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
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  matcher: ["/admin/:path*", "/portal/:path*"],
};
