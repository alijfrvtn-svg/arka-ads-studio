import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Check } from "lucide-react";
import { db } from "@/lib/db";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { IndustryHero } from "@/components/industries/IndustryHero";
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

      {/* approach */}
      {approach.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow={ui(locale).industryApproachEyebrow} title={c.approachTitle(title)} className="mb-12 max-w-3xl" />
            <div className="grid gap-4 md:grid-cols-2">
              {approach.map((a, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-4 rounded-2xl border border-card-border bg-surface p-6">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary">{i + 1}</span>
                    <p className="text-foreground">{a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* portfolio */}
      {ind.projects.length > 0 && (
        <Section className="bg-background-2">
          <Container>
            <SectionHeading eyebrow={ui(locale).portfolioEyebrow} title={c.portfolioTitle(title)} className="mb-10" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ind.projects.map((p) => <ProjectCard key={p.id} project={p} locale={locale} />)}
            </div>
          </Container>
        </Section>
      )}

      {/* cta */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-card-border p-12 text-center">
            <div className="reel-bg absolute inset-0 opacity-15" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">{c.ctaHeading(title)}</h2>
              <p className="mx-auto mt-3 max-w-xl text-foreground-muted">{c.ctaBody}</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
                {c.ctaButton} <ArrowUpLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
