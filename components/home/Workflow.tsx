"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { PaintCanvas } from "./PaintCanvas";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { localeDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

/**
 * The wave.
 *
 * `WAVE[i]` is how far step i is pushed down, in px, and the same numbers place
 * the curve's control points — one source for both, so the line cannot drift
 * off the icons.
 *
 * Deliberately uneven. A strict high-low-high-low alternation still reads as a
 * repeating pattern, which is the "symmetrical" look this replaces; varying the
 * amplitude makes it a wave instead of a zigzag.
 *
 * Only applied from `lg`, where the four steps sit in one row. Stacked one or
 * two per row below that, an offset would just look like broken spacing.
 */
const WAVE = [0, 88, 24, 76];
/** Distance from the top of a step box to the centre of its icon chip.
 *  Measured against the rendered page, not derived from the padding — the step
 *  has its own top padding and the chip its own margin, and a value guessed
 *  from the classes sat the curve 28px high. */
const CHIP_CY = 84;
/** SVG box height; the viewBox matches it 1:1 so y units are px. */
const WAVE_BOX = CHIP_CY + Math.max(...WAVE) + 24;

/**
 * The connector, drawn right to left — the reading direction, and the direction
 * the progress fills.
 *
 * In RTL the first step is the RIGHTMOST column, so step i sits at
 * x = 1050 - i*300 in a 1200-wide box (four columns, centres at 12.5%…87.5%).
 * The path therefore starts at the right and the dash offset fills from there.
 *
 * Those centres are exact only if the columns are contiguous. A horizontal grid
 * gap pulls them inward — `gap-8` put the outer two 12px off the curve — so the
 * row sets `gap-y-*` only and each step carries its own `px-5` for breathing
 * room instead. Measured on the rendered page, all four now sit within 1px.
 */
function wavePath() {
  const pts = WAVE.map((dy, i) => [1050 - i * 300, CHIP_CY + dy] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;      // horizontal control points -> smooth S-curves
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

export function Workflow({ content, locale = "fa" }: { content: HomeContent; locale?: Locale }) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  // The connector fills as the row crosses the viewport: empty when the row is
  // still low on screen, full once it has settled into the middle. Spring, not
  // the raw value, or the line twitches with every scroll tick.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.9", "center 0.55"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  return (
    <Section id="process" className="relative overflow-hidden">
      {/* Paint first, then a white veil, then the content — see globals.css. */}
      <div className="paint-canvas absolute inset-0" aria-hidden>
        <PaintCanvas />
      </div>

      <div className="container-wide relative">
        <SectionHeading
          align="center"
          eyebrow={content.workflowEyebrow}
          title={<HighlightedTitle title={content.workflowHeading} highlight={content.workflowHeadingHighlight} />}
          description={content.workflowDescription}
          className="paint-plate mx-auto mb-16 max-w-2xl"
        />

        <div
          ref={trackRef}
          className="relative grid gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:pb-[88px]"
          onMouseLeave={() => setActive(null)}
        >
          {/* The connector. A stroked path rather than a scaled div, because a
              curve cannot be produced by scaling a rectangle — and `pathLength`
              lets the fill run along the curve itself instead of across a box.
              `preserveAspectRatio="none"` stretches it to whatever width the
              grid is; `vector-effect` keeps the stroke 1px through that. */}
          <svg
            aria-hidden
            focusable="false"
            className="pointer-events-none absolute inset-x-0 top-0 hidden w-full lg:block"
            style={{ height: WAVE_BOX }}
            viewBox={`0 0 1200 ${WAVE_BOX}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d={wavePath()}
              stroke="var(--card-border)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d={wavePath()}
              stroke="var(--accent-bright)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={reduced ? { pathLength: 1 } : { pathLength: fill }}
            />
          </svg>

          {content.workflowSteps.map((s, i) => {
            const dimmed = active !== null && active !== i;
            return (
              // The offset lives on this wrapper, not on the animated element.
              // framer-motion writes `transform` inline while revealing, and an
              // inline transform beats the stylesheet — so putting the wave on
              // the same node would have it wiped the moment the reveal landed.
              <div
                key={i}
                className="wave-slot"
                style={{ "--wf-y": `${WAVE[i] ?? 0}px` } as React.CSSProperties}
              >
              <motion.div
                // Explicit per-index delay rather than parent variants — the
                // same reason as the hero deck: nothing to inherit, nothing to
                // get stuck in.
                initial={reduced ? false : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setActive(i)}
                // The active colour is applied from CSS off this attribute
                // rather than by swapping a Tailwind class. `text-[var(--…)]`
                // produced no rule at all here — the class landed on the
                // element and computed to the inherited ink — so the one place
                // the accent appears is written where the rest of this
                // section's styling lives.
                data-active={active === i}
                className={cn(
                  "wf-step group relative flex flex-col items-center rounded-[1.5rem] px-5 pb-7 pt-5 text-center",
                  dimmed && "wf-dim",
                )}
              >
                <div className="wf-chip relative z-10 mb-7 grid h-18 w-18 place-items-center rounded-[18px] p-5">
                  <Icon name={s.icon} className="h-7 w-7" />
                  <span className="wf-badge absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-background">
                    {localeDigits(locale, String(i + 1).padStart(2, "0"))}
                  </span>
                </div>
                <div className="paint-plate flex flex-col items-center">
                  <h3 className="font-display text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
