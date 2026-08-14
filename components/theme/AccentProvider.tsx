"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Visitor-selectable identity colour. `blue` is ARKA's real brand accent and is
 * represented by the *absence* of a data-accent attribute, so the default look
 * is served by the untouched :root tokens in globals.css — picking blue removes
 * the override rather than re-declaring it.
 */
export const ACCENTS = [
  { key: "blue", label: "آبی آرکا", swatch: "#6699ff" },
  { key: "red", label: "قرمز", swatch: "#ef6f68" },
  { key: "orange", label: "نارنجی", swatch: "#e67d22" },
  { key: "yellow", label: "زرد", swatch: "#b89a00" },
  { key: "green", label: "سبز", swatch: "#48b760" },
  { key: "purple", label: "بنفش", swatch: "#b480eb" },
  { key: "pink", label: "صورتی", swatch: "#e46eaa" },
] as const;

export type Accent = (typeof ACCENTS)[number]["key"];

export const ACCENT_STORAGE_KEY = "arka-accent";

const VALID = new Set<string>(ACCENTS.map((a) => a.key));

interface AccentCtx {
  accent: Accent;
  setAccent: (a: Accent) => void;
}

const Ctx = createContext<AccentCtx>({ accent: "blue", setAccent: () => {} });

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<Accent>("blue");

  // The pre-paint script in app/layout.tsx already applied the stored choice —
  // read it back off the DOM so React state matches what's on screen instead of
  // flashing the default through a second write.
  useEffect(() => {
    const attr = document.documentElement.dataset.accent;
    if (attr && VALID.has(attr)) setAccentState(attr as Accent);
  }, []);

  const setAccent = useCallback((a: Accent) => {
    const el = document.documentElement;
    if (a === "blue") delete el.dataset.accent;
    else el.dataset.accent = a;
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, a);
    } catch {}
    setAccentState(a);
  }, []);

  return <Ctx.Provider value={{ accent, setAccent }}>{children}</Ctx.Provider>;
}

export const useAccent = () => useContext(Ctx);
