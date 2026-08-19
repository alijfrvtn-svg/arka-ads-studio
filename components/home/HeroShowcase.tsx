"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpLeft, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Typewriter } from "@/components/fx/Typewriter";
import { Magnetic } from "@/components/fx/Magnetic";
import { cn } from "@/lib/utils";
import { MARQUEE_SMALL_VARIANTS, smallVariant } from "@/lib/marquee-variants";
import { useMediaQuery } from "@/lib/use-media";
import type { Locale } from "@/types";

export interface ShowcaseCard {
  /** Service slug — the card links straight to that service page. */
  slug: string;
  title: string;
  /** Cover image. Empty renders the placeholder frame instead. */
  image: string | null;
}

export interface ShowcaseSlide {
  department: string;
  title: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  cards: ShowcaseCard[];
}

const LABELS: Record<Locale, { prev: string; next: string; go: string; region: string; of: string }> = {
  fa: { prev: "دسته قبلی", next: "دسته بعدی", go: "رفتن به دسته", region: "دسته‌بندی خدمات", of: "از" },
  en: { prev: "Previous category", next: "Next category", go: "Go to category", region: "Service categories", of: "of" },
  ar: { prev: "الفئة السابقة", next: "الفئة التالية", go: "الانتقال إلى الفئة", region: "فئات الخدمات", of: "من" },
};

/**
 * Geometry of the seven-card fan.
 *
 * The cards are laid out as an arc rather than a row: `spread` walks each card
 * out from centre, `rotate` tilts it along the tangent, and `lift` pushes the
 * outer cards down so the top edges trace a curve. Index 3 is the middle card
 * and sits upright and highest, which is what makes the centre read as the
 * front of the deck.
 *
 * Values are in the visual order left-to-right; the component is inside an RTL
 * document but the fan is a picture, not text, so it is positioned with explicit
 * left/right transforms and stays identical in both directions.
 */
function fan(i: number, total: number, compact = false, narrow = false) {
  const mid = (total - 1) / 2;
  const offset = i - mid; // -3 … +3 for seven cards
  // Spacing is a fraction of the card width, so the fan keeps its shape at both
  // sizes instead of the compact deck spilling out of its box.
  //
  // `narrow` is a phone. At the desktop step of 118 the seven cards spanned
  // 905px — measured on a 375px screen, six of the seven hung off one edge or
  // the other and the outermost sat 265px past it. A hand of cards is meant to
  // overlap, so the phone closes the fan rather than dropping cards from it:
  // a third of the step and half the rake, which brings the whole spread
  // inside 375 with every card still on screen.
  const step = narrow ? 38 : compact ? 88 : 118;
  return {
    x: offset * step,
    y: Math.abs(offset) * (narrow ? 12 : compact ? 19 : 26),
    // Less rake as well as less spread: a rotated card's bounding box is wider
    // than the card, and at 22.5deg that alone was pushing 56px past each end.
    rotate: offset * (narrow ? 4 : 7.5),
    // Middle card sits on top, outer cards recede behind their neighbours.
    z: total - Math.abs(offset),
  };
}

/**
 * Move `slug`'s card to the middle of the deck, keeping everything else in its
 * existing relative order.
 *
 * The middle slot is the one the fan draws upright, highest and on top, so a
 * service page can reuse the homepage deck and still make clear which card you
 * are standing on — without a second layout or a highlight colour there is no
 * palette for.
 */
function centre<T extends { slug: string }>(cards: T[], slug?: string) {
  if (!slug) return cards;
  const found = cards.findIndex((c) => c.slug === slug);
  if (found === -1) return cards;
  const rest = [...cards.slice(0, found), ...cards.slice(found + 1)];
  const mid = Math.floor(cards.length / 2);
  return [...rest.slice(0, mid), cards[found], ...rest.slice(mid)];
}

/** How long the outgoing deck takes to clear the frame, in ms. */
const EXIT_MS = 520;
/** Autoplay dwell per slide. */
const AUTOPLAY_MS = 20_000;

