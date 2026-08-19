"use client";

import Link from "next/link";
import { Clapperboard, FileText, Sparkles, Building2, Users, Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchHit } from "@/lib/search";

const ICONS: Record<SearchHit["type"], LucideIcon> = {
  project: Clapperboard,
  post: FileText,
  service: Sparkles,
  industry: Building2,
  client: Users,
  lead: Inbox,
};

const LABELS: Record<SearchHit["type"], string> = {
  project: "نمونه‌کار",
  post: "مقاله",
  service: "خدمت",
  industry: "صنعت",
  client: "مشتری",
  lead: "سرنخ",
};

/**
 * Result list shared by the site search and the admin palette.
 *
 * Rows are real links so a result can be middle-clicked or opened in a new tab,
 * and `activeIndex` mirrors keyboard navigation from the parent — the roving
 * highlight has to be visible or arrow-key users cannot tell where they are.
 */
export function SearchResults({
  hits,
  activeIndex,
  onNavigate,
  emptyLabel,
  compact = false,
}: {
  hits: SearchHit[];
  activeIndex: number;
  onNavigate: () => void;
  emptyLabel: string;
  compact?: boolean;
}) {
  if (!hits.length) {
    return <p className="px-4 py-8 text-center text-sm text-foreground-muted">{emptyLabel}</p>;
  }

  return (
    // svh, not vh: on a phone `vh` is the *large* viewport — the one you get
    // with the address bar hidden — so a list sized in it is taller than the
    // screen actually showing it for as long as the bar is still down.
    <ul role="listbox" className="max-h-[min(60svh,26rem)] overflow-y-auto overscroll-contain py-1">
      {hits.map((h, i) => {
        const Icon = ICONS[h.type];
        return (
          <li key={`${h.type}-${h.id}`} role="option" aria-selected={i === activeIndex}>
            <Link
              href={h.href}
              onClick={onNavigate}
              data-search-item={i}
              className={cn(
                "flex items-center gap-3 px-4 transition-colors",
                compact ? "py-2.5" : "py-3",
                i === activeIndex ? "bg-card-hover" : "hover:bg-card-hover",
              )}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-card-border bg-surface-2 text-foreground">
                {h.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={h.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{h.title}</span>
                {h.subtitle && (
                  <span className="block truncate text-xs text-foreground-muted">{h.subtitle}</span>
                )}
              </span>
              <span className="shrink-0 rounded-md border border-card-border px-2 py-0.5 text-[0.7rem] text-foreground-faint lg:text-[10px]">
                {h.badge || LABELS[h.type]}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
