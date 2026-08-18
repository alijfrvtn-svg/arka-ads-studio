"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn, localeNumber } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
import type { Locale } from "@/types";

export interface ArcService {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  titleAr: string | null;
  tagline: string | null;
  taglineEn: string | null;
  taglineAr: string | null;
  excerpt: string;
  excerptEn: string | null;
  excerptAr: string | null;
  icon: string;
  priceFrom: number | null;
  /** Rendered as the card's ground once artwork exists; inert until then. */
  cover: string | null;
}

/** How hard the arc bends, at the outer edge of the row. */
const MAX_ROTATE = 26; // deg
const MAX_DEPTH = 90; // px pushed back
const MAX_DROP = 20; // px pushed down
const MAX_SHRINK = 0.07;

/**
 * A department's services as a coverflow row.
 *
 * The cards sit on the near face of a large cylinder: each one's rotateY and
 * translateZ come from how far its centre is from the centre of the row, so a
 * card turns away and recedes as it travels toward the edge and comes upright
 * as it passes through the middle. That is the whole effect — no keyframes, just
 * a function of scroll position.
 *
 * Scrolling rather than a static fan of all seven, because these cards carry
 * real copy: title, tagline, description, price. Seven across a 1240px row is
 * 177px each, which no amount of arc makes readable in Persian. Scrolling keeps
 * them near 290px and matches the reference, where the row visibly continues
 * past both edges.
 *
 * Ready for artwork: `cover` renders as the card ground under a scrim as soon as
 * a service has one, and the layout does not shift when it appears.
 */
export function ServiceArc({
  services,
  locale = "fa",
  detailsLabel,
  priceUnit,
}: {
  services: ArcService[];
  locale?: Locale;
  detailsLabel: string;
  priceUnit: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  /**
   * Read every card, then write every card.
   *
   * Deliberately two passes: interleaving getBoundingClientRect with a style
   * write makes the browser re-layout between each card, and with seven per row
   * and four rows on the page that is the difference between a smooth scroll and
   * a stuttering one.
   */
  const paint = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-arc-card]"));
    const box = el.getBoundingClientRect();
    const mid = box.left + box.width / 2;
    const reach = box.width / 2 || 1;

    const offsets = cards.map((card) => {
      const r = card.getBoundingClientRect();
      return Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - mid) / reach));
    });

    cards.forEach((card, i) => {
      const t = offsets[i];
      const a = Math.abs(t);
      card.style.transform =
        `perspective(1400px) rotateY(${(-t * MAX_ROTATE).toFixed(2)}deg) ` +
        `translateZ(${(-a * MAX_DEPTH).toFixed(1)}px) ` +
        `translateY(${(a * MAX_DROP).toFixed(1)}px) ` +
        `scale(${(1 - a * MAX_SHRINK).toFixed(3)})`;
      // Edge cards recede rather than vanish — still legible, clearly secondary.
      card.style.opacity = String(Math.max(0.45, 1 - a * 0.4).toFixed(2));
      // Clamped above zero: `a` reaches 1.2 at the far edge, so the raw
      // expression went negative and a card that far out would paint behind its
      // own row rather than merely behind its neighbours.
      card.style.zIndex = String(Math.max(1, 100 - Math.round(a * 80)));
    });
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    // Paint once on mount, so the row is already curved before any scrolling.
    paint();
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        paint();
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [paint]);

  const nudge = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-arc-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 290) + 20), behavior: "smooth" });
  };

  const t = ui(locale);

  return (
    <div className="relative">
      <div ref={scroller} className="arc-row flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pt-10">
        {services.map((s) => (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            data-arc-card
            className="arc-card group relative flex min-h-[360px] w-[268px] shrink-0 snap-center flex-col overflow-hidden rounded-[1.5rem] border border-card-border bg-surface p-6 sm:w-[290px]"
          >
            {s.cover && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.cover}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="poster-scrim absolute inset-0" aria-hidden />
              </>
            )}
            <div className="relative flex h-full flex-1 flex-col">
              <div
                className={cn(
                  "mb-5 grid h-12 w-12 place-items-center rounded-[13px]",
                  s.cover ? "glass-onmedia" : "liquid-clear text-foreground",
                )}
              >
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3
                className={cn(
                  "font-display text-lg font-bold tracking-tight",
                  s.cover ? "text-white" : "text-foreground",
                )}
              >
                {tr(locale, s.title, s.titleEn, s.titleAr)}
              </h3>
              {s.tagline && (
                <p className={cn("mt-1.5 text-xs", s.cover ? "text-white/70" : "text-foreground-faint")}>
                  {tr(locale, s.tagline, s.taglineEn, s.taglineAr)}
                </p>
              )}
              <p
                className={cn(
                  "mt-3 flex-1 text-sm leading-relaxed",
                  s.cover ? "text-white/85" : "text-foreground-muted",
                )}
              >
                {tr(locale, s.excerpt, s.excerptEn, s.excerptAr)}
              </p>
              <div
                className={cn(
                  "mt-6 flex items-center justify-between border-t pt-5",
                  s.cover ? "border-white/20" : "border-card-border",
                )}
              >
                <span
                  className={cn("ltr-nums text-xs", s.cover ? "text-white/60" : "text-foreground-faint")}
                >
                  {s.priceFrom ? `${t.priceFromPrefix} ${localeNumber(locale, s.priceFrom)} ${priceUnit}` : ""}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-semibold",
                    s.cover ? "text-white" : "text-foreground",
                  )}
                >
                  {detailsLabel}
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Arrows add to native scroll and drag rather than replacing them — the
          row still moves with a trackpad, a wheel or a finger. */}
      {services.length > 2 && (
        <div className="flex items-center justify-center gap-3 lg:justify-start">
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={t.arcPrev}
            className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={t.arcNext}
            className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
