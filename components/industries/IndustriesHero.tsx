"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { INDUSTRY_PAINT, INDUSTRY_PAINT_ORDER } from "@/lib/constants";
import { localeNumber } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * The industries hero.
 *
 * It used to be the shared PageHero — a title on white paper, with a wall of
 * twelve coloured rows starting immediately underneath and nothing connecting
 * the two.
 *
 * Now the hero is made of the same thing the page is made of. The bars carry
 * the four colours in INDUSTRY_PAINT_ORDER, which is the exact sequence the
 * rows below use, so the last bar and the first row are the same colour and
 * the hero reads as the top of the wall rather than a lid on it.
 *
 * The arrangement is the page's own arrangement, one level up: type on the
 * reading side, a coloured object on the other — which is where the stage sits
 * once the list begins.
 *
 * No image and no video. The covers on this page are 0.7-2.6MB each and there
 * is no real footage yet, so the one thing the hero can be built from that
 * costs nothing to send is the colour it already owns.
 */

/**
 * Bar heights, as a percentage of the rack.
 *
 * Written out rather than generated: random heights re-roll on every render and
 * a regular progression reads as a chart of something. This is a fixed, uneven
 * skyline — no two neighbours within 10 of each other, so nothing lines up.
 */
const HEIGHTS = [38, 66, 47, 82, 55, 94, 43, 72, 60, 100, 50, 78];

const COPY: Record<Locale, { countLabel: string }> = {
  fa: { countLabel: "صنعت، هرکدام با زبان و مخاطب خودش" },
  en: { countLabel: "industries, each with its own language and audience" },
  ar: { countLabel: "صناعة، لكل منها لغتها وجمهورها" },
};

export function IndustriesHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  count,
  locale = "fa",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  breadcrumb: { label: string; href?: string }[];
  /** The real number of published industries, not a written-in one. */
  count: number;
  locale?: Locale;
}) {
  const reduced = useReducedMotion();
  const c = COPY[locale] ?? COPY.fa;

  return (
    <section className="relative overflow-hidden pb-20 pt-40 md:pt-52">
      <Container className="relative">
        <div className="grid items-end gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] lg:gap-16">
          {/* First in source, so in RTL it takes the reading side — the same
              side the list takes below. */}
          <div>
            <Reveal>
              <nav className="-mx-2 mb-5 flex flex-wrap items-center text-xs text-foreground-faint">
                {breadcrumb.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {b.href ? (
                      <Link href={b.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-foreground">
                        {b.label}
                      </Link>
                    ) : (
                      <span className="inline-flex min-h-11 items-center px-2 text-foreground-muted">{b.label}</span>
                    )}
                    {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
                  </span>
                ))}
              </nav>
            </Reveal>

            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground balance sm:text-5xl md:text-6xl lg:text-7xl">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground-muted">{description}</p>
            </Reveal>

            {/* The count. The page's one concrete claim, and it is read from the
                list rather than written in, so it cannot drift. */}
            <Reveal delay={0.15}>
              <div className="mt-10 flex items-baseline gap-4">
                <span className="font-display text-6xl font-extrabold leading-none tracking-[-0.04em] text-foreground ltr-nums md:text-7xl">
                  {localeNumber(locale, count)}
                </span>
                <span className="max-w-[16rem] text-sm leading-relaxed text-foreground-muted">{c.countLabel}</span>
              </div>
            </Reveal>
          </div>

          {/* The rack. Decorative — the list below is the navigation, and every
              name in it is there. */}
          <div className="flex h-[220px] items-end gap-1.5 md:h-[300px] md:gap-2" aria-hidden>
            {Array.from({ length: count }).map((_, i) => (
              <motion.span
                key={i}
                className="ind-row relative min-w-0 flex-1 origin-bottom rounded-t-[10px]"
                style={{
                  background: INDUSTRY_PAINT[INDUSTRY_PAINT_ORDER[i % INDUSTRY_PAINT_ORDER.length]],
                  height: `${HEIGHTS[i % HEIGHTS.length]}%`,
                }}
                // Grows from half height, not from nothing. framer-motion
                // writes the initial transform inline the moment it mounts and
                // only an animation clears it, so `scaleY: 0` means a rack that
                // is invisible on any load where the animation never runs — a
                // backgrounded tab, a stalled frame clock. From 0.5 the worst
                // case is a shorter rack with its skyline intact.
                initial={reduced ? false : { scaleY: 0.5 }}
                animate={{ scaleY: 1 }}
                transition={{
                  duration: 0.85,
                  delay: 0.15 + i * 0.045,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* The same cast-glass shell the rows carry, so the bars are
                    made of the same material and not just the same hues. */}
                <span className="crystal" />
              </motion.span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
