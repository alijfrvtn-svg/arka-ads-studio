"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { HeroScrim, HERO_HEIGHT } from "./HeroStage";
import { SmartVideo, isEmbeddedVideo } from "@/components/media/SmartVideo";
import { cn } from "@/lib/utils";
import type { HeroSlide, HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const EASE = [0.16, 1, 0.3, 1] as const;

/** A slide's media is a video if it is a playable file OR a platform link. */
const isVideoSlide = (url: string) =>
  /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || isEmbeddedVideo(url);

const LABELS: Record<Locale, { prev: string; next: string; go: string; pause: string; play: string; carousel: string }> = {
  fa: { prev: "اسلاید قبلی", next: "اسلاید بعدی", go: "رفتن به اسلاید", pause: "توقف چرخش", play: "ادامه چرخش", carousel: "بنر اسلایدی" },
  en: { prev: "Previous slide", next: "Next slide", go: "Go to slide", pause: "Pause autoplay", play: "Resume autoplay", carousel: "Hero carousel" },
  ar: { prev: "الشريحة السابقة", next: "الشريحة التالية", go: "الانتقال إلى الشريحة", pause: "إيقاف التشغيل", play: "استئناف التشغيل", carousel: "شريط الشرائح" },
};

/**
 * Hero mode `slider` — an admin-authored banner carousel.
 *
 * Autoplay is a courtesy, not a constraint: it stops on hover, on keyboard
 * focus, when the tab is hidden, and permanently once the visitor takes manual
 * control, and it never starts under prefers-reduced-motion. There is always a
 * visible pause control, because a carousel that moves the CTA out from under
 * the cursor is the classic reason carousels get blamed for lost conversions.
 */
export function HeroSlider({
  slides,
  content,
  locale = "fa",
}: {
  slides: HeroSlide[];
  content: HomeContent;
  locale?: Locale;
}) {
  const t = LABELS[locale] ?? LABELS.fa;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionOk, setMotionOk] = useState(true);
  const takenOver = useRef(false);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = useCallback(
    (next: number, manual = false) => {
      if (manual) takenOver.current = true;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || !motionOk || takenOver.current) return;
    const ms = Math.max(2, content.heroSlideDuration) * 1000;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [count, paused, motionOk, content.heroSlideDuration, index]);

  // A carousel advancing in a tab nobody is looking at is wasted bandwidth.
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!count) return null;
  const slide = slides[index];
  const autoplaying = count > 1 && motionOk && !takenOver.current && !paused;

  return (
    <section
      className={cn(
        "relative flex items-center overflow-hidden",
        HERO_HEIGHT[content.heroHeight] ?? HERO_HEIGHT.full,
      )}
      aria-roledescription="carousel"
      aria-label={t.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        // RTL: ArrowLeft moves forward visually, so map by reading direction.
        if (e.key === "ArrowLeft") go(locale === "en" ? index - 1 : index + 1, true);
        if (e.key === "ArrowRight") go(locale === "en" ? index + 1 : index - 1, true);
      }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="absolute inset-0"
        >
          {slide.media && (isVideoSlide(slide.media) ? (
            <SmartVideo
              src={slide.media}
              poster={slide.poster}
              background
              autoPlay
              loop
              className="h-full w-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.media}
              alt=""
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          ))}
          {!slide.media && <div className="h-full w-full reel-bg opacity-70" />}
        </motion.div>
      </AnimatePresence>

      <HeroScrim strength={content.heroOverlay} />

      <div className="container-x relative z-10 pt-28">
        {/* Slide copy swaps under a live region so screen readers hear the
            change without the whole section being re-announced. */}
        <div aria-live={autoplaying ? "off" : "polite"} aria-atomic="true">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          >
            <p className="sr-only">
              {index + 1} / {count}
            </p>
            {slide.badge && (
              <span className="liquid-clear mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-foreground-muted">
                {slide.badge}
              </span>
            )}
            <h1 className="font-display max-w-4xl break-words text-[11vw] font-extrabold leading-[1.12] tracking-[-0.03em] text-foreground sm:text-6xl sm:leading-[1.05] md:text-7xl lg:text-[5.5rem] lg:leading-[0.98]">
              {slide.title}
            </h1>
            {slide.desc && (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground-muted">{slide.desc}</p>
            )}
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.4}>
                <Button href={slide.ctaHref || content.heroCtaHref} size="lg" variant="glow">
                  {slide.ctaLabel || content.heroCtaLabel}
                  <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          <button
            onClick={() => go(index - 1, true)}
            aria-label={t.prev}
            className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={`${s.title}-${i}`}
                onClick={() => go(i, true)}
                aria-label={`${t.go} ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-apple)]",
                  i === index ? "w-9 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50",
                )}
              />
            ))}
          </div>

          <button
            onClick={() => go(index + 1, true)}
            aria-label={t.next}
            className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {motionOk && (
            <button
              onClick={() => {
                takenOver.current = !takenOver.current;
                setPaused(false);
              }}
              aria-label={takenOver.current ? t.play : t.pause}
              className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground-muted"
            >
              {takenOver.current ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
