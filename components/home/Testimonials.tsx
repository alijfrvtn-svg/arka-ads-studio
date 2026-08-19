"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { ui } from "@/lib/i18n";
import { localeDigits, labelOn } from "@/lib/utils";
import { SITE_PAINT } from "@/lib/constants";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const REVIEW_WORD: Record<Locale, string> = { fa: "نظر", en: "Review", ar: "رأي" };

interface T {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  quote: string;
  rating: number;
}

/**
 * A deck you flick through with your thumb.
 *
 * Every testimonial is a real card, all of them stacked in one box and placed
 * by how far they are from the front — depth 0 is the card in your hand, 1 and
 * 2 are the ones peeking out behind it, and everything deeper is parked flat
 * at the back with nothing showing.
 *
 * Advancing does not swap a card out, it renumbers the whole deck: the front
 * card becomes the last one, which is a position defined as "thrown upward and
 * gone", so it flies off the top while the card underneath rises into its
 * place. One card behind it moves up a step, and the one that was invisible at
 * the back fades in as the new third. Nothing mounts or unmounts, so there are
 * no exit animations to finish and nothing can pile up mid-flight.
 *
 * The gap between "thrown away" and "parked at the back" is crossed while the
 * card is at zero opacity, so the long trip back down the deck is never seen.
 *
 * The front card is draggable, which is the same gesture done by hand: pull it
 * up past a threshold, or flick it fast, and the deck advances. Let go short of
 * that and it drops back.
 */

/** Where a card sits, by how far it is from the front. */
function seat(depth: number, last: boolean) {
  // The card that has just been thrown. Above the front card's z so it passes
  // over the deck rather than under it.
  if (last) return { y: -300, scale: 1.02, rotate: -6, opacity: 0, zIndex: 40 };
  switch (depth) {
    case 0:
      return { y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
    case 1:
      return { y: -20, scale: 0.955, rotate: -1.6, opacity: 0.55, zIndex: 20 };
    case 2:
      return { y: -36, scale: 0.91, rotate: 1.9, opacity: 0.32, zIndex: 10 };
    default:
      // Parked. Held at the third card's shape so the fade in and out of the
      // deck is an opacity change and not a jump.
      return { y: -44, scale: 0.88, rotate: 0, opacity: 0, zIndex: 0 };
  }
}

export function Testimonials({ items, content, locale = "fa" }: { items: T[]; content: HomeContent; locale?: Locale }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [held, setHeld] = useState(false);
  const n = items.length;
  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || held) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n, held]);

  if (!n) return null;

  // The deck is a stack of absolutely positioned cards and would collapse to
  // nothing on its own, so one invisible copy holds the height open. It uses
  // the longest quote in the set rather than the current one, or the section
  // would grow and shrink under the reader as the deck turns.
  const longest = items.reduce((a, b) => (b.quote.length > a.quote.length ? b : a), items[0]);

  return (
    <Section id="testimonials">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={content.testimonialsEyebrow}
          title={<HighlightedTitle title={content.testimonialsHeading} highlight={content.testimonialsHeadingHighlight} />}
          className="mx-auto mb-16 max-w-2xl"
        />

        <div className="relative mx-auto max-w-3xl">
          <div className="relative" style={{ perspective: 1400 }}>
            {/* the sizer */}
            <div className="pointer-events-none invisible px-7 py-12 md:px-14 md:py-14" aria-hidden>
              <div className="mb-9 h-10" />
              <p className="font-display text-2xl font-medium leading-relaxed tracking-tight md:text-[1.7rem]">
                «{longest.quote}»
              </p>
              <div className="mt-10 h-14" />
            </div>

            {items.map((t, k) => {
              const depth = (k - i + n) % n;
              // Only the front card and the one just thrown carry their text:
              // the thrown card has to be readable while it flies, and the
              // others are plain colour by design.
              const isFront = depth === 0;
              const thrown = n >= 3 && depth === n - 1;
              const s = seat(depth, thrown);
              // Each testimonial keeps its own colour wherever it sits in the
              // deck, so the cards behind are the real next ones rather than a
              // decorative guess at them.
              const colour = SITE_PAINT[k % SITE_PAINT.length];
              const label = labelOn(colour);

              return (
                <motion.div
                  key={t.id}
                  // aria-hidden on everything but the front card: the deck is
                  // one testimonial at a time, and announcing all of them would
                  // turn a carousel into a wall.
                  aria-hidden={!isFront}
                  className={`absolute inset-0 isolate overflow-hidden rounded-[1.75rem] px-7 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_30px_70px_-32px_rgba(0,0,0,0.45)] md:px-14 md:py-14 ${
                    isFront && n > 1 ? "cursor-grab active:cursor-grabbing" : ""
                  }`}
                  style={{ background: colour, color: label, zIndex: s.zIndex }}
                  // `initial={false}` writes the seat straight into the first
                  // render instead of animating to it. Without it the resting
                  // state lives only inside the animation, so any load where
                  // that never runs leaves all ten cards stacked at full
                  // opacity with no transform — every one of them on top of
                  // the others. Measured exactly that before adding it.
                  initial={false}
                  animate={{ y: s.y, scale: s.scale, rotate: s.rotate, opacity: s.opacity }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 210, damping: 26, mass: 0.9, opacity: { duration: 0.45 } }
                  }
                  drag={isFront && n > 1 ? "y" : false}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.65, bottom: 0.1, left: 0, right: 0 }}
                  onDragStart={() => setHeld(true)}
                  onDragEnd={(_, info) => {
                    setHeld(false);
                    // Either far enough or fast enough — a flick should not
                    // have to travel the whole distance.
                    if (info.offset.y < -70 || info.velocity.y < -450) go(1);
                  }}
                >
                  <span className="crystal" aria-hidden />
                  {(isFront || thrown) && (
                    <>
                      <Quote className="relative mx-auto mb-9 h-10 w-10 opacity-25" />
                      <blockquote className="relative text-center">
                        <p className="font-display text-2xl font-medium leading-relaxed tracking-tight md:text-[1.7rem]">
                          «{t.quote}»
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-4">
                          {t.avatar && (
                            <Image
                              src={t.avatar}
                              alt={t.author}
                              width={56}
                              height={56}
                              // Not draggable itself, or the browser's own image
                              // drag steals the gesture from the card.
                              draggable={false}
                              className="h-14 w-14 rounded-full border-2 border-current object-cover opacity-95"
                            />
                          )}
                          <div className="text-right">
                            <div className="font-bold">{t.author}</div>
                            <div className="text-sm opacity-75">
                              {t.role}
                              {t.company ? ` · ${t.company}` : ""}
                            </div>
                            <div className="mt-1.5 flex gap-0.5">
                              {Array.from({ length: t.rating }).map((_, m) => (
                                <Star key={m} className="h-3.5 w-3.5 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </blockquote>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => go(-1)}
              aria-label={ui(locale).testimonialPrev}
              className="liquid liquid-clear grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* The dot stays 8px for looks, but the button around it is a full
                44px target — an 8px tap target is unusable on a phone. */}
            <div className="flex max-w-[55vw] overflow-x-auto sm:max-w-none">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`${REVIEW_WORD[locale]} ${localeDigits(locale, k + 1)}`}
                  aria-current={k === i}
                  className="grid h-11 w-8 place-items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-apple)] ${k === i ? "w-7 bg-foreground" : "w-1.5 bg-foreground/20"}`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label={ui(locale).testimonialNext}
              className="liquid liquid-clear grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
