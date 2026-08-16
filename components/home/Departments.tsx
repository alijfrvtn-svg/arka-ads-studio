import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { tr } from "@/lib/i18n";
import type { CategoryItem, HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

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
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.departmentsEyebrow}
            title={<HighlightedTitle title={content.departmentsHeading} highlight={content.departmentsHeadingHighlight} />}
            description={content.departmentsDescription}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {departments.map((d, i) => (
            <Reveal key={d.slug} delay={i * 0.08}>
              {/* A card used to announce itself with a coloured glow on hover.
                  Now it lifts and casts a real shadow instead — the same
                  "this is interactive" signal, told with light. */}
              <Link
                href="/services"
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-card-border bg-surface p-8 transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-32px_rgba(0,0,0,0.35)]"
              >
                <div className="liquid-clear mb-7 grid h-14 w-14 place-items-center rounded-[15px] text-foreground">
                  <Icon name={d.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground">{tr(locale, d.title, d.titleEn, d.titleAr)}</h3>
                {locale === "fa" && d.titleEn && (
                  <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-foreground-faint">{d.titleEn}</p>
                )}
                <p className="mt-5 flex-1 text-sm leading-relaxed text-foreground-muted">{tr(locale, d.desc ?? "", d.descEn, d.descAr)}</p>
                <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {content.departmentsCtaLabel}
                  <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
