import "server-only";
import type { Locale } from "@/types";

/**
 * Multi-language (fa/en/ar) is paused for now — see middleware.ts for why.
 * This used to read an `x-locale` header / cookie via next/headers, but doing
 * so anywhere in the render tree forces Next.js to treat the whole page as
 * dynamic (no static generation, no CDN caching), which was hurting Core Web
 * Vitals for a feature the site isn't using for SEO at the moment. Kept as an
 * async function so every existing `await getLocale()` call site (services,
 * industries, posts, the whole site layout, etc.) keeps working unchanged —
 * re-wire this to read the real signal again when EN/AR is reintroduced
 * properly (locale-prefixed URLs + hreflang, not cookie-only switching).
 */
export async function getLocale(): Promise<Locale> {
  return "fa";
}
