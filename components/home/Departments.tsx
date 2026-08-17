import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { DEPARTMENT_POSTER } from "@/lib/constants";
import { tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { CategoryItem, HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

/**
 * The four departments, as posters.
 *
 * Each card is the department's own 4:5 artwork with the copy set into the
 * bottom of it, rather than a white tile with an icon on top — the artwork is
 * the loudest thing in this section and the card is built around it.
 *
 * Legibility is the whole design problem here: the posters are dense, fully
 * saturated collages, so white type laid straight onto one would be unreadable
 * over a yellow panel and fine over a navy one, unpredictably, per card. The
 * `.poster-scrim` gradient (globals.css) solves it by owning the bottom of the
 * card outright — see that rule for the contrast maths. The top half is left
 * almost clear so the poster still reads as a poster.
 */
export function Departments({
  content,
  departments,
  locale = "fa",
}: {
  content: HomeContent;
  // Editable in /admin/categories (kind DEPARTMENT); was a hardcoded list.
  departments: CategoryItem[];
  locale?: Locale;
}) {
  return (
    <Section id="departments">
      {/* Wider than the site container: these are posters, not paragraphs. */}
      <div className="container-wide">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.departmentsEyebrow}
            title={<HighlightedTitle title={content.departmentsHeading} highlight={content.departmentsHeadingHighlight} />}
            description={content.departmentsDescription}
          />
        </div>

        {/* Two across on tablet rather than four: at four, a 4:5 poster on a
            768px screen is ~170px wide and its artwork turns to mush. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {departments.map((d, i) => {
            // `slug` is lowercase; the poster map is keyed by department id.
            const poster = DEPARTMENT_POSTER[d.slug.toUpperCase()];
            return (
              <Reveal key={d.slug} delay={i * 0.08}>
                <Link
                  href="/services"
                  className={cn(
                    "group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[1.75rem] transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5",
                    poster
                      ? "hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_36px_70px_-30px_rgba(0,0,0,0.55)]"
                      : "border border-card-border bg-surface hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-32px_rgba(0,0,0,0.35)]",
                  )}
                >
                  {poster && (
                    <>
                      <Image
                        src={poster}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        // Slow, small push-in. Big enough to feel alive, small
                        // enough that the poster's own composition survives.
                        className="object-cover transition-transform duration-[1400ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.06]"
                      />
                      <div className="poster-scrim absolute inset-0" aria-hidden />
                    </>
                  )}

                  {/* Glass on media, never white-on-white: the chip has to sit
                      on whatever corner of the poster it lands on. */}
                  <span
                    className={cn(
                      "absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-[15px]",
                      poster ? "glass-onmedia" : "liquid-clear text-foreground",
                    )}
                  >
                    <Icon name={d.icon} className="h-5 w-5" />
                  </span>

                  <div className={cn("relative p-7", !poster && "flex flex-1 flex-col justify-end")}>
                    <h3
                      className={cn(
                        "font-display text-[1.35rem] font-bold leading-snug tracking-tight",
                        poster ? "text-white" : "text-foreground",
                      )}
                    >
                      {tr(locale, d.title, d.titleEn, d.titleAr)}
                    </h3>
                    {locale === "fa" && d.titleEn && (
                      <p
                        className={cn(
                          "mt-1.5 text-[0.65rem] uppercase tracking-[0.25em]",
                          poster ? "text-white/65" : "text-foreground-faint",
                        )}
                      >
                        {d.titleEn}
                      </p>
                    )}
                    <p
                      className={cn(
                        "mt-4 text-sm leading-relaxed",
                        poster ? "text-white/85" : "text-foreground-muted",
                      )}
                    >
                      {tr(locale, d.desc ?? "", d.descEn, d.descAr)}
                    </p>
                    <span
                      className={cn(
                        "mt-6 inline-flex items-center gap-1.5 text-sm font-semibold",
                        poster ? "text-white" : "text-foreground",
                      )}
                    >
                      {content.departmentsCtaLabel}
                      <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
