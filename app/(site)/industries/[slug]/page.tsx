import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Check } from "lucide-react";
import { db } from "@/lib/db";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { ProjectCard } from "@/components/work/ProjectCard";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { WaveList } from "@/components/ui/WaveList";
import { buildMetadata } from "@/lib/seo";
import { tr, trArr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Locale } from "@/types";

const COPY: Record<Locale, {
  metaTitlePrefix: string;
  approachTitle: (t: string) => string;
  portfolioTitle: (t: string) => string;
  ctaHeading: (t: string) => string;
  ctaBody: string;
  ctaButton: string;
}> = {
  fa: {
    metaTitlePrefix: "صنعت",
    approachTitle: (t) => `چگونه به صنعت ${t} نگاه می‌کنیم`,
    portfolioTitle: (t) => `پروژه‌های صنعت ${t}`,
    ctaHeading: (t) => `برند شما در صنعت ${t} فعال است؟`,
    ctaBody: "بیایید درباره‌ی رشد برند شما گفت‌وگو کنیم.",
    ctaButton: "شروع گفت‌وگو",
  },
  en: {
    metaTitlePrefix: "Industry",
    approachTitle: (t) => `How we approach the ${t} industry`,
    portfolioTitle: (t) => `${t} industry projects`,
    ctaHeading: (t) => `Is your brand active in ${t}?`,
    ctaBody: "Let's talk about growing your brand.",
    ctaButton: "Start the conversation",
  },
  ar: {
    metaTitlePrefix: "صناعة",
    approachTitle: (t) => `كيف ننظر إلى صناعة ${t}`,
    portfolioTitle: (t) => `مشاريع صناعة ${t}`,
    ctaHeading: (t) => `هل علامتك التجارية نشطة في صناعة ${t}؟`,
    ctaBody: "لنتحدث عن تنمية علامتك التجارية.",
    ctaButton: "ابدأ الحوار",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const ind = await db.industry.findUnique({ where: { slug } });
  if (!ind) return {};
  const title = tr(locale, ind.title, ind.titleEn, ind.titleAr);
  return buildMetadata({
    title: tr(locale, ind.metaTitle ?? "", ind.metaTitleEn, ind.metaTitleAr) || `${COPY[locale].metaTitlePrefix} ${title}`,
    description: tr(locale, ind.metaDescription ?? "", ind.metaDescriptionEn, ind.metaDescriptionAr) || tr(locale, ind.excerpt, ind.excerptEn, ind.excerptAr),
    path: `/industries/${ind.slug}`,
    image: ind.cover || undefined,
    locale,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const ind = await db.industry.findUnique({
    where: { slug },
    include: {
      projects: { where: { published: true }, take: 6, include: { client: { select: { name: true, nameEn: true } } } },
    },
  });
  if (!ind) notFound();
  const approach = trArr<string>(locale, ind.approach, ind.approachEn, ind.approachAr);
  const title = tr(locale, ind.title, ind.titleEn, ind.titleAr);
  const description = tr(locale, ind.description, ind.descriptionEn, ind.descriptionAr);
  const c = COPY[locale];

  return (
    <>
      <IndustryHero title={title} description={description} cover={ind.cover} heroVideo={ind.heroVideo} locale={locale} />

      {/* approach — on the wave, over the paint.
          ------------------------------------------------------------
          Each line is written in two halves: what is actually hard about this
          industry, then what we do about it. They are split on the first
          Persian semicolon, and a line without one simply renders whole — so
          editing these by hand in the admin can shape the emphasis but cannot
          break the section. */}
      {approach.length > 0 && (
        <WaveList
          items={approach.map((a) => {
            const at = a.indexOf("؛ ");
            return at === -1
              ? { lead: a }
              : { lead: a.slice(0, at + 1), rest: a.slice(at + 2) };
          })}
          eyebrow={ui(locale).industryApproachEyebrow}
          heading={c.approachTitle(title)}
          locale={locale}
        />
      )}

      {/* portfolio */}
      {ind.projects.length > 0 && (
        <Section className="bg-background-2">
          <Container>
            <SectionHeading eyebrow={ui(locale).portfolioEyebrow} title={c.portfolioTitle(title)} className="mb-10" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ind.projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
            </div>
          </Container>
        </Section>
      )}

      {/* cta */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-card-border bg-surface-2 p-16 text-center">
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl">{c.ctaHeading(title)}</h2>
              <p className="mx-auto mt-4 max-w-xl text-foreground-muted">{c.ctaBody}</p>
              <Link href="/contact" className="liquid liquid-raised mt-10 inline-flex items-center gap-2 rounded-full px-9 py-4 font-semibold">
                <span className="inline-flex items-center gap-2">
                  {c.ctaButton} <ArrowUpLeft className="h-5 w-5" />
                </span>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
