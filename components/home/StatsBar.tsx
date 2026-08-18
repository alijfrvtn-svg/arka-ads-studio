"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { Counter } from "@/components/fx/Counter";
import { PaintCanvas } from "./PaintCanvas";
import type { Locale } from "@/types";

/**
 * How far each figure is pushed down, by VISUAL position left to right.
 *
 * Uneven on purpose, same reasoning as the process section: a strict
 * alternation still reads as a repeating pattern rather than a wave. These
 * numbers also place the curve's control points, so one array keeps the line on
 * the figures.
 */
const WAVE = [0, 76, 24, 88, 36];
/** Top of a stat block to the centre of its number.
 *  Measured against the rendered page: at 44 the curve ran a uniform 14px below
 *  every figure, which is what a derived value gets you when the block has its
 *  own line-height and the number its own optical centre. */
const NUM_CY = 30;
const WAVE_BOX = NUM_CY + Math.max(...WAVE) + 28;

/**
 * The connector, drawn LEFT TO RIGHT.
 *
 * Opposite to the process section, which runs with the reading direction. Here
 * it was asked for explicitly, and it is the one thing to flip if that reads
 * backwards: reverse the point order and the fill reverses with it.
 *
 * Five columns in a 1200-wide box put the centres at 10%…90%, i.e. x = 120 +
 * i*240 by visual position.
 */
function wavePath() {
  const pts = WAVE.map((dy, i) => [120 + i * 240, NUM_CY + dy] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

/**
 * The numbers, on the same painted canvas as the process section above.
 *
 * The line is drawn by the counting, not by scrolling: it starts on the same
 * trigger as <Counter/> and runs for the same 1900ms on the same ease-out
 * cubic, so it arrives at the last figure exactly as the figures settle. A
 * scroll-driven fill here would have fought the counters — two clocks for one
 * event.
 */
export function StatsBar({ stats, locale = "fa" }: { stats: { label: string; value: number; suffix: string }[]; locale?: Locale }) {
  const reduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement>(null);
  // Same trigger and margin the counters use, so they cannot start apart.
  const inView = useInView(rowRef, { once: true, margin: "-60px" });
  const draw = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      draw.set(1);
      return;
    }
    // 1.9s / easeOutCubic — matched to Counter, not guessed.
    const controls = animate(draw, 1, { duration: 1.9, ease: [0.33, 1, 0.68, 1] });
    return () => controls.stop();
  }, [inView, reduced, draw]);

  return (
    <section className="section relative overflow-hidden">
      <div className="paint-canvas absolute inset-0" aria-hidden>
        <PaintCanvas />
      </div>

      <div className="container-wide relative">
        <div ref={rowRef} className="relative grid grid-cols-2 gap-y-16 md:grid-cols-3 lg:grid-cols-5 lg:pb-[88px]">
          <svg
            aria-hidden
            focusable="false"
            className="pointer-events-none absolute inset-x-0 top-0 hidden w-full lg:block"
            style={{ height: WAVE_BOX }}
            viewBox={`0 0 1200 ${WAVE_BOX}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <path d={wavePath()} stroke="var(--card-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={wavePath()}
              stroke="var(--accent-bright)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: draw }}
            />
          </svg>

          {stats.map((s, i) => (
            // RTL renders the first stat rightmost, but WAVE is indexed by
            // visual position — so the offset is read from the far end.
            <div
              key={s.label}
              className="wave-slot text-center"
              style={{ "--wf-y": `${WAVE[stats.length - 1 - i] ?? 0}px` } as React.CSSProperties}
            >
              <div className="paint-plate inline-flex flex-col items-center">
                <div className="font-display text-5xl font-extrabold tracking-[-0.03em] text-foreground md:text-6xl">
                  <Counter value={s.value} suffix={s.suffix} locale={locale} />
                </div>
                <div className="mt-3.5 text-sm text-foreground-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
