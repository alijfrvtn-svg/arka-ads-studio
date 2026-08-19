import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { INDUSTRY_PAINT } from "@/lib/constants";
import { labelOn, localeDigits } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * The studio's history, read across rather than down.
 *
 * A vertical line with four dots is what every site does, and on a page that
 * already stacks values, team and history one under another, a fourth column of
 * the same shape adds nothing. Time runs along a rail here instead — right to
 * left, with the reading — and each station carries the figure that grew, so
 * the section makes a claim rather than just listing dates.
 *
 * ── Where the colour is allowed to be ─────────────────────────────────────
 * Two of the four site colours cannot carry text on white at all: the coral is
 * 2.80:1 and the gold 1.72:1, so a figure set in its station's colour would be
 * unreadable on half the rail. The colour therefore lives only in filled
 * shapes — a 3px rail, a bead, and a small pill behind each figure, whose label
 * colour is computed per hex. Everything that is read is ink on white, and the
 * four colours together take up a few dozen pixels of the section.
 */

/**
 * What grew, per station.
 *
 * Departments, because it is the one series the page can actually stand
 * behind: the four descriptions below describe them being added one at a time,
 * and the site's own structure ends at four. Not in the CMS because the
 * timeline field has no room for a figure and the admin is not being touched
 * yet — change them here, or say the word and they move into the panel.
 */
const GROWTH = [1, 2, 3, 4];

const UNIT: Record<Locale, string> = {
  fa: "دپارتمان",
  en: "departments",
  ar: "أقسام",
};

interface Entry {
  year: string;
  title: string;
  desc: string;
}

export function AboutTimeline({
  eyebrow,
  heading,
  items,
  locale = "fa",
}: {
  eyebrow: string;
  heading: string;
  items: Entry[];
  locale?: Locale;
}) {
  if (!items.length) return null;

  return (
    <Section>
      <Container>
        <SectionHeading align="center" eyebrow={eyebrow} title={heading} className="mx-auto mb-20 max-w-2xl" />

        {/* No gap between the stations, so their rail segments meet and read as
            one line; the breathing room is inside each one instead. Below lg it
            becomes a scroller rather than stacking, because the whole point is
            that time runs sideways. */}
        <div className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {items.map((t, i) => {
            const colour = INDUSTRY_PAINT[i % INDUSTRY_PAINT.length];
            const label = labelOn(colour);
            const grew = GROWTH[i];

            return (
              <Reveal key={t.year + t.title} delay={i * 0.09}>
                <div className="w-[76vw] shrink-0 snap-center sm:w-[46vw] lg:w-auto">
                  {/* The figure sits above the rail and climbs as it goes, so
                      the row reads as a rising line rather than four labels. */}
                  <div className="flex h-24 items-end" style={{ paddingBottom: i * 16 }}>
                    {grew !== undefined && (
                      <span
                        className="inline-flex items-baseline gap-1.5 rounded-full px-4 py-2 text-sm font-bold leading-none"
                        style={{ background: colour, color: label }}
                      >
                        <span className="font-display text-lg ltr-nums">{localeDigits(locale, grew)}</span>
                        {UNIT[locale] ?? UNIT.fa}
                      </span>
                    )}
                  </div>

                  {/* The rail. One segment per station, in that station's
                      colour; at lg the four meet edge to edge. */}
                  <div className="relative h-[3px] w-full" style={{ background: colour }}>
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-background"
                      style={{ background: colour }}
                    />
                  </div>

                  <div className="pe-8 pt-7">
                    <span className="font-display text-2xl font-extrabold tracking-tight text-foreground ltr-nums">
                      {localeDigits(locale, t.year)}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-foreground">{t.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{t.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
