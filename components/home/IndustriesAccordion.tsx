"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn, labelOn } from "@/lib/utils";
import { INDUSTRY_PAINT_ORDER } from "@/lib/constants";
import { tr } from "@/lib/i18n";
import type { Locale } from "@/types";
import { useAppearance } from "@/components/providers/Appearance";
import { useUi } from "@/components/providers/SiteCopy";

export interface AccordionIndustry {
  id: string;
  slug: string;
  title: string;
  titleEn: string | null;
  titleAr: string | null;
  excerpt: string;
  excerptEn: string | null;
  excerptAr: string | null;
  icon: string;
  cover: string | null;
}

/**
 * Industries on the homepage, as an accordion.
 *
 * Deliberately NOT the same component as the /industries page. That one is a
 * hover-driven list where every row is a link straight out of the page — right
 * for a page whose only job is to route you into an industry. Here the section
 * has to answer "do you work in my field, and what does that mean" without
 * leaving the homepage, so a row opens in place: a short description and one
 * button into the full page.
 *
 * The two are kept separate rather than merged behind a prop because their
 * interaction models genuinely differ — one opens on hover with no persistent
 * state, the other toggles on click and holds it. Sharing them would mean a
 * component that is two components wearing a coat.
 *
 * Backgrounds: the open panel puts `cover` behind the copy at full colour with
 * an ink scrim over it, so a landscape photo can be dropped in per industry
 * from the CMS with nothing here to change. Rows with no cover open onto a
 * plain surface instead, so a half-populated list still looks deliberate.
 */
/**
 * Deterministic pseudo-random, so the ring is irregular but identical on the
 * server and the client. Math.random() here would place the circles twice —
 * once in the SSR html and again on hydration — and React would flag the
 * mismatch.
 */
