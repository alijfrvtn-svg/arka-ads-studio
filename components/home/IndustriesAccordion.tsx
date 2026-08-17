"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpLeft, ChevronDown } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn, labelOn } from "@/lib/utils";
import { INDUSTRY_PAINT, INDUSTRY_PAINT_ORDER } from "@/lib/constants";
import { tr, ui } from "@/lib/i18n";
import type { Locale } from "@/types";

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
 * The decorative orbit.
 *
 * Circles in the row colours drifting around the list — unequal sizes, no
 * symmetry, and slow enough (two to four minutes a revolution) that you notice
 * it has moved rather than watching it move.
 *
 * Each circle is offset inside a wrapper that rotates about the block's centre,
 * so rotating the wrapper carries the circle around an orbit. Only `transform`
 * animates, which keeps the whole thing on the compositor.
 *
 * It lives inside an `overflow-hidden` frame: the orbits are wider than the
 * list on purpose, and without the clip the widest of them would push the page
 * into horizontal scroll on a narrow window.
 */
function Orbits() {
  // size, distance from centre, start angle, duration, direction, colour index
  const bodies = [
    { s: 300, x: -44, y: -30, d: 260, rev: false, c: 0 },
    { s: 190, x: 46, y: -38, d: 320, rev: true, c: 1 },
    { s: 420, x: 52, y: 34, d: 300, rev: false, c: 3 },
    { s: 150, x: -50, y: 40, d: 220, rev: true, c: 2 },
    { s: 240, x: -38, y: 46, d: 380, rev: false, c: 1 },
    { s: 120, x: 40, y: -18, d: 200, rev: true, c: 0 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bodies.map((b, i) => (
        <div
          key={i}
          className="ind-orbit absolute inset-0"
          style={{
            animationDuration: `${b.d}s`,
            animationDirection: b.rev ? "reverse" : "normal",
          }}
        >
          <span
            className="absolute rounded-full"
            style={{
              width: b.s,
              height: b.s,
              left: `calc(50% + ${b.x}% - ${b.s / 2}px)`,
              top: `calc(50% + ${b.y}% - ${b.s / 2}px)`,
              background: INDUSTRY_PAINT[b.c],
              opacity: 0.16,
              filter: "blur(46px)",
            }}
          />
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
  const reduced = useReducedMotion();
  const baseId = useId();
  // One at a time: two open panels in a list this long turns it back into a
  // wall of text, which is the thing the accordion is here to avoid.
  const [open, setOpen] = useState<string | null>(null);
  const t = ui(locale);

  if (!industries.length) return null;

  return (
    <section id="industries" className="section">
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

          <div className="relative overflow-hidden rounded-[1.75rem] border border-card-border bg-surface">
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
                  <span className="ind-crystal" aria-hidden />
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
                              className="mt-0.5 block text-[0.6rem] uppercase tracking-[0.25em]"
                              style={{ color: label, opacity: 0.72 }}
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
