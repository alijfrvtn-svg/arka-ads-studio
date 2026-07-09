"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn, faDate, toFa } from "@/lib/utils";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  readingMinutes: number;
  publishedAt: Date;
  author?: { name: string; avatar: string | null } | null;
}

export function JournalFilter({ posts }: { posts: Post[] }) {
  const cats = ["همه", ...Array.from(new Set(posts.map((p) => p.category)))];
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
              {c}
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
                    <span className="absolute right-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">{p.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm text-foreground-muted">{p.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 border-t border-card-border pt-3 text-xs text-foreground-faint">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {toFa(p.readingMinutes)} دقیقه</span>
                      <span>·</span>
                      <span>{faDate(p.publishedAt, { month: "long", day: "numeric" })}</span>
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
