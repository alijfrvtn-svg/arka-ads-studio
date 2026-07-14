"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { EyeOfCreation } from "./EyeOfCreation";
import { SAMPLE } from "@/lib/media";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [reel, setReel] = useState(false);

  return (
    <section className="relative">
      <EyeOfCreation onWatchReel={() => setReel(true)} />

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
