"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { WORK_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface P {
  id: string;
  slug: string;
  title: string;
  category: string;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  tags?: string;
  client?: { name: string } | null;
}
const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[3/4]"];

export function WorkFilter({ projects }: { projects: P[] }) {
  const [cat, setCat] = useState("همه");
  const cats = WORK_CATEGORIES.filter((c) => c === "همه" || projects.some((p) => p.category === c));
  const filtered = cat === "همه" ? projects : projects.filter((p) => p.category === cat);

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-4 mb-8 border-y border-card-border bg-background/80 px-4 py-3 backdrop-blur-xl">
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
                <ProjectCard project={p} aspect={ASPECTS[i % ASPECTS.length]} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-foreground-muted">پروژه‌ای در این دسته یافت نشد.</p>
        )}
      </div>
    </div>
  );
}
