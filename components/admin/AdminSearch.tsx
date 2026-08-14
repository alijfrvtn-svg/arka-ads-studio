"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { useSearch } from "@/components/search/useSearch";
import { SearchResults } from "@/components/search/SearchResults";

/**
 * Panel-wide search. Replaces an input that had no handler at all — it looked
 * like a search box and did nothing when typed into.
 *
 * Covers projects, articles, services, industries, clients and leads, including
 * drafts, and links straight to each item's editor.
 */
export function AdminSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, hits, loading, active, reset, onKeyDown } = useSearch("admin");

  // Ctrl/⌘+K is the shortcut people already expect from every other panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    reset();
    router.push(href);
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => onKeyDown(e, (hit) => go(hit.href))}
        placeholder="جستجو در پنل…"
        aria-label="جستجو در پنل مدیریت"
        role="combobox"
        aria-expanded={open}
        aria-controls="admin-search-results"
        className="h-10 w-full rounded-xl border border-card-border bg-background/50 pr-10 pl-16 text-sm text-foreground outline-none transition-colors placeholder:text-foreground-faint focus:border-primary"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-foreground-faint" />}
        {query ? (
          <button
            type="button"
            onClick={() => {
              reset();
              inputRef.current?.focus();
            }}
            aria-label="پاک کردن جستجو"
            className="pointer-events-auto grid h-6 w-6 place-items-center rounded text-foreground-faint hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="rounded border border-card-border px-1.5 py-0.5 text-[10px] text-foreground-faint ltr-nums">
            Ctrl K
          </kbd>
        )}
      </span>

      {open && query.trim().length >= 2 && (
        <div
          id="admin-search-results"
          className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-2xl border border-card-border bg-surface shadow-2xl"
        >
          <SearchResults
            hits={hits}
            activeIndex={active}
            onNavigate={() => {
              setOpen(false);
              reset();
            }}
            emptyLabel={loading ? "در حال جستجو…" : "چیزی پیدا نشد"}
            compact
          />
        </div>
      )}
    </div>
  );
}
