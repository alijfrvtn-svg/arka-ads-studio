"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, Clock } from "lucide-react";
import { labelOn, localeDigits } from "@/lib/utils";
import { useMediaQuery, DESKTOP } from "@/lib/use-media";
import type { Locale } from "@/types";
import { useAppearance } from "@/components/providers/Appearance";

/**
 * The five most-read posts, as a deck.
 *
 * Same object as the testimonials on the homepage: every card is real and
 * placed by how far it is from the front, advancing renumbers the deck rather
 * than swapping anything out, and the card that leaves flies off the top while
 * the one beneath rises into its place. Nothing mounts or unmounts, so there
 * are no exit animations to finish and nothing can pile up mid-flight.
 *
 * It turns over on its own every five seconds, and the front card can be
 * thrown by hand — the same gesture, with the clock reset so a manual flick is
 * not immediately overtaken.
 *
 * ── Two things this deck does that the testimonials one does not ──────────
 * Only the front card and the one being thrown carry a photograph; the cards
 * behind are their category's colour and nothing else. That is partly the look
 * — the four colours doing structural work — and partly weight: these covers
 * run over a megabyte each, and mounting five of them to show three would cost
 * most of a page load for pictures that are 30% visible at best.
 *
 * And a cover that fails to load falls back to that same colour rather than to
 * a broken-image icon. One of the current top five is a dead file, so this is
 * not hypothetical, and it means a future one cannot break the hero either.
 */

export interface DeckPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  readingMinutes: number;
  /** Which of the four colours this post's category takes. */
  colourIndex: number;
}

/**
 * Where a card sits, by how far it is from the front.
 *
 * `flat` is the phone, for the same reason as the testimonials deck: five
 * stacked, scaled, rotated cards with a drag gesture is a mouse object. Here it
 * becomes one cover at a time crossing into the next, on the same five-second
 * clock, with the same dots underneath.
 */
