import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/session";
import { LOCALE_COOKIE, LOCALES } from "@/lib/i18n";
import type { Locale } from "@/types";

/** Best-effort match of the browser's Accept-Language header to a supported locale. */
function detectLocale(req: NextRequest): Locale {
  const header = req.headers.get("accept-language") || "";
  const langs = header.split(",").map((l) => l.split(";")[0].trim().toLowerCase());
  for (const l of langs) {
    if (l.startsWith("en")) return "en";
    if (l.startsWith("ar")) return "ar";
    if (l.startsWith("fa")) return "fa";
  }
  return "fa";
}

/**
 * Guard /admin/* (CMS) and /portal/* (staff task panel) — redirect unauthenticated
 * users to the right login, away from login when signed in, and keep STAFF
 * accounts (portal-only) out of the CMS even if they type the URL directly.
 * For the public site, auto-detect + propagate the visitor's language (no
 * redirect, no URL change — just a cookie plus an `x-locale` request header
 * the root layout reads for `dir`/`lang`; /admin and /portal never get this
 * header, so they always stay Persian/RTL).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
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

  // Public site — locale detection/propagation only, no auth.
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  const locale: Locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? (cookieLocale as Locale)
      : detectLocale(req);

  const forwardedHeaders = new Headers(req.headers);
  forwardedHeaders.set("x-locale", locale);
  const res = NextResponse.next({ request: { headers: forwardedHeaders } });
  if (!cookieLocale) {
    res.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|mp4|woff|woff2)$).*)"],
};
