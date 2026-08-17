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
 * Paint thrown across the whole canvas.
 *
 * Shapes start as plain ellipses and are torn apart by feDisplacementMap driven
 * by fractal noise, so nothing reads as a geometric form once the filter has
 * run. Three passes: broad soft washes that leave no bare white anywhere, torn
 * masses on top whose overlaps are where the colours meet at full strength, and
 * flecks so it reads as thrown rather than placed.
 *
 * Legibility is NOT handled here by keeping paint away from the text — that was
 * the first attempt and it left a large white void through the middle of the
 * section. Instead the colour runs edge to edge and each text block carries its
 * own local clearing (`.wf-plate` in globals.css), which reads as a lighter
 * passage in the painting rather than as a box. See that rule for the numbers.
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
        <filter id="wf-splat" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="4" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="150" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-splat2" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.008" numOctaves="4" seed="63" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="135" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-fleck" x="-70%" y="-70%" width="240%" height="240%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="41" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="36" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-soft" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="52" />
        </filter>
      </defs>

      {/* Ground: broad washes that reach right across the canvas, so there is
          no bare white left anywhere. */}
      <g filter="url(#wf-soft)" opacity="0.92">
        <ellipse cx="230" cy="120" rx="430" ry="250" fill="#FF6B5B" />
        <ellipse cx="1380" cy="140" rx="420" ry="240" fill="#FFB902" />
        <ellipse cx="1290" cy="660" rx="470" ry="260" fill="#cbe9f9" />
        <ellipse cx="330" cy="690" rx="360" ry="215" fill="#37192c" opacity="0.5" />
        <ellipse cx="800" cy="360" rx="520" ry="300" fill="#cbe9f9" opacity="0.75" />
        <ellipse cx="820" cy="60" rx="330" ry="150" fill="#FFB902" opacity="0.7" />
        <ellipse cx="700" cy="760" rx="330" ry="160" fill="#FF6B5B" opacity="0.62" />
      </g>

      {/* Torn masses. Where two of these overlap the colours meet at full
          strength, which is where the contrast in the painting comes from. */}
      <g filter="url(#wf-splat)" opacity="0.95">
        <ellipse cx="190" cy="95" rx="260" ry="130" fill="#FF6B5B" />
        <ellipse cx="1430" cy="120" rx="245" ry="125" fill="#FFB902" />
        <ellipse cx="1230" cy="700" rx="285" ry="130" fill="#cbe9f9" />
        <ellipse cx="360" cy="720" rx="215" ry="100" fill="#37192c" opacity="0.9" />
      </g>
      <g filter="url(#wf-splat2)" opacity="0.9">
        <ellipse cx="560" cy="150" rx="210" ry="95" fill="#FFB902" />
        <ellipse cx="1090" cy="130" rx="190" ry="88" fill="#FF6B5B" opacity="0.9" />
        <ellipse cx="860" cy="690" rx="230" ry="105" fill="#cbe9f9" />
        <ellipse cx="1520" cy="420" rx="180" ry="150" fill="#FF6B5B" opacity="0.75" />
        <ellipse cx="80" cy="420" rx="175" ry="150" fill="#FFB902" opacity="0.72" />
      </g>

      {/* Flecks — satellites are what make it read as thrown. */}
      <g filter="url(#wf-fleck)">
        <circle cx="392" cy="196" r="15" fill="#37192c" opacity="0.8" />
        <circle cx="452" cy="92" r="9" fill="#FF6B5B" />
        <circle cx="1300" cy="226" r="13" fill="#37192c" opacity="0.75" />
        <circle cx="1215" cy="118" r="8" fill="#FFB902" />
        <circle cx="1092" cy="700" r="13" fill="#37192c" opacity="0.6" />
        <circle cx="1010" cy="748" r="9" fill="#cbe9f9" />
        <circle cx="470" cy="712" r="10" fill="#37192c" opacity="0.7" />
        <circle cx="176" cy="612" r="8" fill="#37192c" opacity="0.6" />
        <circle cx="905" cy="86" r="7" fill="#FF6B5B" />
        <circle cx="700" cy="120" r="6" fill="#37192c" opacity="0.5" />
        <circle cx="1450" cy="560" r="9" fill="#37192c" opacity="0.5" />
        <circle cx="250" cy="470" r="7" fill="#FF6B5B" opacity="0.8" />
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
          className="wf-plate mx-auto mb-16 max-w-2xl"
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
                <div className="wf-plate flex flex-col items-center">
                  <h3 className="font-display text-lg font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 max-w-xs text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
