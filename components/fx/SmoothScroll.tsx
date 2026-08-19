"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { FINE_POINTER } from "@/lib/use-media";

/**
 * Inertial scrolling — for a wheel, and only for a wheel.
 *
 * A mouse wheel scrolls in coarse notches, and smoothing them into a glide is
 * what this library is for. A touchscreen has nothing to fix: the finger is the
 * scroll, and the momentum that follows it is computed by the compositor on the
 * device's own scroll thread. Replacing that with JavaScript means every frame
 * of every scroll now waits on the main thread, and it is a swap made in the
 * wrong direction on the hardware with the least to spare.
 *
 * On iOS it is worse than a tax. Lenis drives the page with transforms, and the
 * address bar collapsing mid-flick changes the viewport height underneath it —
 * so the toolbar hides late, sticky elements shift, and `svh` units resolve
 * against a box that moved. The gesture the user has been making since the
 * first iPhone stops feeling like the phone.
 *
 * Gated on the pointer rather than on width, for the same reason as everything
 * else here: a touchscreen laptop is wide and still scrolls with a finger.
 *
 * Reduced motion turns it off everywhere.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
