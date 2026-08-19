"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery, DESKTOP } from "@/lib/use-media";
import { ChevronLeft, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * The film hero.
 *
 * A full-bleed loop of the ARKA reel running under the header, with the page's
 * own type held at the foot of the frame.
 *
 * ── Why the copy sits at the bottom and not in the middle ──────────────────
 * The reel carries its own centred type — a line of white text at ~13s and the
 * studio endcard at ~16.5s. A centred h1 would land on both. The foot of the
 * frame is the only place the film never writes into.
 *
 * ── Sound ─────────────────────────────────────────────────────────────────
 * No browser will start an unmuted video on its own. Chrome allows it once a
 * visitor has enough media-engagement history with the domain; Safari and
 * Firefox refuse outright until the visitor has interacted with the page. So
 * this asks in that order:
 *
 *   1. try to play WITH sound — succeeds for returning Chrome visitors;
 *   2. if refused, play muted (which always works) and arm a one-shot listener
 *      so the very first thing the visitor does — a click, a key, a scroll —
 *      turns the sound on;
 *   3. and a control is on screen the whole time either way, so nobody is
 *      stuck with audio they did not want or silence they cannot fix.
 *
 * Step 2's rejection is the normal path, not an error case.
 */

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  home: string;
  work: string;
  soundOn: string;
  soundOff: string;
  hint: string;
  play: string;
  scroll: string;
}> = {
  fa: {
    eyebrow: "نمونه‌کارها",
    title: "کارهایی که",
    highlight: "تأثیر گذاشتند",
    description: "هر پروژه یک داستان است؛ از چالش برند تا نتیجه‌ای که با عدد اندازه‌گیری می‌شود.",
    home: "خانه",
    work: "نمونه‌کارها",
    soundOn: "قطع صدا",
    soundOff: "پخش صدا",
    hint: "برای شنیدن صدا کلیک کنید",
    play: "پخش ویدیو",
    scroll: "پروژه‌ها",
  },
  en: {
    eyebrow: "Portfolio",
    title: "Work that",
    highlight: "made an impact",
    description: "Every project is a story — from a brand's challenge to a result measured in numbers.",
    home: "Home",
    work: "Work",
    soundOn: "Mute",
    soundOff: "Play sound",
    hint: "Click anywhere for sound",
    play: "Play video",
    scroll: "Projects",
  },
  ar: {
    eyebrow: "الأعمال",
    title: "أعمال",
    highlight: "تركت أثرًا",
    description: "كل مشروع قصة؛ من تحدي العلامة التجارية إلى نتيجة تُقاس بالأرقام.",
    home: "الرئيسية",
    work: "الأعمال",
    soundOn: "كتم الصوت",
    soundOff: "تشغيل الصوت",
    hint: "اضغط في أي مكان لتشغيل الصوت",
    play: "تشغيل الفيديو",
    scroll: "المشاريع",
  },
};

