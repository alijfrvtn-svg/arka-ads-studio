import { NextResponse, type NextRequest } from "next/server";
import { searchPublic, searchAdmin } from "@/lib/search";
import { getSessionUser } from "@/lib/auth";

/**
 * Search endpoint for both the public site bar and the admin palette.
 *
 * `scope=admin` is gated on a real session — it returns drafts, CRM contacts
 * and lead email addresses, so it must never be reachable by simply asking for
 * it. Anything unauthenticated falls back to published content only.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const scope = req.nextUrl.searchParams.get("scope");
  if (q.length < 2) return NextResponse.json({ hits: [] });

  if (scope === "admin") {
    const user = await getSessionUser();
    // STAFF only ever use /portal and have no CMS permissions.
    if (!user || user.role === "STAFF") {
      return NextResponse.json({ hits: [] }, { status: 403 });
    }
    return NextResponse.json({ hits: await searchAdmin(q) });
  }

  return NextResponse.json({ hits: await searchPublic(q) });
}
