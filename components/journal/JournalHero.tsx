import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { JournalDeck, type DeckPost } from "./JournalDeck";
import { localeDigits } from "@/lib/utils";
import type { Locale } from "@/types";
import { getAppearance } from "@/lib/appearance";

/**
 * The journal opens on articles, not on a slogan.
 *
 * "Insight and inspiration" told a reader nothing and asked them for nothing.
 * The journal's whole job is to start someone reading, so the hero is the five
 * most-read posts as a turning deck — ranked by views, not by taste.
 *
 * Held, not bled. The brief said magazine cover and it also said keep the
 * whitespace rule, and a photograph running edge to edge is the opposite of
 * whitespace — so the deck is a large plate sitting inside the container with
 * air all round it. It reads as a cover without the page becoming one.
 *
 * The deck itself is JournalDeck; this holds the page's own copy around it.
 *
 * ── The colour ────────────────────────────────────────────────────────────
 * Two of the four site colours cannot carry text on white (coral 2.80:1, gold
 * 1.72:1), so here they only ever fill a shape: the category chip and the
 * cards behind the front one, and a short four-segment rule under the deck.
 * Everything read on white is ink.
 */

const COPY: Record<Locale, { promise: (a: string, b: string) => string; noExceptions: string; read: string; minutes: string; post: string }> = {
  fa: {
    promise: (a, b) => `هر مقاله، بین ${a} تا ${b} دقیقه`,
    noExceptions: "بدون استثنا.",
    read: "خواندن این مقاله",
    minutes: "دقیقه",
    post: "مقاله",
  },
  en: {
    promise: (a, b) => `Every post, ${a} to ${b} minutes`,
    noExceptions: "No exceptions.",
    read: "Read this one",
    minutes: "min",
    post: "Post",
  },
  ar: {
    promise: (a, b) => `كل مقال، من ${a} إلى ${b} دقائق`,
    noExceptions: "بلا استثناء.",
    read: "اقرأ هذا المقال",
    minutes: "دقيقة",
    post: "مقال",
  },
};

export async function JournalHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  posts,
  minMinutes,
  maxMinutes,
  locale = "fa",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  posts: DeckPost[];
  minMinutes: number;
  maxMinutes: number;
  locale?: Locale;
}) {
  // The live identity, edited in the panel; falls back to the shipped
  // constants when nothing is saved. Cached per request.
  const { industryPaint: INDUSTRY_PAINT } = await getAppearance();
  const c = COPY[locale] ?? COPY.fa;

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

        {posts.length > 0 && (
          <Reveal delay={0.15}>
            <div className="mt-12 md:mt-14">
              <JournalDeck
                posts={posts}
                readLabel={c.read}
                minutesLabel={c.minutes}
                postLabel={c.post}
                locale={locale}
              />
            </div>
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
