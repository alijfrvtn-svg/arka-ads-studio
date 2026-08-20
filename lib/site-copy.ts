import { cache } from "react";
import { db } from "@/lib/db";
import { UI } from "@/lib/i18n";
import { parseObj } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * The site's interface strings, editable from the panel.
 *
 * Same shape of decision as `lib/appearance.ts`, and for the same reasons: the
 * `UI` dictionary in `lib/i18n.ts` stays exactly where it is and remains the
 * default for every key. What is saved here is an *override*, merged on top.
 *
 * - A key with no override reads its shipped value, so the panel can be half
 *   filled — or empty — and the site is still fully worded.
 * - A failed query costs freshness, not text. A CMS that can blank the site's
 *   navigation when the database hiccups is not one you want in front of a
 *   connection that drops as often as this one does.
 *
 * `UI` is also imported by Edge middleware and by client components, which is
 * why the override lives in a separate module: this one touches the database
 * and must never be pulled into either of those.
 */

export const COPY_KEY = "siteCopy";

/** `{ [key]: { fa?, en?, ar? } }` — only the keys someone has actually edited. */
export type CopyOverrides = Record<string, Partial<Record<Locale, string>>>;

export type UiStrings = (typeof UI)["fa"];

/** Every key in the dictionary, with its shipped value per locale. */
export function copyDefaults(): { key: string; fa: string; en: string; ar: string }[] {
  return (Object.keys(UI.fa) as (keyof UiStrings)[]).map((k) => ({
    key: k as string,
    fa: String(UI.fa[k] ?? ""),
    en: String((UI.en as Record<string, unknown>)[k as string] ?? ""),
    ar: String((UI.ar as Record<string, unknown>)[k as string] ?? ""),
  }));
}

/**
 * Group the keys by the prefix they already carry.
 *
 * The dictionary is named `navHome`, `footerFollowUs`, `contactRowOffice` and
 * so on, so the grouping is in the data already — no second list to keep in
 * step with it. A key with no recognised prefix falls into "عمومی" rather than
 * being hidden, which matters because an ungrouped key is exactly the one
 * somebody will go looking for.
 */
const GROUPS: { prefix: string; label: string }[] = [
  { prefix: "nav", label: "منو" },
  { prefix: "footer", label: "فوتر" },
  { prefix: "contact", label: "تماس" },
  { prefix: "form", label: "فرم‌ها" },
  { prefix: "cta", label: "دکمه‌های اقدام" },
  { prefix: "work", label: "نمونه‌کارها" },
  { prefix: "service", label: "خدمات" },
  { prefix: "industry", label: "صنایع" },
  { prefix: "journal", label: "ژورنال" },
  { prefix: "post", label: "مقاله" },
  { prefix: "about", label: "درباره ما" },
  { prefix: "team", label: "تیم" },
  { prefix: "testimonial", label: "نظرات" },
  { prefix: "marquee", label: "نوار خدمات" },
  { prefix: "search", label: "جستجو" },
  { prefix: "hero", label: "هیرو" },
];

export function groupCopyKeys(rows: { key: string }[]) {
  const out = new Map<string, string[]>();
  for (const { key } of rows) {
    const g = GROUPS.find((x) => key.startsWith(x.prefix));
    const label = g?.label ?? "عمومی";
    const list = out.get(label) ?? [];
    list.push(key);
    out.set(label, list);
  }
  return [...out.entries()].map(([label, keys]) => ({ label, keys }));
}

/** Overrides only. Cached per request, and never throws. */
export const getCopyOverrides = cache(async (): Promise<CopyOverrides> => {
  try {
    const row = await db.setting.findUnique({ where: { key: COPY_KEY } });
    return parseObj<CopyOverrides>(row?.value, {});
  } catch {
    return {};
  }
});

/**
 * What a server component should render.
 *
 * The drop-in for `ui(locale)`: same shape, same keys, with anything edited in
 * the panel applied on top. Cached, so the twenty-nine components that ask for
 * it while rendering one page share a single query.
 */
export const getUi = cache(async (locale: Locale): Promise<UiStrings> => {
  return resolveCopy(locale, await getCopyOverrides());
});

/**
 * The strings a page should actually render.
 *
 * Falls back per key and per locale: an override that only fills Persian still
 * reads its shipped English, exactly as `tr()` behaves for database content.
 */
export function resolveCopy(locale: Locale, overrides: CopyOverrides): UiStrings {
  const base = { ...(UI[locale] ?? UI.fa) } as Record<string, string>;
  for (const [key, byLocale] of Object.entries(overrides)) {
    const v = byLocale?.[locale];
    if (typeof v === "string" && v.trim()) base[key] = v;
  }
  return base as UiStrings;
}
