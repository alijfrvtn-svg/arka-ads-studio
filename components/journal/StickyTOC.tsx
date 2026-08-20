"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";
import { useUi } from "@/components/providers/SiteCopy";

export function StickyTOC({ items, locale = "fa" }: { items: { level: number; text: string; id: string }[]; locale?: Locale }) {
  // Interface strings, with anything edited in the panel applied. Resolved
  // once here because `ui(locale)` also appeared inside .map() below, and a
  // hook called a varying number of times per render is a different bug.
  const t = useUi();
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (!items.length) return null;

  return (
    <nav className="hidden lg:block">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground-faint">{t.inThisArticle}</p>
      <ul className="space-y-2 border-r border-card-border pr-4">
        {items.map((it) => (
          <li key={it.id} style={{ paddingRight: it.level === 3 ? 12 : 0 }}>
            <a
              href={`#${it.id}`}
              className={cn(
                "block text-sm transition-colors",
                active === it.id ? "font-semibold text-foreground" : "text-foreground-muted hover:text-foreground",
              )}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
