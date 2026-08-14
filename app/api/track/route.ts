import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * Anonymous traffic beacon. Records that *a* page was viewed (or a CTA pressed)
 * — never who did it: no IP, no user agent, no cookie, and the referrer is
 * reduced to its host so query strings can't leak anything.
 *
 * Public pages are served as cached static HTML, so the server is not involved
 * in most visits; this endpoint is the only place traffic can be observed.
 */

/** Obvious crawlers would otherwise dominate the numbers the dashboard shows. */
const BOT = /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|headless|lighthouse|pingdom|gtmetrix/i;

const MAX_PATH = 512;
const MAX_LABEL = 120;

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent") ?? "";
    // Answer 204 either way — a beacon must never surface an error to the page.
    if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

    const body = (await req.json().catch(() => null)) as
      | { path?: unknown; kind?: unknown; label?: unknown; referrer?: unknown }
      | null;
    if (!body || typeof body.path !== "string") return new NextResponse(null, { status: 204 });

    // Only same-origin paths: this endpoint must not become a way to write
    // arbitrary attacker-chosen strings into the admin's dashboard.
    const path = body.path.startsWith("/") ? body.path.slice(0, MAX_PATH) : null;
    if (!path) return new NextResponse(null, { status: 204 });

    const kind = body.kind === "CLICK" ? "CLICK" : "VIEW";
    const label =
      typeof body.label === "string" && body.label.trim()
        ? body.label.trim().slice(0, MAX_LABEL)
        : null;

    let referrer: string | null = null;
    if (typeof body.referrer === "string" && body.referrer) {
      try {
        const host = new URL(body.referrer).host;
        // Internal navigation is not a traffic source worth recording.
        if (host && host !== req.nextUrl.host) referrer = host.slice(0, 120);
      } catch {
        /* malformed referrer — drop it */
      }
    }

    await db.pageView.create({ data: { path, kind, label, referrer } });
    return new NextResponse(null, { status: 204 });
  } catch {
    // Analytics failing must never break a page view.
    return new NextResponse(null, { status: 204 });
  }
}