export function WorkCinematicHero({ locale = "fa" }: { locale?: Locale }) {
  const c = COPY[locale] ?? COPY.fa;
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [soundOn, setSoundOn] = useState(false);
  /** Still wanting sound — cleared when the visitor mutes it themselves, so
   *  their next click does not switch it straight back on. */
  const [wantSound, setWantSound] = useState(true);
  const [started, setStarted] = useState(false);

  /**
   * Whether the client has taken over.
   *
   * This block is the page's h1. framer-motion writes `initial` into the
   * server HTML, so starting it at `opacity: 0` shipped the title of /work
   * invisible until the bundle hydrated — over a video that was already
   * playing behind it. Drawn in place on the first render instead.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The frame drifts and closes in a little as the page scrolls off it. Scroll
  // linked rather than timed, so it tracks the reader instead of running on its
  // own clock.
  //
  // Desktop only. On a phone the address bar collapses on the first flick of
  // scrolling, the viewport grows by ~60px mid-gesture, and every scroll-linked
  // value re-resolves against a stage that just changed height — the video
  // lurches at exactly the moment the reader is looking straight at it. There
  // is no way to smooth that away, so the phone gets a still frame instead.
  const parallax = useMediaQuery(DESKTOP);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);

  const applySound = useCallback((on: boolean) => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !on;
    setWantSound(on);
    if (on) {
      v.play()
        .then(() => setSoundOn(true))
        .catch(() => {
          // Refused: back to silence rather than to a stalled video.
          v.muted = true;
          setSoundOn(false);
        });
    } else {
      setSoundOn(false);
    }
  }, []);

  // Start: with sound if the browser allows it, muted if not.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    let cancelled = false;

    (async () => {
      v.volume = 1;
      v.muted = false;
      try {
        await v.play();
        if (!cancelled) {
          setSoundOn(true);
          setStarted(true);
        }
        return;
      } catch {
        /* expected on a first visit — fall through to muted */
      }
      v.muted = true;
      try {
        await v.play();
      } catch {
        /* nothing left to try; the poster stands in */
      }
      if (!cancelled) {
        setSoundOn(false);
        setStarted(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reduced]);

  // The first gesture anywhere turns the sound on. Only while sound is still
  // wanted and still missing, and it unbinds itself after one hit.
  useEffect(() => {
    if (reduced || soundOn || !wantSound || !started) return;
    const events = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;
    const on = () => applySound(true);
    events.forEach((e) => window.addEventListener(e, on, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, on));
  }, [reduced, soundOn, wantSound, started, applySound]);

  // Nothing plays while it is off screen — a 4MB loop running behind the rest
  // of the page is bandwidth nobody asked for, and audio from a hero the
  // reader has scrolled past is worse than that.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.12 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const startManually = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().then(() => {
      setSoundOn(true);
      setStarted(true);
    }).catch(() => {});
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#050505]"
    >
      {/* The film. Wrapped so the parallax rides the wrapper and leaves the
          element itself free for object-fit. */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={reduced || !parallax ? undefined : { y, scale }}
      >
        <video
          ref={videoRef}
          poster="/video/work-hero-poster.webp"
          className="h-full w-full object-cover"
          playsInline
          loop
          muted
          autoPlay={!reduced}
          preload="metadata"
          // Decorative: the page's own h1 says what this is, and the reel has
          // no narration to caption.
          aria-hidden
          tabIndex={-1}
        >
          <source src="/video/work-hero-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/video/work-hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <div className="film-hero-vignette" aria-hidden />
      <div className="film-hero-top" aria-hidden />
      <div className="film-hero-bottom" aria-hidden />
      <div className="film-grain" aria-hidden />

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        {/* Below the header, which floats over the film with its tokens
            inverted — see header[data-over-media] in globals.css. */}
        <div className="container-x pt-28 md:pt-32">
          {/* White steps here are set by the top scrim, not by taste: over the
              brightest 5% of the reel, white/70 lands at 3.5:1 and only 0.90
              and up clears 4.5. */}
          <nav className="-mx-2 flex flex-wrap items-center text-xs text-white/90">
            <Link href="/" className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-white">
              {c.home}
            </Link>
            <ChevronLeft className="h-3 w-3" />
            <span className="inline-flex min-h-11 items-center px-2 text-white">{c.work}</span>
          </nav>
        </div>

        <div className="flex-1" />

        <div className="container-x pb-14 md:pb-20">
          <motion.div
            initial={reduced || !mounted ? false : { opacity: 0, y: 32 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-white/65 lg:text-[0.7rem] lg:tracking-[0.28em]">
              {c.eyebrow}
            </span>
            <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-white/80 balance sm:text-5xl md:text-6xl lg:text-7xl">
              {c.title} <span className="text-white">{c.highlight}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
              {c.description}
            </p>
          </motion.div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {/* Frosted white with ink content — the one material on this site
                allowed over footage, because white is an endpoint and ink on it
                cannot fall below ~15:1 whatever the frame is doing. */}
            <button
              type="button"
              onClick={() => applySound(!soundOn)}
              aria-pressed={soundOn}
              aria-label={soundOn ? c.soundOn : c.soundOff}
              className="glass-onmedia liquid group inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold"
              data-cursor
            >
              <span className="inline-flex items-center gap-2.5">
                {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {soundOn ? c.soundOn : c.soundOff}
              </span>
            </button>

            {/* Shown only while the browser is holding the sound back, which is
                the usual first visit. It goes as soon as sound is on. */}
            {started && !soundOn && wantSound && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-xs text-white/60"
              >
                {c.hint}
              </motion.span>
            )}

            {/* Reduced motion gets a still frame and a way in, rather than a
                loop it asked not to be given. */}
            {reduced && !started && (
              <button
                type="button"
                onClick={startManually}
                className="glass-onmedia liquid inline-flex min-h-11 items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold"
                data-cursor
              >
                <span className="inline-flex items-center gap-2.5">
                  <Play className="h-4 w-4 fill-current" />
                  {c.play}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Scroll cue, on the opposite side to the copy so it does not read as
            part of the sentence. */}
        <div className="pointer-events-none absolute bottom-7 left-0 right-0 hidden justify-center md:flex">
          <motion.span
            aria-hidden
            className="flex flex-col items-center gap-2 text-[0.72rem] uppercase tracking-[0.14em] text-white/70 lg:text-[0.65rem] lg:tracking-[0.22em]"
            animate={reduced ? undefined : { y: [0, 7, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {c.scroll}
            <span className="h-9 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </motion.span>
        </div>
      </div>
    </section>
  );
}
