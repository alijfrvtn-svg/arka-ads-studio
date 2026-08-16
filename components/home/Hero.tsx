"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ClassicHero } from "./ClassicHero";
import { HeroMedia } from "./HeroMedia";
import { HeroScrollVideo } from "./HeroScrollVideo";
import { HeroSlider } from "./HeroSlider";
import { getEmbedUrl } from "@/lib/embed";
import { EmbedFrame } from "@/components/media/EmbedFrame";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The cinematic hero is by far the heaviest thing on the homepage — ~600 lines
 * of scroll maths plus three extra Google font families of its own — and it is
 * desktop-only even when selected. Loading it on demand keeps all of that out
 * of the bundle for the four other hero modes and for every phone visitor.
 */
const EyeOfCreation = dynamic(() => import("./EyeOfCreation").then((m) => m.EyeOfCreation), {
  ssr: false,
  loading: () => <div className="h-[100svh] w-full reel-bg opacity-40" />,
});

/**
 * Hero dispatcher. Which presentation the homepage opens with is an admin
 * choice (/admin/home → «حالت نمایش هیرو»); everything below just routes to the
 * matching component and owns the showreel modal they all share.
 *
 * `cinematic` remains the default and is the only mode that swaps to a separate
 * mobile layout — its scroll animation is desktop-only by design. The media
 * modes are responsive on their own, so they render everywhere.
 */
export function Hero({
  stats,
  content,
  locale = "fa",
}: {
  stats: { label: string; value: number; suffix: string }[];
  content: HomeContent;
  locale?: Locale;
}) {
  const [reel, setReel] = useState(false);
  // The play button is pointless without something to play — an admin who
  // hasn't set a showreel URL gets a hero with no dead control on it.
  const openReel = content.heroReelUrl ? () => setReel(true) : undefined;
  const embedSrc = getEmbedUrl(content.heroReelUrl, { autoplay: true });

  const stage = (() => {
    switch (content.heroMode) {
      case "slider":
        return content.heroSlides.length ? (
          <HeroSlider slides={content.heroSlides} content={content} locale={locale} />
        ) : (
          // Slider selected but no slides authored yet — show the still-image
          // stage rather than an empty section.
          <HeroMedia variant="image" stats={stats} content={content} onWatchReel={openReel} locale={locale} />
        );
      case "image":
        return <HeroMedia variant="image" stats={stats} content={content} onWatchReel={openReel} locale={locale} />;
      case "videoLoop":
        return <HeroMedia variant="videoLoop" stats={stats} content={content} onWatchReel={openReel} locale={locale} />;
      case "videoScroll":
        return <HeroScrollVideo stats={stats} content={content} onWatchReel={openReel} locale={locale} />;
      case "cinematic":
      default:
        return (
          <>
            {/* Desktop: cinematic scroll-driven animation. Mobile/tablet (<lg): the
                static classic hero instead — the animation is disabled entirely
                below `lg`, not just visually hidden (see EyeOfCreation's matchMedia gate). */}
            <div className="hidden lg:block">
              <EyeOfCreation content={content} onWatchReel={openReel} locale={locale} />
            </div>
            <div className="lg:hidden">
              <ClassicHero stats={stats} content={content} onWatchReel={openReel} locale={locale} />
            </div>
          </>
        );
    }
  })();

  return (
    <section className="relative">
      {stage}

      {/* showreel modal (shared by every mode) */}
      <AnimatePresence>
        {reel && content.heroReelUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-background/85 p-4 backdrop-blur-2xl"
            onClick={() => setReel(false)}
          >
            <button
              className="liquid liquid-clear absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full text-foreground"
              onClick={() => setReel(false)}
              aria-label={locale === "en" ? "Close" : locale === "ar" ? "إغلاق" : "بستن"}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ ease: EASE, duration: 0.35 }}
              className="aspect-video w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-card-border shadow-[0_2px_8px_rgba(0,0,0,0.08),0_40px_90px_-30px_rgba(0,0,0,0.45)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Aparat/YouTube page links are embedded; a direct file plays inline. */}
              {embedSrc ? (
                <EmbedFrame src={embedSrc} title={content.heroReelLabel} className="h-full w-full" />
              ) : (
                <video src={content.heroReelUrl} controls autoPlay className="h-full w-full" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
