"use client";

import { createContext, useContext } from "react";
import { APPEARANCE_DEFAULTS, type Appearance } from "@/lib/appearance";

/**
 * The visual identity, for the half of the site that runs on the client.
 *
 * Server components call `getAppearance()` directly — it is cached per request,
 * so a dozen of them cost one query. Client components cannot, so the layout
 * fetches once and hands the result down through here.
 *
 * The default is the constants rather than `null`, which means a client
 * component rendered outside the provider — a preview, a test, a future route
 * that forgets to wrap — still paints the shipped identity instead of throwing
 * or rendering colourless.
 */
const Ctx = createContext<Appearance>(APPEARANCE_DEFAULTS);

export function AppearanceProvider({ value, children }: { value: Appearance; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppearance(): Appearance {
  return useContext(Ctx);
}
