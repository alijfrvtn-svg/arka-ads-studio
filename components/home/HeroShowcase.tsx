"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpLeft, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Typewriter } from "@/components/fx/Typewriter";
import { Magnetic } from "@/components/fx/Magnetic";
import { cn } from "@/lib/utils";
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
function fan(i: number, total: number) {
  const mid = (total - 1) / 2;
  const offset = i - mid; // -3 … +3 for seven cards
  return {
    x: offset * 118,
    y: Math.abs(offset) * 26,
    rotate: offset * 7.5,
    // Middle card sits on top, outer cards recede behind their neighbours.
    z: total - Math.abs(offset),
  };
}

/** How long the outgoing deck takes to clear the frame, in ms. */
const EXIT_MS = 520;

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
 * Advance is manual only. An auto-advancing hero moves the CTA out from under
 * the cursor, which is the classic reason carousels lose the click.
 */
export function HeroShowcase({
  slides,
  locale = "fa",
}: {
  slides: ShowcaseSlide[];
  locale?: Locale;
}) {
  const t = LABELS[locale] ?? LABELS.fa;
  const [index, setIndex] = useState(0);
  // "out" while the current deck is clearing, "in" once the next one is up.
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [reduced, setReduced] = useState(false);
  const busy = useRef(false);
  const timer = useRef(0);
  const count = slides.length;

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

  if (!count) return null;
  const slide = slides[index];
  const leaving = phase === "out";

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pb-24 pt-32"
      aria-roledescription="carousel"
      aria-label={t.region}
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

            One keyed wrapper per slide, not one animated child per card. Keying
            the cards individually (under AnimatePresence popLayout) left every
            outgoing deck mounted: each card exited on its own schedule and
            nothing guaranteed the group finished, so the screen ended up
            holding all four decks at once. The wrapper remounts on `index`, and
            `leaving` drives the exit, so exactly one deck exists at a time. */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{ height: "clamp(17rem, 34vw, 25rem)", perspective: 1400 }}
        >
          <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              initial="enter"
              animate={leaving ? "leave" : "show"}
              variants={{
                show: { transition: { staggerChildren: reduced ? 0 : 0.075 } },
                leave: { transition: { staggerChildren: reduced ? 0 : 0.03 } },
              }}
            >
              {slide.cards.map((card, i) => {
                const g = fan(i, slide.cards.length);
                return (
                  <motion.div
                    key={card.slug}
                    className="absolute"
                    style={{ zIndex: g.z }}
                    variants={{
                      // Up from below, through a full turn, into the fan.
                      enter: { opacity: 0, x: g.x, y: 260, rotate: g.rotate - 360, scale: 0.82 },
                      show: {
                        opacity: 1,
                        x: g.x,
                        y: g.y,
                        rotate: g.rotate,
                        scale: 1,
                        transition: reduced ? { duration: 0 } : { duration: 1, ease: [0.16, 1, 0.3, 1] },
                      },
                      // …and out through the top.
                      leave: {
                        opacity: 0,
                        y: -300,
                        rotate: g.rotate + 40,
                        scale: 0.9,
                        transition: reduced ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 1, 1] },
                      },
                    }}
                  >
                    <ShowcaseCardFace card={card} />
                  </motion.div>
                );
              })}
          </motion.div>
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
          <button
            onClick={() => go(-1)}
            aria-label={t.prev}
            className="liquid liquid-clear grid h-12 w-12 shrink-0 place-items-center rounded-full text-foreground"
          >
            {locale === "en" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14 }}
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

          <button
            onClick={() => go(1)}
            aria-label={t.next}
            className="liquid liquid-clear grid h-12 w-12 shrink-0 place-items-center rounded-full text-foreground"
          >
            {locale === "en" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* ————— which of the four ————— */}
        <div className="relative z-10 mt-8 flex items-center gap-1">
          {slides.map((s, i) => (
            <button
              key={s.department}
              onClick={() => step(i)}
              aria-label={`${t.go}: ${s.title}`}
              aria-current={i === index}
              className="grid h-11 w-8 place-items-center"
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
function ShowcaseCardFace({ card }: { card: ShowcaseCard }) {
  return (
    <Link
      href={`/services/${card.slug}`}
      data-cursor
      className="group block h-[clamp(11rem,22vw,16rem)] w-[clamp(8rem,16vw,11.5rem)] overflow-hidden rounded-[1.25rem] border border-card-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05),0_22px_48px_-24px_rgba(0,0,0,0.4)] transition-shadow duration-700 [transition-timing-function:var(--ease-apple)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.07),0_36px_70px_-28px_rgba(0,0,0,0.5)]"
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image}
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
          <span className="text-[11px] font-medium leading-snug text-foreground-muted">{card.title}</span>
        </span>
      )}
    </Link>
  );
}