/**
 * Homepage hero: a deck of service cards per department, stepped through by
 * hand.
 *
 * Replaces the five previous hero modes (cinematic / slider / image / videoLoop
 * / videoScroll). Those were five ways to present the same headline; this one
 * presents the actual catalogue, so the first screen answers "what do you do"
 * with seven concrete answers instead of an adjective.
 *
 * Motion, per slide:
 *   cards  — rise from below, spinning a full turn as they settle into the fan
 *   title  — types
 *   tagline + CTA — type/fade in behind it
 * Leaving, the whole deck exits upward and the copy fades, so the two slides
 * never occupy the same space.
 *
 * Advances on its own every 20s, and by hand at any time. Autoplay stops on
 * hover and on keyboard focus — an auto-advancing hero that moves the CTA out
 * from under the cursor is the classic reason carousels lose the click, and
 * pausing on approach is what makes the two safe together.
 */
export function HeroShowcase({
  slides,
  locale = "fa",
  focusSlug,
  compact = false,
}: {
  slides: ShowcaseSlide[];
  locale?: Locale;
  /**
   * Service pages pass their own slug: that card moves to the front of the fan
   * and everything else fans out behind it. With a single slide the arrows and
   * the position dots disappear on their own — there is nowhere to go.
   */
  focusSlug?: string;
  /**
   * Sub-page footprint. The homepage hero owns the whole first screen; on a
   * service page the deck is an introduction to the page under it, and a
   * full-height one would push the actual content below the fold.
   */
  compact?: boolean;
}) {
  const t = LABELS[locale] ?? LABELS.fa;
  const [index, setIndex] = useState(0);
  // "out" while the current deck is clearing, "in" once the next one is up.
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const busy = useRef(false);
  const timer = useRef(0);
  const count = slides.length;

  /**
   * Whether the client has taken over.
   *
   * framer-motion writes `initial` into the *server-rendered HTML*, so an
   * entrance that starts at `opacity: 0` ships the hero invisible and leaves it
   * that way until the bundle has downloaded, parsed and hydrated. This is the
   * top of the homepage — the first thing anyone sees and the LCP — and on a
   * slow link it was a white screen for as long as that took.
   *
   * So the first render has no entrance: the deck and the heading are drawn
   * where they belong, in the HTML, with no script needed to reveal them. Every
   * slide after it animates exactly as before, because by then this is true.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /** Below sm the fan closes up — see `fan()`. */
  const wide = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(timer.current);
    };
  }, []);

  /**
   * Leave, then arrive — driven by a timer rather than by AnimatePresence.
   *
   * The obvious version (an AnimatePresence keyed on the slide) does not work
   * here: with `mode="wait"` the incoming deck is held until the outgoing one
   * signals completion, and a wrapper whose only exit variant is a
   * `staggerChildren` transition never sends that signal — the first deck stayed
   * on screen through every slide change while the heading dutifully updated
   * around it. Sequencing it by hand makes the two halves explicit and cannot
   * deadlock.
   *
   * `busy` swallows clicks mid-transition, so a fast double-click cannot leave
   * the deck and the heading on different slides.
   */
  const step = useCallback(
    (next: number) => {
      if (busy.current || next === index) return;
      busy.current = true;
      setPhase("out");
      timer.current = window.setTimeout(
        () => {
          setIndex(next);
          setPhase("in");
          busy.current = false;
        },
        reduced ? 0 : EXIT_MS,
      );
    },
    [index, reduced],
  );

  const go = useCallback(
    (d: number) => step((index + d + count) % count),
    [step, index, count],
  );

  /**
   * Autoplay, 20s a slide.
   *
   * Three things stop it, and all three matter for a carousel that holds the
   * page's primary CTA:
   *   - hover or keyboard focus, so it cannot move the button out from under a
   *     cursor or a tab stop mid-reach;
   *   - a hidden tab, since advancing a deck nobody is looking at is a repaint
   *     for nothing;
   *   - prefers-reduced-motion, which is exactly what a slideshow that moves on
   *     its own is about.
   * It keeps running after a manual click rather than switching off — the
   * arrows are a way to get ahead of it, not a way to take it over.
   */
  useEffect(() => {
    if (reduced || count < 2 || paused) return;
    // A timeout re-armed on `index`, not an interval: advancing by hand
    // restarts the dwell, so a slide you just chose still gets its full 20s
    // instead of being taken away a moment later by a tick already in flight.
    // It also routes through `go`, so autoplay uses the same exit-then-enter
    // transition as the arrows rather than swapping the deck underneath it.
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [reduced, count, paused, index, go]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!count) return null;
  const slide = slides[index];
  const leaving = phase === "out";
  const cards = centre(slide.cards, focusSlug);
  const single = count < 2;

  return (
    <section
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden",
        compact ? "pb-16 pt-28" : "min-h-[100svh] pb-24 pt-32",
      )}
      aria-roledescription="carousel"
      aria-label={t.region}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        // RTL: ArrowLeft advances visually, so map by reading direction.
        if (e.key === "ArrowLeft") go(locale === "en" ? -1 : 1);
        if (e.key === "ArrowRight") go(locale === "en" ? 1 : -1);
      }}
    >
      <div className="container-x flex w-full flex-col items-center">
        {/* ————— title ————— */}
        <div className="relative z-10 mb-4 min-h-[4.5rem] w-full max-w-4xl text-center md:min-h-[7rem]">
          <motion.div
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: reduced ? 0 : leaving ? 0.22 : 0.3 }}
          >
            <Typewriter
              as="h1"
              runKey={index}
              text={slide.title}
              speed={34}
              startDelay={reduced ? 0 : 420}
              className="font-display text-[8vw] font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            />
          </motion.div>
        </div>

        {/* ————— the deck —————

            Every card carries its own initial/animate/transition, with the
            stagger written as `delay: i * step` — no variants, and no
            orchestration inherited from the wrapper.

            The first version keyed each card under AnimatePresence popLayout
            and the outgoing decks never unmounted: each card exited on its own
            schedule, nothing tracked the group, and all four decks ended up
            stacked on screen (7 -> 14 -> 21 -> 28 cards). Rather than tune that
            orchestration, this drops it — a card that is told exactly where to
            be has no group state to get stuck in.

            The wrapper is keyed on `index` purely so a slide change remounts
            the cards and replays their entrance. */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{
            height: compact ? "clamp(12rem, 26vw, 19rem)" : "clamp(14rem, 34vw, 25rem)",
            perspective: 1400,
          }}
        >
          <div key={index} className="absolute inset-0 flex items-center justify-center">
            {cards.map((card, i) => {
              const g = fan(i, cards.length, compact, !wide);
              const focused = !!focusSlug && card.slug === focusSlug;
              return (
                <motion.div
                  key={card.slug}
                  className="absolute"
                  // The focused card is lifted clear of the whole deck, not
                  // just its neighbours, so nothing overlaps it.
                  style={{ zIndex: focused ? cards.length + 1 : g.z }}
                  // Up from below, through a full turn, into the fan.
                  initial={mounted ? { opacity: 0, x: g.x, y: 260, rotate: g.rotate - 360, scale: 0.82 } : false}
                  animate={
                    leaving
                      ? // …and out through the top.
                        { opacity: 0, x: g.x, y: -300, rotate: g.rotate + 40, scale: 0.9 }
                      : {
                          opacity: 1,
                          x: g.x,
                          // Focused: upright, forward and a touch higher. It
                          // reads as the front of the deck without needing a
                          // colour to say so.
                          y: focused ? -18 : g.y,
                          rotate: focused ? 0 : g.rotate,
                          scale: focused ? 1.1 : 1,
                        }
                  }
                  transition={
                    reduced
                      ? { duration: 0 }
                      : leaving
                        ? { duration: 0.42, delay: i * 0.03, ease: [0.4, 0, 1, 1] }
                        : { duration: 1, delay: i * 0.075, ease: [0.16, 1, 0.3, 1] }
                  }
                >
                  <ShowcaseCardFace card={card} focused={focused} compact={compact} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ————— tagline ————— */}
        <div className="relative z-10 mt-10 min-h-[3.25rem] w-full max-w-xl text-center">
          <motion.div
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={{ duration: reduced ? 0 : leaving ? 0.22 : 0.3 }}
          >
            <Typewriter
              as="p"
              runKey={index}
              text={slide.tagline}
              speed={16}
              startDelay={reduced ? 0 : 900}
              className="text-base leading-relaxed text-foreground-muted md:text-lg"
            />
          </motion.div>
        </div>

        {/* ————— CTA + arrows ————— */}
        <div className="relative z-10 mt-9 flex items-center gap-3 sm:gap-5">
          {/* Direction is NOT locale-dependent — "previous" is -1 everywhere.
              Only the arrowhead flips, because in RTL the previous slide lies
              to the right. Tying the delta to the locale as well had the two
              cancelling out: this button was labelled prev and stepped forward. */}
          {!single && (
            <button
              onClick={() => go(-1)}
              aria-label={t.prev}
              className="liquid liquid-clear grid h-12 w-12 shrink-0 place-items-center rounded-full text-foreground"
            >
              {locale === "en" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          )}

          <motion.div
            key={index}
            initial={mounted ? { opacity: 0, y: 14 } : false}
            animate={leaving ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : leaving
                  ? { duration: 0.2 }
                  : { duration: 0.5, delay: 1.25, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <Magnetic strength={0.4}>
              <Link
                href={slide.ctaHref}
                data-track="hero-showcase-cta"
                className="liquid btn-glow group inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-8 text-base font-semibold"
              >
                <span className="inline-flex items-center gap-2.5">
                  {slide.ctaLabel}
                  <ArrowUpLeft className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Magnetic>
          </motion.div>

          {!single && (
            <button
              onClick={() => go(1)}
              aria-label={t.next}
              className="liquid liquid-clear grid h-12 w-12 shrink-0 place-items-center rounded-full text-foreground"
            >
              {locale === "en" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* ————— which of the four ————— */}
        <div className={cn("relative z-10 mt-8 flex items-center gap-1", single && "hidden")}>
          {slides.map((s, i) => (
            <button
              key={s.department}
              onClick={() => step(i)}
              aria-label={`${t.go}: ${s.title}`}
              aria-current={i === index}
              className="grid h-11 w-11 shrink-0 place-items-center"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                  i === index ? "w-7 bg-foreground" : "w-1.5 bg-foreground/25",
                )}
              />
            </button>
          ))}
        </div>

        {/* Slide changes are announced once, as a sentence, rather than through
            the typing animation firing a live update per character. */}
        <p className="sr-only" aria-live="polite">
          {slide.title} — {index + 1} {t.of} {count}
        </p>
      </div>
    </section>
  );
}

/** One card in the deck. Links to its own service page. */
function ShowcaseCardFace({
  card,
  focused = false,
  compact = false,
}: {
  card: ShowcaseCard;
  focused?: boolean;
  compact?: boolean;
}) {
  // Only the static artwork has a smaller sibling; a Media Library upload
  // or a remote cover is served exactly as before.
  const small = card.image && MARQUEE_SMALL_VARIANTS.has(card.image) ? smallVariant(card.image) : null;

  return (
    <Link
      href={`/services/${card.slug}`}
      data-cursor
      aria-current={focused ? "page" : undefined}
      /* 4:5 — the artwork's own ratio, so a card is never cropped. The width
         follows from the height rather than being set independently. */
      className={cn(
        "group block aspect-[4/5] overflow-hidden rounded-[1.25rem] border bg-surface transition-shadow duration-700 [transition-timing-function:var(--ease-apple)]",
        compact ? "h-[clamp(7.5rem,17vw,12.5rem)]" : "h-[clamp(9rem,22vw,16rem)]",
        focused
          ? "border-foreground/25 shadow-[0_3px_6px_rgba(0,0,0,0.08),0_48px_90px_-30px_rgba(0,0,0,0.55)]"
          : "border-card-border shadow-[0_1px_2px_rgba(0,0,0,0.05),0_22px_48px_-24px_rgba(0,0,0,0.4)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.07),0_36px_70px_-28px_rgba(0,0,0,0.5)]",
      )}
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
          // These are the only eager images on the homepage, so they are the
          // ones competing with the LCP — and they were the full 720px file
          // for a card that is never wider than 160px. `sizes` is the card's
          // own clamp, so the browser resolves the same number the layout
          // does: a 2x screen takes the 420px sibling at 31KB, a 3x screen
          // still needs more than 420 and keeps the original. Seven cards, so
          // this is ~440KB off the critical path on most devices.
          srcSet={small ? `${small} 420w, ${card.image} 720w` : undefined}
          sizes={
            small
              ? compact
                ? "(max-width: 1023px) 144px, clamp(144px, 17vw, 200px)"
                : "(max-width: 1023px) 176px, clamp(176px, 22vw, 256px)"
              : undefined
          }
          alt={card.title}
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
        /* Placeholder until the artwork is uploaded — the card keeps its exact
           final footprint so the fan geometry does not shift when real images
           land. */
        <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-2 px-3 text-center">
          <ImageIcon className="h-5 w-5 text-foreground-faint" aria-hidden />
          <span className="text-[0.72rem] lg:text-[11px] font-medium leading-snug text-foreground-muted">{card.title}</span>
        </span>
      )}
    </Link>
  );
}