function rand(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The circles ringing the list.
 *
 * They sit on an ellipse around the card rather than behind it: the card is
 * opaque, so anything behind it is simply invisible — which is exactly what the
 * first version of this did, with the layer clipped to the card's own box and
 * every circle either hidden underneath it or cut off at its edge.
 *
 * Irregular by construction. Angles are stepped unevenly, and the radius, size,
 * blur and opacity of each circle are jittered from a seeded generator, so
 * nothing lines up and no two are the same size. They are split across five
 * groups turning at different speeds and in both directions, which keeps the
 * ring from reading as one rigid wheel.
 *
 * The section clips this layer. The ring is deliberately wider than the content,
 * and unclipped the outermost circles would push the page into horizontal
 * scroll on a narrow window.
 */
function Orbits() {
  const { industryPaint: INDUSTRY_PAINT } = useAppearance();
  const groups = [
    { n: 8, dur: 240, rev: false },
    { n: 7, dur: 310, rev: true },
    { n: 7, dur: 190, rev: false },
    { n: 6, dur: 380, rev: true },
    { n: 6, dur: 280, rev: false },
  ];
  const r = rand(9271);
  let angle = 0;
  return (
    <div className="ind-orbits pointer-events-none absolute -inset-x-[26%] -inset-y-[10%] z-0" aria-hidden>
      {groups.map((g, gi) => (
        <div
          key={gi}
          className="ind-orbit absolute inset-0"
          style={{ animationDuration: `${g.dur}s`, animationDirection: g.rev ? "reverse" : "normal" }}
        >
          {Array.from({ length: g.n }).map((_, i) => {
            // Uneven steps: a fixed step would space them like clock marks.
            angle += 360 / (g.n * groups.length) + r() * 26 - 8;
            const rad = (angle * Math.PI) / 180;
            // Rounded: unrounded these serialise as 17-digit floats and the ring
            // alone adds ~2KB of inline style to every page load.
            const size = Math.round(46 + r() * 210);
            // Ride just outside the CARD's rectangle, not on a plain ellipse.
            // The card is far taller than it is wide, so an ellipse that clears
            // it at the sides sits deep inside it at the top and bottom — which
            // is how half the circles ended up hidden behind it. `t` is the
            // distance from centre to the card edge along this angle, in layer
            // percentages: the insets above put the card's half-width at 32.9%
            // of the layer and its half-height at 41.7%.
            const t = Math.min(
              32.9 / Math.max(Math.abs(Math.cos(rad)), 1e-3),
              41.7 / Math.max(Math.abs(Math.sin(rad)), 1e-3),
            );
            const k = 1.04 + r() * 0.26; // how far beyond the edge this one sits
            const rx = t * k;
            const ry = t * k;
            return (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: size,
                  height: size,
                  left: `calc(50% + ${(Math.cos(rad) * rx).toFixed(1)}% - ${size / 2}px)`,
                  top: `calc(50% + ${(Math.sin(rad) * ry).toFixed(1)}% - ${size / 2}px)`,
                  background: INDUSTRY_PAINT[Math.floor(r() * INDUSTRY_PAINT.length)],
                  opacity: Math.round((0.42 + r() * 0.3) * 100) / 100,
                  filter: `blur(${Math.round(14 + r() * 22)}px)`,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function IndustriesAccordion({
  industries,
  heading,
  description,
  eyebrow,
  locale = "fa",
}: {
  industries: AccordionIndustry[];
  heading: React.ReactNode;
  description?: string;
  eyebrow?: string;
  locale?: Locale;
}) {
  // Interface strings, with anything edited in the panel applied. Resolved
  // once here because `ui(locale)` also appeared inside .map() below, and a
  // hook called a varying number of times per render is a different bug.
  const t = useUi();
  // The live identity, edited in the panel. Falls back to the shipped
  // constants when there is nothing saved — see lib/appearance.ts.
  const { industryPaint: INDUSTRY_PAINT } = useAppearance();
  const reduced = useReducedMotion();
  const baseId = useId();
  // One at a time: two open panels in a list this long turns it back into a
  // wall of text, which is the thing the accordion is here to avoid.
  const [open, setOpen] = useState<string | null>(null);

  if (!industries.length) return null;

  return (
    <section id="industries" className="section relative overflow-hidden">
      <div className="container-x">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          {eyebrow && <span className="eyebrow mx-auto w-fit">{eyebrow}</span>}
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight text-foreground balance sm:text-4xl md:text-5xl">
            {heading}
          </h2>
          {description && (
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
              {description}
            </p>
          )}
        </div>

        <div className="relative">
          <Orbits />

          <div className="relative z-10 overflow-hidden rounded-[1.75rem] border border-card-border bg-surface">
          <div className="divide-y divide-card-border">
            {industries.map((ind, i) => {
              const isOpen = open === ind.id;
              const colour = INDUSTRY_PAINT[INDUSTRY_PAINT_ORDER[i % INDUSTRY_PAINT_ORDER.length]];
              // Computed, never paired by hand — see labelOn() in lib/utils.
              const label = labelOn(colour);
              const onDark = label === "#ffffff";
              const panelId = `${baseId}-${ind.id}`;
              const title = tr(locale, ind.title, ind.titleEn, ind.titleAr);
              const excerpt = tr(locale, ind.excerpt, ind.excerptEn, ind.excerptAr);
              return (
                <div key={ind.id} className="ind-row relative" style={{ background: colour }}>
                  {/* The crystal shell: a diagonal facet, a top sheen and a
                      bevelled rim, so the colour reads as something cast in
                      glass rather than a flat fill. */}
                  <span className="crystal" aria-hidden />
                  <h3 className="relative">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : ind.id)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className={cn(
                        "group relative flex w-full items-center justify-between gap-4 px-6 py-6 text-right md:px-10",
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={cn(
                            "grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                            onDark
                              ? "border-white/35 bg-white/15 text-white"
                              : "border-black/20 bg-black/[0.07] text-[#111]",
                            isOpen && (onDark ? "bg-white/25" : "bg-black/[0.12]"),
                          )}
                        >
                          <Icon name={ind.icon} className="h-5 w-5" />
                        </span>
                        <span className="text-right">
                          <span
                            className="block font-display text-xl font-bold tracking-tight md:text-2xl"
                            style={{ color: label }}
                          >
                            {title}
                          </span>
                          {locale === "fa" && ind.titleEn && (
                            <span
                              className="mt-0.5 block text-[0.7rem] uppercase tracking-[0.14em] lg:text-[0.6rem] lg:tracking-[0.25em]"
                              // 0.85, not lower: this micro-line is 0.6rem, so
                              // it needs 4.5:1, and at 0.72 it sits at 3.65 on
                              // the violet. 0.85 puts the worst of the four at
                              // 4.55. Same floor as the /industries list.
                              style={{ color: label, opacity: 0.85 }}
                            >
                              {ind.titleEn}
                            </span>
                          )}
                        </span>
                      </span>

                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-apple)]",
                          isOpen && "rotate-180",
                        )}
                        style={{ color: label, opacity: isOpen ? 1 : 0.75 }}
                      />
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        key="panel"
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? undefined : { height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          {ind.cover && (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={ind.cover}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                              {/* Ink, not the page background: the copy on top is
                                  white and the photo underneath is whatever the
                                  CMS holds. Near-opaque on the text side, clearing
                                  toward the other so the picture is still seen. */}
                              <div
                                className="absolute inset-0"
                                style={{
                                  background:
                                    "linear-gradient(to left, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.86) 38%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.3) 100%)",
                                }}
                              />
                            </>
                          )}

                          <div className="relative px-6 pb-9 pt-2 md:px-10">
                            <p
                              className={cn(
                                "max-w-2xl text-sm leading-relaxed md:text-base",
                                ind.cover ? "text-white/90" : "text-foreground-muted",
                              )}
                            >
                              {excerpt}
                            </p>
                            <Link
                              href={`/industries/${ind.slug}`}
                              className={cn(
                                "group/cta mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
                                // Over a photo the button reuses .glass-onmedia
                                // (frosted white, ink label) rather than the
                                // ink pill: it is the one treatment on the site
                                // already proven against an unknown image —
                                // 11.7:1 over black, 18.9:1 over white.
                                ind.cover ? "liquid glass-onmedia" : "liquid liquid-raised",
                              )}
                            >
                              <span className="inline-flex items-center gap-2">
                                {t.industryCta}
                                <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover/cta:-translate-x-1 group-hover/cta:-translate-y-1" />
                              </span>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
