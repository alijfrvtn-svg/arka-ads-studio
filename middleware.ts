import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";

/**
 * Guard /admin/* (CMS) and /portal/* (staff task panel) — redirect unauthenticated
 * users to the right login, away from login when signed in, and keep STAFF
 * accounts (portal-only) out of the CMS even if they type the URL directly.
 *
 * Multi-language (fa/en/ar) detection/propagation is paused for now — it forced
 * every public page to render dynamically (no CDN caching), which was hurting
 * Core Web Vitals for no real benefit since the site isn't pursuing EN/AR SEO
 * at the moment. The infrastructure (lib/i18n.ts, LanguageSwitcher, translated
 * content) is kept in place to re-enable properly later; see getLocale() in
 * lib/get-locale.ts, which now just returns "fa" without reading any cookie.
 */
/**
 * Second gate in front of the CMS, ahead of the password.
 *
 * The public site no longer links to /admin anywhere, but "not linked" is not
 * "not reachable" — the path is guessable and the login form is the only thing
 * between a bot and the CMS. So the door has to be knocked on first:
 *
 *   ADMIN_ACCESS_PATH  the secret. Visiting /enter/<secret> sets a cookie and
 *                      forwards to the real login. Nothing else reveals it.
 *   ADMIN_ALLOWED_IPS  optional comma-separated allowlist. When set, requests
 *                      from anywhere else never reach the CMS at all.
 *
 * Both are optional: with neither configured this behaves exactly as before, so
 * a missing env var locks nobody out of their own panel. Unauthorised requests
 * get 404, not 403 — a 403 confirms something is there.
 *
 * The knock lives under a fixed /enter/ prefix rather than at the site root so
 * the matcher below can stay scoped to three known prefixes. The first attempt
 * put the secret at the root, which forced a bare "/:path" into the matcher and
 * 404'd every single public page on the site — the route table and a catch-all
 * middleware matcher do not coexist. The secret is still the unguessable part;
 * only its parent folder is public knowledge, which gives an attacker nothing.
 */
const KNOCK_PREFIX = "/enter/";
const KNOCK_COOKIE = "arka_gate";

function ipAllowed(req: NextRequest) {
  const raw = process.env.ADMIN_ALLOWED_IPS?.trim();
  if (!raw) return true; // not configured -> IP is not a criterion
  const allow = raw.split(",").map((s) => s.trim()).filter(Boolean);
  if (!allow.length) return true;
  // x-forwarded-for is client-controlled in general, but on Netlify the edge
  // rewrites it, so the FIRST entry is the real peer.
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  return allow.includes(ip);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const secret = process.env.ADMIN_ACCESS_PATH?.trim();

  // The knock itself: set the gate cookie, then forward to the login. Handled
  // before anything else so it works whether or not a session exists. A wrong
  // secret under /enter/ gets 404, same as everything else that fails the gate.
  if (pathname.startsWith(KNOCK_PREFIX)) {
    if (!secret || pathname !== `${KNOCK_PREFIX}${secret.replace(/^\/+/, "")}`) {
      return new NextResponse(null, { status: 404 });
    }
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const res = NextResponse.redirect(url);
    res.cookies.set(KNOCK_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });
    return res;
  }

  const isCms = pathname.startsWith("/admin");
  if (isCms) {
    if (!ipAllowed(req)) return new NextResponse(null, { status: 404 });
    // An existing session is its own proof of entry — requiring the knock again
    // would log people out of a working panel the moment the cookie expired.
    const knocked = req.cookies.get(KNOCK_COOKIE)?.value === "1";
    const hasSession = !!req.cookies.get(SESSION_COOKIE)?.value;
    if (secret && !knocked && !hasSession) return new NextResponse(null, { status: 404 });
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = token ? await verifySession(token) : null;

  const inPortal = pathname.startsWith("/portal");
  const loginPath = inPortal ? "/portal/login" : "/admin/login";
  const homePath = inPortal ? "/portal" : "/admin";
  const isLogin = pathname === loginPath;

  if (!valid && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = loginPath;
    url.search = `?from=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (valid && !inPortal && valid.role === "STAFF") {
    const url = req.nextUrl.clone();
    url.pathname = "/portal";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (valid && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = homePath;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Three known prefixes, nothing else. Public pages never enter the
  // middleware, so the gate cannot affect them — which is exactly the failure
  // mode a catch-all matcher produced.
  matcher: ["/admin/:path*", "/portal/:path*", "/enter/:path*"],
};
