"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { HomeContent } from "@/lib/queries";

interface T {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  avatar: string | null;
  quote: string;
  rating: number;
}

export function Testimonials({ items, content }: { items: T[]; content: HomeContent }) {
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
    <Section id="testimonials" className="bg-background-2">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={content.testimonialsEyebrow}
          title={<HighlightedTitle title={content.testimonialsHeading} highlight={content.testimonialsHeadingHighlight} />}
          className="mx-auto mb-14 max-w-2xl"
        />

        <div className="relative mx-auto max-w-4xl">
          <Quote className="mx-auto mb-8 h-12 w-12 text-primary/30" />
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="font-display text-2xl font-medium leading-relaxed text-foreground md:text-3xl">
                  «{t.quote}»
                </p>
                <div className="mt-8 flex items-center justify-center gap-4">
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
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, k) => (
                        <Star key={k} className="h-3.5 w-3.5 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => go(-1)}
              aria-label="قبلی"
              className="grid h-11 w-11 place-items-center rounded-full border border-card-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {items.map((_, k) => (
                <button
                  key={k}
                  onClick={() => setI(k)}
                  aria-label={`نظر ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-primary" : "w-2 bg-card-border"}`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="بعدی"
              className="grid h-11 w-11 place-items-center rounded-full border border-card-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
