"use client";

import { HeroCopy, HeroScrim, ScrollCue, HERO_HEIGHT } from "./HeroStage";
import { SmartVideo } from "@/components/media/SmartVideo";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

/**
 * Hero modes `image` (still frame) and `videoLoop` (silently looping clip).
 * Both are the same stage with a different backdrop element, so they share one
 * component — picking between them in the admin only changes which tag renders.
 */
export function HeroMedia({
  variant,
  stats,
  content,
  onWatchReel,
  locale = "fa",
}: {
  variant: "image" | "videoLoop";
  stats: { label: string; value: number; suffix: string }[];
  content: HomeContent;
  onWatchReel?: () => void;
  locale?: Locale;
}) {
  const centered = content.heroAlign === "center";

  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden",
        HERO_HEIGHT[content.heroHeight] ?? HERO_HEIGHT.full,
      )}
    >
      {content.heroMedia ? (
        variant === "videoLoop" ? (
          // SmartVideo, not <video>: heroMedia may be an Aparat/YouTube page
          // link, which a native <video> renders as an empty black box.
          <SmartVideo
            src={content.heroMedia}
            poster={content.heroPoster}
            background
            autoPlay
            loop
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          // Hero art is the LCP element: eager + high priority, and never lazy.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.heroMedia}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      ) : (
        // No media chosen yet — fall back to the graphite sweep rather than a
        // blank box, so a half-configured hero still looks intentional.
        <div className="absolute inset-0 reel-bg opacity-70" />
      )}

      <HeroScrim strength={content.heroOverlay} />
      <div className="aurora animate-aurora-1 -left-40 top-10 h-[32rem] w-[32rem] bg-foreground/[0.07]" />
      <div className="aurora animate-aurora-2 -right-32 bottom-0 h-[28rem] w-[28rem] bg-foreground/[0.05]" />

      <div className={cn("container-x relative z-10 pt-28", centered && "flex justify-center")}>
        <HeroCopy
          badge={content.heroBadge}
          headline={content.heroHeadline}
          description={content.heroDescription}
          tags={content.heroTags}
          ctaLabel={content.heroCtaLabel}
          ctaHref={content.heroCtaHref}
          reelLabel={content.heroReelLabel}
          onWatchReel={onWatchReel}
          stats={content.heroShowStats ? stats : undefined}
          align={content.heroAlign}
          locale={locale}
        />
      </div>

      <ScrollCue locale={locale} />
    </section>
  );
}
