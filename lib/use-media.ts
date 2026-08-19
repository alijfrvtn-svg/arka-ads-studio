"use client";

import { useEffect, useState } from "react";

/**
 * A media query as React state.
 *
 * ── Why it always starts false ────────────────────────────────────────────
 * There is no way to ask a media query on the server, so the first render has
 * to guess. It guesses "no" every time, deliberately: every effect gated on
 * one of these is an enhancement, and the ungated state — no parallax, no
 * magnetism, no pinning — is the one that is correct everywhere. Guessing
 * "yes" would mean a phone renders the desktop behaviour for a frame and then
 * tears it back out, which is both a hydration mismatch and a visible jump.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    // Plugging in a mouse, rotating a tablet, dragging a window between
    // screens — all of them change the answer without a reload.
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);

  return matches;
}

/**
 * A pointer that hovers and can be aimed precisely — a mouse, a trackpad, a
 * stylus. Not a width: a touchscreen laptop is wide and still cannot hover,
 * and a phone plugged into a mouse is narrow and can. Anything that follows
 * the cursor or reacts to hover belongs behind this, not behind a breakpoint.
 */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/** Desktop width. Use for things gated on room, not on input. */
export const DESKTOP = "(min-width: 1024px)";
