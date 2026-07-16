"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LOCALE_COOKIE, LOCALES } from "./i18n";
import type { Locale } from "@/types";

/** Public (unauthenticated) action — any visitor can switch the site's display language. */
export async function setLocale(locale: Locale) {
  if (!(LOCALES as readonly string[]).includes(locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/", "layout");
}
