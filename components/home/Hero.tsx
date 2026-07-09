"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpLeft, Play, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/fx/Magnetic";
import { SAMPLE } from "@/lib/media";
import { SITE } from "@/lib/constants";
import { toFa } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ stats }: { stats: { label: string; value: number; suffix: string }[] }) {
  const [reel, setReel] = useState(false);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* background reel */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={SAMPLE.showreelPoster}
        className="absolute inset-0 h-full w-full object-cover opacity-[0.28]"
      >
        <source src={SAMPLE.showreel} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/55 to-background" />
      <div className="absolute inset-0 hero-grid opacity-70" />
      <div className="aurora animate-aurora-1 -left-40 top-10 h-[32rem] w-[32rem] bg-primary/25" />
      <div className="aurora animate-aurora-2 -right-32 bottom-0 h-[28rem] w-[28rem] bg-accent/20" />

      <div className="container-x relative z-10 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-card-border bg-surface/50 px-4 py-1.5 text-xs font-medium text-foreground-muted backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-primary" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {SITE.positioning}
        </motion.div>

        <h1 className="font-display text-[13vw] font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          {["طراحی کن.", "خلق کن.", "تأثیر بگذار."].map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: EASE }}
              className={i === 2 ? "block text-gradient" : "block text-foreground"}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-foreground-muted"
        >
          آرکا یک پروداکشن‌هاوس خلاق است؛ برندها را با هنر بصری سینمایی، راهکارهای دیجیتال و
          روایت داده‌محور به سطحی تازه می‌رساند.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={0.4}>
            <Button href="/contact" size="lg" variant="glow">
              شروع پروژه
              <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </Magnetic>
          <button
            onClick={() => setReel(true)}
            className="group inline-flex items-center gap-3 text-foreground"
          >
            <span className="relative grid h-14 w-14 place-items-center rounded-full border border-card-border bg-surface/50 backdrop-blur transition-colors group-hover:border-primary">
              <span className="absolute inset-0 animate-ping-slow rounded-full border border-primary/40" />
              <Play className="h-5 w-5 translate-x-0.5 fill-current text-primary" />
            </span>
            <span className="text-sm font-medium">تماشای شوریل ۲۰۲۵</span>
          </button>
        </motion.div>

        {/* mini stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-6 border-t border-card-border pt-8 sm:grid-cols-4"
        >
          {stats.slice(0, 4).map((s) => (
            <div key={s.label}>
              <div className="font-display text-2xl font-bold text-foreground md:text-3xl">
                {toFa(s.value)}
                {s.suffix}
              </div>
              <div className="mt-1 text-xs text-foreground-muted">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-foreground-faint">اسکرول</span>
        <span className="h-10 w-px overflow-hidden bg-card-border">
          <span className="block h-full w-full animate-scroll-line bg-primary" />
        </span>
      </div>

      {/* showreel modal */}
      <AnimatePresence>
        {reel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
            onClick={() => setReel(false)}
          >
            <button
              className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-card-border text-foreground hover:border-primary"
              onClick={() => setReel(false)}
              aria-label="بستن"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ ease: EASE, duration: 0.35 }}
              className="aspect-video w-full max-w-5xl overflow-hidden rounded-2xl border border-card-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video src={SAMPLE.showreel} controls autoPlay className="h-full w-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
