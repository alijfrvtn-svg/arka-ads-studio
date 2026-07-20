"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Server-rendered admin pages don't live-update — mount this on any
 * read-only listing that needs to feel closer to real-time (login/logout
 * timestamps, activity stats) so it re-fetches on its own instead of only
 * ever showing whatever was true the moment the tab was opened. */
export function AutoRefresh({ intervalMs = 20000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
