"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check } from "lucide-react";
import { localeDigits } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * Service features, laid out on the same wave as the homepage process section.
 *
 * That section's wave is hard-coded for exactly four steps; a service can have
 * any number of features, so the geometry is generated here instead of copied.
 * The rules are the same ones that made the original read as a wave rather than
 * a zigzag:
 *
 *   - amplitude varies per column instead of alternating, so no two neighbours
 *     are mirror images;
 *   - the connector is a stroked path through the same points, not a scaled
 *     rectangle, because a curve cannot be produced by scaling one;
 *   - the row uses `gap-y` only, since a horizontal gap pulls the real column
 *     centres off the clean percentages the viewBox assumes and the line drifts
 *     off the markers.
 */
const AMPLITUDE = [0, 78, 22, 64, 34, 86, 14, 70, 44];

/** Top of a feature cell to the centre of its check mark. */
const MARK_CY = 34;

/** Written out so Tailwind can see them. */
const COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

function wave(n: number) {
  return Array.from({ length: n }, (_, i) => AMPLITUDE[i % AMPLITUDE.length]);
}

/**
 * Right to left, with the reading direction — the first feature is the
 * rightmost column in RTL, so column i sits at the far end of the box.
 */
function wavePath(offsets: number[]) {
  const n = offsets.length;
  const step = 1200 / n;
  const pts = offsets.map((dy, i) => [1200 - step * (i + 0.5), MARK_CY + dy] as const);
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1]}`;
  for (let i = 1; i < n; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = ((x0 + x1) / 2).toFixed(1);
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1.toFixed(1)} ${y1}`;
  }
  return d;
}

export function ServiceWaveFeatures({
  features,
  locale = "fa",
}: {
  features: string[];
  locale?: Locale;
}) {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.9", "center 0.55"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });

  if (!features.length) return null;

  // Beyond four across the cells get too narrow for a Persian line, so long
  // lists wrap — and the wave only applies to the row that shares a line.
  const perRow = features.length >= 4 ? 4 : features.length;
  const offsets = wave(perRow);
  const box = MARK_CY + Math.max(...offsets) + 24;

  return (
    // Static column classes rather than a computed value: Tailwind only emits
    // what it can see in the source, so a template-built class name produces no
    // rule at all.
    <div ref={trackRef} className={`relative grid gap-y-10 sm:grid-cols-2 ${COLS[perRow]}`}>
      {/* The connector, drawn only where the whole row shares one line. */}
      <svg
        aria-hidden
        focusable="false"
        className="pointer-events-none absolute inset-x-0 top-0 hidden w-full lg:block"
        style={{ height: box }}
        viewBox={`0 0 1200 ${box}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <path d={wavePath(offsets)} stroke="var(--card-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={wavePath(offsets)}
          stroke="var(--accent-bright)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={reduced ? { pathLength: 1 } : { pathLength: fill }}
        />
      </svg>

      {features.map((f, i) => (
        <div
          key={i}
          className="wave-slot"
          style={{ "--wf-y": `${offsets[i % perRow]}px` } as React.CSSProperties}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 26 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, delay: (i % perRow) * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="wf-step group relative flex flex-col items-center rounded-[1.5rem] px-5 pb-7 pt-5 text-center"
          >
            <div className="wf-chip relative z-10 mb-6 grid h-14 w-14 place-items-center rounded-[16px]">
              <Check className="h-5 w-5" />
              <span className="wf-badge absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-background">
                {localeDigits(locale, String(i + 1).padStart(2, "0"))}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground">{f}</p>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
