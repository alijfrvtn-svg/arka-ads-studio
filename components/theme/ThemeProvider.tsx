"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "light", setTheme: () => {}, toggle: () => {} });

/** The CMS is the only surface with two appearances left. */
const isCms = (path: string) => /^\/(admin|portal)(\/|$)/.test(path);

/**
 * Theme switching now belongs to the CMS alone.
 *
 * The public site is a single whitespace theme carried by the :root tokens in
 * globals.css, so `<html>` must have no theme class there. The pre-paint script
 * in app/layout.tsx gets the first render right; this effect covers the case it
 * cannot — a client-side navigation out of /admin, where the document element
 * survives and would otherwise drag `.dark` onto the public pages.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const e = document.documentElement;
    if (!isCms(pathname)) {
      e.classList.remove("light", "dark");
      e.style.colorScheme = "light";
      setThemeState("light");
      return;
    }
    let stored: Theme | null = null;
    try {
      const v = localStorage.getItem("arka-theme");
      if (v === "light" || v === "dark") stored = v;
    } catch {}
    const next: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    e.classList.remove("light", "dark");
    e.classList.add(next);
    e.style.colorScheme = next;
    setThemeState(next);
  }, [pathname]);

  const setTheme = useCallback((t: Theme) => {
    const e = document.documentElement;
    e.classList.remove("light", "dark");
    e.classList.add(t);
    e.style.colorScheme = t;
    try {
      localStorage.setItem("arka-theme", t);
    } catch {}
    setThemeState(t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(document.documentElement.classList.contains("light") ? "dark" : "light");
  }, [setTheme]);

  return <Ctx.Provider value={{ theme, setTheme, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
