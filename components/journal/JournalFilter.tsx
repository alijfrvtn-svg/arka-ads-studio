"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn, localeDate, localeNumber, paintSeed } from "@/lib/utils";
import { INDUSTRY_PAINT } from "@/lib/constants";
import { tr, ui } from "@/lib/i18n";
import type { CategoryItem } from "@/lib/queries";
import type { Locale } from "@/types";

interface Post {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  excerpt: string;
  excerptEn?: string | null;
  excerptAr?: string | null;
  cover: string;
  category: string;
  categoryEn?: string | null;
  categoryAr?: string | null;
  readingMinutes: number;
  publishedAt: Date;
  author?: { name: string; avatar: string | null } | null;
}

/** A stable one of the four per category, so a card without a cover still
    looks placed rather than arbitrary. */
function colourIndex(category: string): number {
  return paintSeed(category) % INDUSTRY_PAINT.length;
}

export function JournalFilter({
  posts,
  categories,
  locale = "fa",
}: {
  posts: Post[];
  // Editable in /admin/categories (kind POST) — the chip order follows the
  // admin's ordering instead of whatever order posts happen to come back in.
  categories: CategoryItem[];
  locale?: Locale;
}) {
  const ALL = "همه";
  const known = categories.filter((c) => posts.some((p) => p.category === c.slug)).map((c) => c.slug);
  // A post whose category was removed from the taxonomy still needs a home.
  const orphans = Array.from(new Set(posts.map((p) => p.category))).filter((c) => !known.includes(c));
  const cats = [ALL, ...known, ...orphans];
  const labels = new Map(categories.map((c) => [c.slug, c]));
  const [cat, setCat] = useState(ALL);

  /**
   * Whether the client has taken over.
   *
   * framer-motion writes `initial` into the server-rendered HTML, so a grid
   * whose entrance starts at `opacity: 0` ships invisible and stays that way
   * until the bundle hydrates. This grid *is* the page's content, so on a slow
   * link the visitor got an empty page rather than a page that had not
   * animated yet. The first render is drawn in place; filtering — which
   * already requires a click, so the script is plainly running — animates
   * exactly as before.
   */
  /** Covers whose file 404s — see the card background. */
  const [dead, setDead] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const list = cat === ALL ? posts : posts.filter((p) => p.category === cat);

  return (
    <div>
      <div className="glass glass-strong sticky top-[72px] z-20 mb-14 rounded-none border-x-0 py-3.5">
        <div className="container-x flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center rounded-full px-5 text-sm font-medium transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                cat === c
                  ? "bg-foreground text-background shadow-[0_1px_2px_rgba(0,0,0,0.18),0_10px_24px_-12px_rgba(0,0,0,0.4)]"
                  : "border border-card-border text-foreground-muted hover:border-foreground/25 hover:text-foreground",
              )}
            >
              {c === ALL ? ui(locale).filterAll : tr(locale, labels.get(c)?.title ?? c, labels.get(c)?.titleEn, labels.get(c)?.titleAr)}
            </button>
          ))}
        </div>
      </div>

      <div className="container-x">
        <motion.div layout className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={mounted ? { opacity: 0, y: 16 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/journal/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-card-border bg-surface transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-32px_rgba(0,0,0,0.35)]">
                  <div
                    className="relative aspect-[16/10] overflow-hidden"
                    // The card's own category colour, showing through wherever
                    // the cover does not. Two of the published covers are dead
                    // files, and a card whose picture is a broken-image icon
                    // reads as a broken site rather than as a missing upload.
                    style={{ background: INDUSTRY_PAINT[colourIndex(p.category) % INDUSTRY_PAINT.length] }}
                  >
                    {!dead.includes(p.id) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.cover}
                        alt=""
                        onError={() => setDead((d) => (d.includes(p.id) ? d : [...d, p.id]))}
                        className="h-full w-full object-cover transition-all duration-[900ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.04]"
                      />
                    )}
                    <span className="glass-onmedia absolute right-3 top-3 rounded-full px-3 py-1 text-xs">{tr(locale, labels.get(p.category)?.title ?? p.category, labels.get(p.category)?.titleEn, labels.get(p.category)?.titleAr)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">{tr(locale, p.title, p.titleEn, p.titleAr)}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-foreground-muted">{tr(locale, p.excerpt, p.excerptEn, p.excerptAr)}</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-card-border pt-3 text-xs text-foreground-faint">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {localeNumber(locale, p.readingMinutes)} {ui(locale).readingMinutesSuffix}</span>
                      <span>·</span>
                      <span>{localeDate(locale, p.publishedAt, { month: "long", day: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
