"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn, localeDate, localeNumber } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
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

export function JournalFilter({ posts, locale = "fa" }: { posts: Post[]; locale?: Locale }) {
  const cats = ["همه", ...Array.from(new Set(posts.map((p) => p.category)))];
  const catLabels = new Map(posts.map((p) => [p.category, { en: p.categoryEn, ar: p.categoryAr }]));
  const [cat, setCat] = useState("همه");
  const list = cat === "همه" ? posts : posts.filter((p) => p.category === cat);

  return (
    <div>
      <div className="sticky top-[72px] z-20 mb-10 border-y border-card-border bg-background/80 py-3 backdrop-blur-xl">
        <div className="container-x flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                cat === c ? "bg-primary text-primary-foreground" : "border border-card-border text-foreground-muted hover:text-foreground",
              )}
            >
              {c === "همه" ? ui(locale).filterAll : tr(locale, c, catLabels.get(c)?.en, catLabels.get(c)?.ar)}
            </button>
          ))}
        </div>
      </div>

      <div className="container-x">
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/journal/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-surface">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.cover} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">{tr(locale, p.category, p.categoryEn, p.categoryAr)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{tr(locale, p.title, p.titleEn, p.titleAr)}</h3>
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
