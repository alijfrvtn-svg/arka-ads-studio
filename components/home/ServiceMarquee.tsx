import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

export interface MarqueeCard {
  slug: string;
  title: string;
  image: string | null;
}

/**
 * The full 28-card catalogue drifting past, with the closing call to action
 * standing in the middle of it.
 *
 * Sits above the footer on every page, so wherever a visitor stops reading, the
 * last thing before the footer is the whole of what ARKA does plus one way to
 * start. Two rows travelling in opposite directions: a single row reads as a
 * conveyor belt, two opposed rows read as depth.
 *
 * How the loop is seamless
 * ------------------------
 * Each row renders its cards twice and translates by exactly -50%. At the end
 * of the cycle the second copy sits precisely where the first began, so the
 * jump back to 0% is invisible. This is why the duplicate is `aria-hidden` and
 * why the row must not be given a gap that differs between the copies.
 *
 * Cost
 * ----
 * 28 cards x 2 copies x 2 rows would be 112 <img> elements on every page. The
 * rows are split — 14 cards each — so it is 56, and each card is ~90KB of webp
 * at 720px. They are `loading="lazy"` and the band is below the fold on every
 * page, so nothing here competes with the LCP.
 */
export function ServiceMarquee({
  cards,
  heading,
  body,
  ctaLabel,
  ctaHref = "/services",
}: {
  cards: MarqueeCard[];
  heading: string;
  body?: string;
  ctaLabel: string;
  ctaHref?: string;
}) {
  if (cards.length < 4) return null;

  // Split rather than duplicated: the two rows should not show the same card at
  // the same moment, or the opposing motion reads as a mirror rather than depth.
  const half = Math.ceil(cards.length / 2);
  const rows = [cards.slice(0, half), cards.slice(half)];

  return (
    <section className="relative overflow-hidden border-t border-card-border bg-background py-20 md:py-28">
      <div className="flex flex-col gap-5">
        <MarqueeRow cards={rows[0]} direction="ltr" />
        <MarqueeRow cards={rows[1]} direction="rtl" />
      </div>

      {/* The copy sits over the middle of the band. The scrim is what makes it
          readable: without it the cards run straight under the headline and
          neither survives. */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 46% at 50% 50%, var(--background) 34%, color-mix(in srgb, var(--background) 88%, transparent) 56%, transparent 78%)",
          }}
        />
        <div className="container-x pointer-events-auto relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] text-foreground balance sm:text-4xl md:text-5xl">
              {heading}
            </h2>
          </Reveal>
          {body && (
            <Reveal delay={0.05}>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground-muted">
                {body}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <Link
              href={ctaHref}
              data-track="marquee-cta"
              className="liquid btn-glow group mt-9 inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-9 text-base font-semibold"
            >
              <span className="inline-flex items-center gap-2.5">
                {ctaLabel}
                <ArrowUpLeft className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ cards, direction }: { cards: MarqueeCard[]; direction: "ltr" | "rtl" }) {
  return (
    // dir is forced: this is a picture, not text, and it must travel the same
    // way regardless of the RTL document it lives in.
    <div className="relative flex overflow-hidden" dir="ltr" aria-hidden={direction === "rtl"}>
      <div
        className={cn(
          "flex w-max shrink-0 gap-5",
          direction === "ltr" ? "animate-marquee-x" : "animate-marquee-x-reverse",
        )}
      >
        {[0, 1].map((copy) =>
          cards.map((c) => (
            <MarqueeCardFace key={`${copy}-${c.slug}`} card={c} duplicate={copy === 1} />
          )),
        )}
      </div>
    </div>
  );
}

function MarqueeCardFace({ card, duplicate }: { card: MarqueeCard; duplicate: boolean }) {
  const inner = card.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={card.image}
      alt={duplicate ? "" : card.title}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  ) : (
    <span className="grid h-full w-full place-items-center bg-surface-2 px-3 text-center text-[11px] font-medium leading-snug text-foreground-muted">
      {card.title}
    </span>
  );

  const className =
    "block aspect-[4/5] h-[clamp(8rem,14vw,11rem)] shrink-0 overflow-hidden rounded-[1.1rem] border border-card-border bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.05),0_14px_32px_-20px_rgba(0,0,0,0.35)]";

  // The duplicate copy exists only to make the loop seamless, so it is inert:
  // not a link, not focusable, not announced. Otherwise every service on the
  // site would appear twice in the tab order of every page.
  return duplicate ? (
    <span className={className} aria-hidden>
      {inner}
    </span>
  ) : (
    <Link href={`/services/${card.slug}`} className={className} data-cursor>
      {inner}
    </Link>
  );
}
