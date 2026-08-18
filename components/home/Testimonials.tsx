"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { ui } from "@/lib/i18n";
import { localeDigits } from "@/lib/utils";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const REVIEW_WORD: Record<Locale, string> = { fa: "نظر", en: "Review", ar: "رأي" };

interface T {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  quote: string;
  rating: number;
}

export function Testimonials({ items, content, locale = "fa" }: { items: T[]; content: HomeContent; locale?: Locale }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [n]);

  if (!n) return null;
  const t = items[i];

  return (
    <Section id="testimonials">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={content.testimonialsEyebrow}
          title={<HighlightedTitle title={content.testimonialsHeading} highlight={content.testimonialsHeadingHighlight} />}
          className="mx-auto mb-16 max-w-2xl"
        />

        {/* A deck, not a bare quote.

            The two cards behind are decoration, not content: they carry no text
            and are aria-hidden, so the stack reads as depth without the screen
            reader announcing three testimonials or the tab order gaining two
            dead stops. The quote itself keeps the cross-fade it already had —
            only the front card is real, which is also why this needed no
            per-card animation state. */}
        <div className="relative mx-auto max-w-3xl">
          <div className="relative" style={{ perspective: 1200 }}>
            <span
              aria-hidden
              className="tm-ghost absolute inset-x-6 -top-5 h-full rounded-[1.75rem] border border-card-border bg-surface"
              style={{ transform: "rotate(-1.6deg) scale(0.955)", opacity: 0.55 }}
            />
            <span
              aria-hidden
              className="tm-ghost absolute inset-x-11 -top-9 h-full rounded-[1.75rem] border border-card-border bg-surface"
              style={{ transform: "rotate(1.9deg) scale(0.91)", opacity: 0.32 }}
            />

            <div className="relative rounded-[1.75rem] border border-card-border bg-surface px-7 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_28px_64px_-34px_rgba(0,0,0,0.3)] md:px-14 md:py-14">
              <Quote className="mx-auto mb-9 h-10 w-10 text-foreground/15" />
              <div className="min-h-[210px]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={t.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-center"
                  >
                    <p className="font-display text-2xl font-medium leading-relaxed tracking-tight text-foreground md:text-[1.7rem]">
                      «{t.quote}»
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-4">
                      {t.avatar && (
                        <Image
                          src={t.avatar}
                          alt={t.author}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-full border border-card-border object-cover"
                        />
                      )}
                      <div className="text-right">
                        <div className="font-bold text-foreground">{t.author}</div>
                        <div className="text-sm text-foreground-muted">
                          {t.role}
                          {t.company ? ` · ${t.company}` : ""}
                        </div>
                        <div className="mt-1.5 flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, k) => (
                            <Star key={k} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.blockquote>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 sm:gap-4">
            <button
              onClick={() => go(-1)}
              aria-label={ui(locale).testimonialPrev}
              className="liquid liquid-clear grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* The dot stays 8px for looks, but the button around it is a full
                44px target — an 8px tap target is unusable on a phone. */}
            <div className="flex max-w-[55vw] overflow-x-auto sm:max-w-none">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`${REVIEW_WORD[locale]} ${localeDigits(locale, k + 1)}`}
                  aria-current={k === i}
                  className="grid h-11 w-8 place-items-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-500 [transition-timing-function:var(--ease-apple)] ${k === i ? "w-7 bg-foreground" : "w-1.5 bg-foreground/20"}`}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label={ui(locale).testimonialNext}
              className="liquid liquid-clear grid h-11 w-11 shrink-0 place-items-center rounded-full text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
