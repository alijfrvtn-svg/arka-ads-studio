"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { localeDigits } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

/**
 * Paint splashed onto a white canvas.
 *
 * The shapes start as plain ellipses and are then torn apart by
 * feDisplacementMap driven by fractal noise — which is what makes them read as
 * thrown paint rather than as the circles they actually are. Nothing here is a
 * recognisable geometric form once the filter has run.
 *
 * Placement is the part that matters: the four step columns occupy the middle
 * band of this section, so the paint is kept to the top and bottom edges and to
 * the gutters between columns. `--wf-veil` then lays a white radial haze over
 * the centre, so even a direct hit behind a paragraph cannot pull its contrast
 * down. See the `.wf-canvas` rule in globals.css for the measured floor.
 */
function PaintCanvas() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 780"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Two strengths: `splat` shreds the big masses, `fleck` keeps the
            droplets tighter so they still read as droplets. */}
        <filter id="wf-splat" x="-35%" y="-35%" width="170%" height="170%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.017" numOctaves="4" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="115" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-fleck" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="41" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
      </defs>

      {/* Soft washes underneath — these carry the colour without any edge. */}
      <g filter="url(#wf-soft)" opacity="0.5">
        <ellipse cx="215" cy="105" rx="230" ry="120" fill="#FF6B5B" />
        <ellipse cx="1405" cy="130" rx="215" ry="115" fill="#FFB902" />
        <ellipse cx="1320" cy="690" rx="260" ry="120" fill="#cbe9f9" />
        <ellipse cx="250" cy="700" rx="185" ry="95" fill="#37192c" opacity="0.55" />
      </g>

      {/* Torn masses on top. */}
      <g filter="url(#wf-splat)">
        <ellipse cx="150" cy="70" rx="130" ry="66" fill="#FF6B5B" opacity="0.9" />
        <ellipse cx="1470" cy="92" rx="118" ry="60" fill="#FFB902" opacity="0.92" />
        <ellipse cx="1245" cy="726" rx="150" ry="62" fill="#cbe9f9" />
        <ellipse cx="330" cy="742" rx="104" ry="48" fill="#37192c" opacity="0.85" />
        {/* Gutter hits — between the columns, never behind them. */}
        <ellipse cx="800" cy="34" rx="86" ry="34" fill="#FFB902" opacity="0.6" />
        <ellipse cx="612" cy="762" rx="74" ry="30" fill="#FF6B5B" opacity="0.55" />
      </g>

      {/* Flecks. Real splatter throws satellites; without these the masses look
          placed rather than thrown. */}
      <g filter="url(#wf-fleck)">
        <circle cx="392" cy="146" r="13" fill="#FF6B5B" opacity="0.85" />
        <circle cx="452" cy="82" r="8" fill="#FF6B5B" opacity="0.7" />
        <circle cx="1300" cy="196" r="11" fill="#FFB902" opacity="0.8" />
        <circle cx="1215" cy="118" r="7" fill="#FFB902" opacity="0.65" />
        <circle cx="1092" cy="700" r="12" fill="#cbe9f9" />
        <circle cx="1010" cy="748" r="8" fill="#cbe9f9" />
        <circle cx="470" cy="712" r="9" fill="#37192c" opacity="0.7" />
        <circle cx="176" cy="612" r="7" fill="#37192c" opacity="0.55" />
        <circle cx="905" cy="86" r="6" fill="#FF6B5B" opacity="0.5" />
        <circle cx="700" cy="120" r="5" fill="#FFB902" opacity="0.5" />
      </g>
    </svg>
  );
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
      <div className="wf-canvas absolute inset-0" aria-hidden>
        <PaintCanvas />
      </div>

      <div className="container-wide relative">
        <SectionHeading
          align="center"
          eyebrow={content.workflowEyebrow}
          title={<HighlightedTitle title={content.workflowHeading} highlight={content.workflowHeadingHighlight} />}
          description={content.workflowDescription}
          className="mx-auto mb-16 max-w-2xl"
        />

        <div
          ref={trackRef}
          className="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          onMouseLeave={() => setActive(null)}
        >
          {/* Track + fill. The fill is scaled rather than sized so it animates
              on the compositor; `origin-right` is what makes it travel right to
              left, with the reading direction. */}
          <div className="pointer-events-none absolute inset-x-0 top-9 hidden h-px lg:block">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-card-border to-transparent" />
            <motion.div
              className="absolute inset-0 origin-right bg-gradient-to-l from-transparent via-[var(--accent-bright)] to-transparent"
              style={reduced ? { scaleX: 1 } : { scaleX: fill }}
            />
          </div>

          {content.workflowSteps.map((s, i) => {
            const dimmed = active !== null && active !== i;
            return (
              <motion.div
                key={i}
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
                <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-foreground-muted">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
