import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

/**
 * A row of related things on an industry page — articles in one section,
 * projects in the next, same card either way.
 *
 * Cards without an `href` are placeholders. They carry a «نمونه» pill and are
 * plain elements rather than links, so nothing on the page leads a visitor to a
 * piece of writing or a project that does not exist. As soon as a section is
 * given real items it renders those instead and the pill goes.
 */
export interface RelatedItem {
  key: string;
  title: string;
  /** The line under the title — a date and a reading time, or a client. */
  meta: string;
  image: string;
  /** Absent on a placeholder. */
  href?: string;
}

export function IndustryRelated({
  eyebrow,
  heading,
  items,
  sampleLabel,
  className,
}: {
  eyebrow: string;
  heading: string;
  items: RelatedItem[];
  /** Shown on cards that are standing in for content not published yet. */
  sampleLabel: string;
  className?: string;
}) {
  if (!items.length) return null;

  return (
    <Section className={className}>
      <Container>
        <SectionHeading eyebrow={eyebrow} title={heading} className="mb-10 max-w-3xl" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const inner = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.04]"
                  />
                  {!it.href && (
                    <span className="glass-onmedia absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium">
                      {sampleLabel}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-foreground">
                    {it.title}
                  </h3>
                  <p className="mt-2 text-xs text-foreground-faint">{it.meta}</p>
                  {it.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  )}
                </div>
              </>
            );

            const shell = cn(
              "group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-card-border bg-surface",
              it.href &&
                "transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-32px_rgba(0,0,0,0.35)]",
            );

            return (
              <Reveal key={it.key} delay={i * 0.06} className="h-full">
                {it.href ? (
                  <Link href={it.href} className={shell}>
                    {inner}
                  </Link>
                ) : (
                  // Not a link and not focusable: it is a picture of a card, and
                  // a tab stop that goes nowhere is worse than no tab stop.
                  <div className={shell}>{inner}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
