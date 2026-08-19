"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
import type { CategoryItem } from "@/lib/queries";
import type { Locale } from "@/types";
import { projectStatus } from "@/lib/constants";

interface P {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  category: string;
  categoryEn?: string | null;
  categoryAr?: string | null;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  status?: string;
  tags?: string;
  tagsEn?: string | null;
  tagsAr?: string | null;
  client?: { name: string } | null;
}
const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[3/4]"];

export function WorkFilter({
  projects,
  categories,
  locale = "fa",
}: {
  projects: P[];
  // Editable in /admin/categories (kind WORK).
  categories: CategoryItem[];
  locale?: Locale;
}) {
  const ALL = "همه";
  const [cat, setCat] = useState(ALL);
  const [status, setStatus] = useState<"ALL" | "DONE" | "IN_PROGRESS">("ALL");
  // Only offer a chip that would actually match something.
  const cats = [ALL, ...categories.filter((c) => projects.some((p) => p.category === c.slug)).map((c) => c.slug)];
  const labels = new Map(categories.map((c) => [c.slug, c]));
  // Same rule for the status row — hide it entirely unless the portfolio
  // actually contains both states, otherwise it is a control that can only
  // ever return the same list.
  const hasMixedStatus =
    projects.some((p) => (p.status ?? "DONE") === "DONE") &&
    projects.some((p) => p.status === "IN_PROGRESS");
  const filtered = projects
    .filter((p) => cat === ALL || p.category === cat)
    .filter((p) => status === "ALL" || (p.status ?? "DONE") === status);

  return (
    <div>
      {/* Full bleed without a negative margin.
          ------------------------------------------------------------
          This carried `-mx-4 px-4`, which is the usual way to break a bar out
          of a padded container — but its parent is the page's full width
          already, so the pair only made the bar 32px wider than the document
          and pushed 16px past the right edge, giving the whole page a
          horizontal scroll. The glass spans edge to edge on its own, and the
          `container-x` inside is what lines the chips up with the grid
          below. */}
      <div className="glass glass-strong sticky top-[72px] z-20 mb-12 rounded-none border-x-0 py-3.5">
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
        {hasMixedStatus && (
          <div className="container-x mt-2 flex gap-2 overflow-x-auto">
            {(["ALL", "DONE", "IN_PROGRESS"] as const).map((v) => {
              const meta = v === "ALL" ? null : projectStatus(v);
              return (
                <button
                  key={v}
                  onClick={() => setStatus(v)}
                  aria-pressed={status === v}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-medium transition-all duration-500",
                    status === v
                      ? "border-foreground font-semibold text-foreground"
                      : "border-card-border text-foreground-muted hover:text-foreground",
                  )}
                >
                  {/* Filled dot = delivered, hollow ring = still in production. The
                      label next to it carries the same information, so the shape
                      is reinforcement, not the only cue. */}
                  {meta && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={
                        meta.value === "IN_PROGRESS"
                          ? { border: "1.5px solid currentColor" }
                          : { background: "currentColor" }
                      }
                      aria-hidden
                    />
                  )}
                  {v === "ALL" ? ui(locale).filterAll : tr(locale, meta!.label, meta!.labelEn, meta!.labelAr)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="container-x">
        <motion.div layout className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="break-inside-avoid"
              >
                <ProjectCard project={p} aspect={ASPECTS[i % ASPECTS.length]} locale={locale} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-foreground-muted">{ui(locale).workEmpty}</p>
        )}
      </div>
    </div>
  );
}
