"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { PaintCanvas } from "@/components/home/PaintCanvas";
import { Reveal } from "@/components/fx/Reveal";
import { Eyebrow } from "@/components/ui/Section";
import { localeDigits } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * A short list laid along a wave, on the homepage process section's paint.
 *
 * Written for the service feature lists and now also carrying the industry
 * approach, so it takes items rather than owning any copy: `lead` is the line
 * that gets the weight, `rest` the answer under it when there is one.
 *
 * Three things separate it from the homepage version of the wave:
 *
 *   1. That wave is hard-coded for exactly four steps. A service can have any
 *      number, so the row wraps — and the moment it wraps, a connector drawn
 *      across one row leaves every later row hanging unattached.
 *   2. So the rows snake. Odd rows are placed in reverse, which puts the last
 *      marker of a row directly above the first marker of the next and lets one
 *      unbroken line run through every feature without doubling back across the
 *      full width to start each row again.
 *   3. The line is measured off the rendered page rather than computed from a
 *      viewBox. Row heights depend on how the Persian copy happens to wrap,
 *      which is not knowable in advance, so a percentage-based path drifts off
 *      the markers as soon as one cell takes an extra line.
 */

/** Columns in a full row, from lg up. */
const PER_ROW = 4;

/**
 * How far each column in a row is pushed down, in px.
 *
 * Uneven on purpose — a strict high-low alternation still reads as a repeating
 * zigzag, which is the look the wave replaced.
 */
const AMPLITUDE = [0, 78, 22, 64];

/** Written out so Tailwind can see them — a template-built class name produces
 *  no rule at all. */
const COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

/**
 * Layout offset of `el` inside `root`, walked up the offsetParent chain.
 *
 * offsetTop/offsetLeft are layout values and ignore transforms, which is the
 * whole point here: the reveal writes an inline transform on the cell while it
 * animates, so a rect taken before that lands would put the line 26px low.
 * `root` has to be positioned, or the walk runs straight past it.
 */
function offsetIn(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n && n !== root; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return [x, y] as const;
}

export interface WaveItem {
  /** The line that carries the weight. */
  lead: string;
  /** The answer beneath it, when the item has two halves. */
  rest?: string;
}

