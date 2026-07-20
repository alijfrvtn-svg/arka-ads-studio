import { toJalaali, toGregorian, jalaaliMonthLength as _jalaaliMonthLength } from "jalaali-js";

export const JALALI_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
] as const;

// Persian week starts Saturday.
export const JALALI_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

export interface JalaliDate {
  jy: number;
  jm: number; // 1-12
  jd: number;
}

/**
 * All conversions here are UTC-based on purpose: `saveTask` stores `dueDate`
 * from a bare "YYYY-MM-DD" string via `new Date(str)`, which JS parses as UTC
 * midnight. Mixing that with local-timezone Date math would silently shift
 * a task's deadline by a day depending on the server's timezone — so every
 * Jalali<->Gregorian conversion below stays in UTC to match exactly.
 */
export function gregorianToJalali(date: Date): JalaliDate {
  const { jy, jm, jd } = toJalaali(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
  return { jy, jm, jd };
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return new Date(Date.UTC(gy, gm - 1, gd));
}

export function jalaliMonthLength(jy: number, jm: number): number {
  return _jalaaliMonthLength(jy, jm);
}

/** Today's Jalali date, based on the caller's local wall-clock day (not UTC "now"). */
export function todayJalali(): JalaliDate {
  const now = new Date();
  return gregorianToJalali(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

export interface JalaliCalendarCell {
  jy: number;
  jm: number;
  jd: number;
  date: Date;
  inCurrentMonth: boolean;
}

/** Full 7-column week grid for a Jalali month, padded with adjacent-month days so every row is complete. */
export function buildJalaliMonthGrid(jy: number, jm: number): JalaliCalendarCell[][] {
  const daysInMonth = jalaliMonthLength(jy, jm);
  const firstOfMonth = jalaliToGregorian(jy, jm, 1);
  const firstWeekdayIndex = (firstOfMonth.getUTCDay() + 1) % 7; // Sat->0 ... Fri->6

  const prevJm = jm === 1 ? 12 : jm - 1;
  const prevJy = jm === 1 ? jy - 1 : jy;
  const prevMonthLength = jalaliMonthLength(prevJy, prevJm);
  const nextJm = jm === 12 ? 1 : jm + 1;
  const nextJy = jm === 12 ? jy + 1 : jy;

  const cells: JalaliCalendarCell[] = [];

  for (let i = firstWeekdayIndex - 1; i >= 0; i--) {
    const jd = prevMonthLength - i;
    cells.push({ jy: prevJy, jm: prevJm, jd, date: jalaliToGregorian(prevJy, prevJm, jd), inCurrentMonth: false });
  }

  for (let jd = 1; jd <= daysInMonth; jd++) {
    cells.push({ jy, jm, jd, date: jalaliToGregorian(jy, jm, jd), inCurrentMonth: true });
  }

  let nextJd = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ jy: nextJy, jm: nextJm, jd: nextJd, date: jalaliToGregorian(nextJy, nextJm, nextJd), inCurrentMonth: false });
    nextJd++;
  }

  const rows: JalaliCalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

/** Stable "YYYY-MM-DD" grouping key, UTC-based to match how dueDate is stored/compared. */
export function dateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

/** Clamp/normalize a (jy, jm) pair so month math (prev/next navigation) never produces an out-of-range month. */
export function normalizeJalaliMonth(jy: number, jm: number): { jy: number; jm: number } {
  let y = jy, m = jm;
  while (m < 1) { m += 12; y -= 1; }
  while (m > 12) { m -= 12; y += 1; }
  return { jy: y, jm: m };
}

/** Start (Saturday, UTC midnight) of the Jalali week containing the given date. */
export function jalaliWeekStart(date: Date): Date {
  const weekdayIndex = (date.getUTCDay() + 1) % 7; // Sat->0 ... Fri->6
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - weekdayIndex);
  return start;
}

/** [start, end) UTC range for the Jalali week that contains `date` (defaults to now, using local wall-clock day). */
export function jalaliWeekRange(date: Date = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))) {
  const start = jalaliWeekStart(date);
  const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
  return { start, end };
}
