"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { EmbedFrame } from "@/components/media/EmbedFrame";
import { getEmbedUrl } from "@/lib/embed";
import { cn, labelOn } from "@/lib/utils";
import { INDUSTRY_PAINT_ORDER } from "@/lib/constants";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/types";
import { useAppearance } from "@/components/providers/Appearance";

/**
 * The industries page: a list you run down, and a stage that answers it.
 *
 * What it replaces showed the title and an icon, and nothing else — while every
 * one of the twelve rows carries a real cover and a 150-character excerpt that
 * never reached the screen. The covers were there, at 25% opacity under a
 * near-white gradient, which is why the page read as an empty list.
 *
 * From lg the list sits on the reading side and the stage holds still beside
 * it: pointing at a row fills the stage with that industry's media, its
 * excerpt and its way in. Below lg there is no pointer to hover with, so the
 * layout stops pretending — each row becomes its own card carrying the same
 * media and excerpt directly.
 *
 * The stage is `aria-hidden`. Everything it shows is in the list markup too —
 * the excerpt is `lg:sr-only` rather than absent — so a screen reader and a
 * keyboard get the whole page from the list alone, and the stage stays what it
 * is: a preview.
 */

interface Ind {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  titleAr: string | null;
  excerpt: string;
  excerptEn?: string | null;
  excerptAr?: string | null;
  icon: string;
  cover: string | null;
  heroVideo: string | null;
}

/**
 * Seed media that is not real content.
 *
 * Eleven of the twelve industries point `heroVideo` at Google's public sample
 * bucket — ForBiggerJoyrides, ElephantsDream and four others, six clips shared
 * between eleven rows. They are leftovers from seeding, and the host answers
 * 403 from here, so mounting one shows a black rectangle at best and someone
 * else's short film at worst.
 *
 * The covers are real uploads, so a filtered row falls back to its cover and
 * looks finished. Point `heroVideo` at a real file in the admin and the stage
 * plays it with no change here.
 */
const PLACEHOLDER_MEDIA = /commondatastorage\.googleapis\.com\/gtv-videos-bucket/i;

function realVideo(src: string | null): string | null {
  if (!src || PLACEHOLDER_MEDIA.test(src)) return null;
  return src;
}

const COPY: Record<Locale, { view: string; empty: string }> = {
  fa: { view: "ورود به این صنعت", empty: "صنعتی برای نمایش نیست." },
  en: { view: "Explore this industry", empty: "No industries to show." },
  ar: { view: "ادخل هذه الصناعة", empty: "لا توجد صناعات للعرض." },
};

/**
 * One industry's media. A video when there is a real one, the cover otherwise,
 * and a plain surface if even that is missing — an <img> with an empty src
 * renders as a broken-image icon, which is worse than nothing.
 */
