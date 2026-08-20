import { cache } from "react";
import { db } from "@/lib/db";
import {
  SITE_PAINT,
  INDUSTRY_PAINT,
  TEXT_PAINT,
  DEPARTMENT_PAINT,
  DEPARTMENT_PRICE_FROM,
  DEPARTMENT_DESC_GRADIENT,
  DEPARTMENT_POSTER,
  PLAN_MULTIPLIER,
} from "@/lib/constants";
import { parseObj } from "@/lib/utils";

/**
 * The site's visual identity, editable from the panel.
 *
 * Everything here already existed as a constant in `lib/constants.ts`. Nothing
 * has been moved out of there — those values are still the source of truth for
 * *defaults*, and this module reads a saved override on top of them. That
 * ordering is deliberate and load-bearing:
 *
 * - A missing key falls back to the constant, so a half-filled settings row can
 *   never blank a colour out.
 * - The site renders correctly with no row at all, which is what happens on a
 *   fresh database and, more to the point, whenever Neon drops the connection
 *   mid-render — a failure this project sees often enough that "the design
 *   depends on a query succeeding" would be a bad trade.
 *
 * It lives in the existing `Setting` key/value table rather than in new
 * columns, so there is no migration to run against a database that has been
 * refusing connections all week.
 */

export interface Appearance {
  /** The six the whole site paints with; the first four are the brand. */
  sitePaint: string[];
  /** The four, as backgrounds. */
  industryPaint: string[];
  /** The same four darkened enough to be set as type on white. */
  textPaint: string[];
  /** One colour per department. */
  departmentPaint: Record<string, string>;
  /** The dark two-stop pair behind each department's long description. */
  departmentGradient: Record<string, [string, string]>;
  /** The poster image for each department. */
  departmentPoster: Record<string, string>;
  /** Starting price per department, in rials. */
  departmentPriceFrom: Record<string, number>;
  /** What each plan multiplies that starting price by. */
  planMultiplier: Record<string, number>;
}

export const APPEARANCE_DEFAULTS: Appearance = {
  sitePaint: [...SITE_PAINT],
  industryPaint: [...INDUSTRY_PAINT],
  textPaint: [...TEXT_PAINT],
  departmentPaint: { ...DEPARTMENT_PAINT },
  departmentGradient: { ...DEPARTMENT_DESC_GRADIENT },
  departmentPoster: { ...DEPARTMENT_POSTER },
  departmentPriceFrom: { ...DEPARTMENT_PRICE_FROM },
  planMultiplier: { ...PLAN_MULTIPLIER },
};

export const APPEARANCE_KEY = "appearance";

/**
 * Merge a saved override over the defaults.
 *
 * Per key, not per object: a saved `departmentPaint` holding only DESIGN must
 * not take FILM, DIGITAL and STRATEGY down with it. Arrays merge by index for
 * the same reason — saving three colours leaves the fourth alone rather than
 * truncating the set.
 */
export function mergeAppearance(saved: Partial<Appearance> | null | undefined): Appearance {
  const d = APPEARANCE_DEFAULTS;
  if (!saved) return d;

  const arr = (s: unknown, fallback: string[]) =>
    Array.isArray(s) ? fallback.map((v, i) => (typeof s[i] === "string" && s[i] ? (s[i] as string) : v)) : fallback;

  const rec = <T,>(s: unknown, fallback: Record<string, T>): Record<string, T> => {
    if (!s || typeof s !== "object") return fallback;
    const out = { ...fallback };
    for (const [k, v] of Object.entries(s as Record<string, T>)) {
      if (v !== null && v !== undefined && v !== ("" as unknown as T)) out[k] = v;
    }
    return out;
  };

  return {
    sitePaint: arr(saved.sitePaint, d.sitePaint),
    industryPaint: arr(saved.industryPaint, d.industryPaint),
    textPaint: arr(saved.textPaint, d.textPaint),
    departmentPaint: rec(saved.departmentPaint, d.departmentPaint),
    departmentGradient: rec(saved.departmentGradient, d.departmentGradient),
    departmentPoster: rec(saved.departmentPoster, d.departmentPoster),
    departmentPriceFrom: rec(saved.departmentPriceFrom, d.departmentPriceFrom),
    planMultiplier: rec(saved.planMultiplier, d.planMultiplier),
  };
}

/**
 * The live identity.
 *
 * `cache()` because a dozen server components ask for this while rendering one
 * page, and without it that is a dozen round trips to a database that has been
 * timing out all week. One per request instead.
 *
 * Never throws. If the query fails the site gets the constants, which is the
 * design as shipped — a database blip should cost freshness, not colour.
 */
export const getAppearance = cache(async (): Promise<Appearance> => {
  try {
    const row = await db.setting.findUnique({ where: { key: APPEARANCE_KEY } });
    return mergeAppearance(parseObj<Partial<Appearance>>(row?.value, {}));
  } catch {
    return APPEARANCE_DEFAULTS;
  }
});
