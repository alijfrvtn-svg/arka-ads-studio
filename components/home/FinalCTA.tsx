import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { HomeContent } from "@/lib/queries";

export function FinalCTA({
  content,
  phone,
  phoneDisplay,
}: {
  content: HomeContent;
  phone: string;
  phoneDisplay: string;
}) {
  return (
    <section className="section">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-card-border bg-surface-2 px-6 py-24 text-center md:px-16 md:py-32">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.04] blur-[130px]" />
          <div className="relative">
            <Reveal>
              <p className="eyebrow mx-auto w-fit">{content.finalEyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto mt-7 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground balance md:text-6xl">
                <HighlightedTitle title={content.finalHeading} highlight={content.finalHeadingHighlight} />
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-foreground-muted">{content.finalDescription}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="liquid liquid-raised group inline-flex items-center gap-2 rounded-full px-9 py-4 text-base font-semibold"
                >
                  <span className="inline-flex items-center gap-2">
                    {content.finalCtaLabel}
                    <ArrowUpLeft className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
                <a
                  href={`tel:${phone}`}
                  className="liquid liquid-clear inline-flex items-center gap-2 rounded-full px-9 py-4 text-base font-semibold text-foreground"
                >
                  <span className="ltr-nums">{phoneDisplay}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
