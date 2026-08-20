"use client";

import { createContext, useContext } from "react";
import { UI } from "@/lib/i18n";
import type { UiStrings } from "@/lib/site-copy";
import type { Locale } from "@/types";

/**
 * The interface strings, for the half of the site that runs on the client.
 *
 * The mirror of `AppearanceProvider`, and the same reasoning: server components
 * call `getUi(locale)`, which is cached per request; client components read
 * from here, fed once by the layout.
 *
 * The fallback is the shipped Persian dictionary rather than an empty object,
 * so a client component rendered outside the provider shows words rather than
 * blanks. On this site that is not hypothetical — the header and the contact
 * form are both client components and both are rendered in places a provider
 * could plausibly be missed.
 */
const Ctx = createContext<UiStrings>(UI.fa);

export function SiteCopyProvider({ value, children }: { value: UiStrings; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * The client-side `ui(locale)`.
 *
 * Takes the locale only so call sites read the same as the function they are
 * replacing; the value it returns is already resolved for the locale the layout
 * rendered in, because a client component cannot be in a different one.
 */
export function useUi(_locale?: Locale): UiStrings {
  return useContext(Ctx);
}
