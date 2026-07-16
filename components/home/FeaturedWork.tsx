import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { HomeContent } from "@/lib/queries";

const ASPECTS = ["aspect-[4/5]", "aspect-[3/4]", "aspect-[4/3]", "aspect-[1/1]", "aspect-[4/5]", "aspect-[3/4]"];

interface P {
  slug: string;
  title: string;
  category: string;
  cover: string;
  accent?: string;
  heroVideo?: string | null;
  tags?: string;
  client?: { name: string } | null;
}

export function FeaturedWork({ projects, content }: { projects: P[]; content: HomeContent }) {
  return (
    <Section id="work" className="bg-background-2">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={content.featuredEyebrow}
            title={<HighlightedTitle title={content.featuredHeading} highlight={content.featuredHeadingHighlight} />}
            description={content.featuredDescription}
          />
          <Reveal>
            <Link
              href="/work"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-card-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {content.featuredCtaLabel}
              <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </Reveal>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07} className="break-inside-avoid">
              <ProjectCard project={p} aspect={ASPECTS[i % ASPECTS.length]} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
