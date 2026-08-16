"use client";

import { motion } from "framer-motion";
import { ArrowUpLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { cn, localeNumber } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

export const HERO_HEIGHT: Record<string, string> = {
  full: "min-h-[100svh]",
  tall: "min-h-[80svh]",
  medium: "min-h-[62svh]",
};

/**
 * Copy + CTA layer shared by every non-cinematic hero mode (image, looping
 * video, scroll-scrubbed video and the mobile fallback). Only the backdrop
 * differs between those modes, so keeping one copy layer means an admin edit to
 * the headline/CTAs lands identically whichever mode is switched on.
 */
export function HeroCopy({
  badge,
  headline,
  description,
  tags,
  ctaLabel,
  ctaHref,
  reelLabel,
  onWatchReel,
  stats,
  align = "start",
  locale = "fa",
  animate = true,
}: {
  badge?: string;
  headline: string[];
  description?: string;
  tags?: string[];
  ctaLabel: string;
  ctaHref: string;
  reelLabel?: string;
  onWatchReel?: () => void;
  stats?: { label: string; value: number; suffix: string }[];
  align?: string;
  locale?: Locale;
  animate?: boolean;
}) {
  const centered = align === "center";
  // Scroll-driven modes already animate the whole stage; a second entrance
  // animation on top of that reads as jitter, so they opt out.
  const rise = (delay: number) =>
    animate
      ? {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: EASE },
        }
      : {};

  return (
    <div className={cn("relative z-10 w-full", centered && "text-center")}>
      {badge && (
        <motion.div
          {...rise(0)}
          className={cn(
            "liquid-clear mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground-muted",
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-foreground" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
          </span>
          {badge}
        </motion.div>
      )}

      <h1 className="font-display break-words text-[11vw] font-extrabold leading-[1.12] tracking-[-0.03em] sm:text-7xl sm:leading-[1.02] md:text-8xl lg:text-[7.5rem] lg:leading-[0.95]">
        {headline.map((line, i) => (
          <motion.span
            key={`${line}-${i}`}
            {...(animate
              ? {
                  initial: { opacity: 0, y: 40 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE },
                }
              : {})}
            className={cn("block", i === headline.length - 1 ? "text-gradient" : "text-foreground")}
          >
            {line}
          </motion.span>
        ))}
      </h1>

      {description && (
        <motion.p
          {...rise(0.55)}
          className={cn(
            "mt-8 max-w-xl text-lg leading-relaxed text-foreground-muted",
            centered && "mx-auto",
          )}
        >
          {description}
        </motion.p>
      )}

      {!!tags?.length && (
        <motion.ul
          {...rise(0.62)}
          className={cn("mt-6 flex flex-wrap gap-2", centered && "justify-center")}
        >
          {tags.map((t) => (
            <li
              key={t}
              className="liquid-clear rounded-full px-3.5 py-1.5 text-xs text-foreground-muted"
            >
              {t}
            </li>
          ))}
        </motion.ul>
      )}

      <motion.div
        {...rise(0.7)}
        className={cn("mt-10 flex flex-wrap items-center gap-4", centered && "justify-center")}
      >
        <Magnetic strength={0.4}>
          <Button href={ctaHref} size="lg" variant="glow" data-track="hero-cta">
            {ctaLabel}
            <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
          </Button>
        </Magnetic>
        {onWatchReel && reelLabel && (
          <button onClick={onWatchReel} className="group inline-flex items-center gap-3 text-foreground">
            <span className="liquid liquid-clear relative grid h-14 w-14 place-items-center rounded-full">
              <span className="absolute inset-0 animate-ping-slow rounded-full border border-foreground/25" />
              <Play className="h-5 w-5 translate-x-0.5 fill-current text-foreground" />
            </span>
            <span className="text-sm font-medium">{reelLabel}</span>
          </button>
        )}
      </motion.div>

      {!!stats?.length && (
        <motion.div
          {...(animate ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 1, delay: 1 } } : {})}
          className={cn(
            "mt-16 grid max-w-2xl grid-cols-2 gap-6 border-t border-card-border pt-8 sm:grid-cols-4",
            centered && "mx-auto",
          )}
        >
          {stats.slice(0, 4).map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {localeNumber(locale, s.value)}
                {s.suffix}
              </div>
              <div className="mt-1 text-xs text-foreground-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/** Bottom-centred "keep scrolling" cue, shared by the static hero modes. */
export function ScrollCue({ locale = "fa" }: { locale?: Locale }) {
  return (
    <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
      <span className="text-[10px] uppercase tracking-[0.3em] text-foreground-faint">{ui(locale).scrollHint}</span>
      <span className="h-10 w-px overflow-hidden bg-card-border">
        <span className="block h-full w-full animate-scroll-line bg-foreground" />
      </span>
    </div>
  );
}

/**
 * Scrim over hero media. Text on top of arbitrary admin-uploaded imagery has no
 * guaranteed contrast, so this is not decorative — `strength` is the admin's
 * dial for it and the gradient always bottoms out at the page background so the
 * hero blends into the next section.
 */
export function HeroScrim({ strength = 55 }: { strength?: number }) {
  const a = Math.max(0, Math.min(90, strength)) / 100;
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(to bottom, color-mix(in srgb, var(--background) ${(a * 100).toFixed(0)}%, transparent), color-mix(in srgb, var(--background) ${(a * 72).toFixed(0)}%, transparent) 55%, var(--background))`,
      }}
    />
  );
}
