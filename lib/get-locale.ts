import "server-only";
import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, LOCALES } from "./i18n";
import type { Locale } from "@/types";

/** Resolve the visitor's locale — set by middleware.ts (header for this request,
 * cookie for the next one). /admin and /portal never get the header, so
 * `getLocale()` there falls through to the cookie (usually absent) → "fa".
 * Server-component-only (uses next/headers) — kept out of lib/i18n.ts so
 * that file stays safe to import from client components and middleware. */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (fromHeader && (LOCALES as readonly string[]).includes(fromHeader)) return fromHeader as Locale;
  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) return fromCookie as Locale;
  return "fa";
}