function Media({
  ind,
  play,
  eager = false,
  className,
}: {
  ind: Ind;
  /** Whether this one should be running. Only ever one at a time. */
  play: boolean;
  /** True for the stage, which is above the fold. */
  eager?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = realVideo(ind.heroVideo);
  const embed = src ? getEmbedUrl(src, { autoplay: true, mute: true, loop: true }) : null;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else v.pause();
  }, [play]);

  if (src && embed) {
    return <EmbedFrame src={embed} className={cn("pointer-events-none h-full w-full", className)} />;
  }
  if (src) {
    return (
      <video
        ref={videoRef}
        src={src}
        poster={ind.cover ?? undefined}
        muted
        loop
        playsInline
        // Nothing is fetched until this one is actually asked to play, so a
        // page of twelve costs one video, not twelve.
        preload="none"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  if (ind.cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={ind.cover}
        alt=""
        // The covers are 0.7-2.6MB each. Twelve of them eagerly is most of a
        // mobile data plan for a page you may only read the top of.
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return <span className={cn("block h-full w-full bg-surface-2", className)} />;
}

export function IndustryShowcase({ industries, locale = "fa" }: { industries: Ind[]; locale?: Locale }) {
  // The live identity, edited in the panel. Falls back to the shipped
  // constants when there is nothing saved — see lib/appearance.ts.
  const { industryPaint: INDUSTRY_PAINT } = useAppearance();
  const reduced = useReducedMotion();
  const c = COPY[locale] ?? COPY.fa;
  const [active, setActive] = useState(0);

  /**
   * Whether the client has taken over.
   *
   * framer-motion writes `initial` into the server-rendered HTML, so an
   * entrance that begins at `opacity: 0` ships these invisible and leaves them
   * that way until the bundle hydrates. The first render is drawn in place;
   * everything after it animates exactly as before.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  /**
   * The frame the stage is crossfading FROM.
   *
   * The first version let <AnimatePresence> hold the outgoing media and fade it
   * out. Two things were wrong with that: `mode="wait"` made every new caption
   * queue behind a 0.45s exit, so running down twelve rows lagged a full step
   * behind the pointer; and because an exit only finishes when its animation
   * does, fast movement left several covers mounted at once — the opposite of
   * the one-at-a-time rule this component is built on.
   *
   * Holding the previous index in state instead pins the count at exactly two:
   * the outgoing frame sits still underneath while the incoming one fades in
   * over it, and it is replaced on a timer rather than by an animation
   * completing.
   */
  const [prev, setPrev] = useState(0);
  /** Which card is on screen on the narrow layout — the stand-in for hover. */
  const [visible, setVisible] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  // Below lg there is no pointer, so the card the reader has actually arrived
  // at is the one that plays. Same rule as the stage: one at a time.
  useEffect(() => {
    if (reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = cardRefs.current.indexOf(e.target as HTMLElement);
          if (i >= 0) setVisible(i);
        }
      },
      { threshold: 0.6 },
    );
    cardRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [reduced, industries.length]);

  useEffect(() => {
    if (prev === active) return;
    const t = setTimeout(() => setPrev(active), 460);
    return () => clearTimeout(t);
  }, [active, prev]);

  const pick = useCallback((i: number) => setActive(i), []);

  if (!industries.length) {
    return <p className="py-20 text-center text-foreground-muted">{c.empty}</p>;
  }

  const cur = industries[active] ?? industries[0];
  const prevInd = industries[prev] ?? null;
  const curTitle = tr(locale, cur.title, cur.titleEn, cur.titleAr);
  const curExcerpt = tr(locale, cur.excerpt, cur.excerptEn ?? null, cur.excerptAr ?? null);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
      {/* ── the list ── first in source, so in RTL it takes the reading side ── */}
      <div className="overflow-hidden rounded-[1.75rem] border border-card-border lg:self-start">
        <div>
          {industries.map((ind, i) => {
            const isActive = i === active;
            const title = tr(locale, ind.title, ind.titleEn, ind.titleAr);
            const excerpt = tr(locale, ind.excerpt, ind.excerptEn ?? null, ind.excerptAr ?? null);
            // Same four colours and the same order as the homepage rows: three
            // rows per colour, no colour ever touching itself. The order table
            // is twelve long and so is this list, so it lands exactly.
            const colour = INDUSTRY_PAINT[INDUSTRY_PAINT_ORDER[i % INDUSTRY_PAINT_ORDER.length]];
            // Computed per hex, never paired by hand — see labelOn(). Floor
            // across the four is 5.70:1 (white on the violet), widest 10.96:1
            // (ink on the gold).
            const label = labelOn(colour);
            const onDark = label === "#ffffff";
            return (
              <Link
                key={ind.id}
                href={`/industries/${ind.slug}`}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                // Focus as well as hover: running the list with a keyboard
                // should drive the stage exactly as the pointer does.
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                className="ind-row relative group block px-5 py-5 md:px-7"
                style={{ background: colour, color: label }}
              >
                {/* The cast-glass shell, as on the homepage: a diagonal facet, a
                    sheen off the top edge and a bevelled rim, all white and
                    black at low alpha so it works on any of the four without
                    being tuned per hex. */}
                <span className="crystal" aria-hidden />
                {/* The card's own media, on the layout that has no stage. */}
                <div className="relative mb-4 aspect-[16/10] overflow-hidden rounded-[1.25rem] lg:hidden">
                  <Media ind={ind} play={!reduced && i === visible} />
                  <span className="poster-scrim absolute inset-0" aria-hidden />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="flex min-w-0 items-center gap-4">
                    <span
                      className={cn(
                        "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                        onDark ? "border-white/35 bg-white/15" : "border-black/20 bg-black/[0.07]",
                        isActive && (onDark ? "border-white/60 bg-white/30" : "border-black/35 bg-black/[0.16]"),
                      )}
                      style={{ color: label }}
                    >
                      <Icon name={ind.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span
                        className="block truncate font-display text-xl font-bold tracking-tight md:text-2xl"
                        style={{ color: label }}
                      >
                        {title}
                      </span>
                      {locale === "fa" && ind.titleEn && (
                        <span
                          className="mt-0.5 block truncate text-[0.7rem] uppercase tracking-[0.12em] transition-opacity duration-500 lg:text-[0.6rem] lg:tracking-[0.22em]"
                          // 0.85 is the floor, not a taste: at 0.6 the label
                          // lands at 3.01:1 on the violet and 3.26 on the blue.
                          // Measured across the four, 0.85 is where the worst
                          // (violet) reaches 4.55 and all of them clear AA.
                          style={{ color: label, opacity: isActive ? 1 : 0.85 }}
                        >
                          {ind.titleEn}
                        </span>
                      )}
                    </span>
                  </span>
                  <ArrowUpLeft
                    className={cn(
                      "h-5 w-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                      isActive ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0",
                    )}
                    style={{ color: label }}
                    aria-hidden
                  />
                </div>

                {/* Read out on every layout; drawn only where the stage is not
                    already showing it. */}
                <p className="mt-3 text-sm leading-relaxed lg:sr-only" style={{ color: label, opacity: 0.85 }}>
                  {excerpt}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── the stage ── holds still while the list runs past it ── */}
      <div
        aria-hidden
        className="sticky top-28 hidden h-[min(calc(100svh-9rem),44rem)] overflow-hidden rounded-[1.75rem] border border-card-border bg-[#0a0a0a] lg:block"
      >
        {/* The outgoing frame, held still. Rendered only while a change is in
            flight, so the stage is one node at rest and two mid-crossfade. */}
        {prevInd && prevInd.id !== cur.id && (
          <div className="absolute inset-0">
            <Media ind={prevInd} play={false} />
          </div>
        )}
        <motion.div
          key={cur.id}
          className="absolute inset-0"
          initial={reduced || !mounted ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <Media ind={cur} play={!reduced} eager />
        </motion.div>

        {/* Built for exactly this case: white type over a photograph nobody has
            vetted. See .poster-scrim in globals.css for the numbers. */}
        <span className="poster-scrim absolute inset-0" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
          {/* Only the transform is animated, never the opacity. If the caption
              faded in and the animation never ran — a hidden tab, a stalled
              frame clock — the stage would be a photograph with no label on it.
              Starting 12px low and settling degrades to "12px low". */}
          <motion.div
            key={cur.id}
            initial={reduced ? false : { y: 12 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
              {locale === "fa" && cur.titleEn && (
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/70 lg:text-[0.65rem] lg:tracking-[0.28em]">
                  {cur.titleEn}
                </span>
              )}
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.02em] text-white md:text-4xl">
                {curTitle}
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">{curExcerpt}</p>
              <span className="glass-onmedia mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                {c.view}
                <ArrowUpLeft className="h-4 w-4" />
              </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