export function WaveList({
  items,
  eyebrow,
  heading,
  locale = "fa",
}: {
  items: WaveItem[];
  eyebrow: string;
  heading: string;
  locale?: Locale;
}) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const seats = useRef<(HTMLDivElement | null)[]>([]);
  const marks = useRef<(HTMLDivElement | null)[]>([]);
  const [line, setLine] = useState<{ d: string; w: number; h: number } | null>(null);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.85", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const tr = track.getBoundingClientRect();
    const pts: [number, number][] = [];

    for (let i = 0; i < marks.current.length; i++) {
      const seat = seats.current[i];
      const mark = marks.current[i];
      if (!seat || !mark) continue;
      // The seat's rect, because it carries the wave offset as a transform and
      // a rect includes transforms; the mark's position inside it as a layout
      // offset, because the reveal's transform must not count. Mixing the two
      // is deliberate.
      const sr = seat.getBoundingClientRect();
      const [ox, oy] = offsetIn(mark, seat);
      pts.push([
        sr.left - tr.left + ox + mark.offsetWidth / 2,
        sr.top - tr.top + oy + mark.offsetHeight / 2,
      ]);
    }

    if (pts.length < 2) {
      setLine(null);
      return;
    }

    let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      if (Math.abs(x1 - x0) >= Math.abs(y1 - y0)) {
        // Along a row: horizontal control points give the S-curve.
        const cx = ((x0 + x1) / 2).toFixed(1);
        d += ` C ${cx} ${y0.toFixed(1)}, ${cx} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      } else {
        // Dropping to the next row, where the two markers sit at almost the
        // same x — horizontal control points there would make the line bulge
        // sideways and double back on itself.
        const cy = ((y0 + y1) / 2).toFixed(1);
        d += ` C ${x0.toFixed(1)} ${cy}, ${x1.toFixed(1)} ${cy}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      }
    }
    setLine({ d, w: tr.width, h: tr.height });
  }, []);

  useEffect(() => {
    measure();
    const track = trackRef.current;
    if (!track) return;
    // Covers viewport resize, the breakpoint change that turns the snake on and
    // off, and a cell taking an extra line — all of which move the markers.
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    // Persian copy rewraps once Estedad lands, which shifts every row.
    document.fonts?.ready.then(() => measure()).catch(() => {});
    return () => ro.disconnect();
  }, [measure, items.length]);

  if (!items.length) return null;

  const perRow = Math.min(items.length, PER_ROW);

  return (
    <section className="section relative overflow-hidden">
      {/* The same painting as the homepage process section. Legibility is not
          handled by keeping paint away from the text but by the local clearing
          each text block carries — see `.paint-plate` in globals.css. */}
      <div className="paint-canvas absolute inset-0" aria-hidden>
        <PaintCanvas />
      </div>

      <div className="container-x relative">
        <div className="paint-plate mx-auto mb-20 max-w-2xl text-center">
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-[-0.028em] text-foreground sm:text-4xl md:text-5xl">
              {heading}
            </h2>
          </Reveal>
        </div>

        {/* The row gap has to clear the deepest push (78px) or a low cell in one
            row lands on a high cell in the next: the offset is a transform and
            therefore invisible to layout. lg:gap-y-32 is 128px. */}
        <div
          ref={trackRef}
          className={`relative grid gap-y-14 sm:grid-cols-2 lg:gap-y-32 lg:pb-20 ${COLS[perRow]}`}
        >
          {/* Drawn at 1:1 in px from the measured points, so no aspect-ratio
              trickery and no non-scaling-stroke: one SVG unit is one pixel. */}
          {line && (
            <svg
              aria-hidden
              focusable="false"
              className="pointer-events-none absolute left-0 top-0 hidden lg:block"
              width={line.w}
              height={line.h}
              viewBox={`0 0 ${line.w} ${line.h}`}
              fill="none"
            >
              <path d={line.d} stroke="var(--card-border)" strokeWidth="1" />
              <motion.path
                d={line.d}
                stroke="var(--accent-bright)"
                strokeWidth="1.75"
                strokeLinecap="round"
                style={reduced ? { pathLength: 1 } : { pathLength: fill }}
              />
            </svg>
          )}

          {items.map((it, i) => {
            const row = Math.floor(i / perRow);
            const j = i % perRow;
            return (
              // The wave offset lives on this wrapper rather than on the
              // animated element inside: framer-motion writes `transform`
              // inline while revealing, and an inline transform beats the
              // stylesheet, so the offset would be wiped the moment the reveal
              // landed.
              <div
                key={i}
                ref={(el) => {
                  seats.current[i] = el;
                }}
                className="wave-slot wave-seat relative"
                style={
                  {
                    "--wf-y": `${AMPLITUDE[j % AMPLITUDE.length]}px`,
                    // Column 1 is the rightmost in RTL. Odd rows count from the
                    // far side so the row reads back the other way and the
                    // snake closes.
                    "--wf-col": row % 2 === 0 ? j + 1 : perRow - j,
                    "--wf-row": row + 1,
                  } as React.CSSProperties
                }
              >
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 26 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.6, delay: j * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="wf-step group relative flex flex-col items-center rounded-[1.5rem] px-5 pb-8 pt-5 text-center"
                >
                  <div
                    ref={(el) => {
                      marks.current[i] = el;
                    }}
                    className="wf-chip relative z-10 mb-7 grid h-16 w-16 place-items-center rounded-[18px]"
                  >
                    <Check className="h-6 w-6" />
                    <span className="wf-badge absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-background">
                      {localeDigits(locale, String(i + 1).padStart(2, "0"))}
                    </span>
                  </div>
                  <div className="paint-plate">
                    <p className="text-base font-semibold leading-[1.9] md:text-lg md:leading-[1.85]">{it.lead}</p>
                    {it.rest && (
                      <p className="mt-2 text-sm font-normal leading-[1.9] opacity-80 md:text-base">{it.rest}</p>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
