"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { useSearch } from "./useSearch";
import { SearchResults } from "./SearchResults";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Site-wide search across projects, services, articles and industries.
 *
 * Opens as an overlay rather than an always-open field: the header already
 * carries nav, theme, accent and the primary CTA, and a permanently expanded
 * input there would push the CTA off-screen on small phones. `trigger="inline"`
 * renders the full bar for placements that have the room, like the homepage.
 */
export function SiteSearch({ trigger = "icon" }: { trigger?: "icon" | "inline" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, setQuery, hits, loading, active, reset, onKeyDown } = useSearch("public");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // Focus after the entrance transition so the caret doesn't jump.
    const id = window.setTimeout(() => inputRef.current?.focus(), 80);
    // The overlay owns the viewport while it is up; letting the page scroll
    // behind it is the classic "where did my place go" bug.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
      document.body.style.overflow = prev;
      window.clearTimeout(id);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    reset();
    router.push(href);
  };

  return (
    <>
      {trigger === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="جستجو در سایت"
          className="grid h-11 w-11 place-items-center rounded-full border border-card-border bg-surface/60 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-3 rounded-2xl border border-card-border bg-surface/60 px-5 py-4 text-right backdrop-blur transition-colors hover:border-primary/50"
        >
          <Search className="h-5 w-5 shrink-0 text-foreground-faint transition-colors group-hover:text-primary" />
          <span className="flex-1 text-sm text-foreground-faint">
            جستجو در نمونه‌کارها، خدمات و مقالات…
          </span>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/85 p-4 backdrop-blur-xl sm:p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="جستجو در سایت"
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto mt-[8vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-card-border bg-surface shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-card-border px-4">
                <Search className="h-5 w-5 shrink-0 text-foreground-faint" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => onKeyDown(e, (hit) => go(hit.href))}
                  placeholder="چه چیزی را می‌خواهید پیدا کنید؟"
                  aria-label="عبارت جستجو"
                  className="h-14 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-foreground-faint"
                />
                {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-foreground-faint" />}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="بستن"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-foreground-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {query.trim().length < 2 ? (
                <p className="px-4 py-10 text-center text-sm text-foreground-muted">
                  حداقل ۲ حرف بنویسید — نمونه‌کارها، خدمات، صنایع و مقالات جستجو می‌شوند.
                </p>
              ) : (
                <SearchResults
                  hits={hits}
                  activeIndex={active}
                  onNavigate={() => {
                    setOpen(false);
                    reset();
                  }}
                  emptyLabel={loading ? "در حال جستجو…" : "چیزی با این عبارت پیدا نشد"}
                />
              )}

              <div className={cn("border-t border-card-border px-4 py-2 text-[11px] text-foreground-faint")}>
                برای جابه‌جایی از کلیدهای ↑ ↓ و برای باز کردن از Enter استفاده کنید.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
