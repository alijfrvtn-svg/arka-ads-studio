"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const IDLE_MS = 15 * 60 * 1000;
const CHECK_INTERVAL_MS = 15 * 1000;
const STORAGE_KEY = "arka_last_activity";
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"] as const;

/**
 * Silently logs the user out after 15 minutes with zero mouse/keyboard/scroll
 * activity — mounted once in both AdminShell and PortalShell. Uses
 * localStorage (not component state) for the "last active" timestamp so
 * activity in ANY open tab resets the clock for all of them (otherwise an
 * idle background tab could log out an actively-used foreground one). Goes
 * through the real /api/auth/logout endpoint so it properly closes the
 * SessionLog row too — this exists specifically so someone can't leave the
 * panel open and inflate their weekly activity-hours report.
 */
export function IdleLogout({ loginPath }: { loginPath: string }) {
  const router = useRouter();

  useEffect(() => {
    const markActive = () => {
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {}
    };
    markActive();
    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, markActive, { passive: true }));

    const interval = setInterval(async () => {
      let last = Date.now();
      try {
        last = Number(localStorage.getItem(STORAGE_KEY)) || Date.now();
      } catch {}
      if (Date.now() - last >= IDLE_MS) {
        clearInterval(interval);
        await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
        router.push(loginPath);
        router.refresh();
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, markActive));
      clearInterval(interval);
    };
  }, [router, loginPath]);

  return null;
}
