import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, ChevronLeft, Clock } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { INDUSTRY_PAINT } from "@/lib/constants";
import { labelOn, localeDigits } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * The journal opens on an article, not on a slogan.
 *
 * "Insight and inspiration" told a reader nothing and asked them for nothing.
 * The journal's whole job is to start someone reading, and there is already a
 * clear candidate: the featured post has 833 views against 12-25 for every
 * other one, so the cover is picked by the numbers rather than by taste.
 *
 * Held, not bled. The brief said magazine cover and it also said keep the
 * whitespace rule, and a photograph running edge to edge is the opposite of
 * whitespace — so the cover is a large plate sitting inside the container with
 * air all round it. It reads as a cover without the page becoming one.
 *
 * ── The colour ────────────────────────────────────────────────────────────
 * Two of the four site colours cannot carry text on white (coral 2.80:1, gold
 * 1.72:1), so here they only ever fill a shape: the category chip, which is
 * opaque and sits on the photograph with its label computed per hex, and a
 * short four-segment rule under the plate. Everything read on white is ink.
 */

const COPY: Record<Locale, { promise: (a: string, b: string) => string; noExceptions: string; read: string; minutes: string }> = {
  fa: {
    promise: (a, b) => `هر مقاله، بین ${a} تا ${b} دقیقه`,
    noExceptions: "بدون استثنا.",
    read: "خواندن این مقاله",
    minutes: "دقیقه",
  },
  en: {
    promise: (a, b) => `Every post, ${a} to ${b} minutes`,
    noExceptions: "No exceptions.",
    read: "Read this one",
    minutes: "min",
  },
  ar: {
    promise: (a, b) => `كل مقال، من ${a} إلى ${b} دقائق`,
    noExceptions: "بلا استثناء.",
    read: "اقرأ هذا المقال",
    minutes: "دقيقة",
  },
};

export interface FeaturedPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  readingMinutes: number;
}

export function JournalHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  post,
  /** Index of the post's category among the journal's categories, so the chip
   *  colour is stable rather than derived from the string. */
  categoryIndex,
  minMinutes,
  maxMinutes,
  locale = "fa",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  post: FeaturedPost | null;
  categoryIndex: number;
  minMinutes: number;
  maxMinutes: number;
  locale?: Locale;
}) {
  const c = COPY[locale] ?? COPY.fa;
  const colour = INDUSTRY_PAINT[categoryIndex % INDUSTRY_PAINT.length];
  const chipLabel = labelOn(colour);

  return (
    <section className="relative overflow-hidden pb-16 pt-40 md:pt-52">
      <Container>
        <Reveal>
          <nav className="-mx-2 mb-5 flex flex-wrap items-center text-xs text-foreground-faint">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center px-2 text-foreground-muted">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
              </span>
            ))}
          </nav>
        </Reveal>

        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground balance sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">{description}</p>
          </Reveal>
        )}

        {post && (
          <Reveal delay={0.15}>
            <Link
              href={`/journal/${post.slug}`}
              className="group mt-12 block overflow-hidden rounded-[2rem] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_40px_80px_-40px_rgba(0,0,0,0.5)] md:mt-14"
            >
              <div className="relative aspect-[16/10] max-h-[58svh] w-full md:aspect-[16/9]">
                <Image
                  src={post.cover}
                  alt=""
                  fill
                  // The one image above the fold on this page, so it is not
                  // allowed to arrive late.
                  priority
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.04]"
                />
                {/* Built for exactly this: white type over a photograph nobody
                    has vetted. See .poster-scrim in globals.css. */}
                <div className="poster-scrim absolute inset-0" aria-hidden />

                <div className="absolute right-6 top-6 flex items-center gap-2 md:right-8 md:top-8">
                  {/* Opaque, so the colour survives whatever is under it. */}
                  <span
                    className="rounded-full px-3.5 py-1.5 text-xs font-bold"
                    style={{ background: colour, color: chipLabel }}
                  >
                    {post.category}
                  </span>
                  <span className="glass-onmedia inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="ltr-nums">{localeDigits(locale, post.readingMinutes)}</span> {c.minutes}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <h2 className="max-w-3xl font-display text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl md:text-4xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-white/85 md:block">{post.excerpt}</p>
                  <span className="glass-onmedia mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold">
                    {c.read}
                    <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        )}

        {/* The promise. Both numbers are read off the posts, so it cannot
            become a claim the journal has stopped keeping. */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="flex overflow-hidden rounded-full" aria-hidden>
              {INDUSTRY_PAINT.map((k) => (
                <span key={k} className="h-[3px] w-7" style={{ background: k }} />
              ))}
            </span>
            <p className="text-sm text-foreground-muted md:text-base">
              <span className="font-semibold text-foreground">
                {c.promise(localeDigits(locale, minMinutes), localeDigits(locale, maxMinutes))}
              </span>{" "}
              {c.noExceptions}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
