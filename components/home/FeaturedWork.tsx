import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { HomeContent } from "@/lib/queries";
import type { Locale } from "@/types";

const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[3/4]"];

interface P {
  slug: string;
  title: string;
  titleEn?: string | null;
  titleAr?: string | null;
  category: string;
  categoryEn?: string | null;
  categoryAr?: string | null;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  status?: string;
  tags?: string;
  tagsEn?: string | null;
  tagsAr?: string | null;
  client?: { name: string } | null;
}

export function FeaturedWork({ projects, content, locale = "fa" }: { projects: P[]; content: HomeContent; locale?: Locale }) {
  return (
    <Section id="work" className="bg-background-2">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.featuredEyebrow}
            title={<HighlightedTitle title={content.featuredHeading} highlight={content.featuredHeadingHighlight} />}
            description={content.featuredDescription}
          />
          <Reveal>
            <Link
              href="/work"
              className="liquid liquid-clear group inline-flex shrink-0 items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-foreground"
            >
              <span className="inline-flex items-center gap-2">
                {content.featuredCtaLabel}
                <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07} className="break-inside-avoid">
              <ProjectCard project={p} aspect={ASPECTS[i % ASPECTS.length]} priority={i < 3} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
