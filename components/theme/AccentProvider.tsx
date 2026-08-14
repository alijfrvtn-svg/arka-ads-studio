"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/**
 * Living identity colour.
 *
 * The site cycles through its palette on a timer instead of asking the visitor
 * to pick — the point is a site that feels alive, not another control to
 * operate. `blue` is ARKA's real brand accent and is represented by the
 * *absence* of a data-accent attribute, so the resting state is served by the
 * untouched :root tokens in globals.css.
 *
 * Turning the cycle off pins the brand blue.
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

export const ACCENT_CYCLE_KEY = "arka-accent-cycle";
/** How long each colour holds before the next one fades in. */
export const CYCLE_MS = 30_000;
/** Length of the cross-fade between colours (also set in globals.css). */
export const CYCLE_FADE_MS = 1_800;

const ORDER: Accent[] = ACCENTS.map((a) => a.key);

interface AccentCtx {
  /** Colour currently painted. */
  accent: Accent;
  /** Whether the timer is running. */
  cycling: boolean;
  setCycling: (on: boolean) => void;
}

const Ctx = createContext<AccentCtx>({ accent: "blue", cycling: true, setCycling: () => {} });

let fadeTimer = 0;

/**
 * Swap the identity colour, cross-fading rather than cutting.
 *
 * `.accent-shifting` (globals.css) is what supplies the transition — custom
 * properties cannot be transitioned on their own, so the class puts a temporary
 * transition on the properties that *consume* them and is removed once the fade
 * is done, leaving normal hover timings alone.
 */
function paint(a: Accent, animate = true) {
  const el = document.documentElement;
  if (animate) {
    el.classList.add("accent-shifting");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(
      () => el.classList.remove("accent-shifting"),
      CYCLE_FADE_MS,
    );
  }
  if (a === "blue") delete el.dataset.accent;
  else el.dataset.accent = a;
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  // Default ON — the pre-paint script in app/layout.tsx applies the same
  // default, so this matches what is already on screen.
  const [cycling, setCyclingState] = useState(true);
  const [accent, setAccent] = useState<Accent>("blue");
  const index = useRef(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(ACCENT_CYCLE_KEY) === "off") setCyclingState(false);
    } catch {}
    const current = document.documentElement.dataset.accent as Accent | undefined;
    if (current && ORDER.includes(current)) {
      setAccent(current);
      index.current = ORDER.indexOf(current);
    }
  }, []);

  useEffect(() => {
    if (!cycling) {
      paint("blue");
      setAccent("blue");
      index.current = 0;
      return;
    }

    // Respect reduced-motion: a colour wash across the whole page every 30s is
    // exactly the kind of ambient movement that setting asks us to stop.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      paint("blue", false);
      setAccent("blue");
      return;
    }

    const advance = () => {
      index.current = (index.current + 1) % ORDER.length;
      const next = ORDER[index.current];
      paint(next);
      setAccent(next);
    };

    const id = window.setInterval(advance, CYCLE_MS);
    // Cycling in a tab nobody is looking at just burns a repaint every 30s.
    const onVis = () => {
      if (document.hidden) window.clearInterval(id);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [cycling]);

  const setCycling = useCallback((on: boolean) => {
    setCyclingState(on);
    try {
      localStorage.setItem(ACCENT_CYCLE_KEY, on ? "on" : "off");
    } catch {}
  }, []);

  return <Ctx.Provider value={{ accent, cycling, setCycling }}>{children}</Ctx.Provider>;
}

export const useAccent = () => useContext(Ctx);
