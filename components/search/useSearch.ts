"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchHit } from "@/lib/search";

/**
 * Debounced search with keyboard navigation, shared by the public bar and the
 * admin palette.
 *
 * Every request carries an AbortController: without it a slow early query can
 * land after a fast later one and overwrite the results with stale matches for
 * a prefix the user has already typed past.
 */
export function useSearch(scope: "public" | "admin", { debounceMs = 220 } = {}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    abortRef.current?.abort();
    if (q.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    const id = window.setTimeout(async () => {
      try {
        const url = `/api/search?q=${encodeURIComponent(q)}${scope === "admin" ? "&scope=admin" : ""}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = (await res.json()) as { hits?: SearchHit[] };
        setHits(data.hits ?? []);
        setActive(0);
      } catch {
        // Aborted or offline — leave the previous list rather than blanking it.
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(id);
      ctrl.abort();
    };
  }, [query, scope, debounceMs]);

  const reset = useCallback(() => {
    setQuery("");
    setHits([]);
    setActive(0);
  }, []);

  /** Wire onto the input: ↑/↓ move the highlight, Enter opens it. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, onOpen: (hit: SearchHit) => void) => {
      if (!hits.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => (i + 1) % hits.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => (i - 1 + hits.length) % hits.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onOpen(hits[active]);
      }
    },
    [hits, active],
  );

  return { query, setQuery, hits, loading, active, setActive, reset, onKeyDown };
}
