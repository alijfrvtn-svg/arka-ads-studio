"use client";

import { useEffect, useRef, useState } from "react";
import { HeroCopy, HeroScrim, HERO_HEIGHT } from "./HeroStage";
import { SmartVideo, isEmbeddedVideo } from "@/components/media/SmartVideo";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Hero mode `videoScroll` — the clip is scrubbed by scroll position instead of
 * playing on its own, so the visitor "drives" the footage.
 *
 * Scrubbing is desktop-only and skipped under prefers-reduced-motion: on touch
 * scroll is inertial (seeks arrive in bursts and stutter) and tying motion to
 * scroll is exactly what reduced-motion asks us not to do. In both of those
 * cases the same clip simply loops, so the section still reads as intended.
 */
export function HeroScrollVideo({
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
  const scaffoldRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mq = window.matchMedia(DESKTOP_QUERY);
    let detach: (() => void) | null = null;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const el = scaffoldRef.current;
        const v = videoRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          const total = rect.height - window.innerHeight;
          const p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
          setProgress(p);
          // Only seek once metadata has landed — duration is NaN before that
          // and assigning NaN to currentTime throws.
          if (v && Number.isFinite(v.duration) && v.duration > 0) {
            v.currentTime = v.duration * p;
          }
        }
        ticking.current = false;
      });
    };

    const sync = () => {
      const on = mq.matches && motionOk;
      setScrubbing(on);
      if (on) {
        if (detach) return;
        const v = videoRef.current;
        v?.pause();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        detach = () => {
          window.removeEventListener("scroll", onScroll);
          window.removeEventListener("resize", onScroll);
        };
      } else {
        detach?.();
        detach = null;
        setProgress(0);
        videoRef.current?.play().catch(() => {});
      }
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      detach?.();
    };
  }, []);

  const embedded = isEmbeddedVideo(content.heroMedia);
  const runway = Math.max(160, Math.min(1200, content.heroScrollLength));
  const centered = content.heroAlign === "center";

  return (
    <div ref={scaffoldRef} style={{ position: "relative", height: `${runway}vh` }}>
      <section
        className={cn(
          "sticky top-0 flex h-[100svh] items-center overflow-hidden",
          HERO_HEIGHT[content.heroHeight] ?? HERO_HEIGHT.full,
        )}
      >
        {!content.heroMedia ? (
          <div className="absolute inset-0 reel-bg opacity-60" />
        ) : embedded ? (
          // An Aparat/YouTube clip plays inside a third-party iframe we cannot
          // seek, so scroll-scrubbing is impossible for it. Rather than show a
          // dead frame, fall back to the same clip looping — the admin still
          // gets a working hero, just without the scrub. Use a direct file
          // (uploaded to the Media Library) to get real scrubbing.
          <SmartVideo
            src={content.heroMedia}
            poster={content.heroPoster}
            background
            autoPlay
            loop
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            muted
            playsInline
            loop={!scrubbing}
            autoPlay={!scrubbing}
            // Scrubbing needs the whole file buffered or seeking stalls;
            // looping playback only needs enough to start.
            preload={scrubbing ? "auto" : "metadata"}
            poster={content.heroPoster || undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={content.heroMedia} />
          </video>
        )}

        <HeroScrim strength={content.heroOverlay} />

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
            animate={!scrubbing}
          />
        </div>

        {scrubbing && !embedded && (
          <>
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-foreground-faint">
              {ui(locale).scrollHint}
            </div>
            <div
              className="absolute bottom-0 left-0 z-20 h-0.5 bg-primary"
              style={{ width: `${(progress * 100).toFixed(2)}%` }}
              aria-hidden
            />
          </>
        )}
      </section>
    </div>
  );
}