function seat(depth: number, last: boolean, flat: boolean) {
  if (flat) {
    return depth === 0
      ? { y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 }
      : { y: 0, scale: 1, rotate: 0, opacity: 0, zIndex: 0 };
  }
  if (last) return { y: -240, scale: 1.03, rotate: -3.5, opacity: 0, zIndex: 40 };
  switch (depth) {
    case 0:
      return { y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
    case 1:
      return { y: -16, scale: 0.965, rotate: -1.1, opacity: 0.5, zIndex: 20 };
    case 2:
      return { y: -30, scale: 0.93, rotate: 1.4, opacity: 0.28, zIndex: 10 };
    default:
      return { y: -38, scale: 0.9, rotate: 0, opacity: 0, zIndex: 0 };
  }
}

const TURN = 5000;

export function JournalDeck({
  posts,
  readLabel,
  minutesLabel,
  postLabel,
  locale = "fa",
}: {
  posts: DeckPost[];
  readLabel: string;
  minutesLabel: string;
  /** For the dot buttons' accessible names. */
  postLabel: string;
  locale?: Locale;
}) {
  // The live identity, edited in the panel. Falls back to the shipped
  // constants when there is nothing saved — see lib/appearance.ts.
  const { industryPaint: INDUSTRY_PAINT } = useAppearance();
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  /** The stacked deck is desktop only; a phone gets one cover at a time. */
  const rich = useMediaQuery(DESKTOP);
  const n = posts.length;

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  // `i` is a dependency on purpose: turning it by hand restarts the clock, so a
  // manual flick is not overtaken a moment later.
  useEffect(() => {
    if (n < 2 || held || reduced) return;
    const t = setTimeout(() => setI((p) => (p + 1) % n), TURN);
    return () => clearTimeout(t);
  }, [n, held, i, reduced]);

  if (!n) return null;

  return (
    <div>
      {/* Portrait on a phone, landscape from sm up.
          ------------------------------------------------------------
          16/10 is a shape that only works once the card is wide. At 320px it
          left a 272x170 plate holding a category chip, a reading-time pill, a
          three-line Persian headline and a 46px button — the headline started
          30px above the top of the card and ran straight through the chips.
          A cover is portrait anyway, so below sm it becomes one and the content
          gets the 360px it actually needs. */}
      <div className="relative aspect-[3/4] max-h-[62svh] w-full sm:aspect-[16/10] md:aspect-[16/9]">
        {posts.map((p, k) => {
          const depth = (k - i + n) % n;
          const isFront = depth === 0;
          const thrown = n >= 3 && depth === n - 1;
          const s = seat(depth, thrown, !rich);
          const colour = INDUSTRY_PAINT[p.colourIndex % INDUSTRY_PAINT.length];
          const chipLabel = labelOn(colour);
          const showMedia = isFront || (thrown && rich);
          const dead = failed.includes(p.slug);

          return (
            <motion.div
              key={p.slug}
              // Only the front card is in the reading order; the rest are a
              // picture of a deck, and the grid below lists all of them anyway.
              aria-hidden={!isFront}
              className={`absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_40px_80px_-40px_rgba(0,0,0,0.5)] ${
                isFront && n > 1 ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{ background: colour, zIndex: s.zIndex }}
              // Writes the seat into the first render instead of animating to
              // it — without this the resting state lives only inside the
              // animation, and any load where that never runs leaves all five
              // cards stacked at full opacity on top of one another.
              initial={false}
              animate={{ y: s.y, scale: s.scale, rotate: s.rotate, opacity: s.opacity }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 210, damping: 26, mass: 0.9, opacity: { duration: 0.45 } }
              }
              drag={isFront && n > 1 && !reduced && rich ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.65, bottom: 0.1, left: 0, right: 0 }}
              onDragStart={() => setHeld(true)}
              onDragEnd={(_, info) => {
                setHeld(false);
                if (info.offset.y < -70 || info.velocity.y < -450) go(1);
              }}
            >
              {showMedia && !dead && (
                <Image
                  src={p.cover}
                  alt=""
                  fill
                  priority={k === 0}
                  sizes="100vw"
                  draggable={false}
                  onError={() => setFailed((f) => (f.includes(p.slug) ? f : [...f, p.slug]))}
                  className="object-cover"
                />
              )}

              {showMedia && (
                <>
                  {/* Built for white type over a photograph nobody has vetted —
                      and it does the same job over the flat colour when the
                      photograph is missing. */}
                  <div className="poster-scrim absolute inset-0" aria-hidden />

                  <div className="absolute right-6 top-6 flex items-center gap-2 md:right-8 md:top-8">
                    <span
                      className="rounded-full px-3.5 py-1.5 text-xs font-bold"
                      style={{ background: colour, color: chipLabel }}
                    >
                      {p.category}
                    </span>
                    <span className="glass-onmedia inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="ltr-nums">{localeDigits(locale, p.readingMinutes)}</span> {minutesLabel}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                    <h2 className="max-w-3xl font-display text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl md:text-4xl">
                      {p.title}
                    </h2>
                    <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-white/85 md:block">{p.excerpt}</p>
                    {/* The link is the button rather than the whole card: the
                        card is draggable, and a drag that ends on a link is a
                        click as far as the browser is concerned. */}
                    <Link
                      href={`/journal/${p.slug}`}
                      draggable={false}
                      tabIndex={isFront ? 0 : -1}
                      className="glass-onmedia group mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
                    >
                      {readLabel}
                      <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* The dot is 8px for looks; the button around it is a full 44px target. */}
      <div className="mt-6 flex items-center gap-1">
        {posts.map((p, k) => {
          const active = k === i;
          const colour = INDUSTRY_PAINT[p.colourIndex % INDUSTRY_PAINT.length];
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => setI(k)}
              aria-label={`${postLabel} ${localeDigits(locale, k + 1)}`}
              aria-current={active}
              className="grid h-11 w-11 shrink-0 place-items-center"
            >
              <span
                className="block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-apple)]"
                style={{
                  width: active ? 28 : 6,
                  background: active ? colour : "var(--foreground-faint)",
                  opacity: active ? 1 : 0.35,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
