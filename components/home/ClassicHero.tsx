"use client";

import { HeroCopy, HeroScrim, ScrollCue } from "./HeroStage";
import { SmartVideo, isEmbeddedVideo } from "@/components/media/SmartVideo";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

/** Mobile/tablet fallback hero (below the `lg` breakpoint) for the `cinematic`
 * mode — the scroll-driven EyeOfCreation animation is desktop-only, so this
 * static version (media background + copy + CTAs + stats) is what phones and
 * tablets see instead. The backdrop is whatever the admin set as hero media;
 * with none set it falls back to the brand gradient rather than pulling a
 * third-party sample clip. */
export function ClassicHero({
  stats,
  content,
  onWatchReel,
  locale = "fa",
}: {
  stats: { label: string; value: number; suffix: string }[];
  content: HomeContent;
  onWatchReel?: () => void;
  locale?: Locale;
}) {
  const isVideo =
    !!content.heroMedia &&
    (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(content.heroMedia) || isEmbeddedVideo(content.heroMedia));

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {content.heroMedia ? (
        isVideo ? (
          <SmartVideo
            src={content.heroMedia}
            poster={content.heroPoster}
            background
            autoPlay
            loop
            className="absolute inset-0 h-full w-full object-cover opacity-[0.28]"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={content.heroMedia}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.28]"
          />
        )
      ) : (
        <div className="absolute inset-0 reel-bg opacity-40" />
      )}

      <HeroScrim strength={content.heroOverlay} />
      <div className="aurora animate-aurora-1 -left-40 top-10 h-[32rem] w-[32rem] bg-primary/25" />
      <div className="aurora animate-aurora-2 -right-32 bottom-0 h-[28rem] w-[28rem] bg-accent/20" />

      <div className="container-x relative z-10 pt-28">
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
          align="start"
          locale={locale}
        />
      </div>

      <ScrollCue locale={locale} />
    </section>
  );
}
