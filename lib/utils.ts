import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/types";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Safely parse a JSON-encoded array column. */
export function parseArr<T = unknown>(v: string | null | undefined): T[] {
  if (!v) return [];
  try {
    const p = JSON.parse(v);
    return Array.isArray(p) ? (p as T[]) : [];
  } catch {
    return [];
  }
}

/** Safely parse a JSON-encoded object column with a fallback. */
export function parseObj<T>(v: string | null | undefined, fallback: T): T {
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert Latin digits in a string to Persian digits. */
export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/**
 * Normalize a phone number typed with a Persian or Arabic-Indic keyboard
 * (۰۹۱۲... or ٠٩١٢...) into plain ASCII digits, and strip spaces/dashes/
 * parens. Iranian mobile numbers entered with a +98/0098 prefix are folded
 * to the local 0-prefixed form Kavenegar expects (e.g. "+989121234567" and
 * "989121234567" both become "09121234567"). Visually a Persian-digit phone
 * number is indistinguishable from an ASCII one, but APIs like Kavenegar's
 * silently reject (or never even log) the request if it isn't ASCII.
 */
export function normalizePhone(input: string): string {
  let s = String(input).trim();
  s = s.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - "۰".charCodeAt(0)));
  s = s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - "٠".charCodeAt(0)));
  s = s.replace(/[\s\-().]/g, "");
  if (s.startsWith("+98")) s = "0" + s.slice(3);
  else if (s.startsWith("0098")) s = "0" + s.slice(4);
  else if (s.startsWith("98") && s.length === 12) s = "0" + s.slice(2);
  return s;
}

/** Persian-grouped number, e.g. 12500 → "۱۲٬۵۰۰". */
export function faNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

/** Compact Persian number for stats, e.g. 1200 → "۱٬۲۰۰". */
export function faPrice(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

/** Format a date using the Persian (Jalali) calendar, always in Iran local time
 * regardless of the server's own timezone (Netlify functions run in UTC, so
 * without this, times like "آخرین ورود" would silently render 3.5h off). */
export function faDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", { timeZone: "Asia/Tehran", ...opts }).format(d);
}

/** Slug from Persian or Latin text (keeps unicode letters). */
export function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Estimate reading minutes from plain text / markdown (Persian ~ 200 wpm). */
export function readingTime(text: string): number {
  const words = text.replace(/[#>*_`\-\[\]()]/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Truncate a string to n chars on a word boundary. */
export function truncate(str: string, n: number): string {
  if (str.length <= n) return str;
  return str.slice(0, str.lastIndexOf(" ", n)).trim() + "…";
}

/** Locale-aware grouped number: Persian digits for fa, Western digits for en/ar. */
export function localeNumber(locale: Locale, n: number): string {
  return locale === "fa" ? faNumber(n) : new Intl.NumberFormat("en-US").format(n);
}

/** Locale-aware digit conversion: Persian digits for fa, left as Western digits otherwise. */
export function localeDigits(locale: Locale, input: string | number): string {
  return locale === "fa" ? toFa(input) : String(input);
}

/** Locale-aware date: Jalali calendar for fa, Gregorian for en/ar. */
export function localeDate(
  locale: Locale,
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
): string {
  if (locale === "fa") return faDate(date, opts);
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-US", opts).format(d);
}

/** Relative "x ago" in Persian for the CRM/admin. */
export function faTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });
  if (diff < 60) return rtf.format(-Math.floor(diff), "second");
  if (diff < 3600) return rtf.format(-Math.floor(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.floor(diff / 3600), "hour");
  if (diff < 2592000) return rtf.format(-Math.floor(diff / 86400), "day");
  if (diff < 31536000) return rtf.format(-Math.floor(diff / 2592000), "month");
  return rtf.format(-Math.floor(diff / 31536000), "year");
}
