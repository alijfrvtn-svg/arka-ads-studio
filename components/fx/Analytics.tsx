"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Fires one anonymous beacon per page view, plus one per CTA press.
 *
 * Uses sendBeacon so the request survives the visitor navigating away, and
 * never blocks rendering. Respects Do Not Track — if someone has asked not to
 * be counted, we don't count them, even though the payload carries nothing
 * personal.
 */
export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (navigator.doNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1") return;
    // App Router re-runs effects on some re-renders; only count real moves.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;

    send({ path: pathname, kind: "VIEW", referrer: document.referrer || undefined });
  }, [pathname]);

  // CTA clicks, captured centrally: any element carrying data-track="<label>"
  // reports itself, so adding a tracked control never means touching this file.
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      send({ path: window.location.pathname, kind: "CLICK", label: el.dataset.track });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}

function send(payload: { path: string; kind: "VIEW" | "CLICK"; label?: string; referrer?: string }) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
    }
  } catch {
    /* never let analytics break navigation */
  }
}
