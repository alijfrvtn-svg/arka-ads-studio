"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface Ind {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  icon: string;
  cover: string | null;
  heroVideo: string | null;
}

export function IndustryShowcase({ industries }: { industries: Ind[] }) {
  const [active, setActive] = useState(0);
  const cur = industries[active];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-card-border">
      {/* interactive background */}
      <div className="absolute inset-0">
        {cur?.heroVideo ? (
          <video
            key={cur.id}
            src={cur.heroVideo}
            poster={cur.cover ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-25"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          cur?.cover && <img src={cur.cover} alt="" className="h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/60 to-background/90" />
      </div>

      {/* list */}
      <div className="relative divide-y divide-card-border">
        {industries.map((ind, i) => (
          <Link
            key={ind.id}
            href={`/industries/${ind.slug}`}
            onMouseEnter={() => setActive(i)}
            className="group flex items-center justify-between gap-4 px-6 py-5 md:px-10"
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl border transition-colors",
                  i === active ? "border-primary/50 bg-primary/10 text-primary" : "border-card-border text-foreground-faint",
                )}
              >
                <Icon name={ind.icon} className="h-5 w-5" />
              </span>
              <div>
                <span
                  className={cn(
                    "font-display text-2xl font-bold transition-colors md:text-3xl",
                    i === active ? "text-foreground" : "text-foreground-faint",
                  )}
                >
                  {ind.title}
                </span>
                <p className={cn("text-xs uppercase tracking-widest transition-opacity", i === active ? "text-primary opacity-100" : "opacity-0")}>
                  {ind.titleEn}
                </p>
              </div>
            </div>
            <ArrowUpLeft
              className={cn(
                "h-6 w-6 shrink-0 transition-all",
                i === active ? "translate-x-0 text-primary opacity-100" : "translate-x-2 opacity-0",
              )}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
