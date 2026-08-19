"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { SERVICE_CARD_IMAGE } from "@/lib/constants";
import { useMediaQuery, DESKTOP } from "@/lib/use-media";
import { ARC_SMALL_VARIANTS, smallVariant } from "@/lib/marquee-variants";
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
  /** Whether the row is drawn on a cylinder. A ref, because `paint` reads it
   *  from inside a rAF and must not be rebuilt when it changes. */
  const curved = useRef(false);
  const wide = useMediaQuery(DESKTOP);

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

    /**
     * A phone gets a plain slider.
     *
     * The curve is a per-frame rewrite of rotateY, translateZ, translateY and
     * scale on every card — and because it moves a card *visually* while its
     * snap position is worked out from layout, a card snapped to the centre
     * still came to rest off-centre and half out of frame. Clearing the
     * transforms is what puts it back in the middle, so this is the same fix
     * for both complaints.
     */
    if (!curved.current) {
      for (const card of el.querySelectorAll<HTMLElement>("[data-arc-card]")) {
        card.style.transform = "";
        card.style.opacity = "";
        card.style.zIndex = "";
      }
      return;
    }
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
    curved.current = wide;
    paint();
  }, [wide, paint]);

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
        {services.map((s) => {
          // The arc's own artwork, not `cover` — see SERVICE_CARD_IMAGE.
          const art = SERVICE_CARD_IMAGE[s.slug] ?? s.cover;
          const artSmall = art && ARC_SMALL_VARIANTS.has(art) ? smallVariant(art) : null;
          return (
          <Link
            key={s.id}
            href={`/services/${s.slug}`}
            data-arc-card
            className="arc-card group relative flex min-h-[360px] w-[268px] shrink-0 snap-center flex-col overflow-hidden rounded-[1.5rem] border border-card-border bg-surface p-6 sm:w-[290px]"
          >
            {art && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art}
                  // The card is a fixed 268px, 290px from sm up, so `sizes` is
                  // simply those two numbers — and 600 is exactly twice the
                  // larger one. A 2x screen takes the small file and matches
                  // pixel for pixel; a 3x screen still picks the 900px
                  // original. Artwork uploaded to the Media Library has no
                  // sibling and is served exactly as before.
                  srcSet={artSmall ? `${artSmall} 600w, ${art} 900w` : undefined}
                  sizes={artSmall ? "(max-width: 639px) 268px, 290px" : undefined}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="poster-scrim absolute inset-0" aria-hidden />
              </>
            )}
            {/* `justify-end` is the whole fix for legibility here: the artwork
                carries its own title across the top, so copy laid over it
                collided with the printed one. Pushing the text to the foot of
                the card puts it on the dense end of the scrim and leaves the
                artwork's own heading visible above it. */}
            <div className="relative flex h-full flex-1 flex-col justify-end">
              <div
                className={cn(
                  "absolute right-0 top-0 grid h-12 w-12 place-items-center rounded-[13px]",
                  art ? "glass-onmedia" : "liquid-clear text-foreground",
                )}
              >
                <Icon name={s.icon} className="h-5 w-5" />
              </div>
              <h3
                className={cn(
                  "font-display text-lg font-bold tracking-tight",
                  art ? "text-white" : "text-foreground",
                )}
              >
                {tr(locale, s.title, s.titleEn, s.titleAr)}
              </h3>
              {s.tagline && (
                <p className={cn("mt-1.5 text-xs", art ? "text-white/70" : "text-foreground-faint")}>
                  {tr(locale, s.tagline, s.taglineEn, s.taglineAr)}
                </p>
              )}
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  art ? "text-white/85" : "text-foreground-muted",
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
                    art ? "text-white" : "text-foreground",
                  )}
                >
                  {detailsLabel}
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </div>
          </Link>
          );
        })}
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
