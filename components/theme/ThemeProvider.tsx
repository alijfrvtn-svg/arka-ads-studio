"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.classList.contains("light") ? "light" : "dark";
    setThemeState(current);
  }, []);

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
