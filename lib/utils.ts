import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

/** Persian-grouped number, e.g. 12500 → "۱۲٬۵۰۰". */
export function faNumber(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

/** Compact Persian number for stats, e.g. 1200 → "۱٬۲۰۰". */
export function faPrice(n: number): string {
  return new Intl.NumberFormat("fa-IR").format(n);
}

/** Format a date using the Persian (Jalali) calendar. */
export function faDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" },
): string {
  const d = typeof date === "object" ? date : new Date(date);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", opts).format(d);
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
