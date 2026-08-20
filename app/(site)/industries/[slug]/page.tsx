import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SERVICE_CARD_IMAGE } from "@/lib/constants";
import { IndustryHero } from "@/components/industries/IndustryHero";
import { WaveList } from "@/components/ui/WaveList";
import { IndustryRelated } from "@/components/industries/IndustryRelated";
import { buildMetadata } from "@/lib/seo";
import { tr, trArr } from "@/lib/i18n";
import { localeDigits } from "@/lib/utils";
import { getLocale } from "@/lib/get-locale";
import type { Locale } from "@/types";
import { getUi } from "@/lib/site-copy";

const COPY: Record<Locale, {
  metaTitlePrefix: string;
  approachTitle: (t: string) => string;
  articlesEyebrow: string;
  articlesTitle: (t: string) => string;
  portfolioTitle: (t: string) => string;
  sampleLabel: string;
  sampleArticle: (n: string) => string;
  sampleArticleMeta: string;
  sampleWork: (n: string) => string;
  sampleWorkMeta: string;
}> = {
  fa: {
    metaTitlePrefix: "صنعت",
    approachTitle: (t) => `چگونه به صنعت ${t} نگاه می‌کنیم`,
    articlesEyebrow: "ژورنال",
    articlesTitle: (t) => `مقاله‌های صنعت ${t}`,
    portfolioTitle: (t) => `پروژه‌های صنعت ${t}`,
    sampleLabel: "نمونه",
    sampleArticle: (n) => `عنوان مقالهٔ ${n} در این صنعت`,
    sampleArticleMeta: "این کارت با انتشار مقاله و تیک‌زدن این صنعت پر می‌شود",
    sampleWork: (n) => `نمونه‌کار ${n} در این صنعت`,
    sampleWorkMeta: "این کارت با انتشار پروژه و انتخاب این صنعت پر می‌شود",
  },
  en: {
    metaTitlePrefix: "Industry",
    approachTitle: (t) => `How we approach the ${t} industry`,
    articlesEyebrow: "Journal",
    articlesTitle: (t) => `${t} industry articles`,
    portfolioTitle: (t) => `${t} industry projects`,
    sampleLabel: "Sample",
    sampleArticle: (n) => `Article ${n} title for this industry`,
    sampleArticleMeta: "Fills in once an article is published and tagged to this industry",
    sampleWork: (n) => `Project ${n} in this industry`,
    sampleWorkMeta: "Fills in once a project is published and tagged to this industry",
  },
  ar: {
    metaTitlePrefix: "صناعة",
    approachTitle: (t) => `كيف ننظر إلى صناعة ${t}`,
    articlesEyebrow: "المدونة",
    articlesTitle: (t) => `مقالات صناعة ${t}`,
    portfolioTitle: (t) => `مشاريع صناعة ${t}`,
    sampleLabel: "نموذج",
    sampleArticle: (n) => `عنوان المقال ${n} في هذه الصناعة`,
    sampleArticleMeta: "يمتلئ عند نشر مقال وربطه بهذه الصناعة",
    sampleWork: (n) => `مشروع ${n} في هذه الصناعة`,
    sampleWorkMeta: "يمتلئ عند نشر مشروع وربطه بهذه الصناعة",
  },
};

/**
 * Artwork for the placeholder cards.
 *
 * The service-card set is 28 real, already-optimised files the site is serving
 * anyway, so a placeholder costs nothing extra and looks like the rest of the
 * work rather than like a grey box. Picked from the slug so a given industry
 * always shows the same three, and offset so its articles and its projects do
 * not show the same pictures.
 */
const SAMPLE_ART = Object.values(SERVICE_CARD_IMAGE);

function samples(slug: string, offset: number, n = 3): string[] {
  let seed = 0;
  for (let i = 0; i < slug.length; i++) seed = (seed * 31 + slug.charCodeAt(i)) % 9973;
  return Array.from({ length: n }, (_, i) => SAMPLE_ART[(seed + offset + i * 5) % SAMPLE_ART.length]);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  // Interface strings, with anything edited in the panel applied. Cached per
  // request, so every component asking for it costs one query between them.
  const t = await getUi(locale);
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
  const t = await getUi(locale);
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
          eyebrow={t.industryApproachEyebrow}
          heading={c.approachTitle(title)}
          locale={locale}
        />
      )}

      {/* Related reading.
          ------------------------------------------------------------
          Placeholders for now, by request. There is no Post-to-Industry
          relation yet, so nothing can be ticked against an industry — until
          there is, every industry shows the same three sample cards, and they
          are marked as samples rather than dressed up as articles. */}
      <IndustryRelated
        eyebrow={c.articlesEyebrow}
        heading={c.articlesTitle(title)}
        items={samples(ind.slug, 0).map((image, i) => ({
          key: `post-${i}`,
          title: c.sampleArticle(localeDigits(locale, i + 1)),
          meta: c.sampleArticleMeta,
          image,
        }))}
        sampleLabel={c.sampleLabel}
      />

      {/* Related work. Real projects when this industry has any — the relation
          for those already exists — and the same placeholders when it does
          not, which is currently every industry, since nothing is published. */}
      <IndustryRelated
        className="bg-background-2"
        eyebrow={t.portfolioEyebrow}
        heading={c.portfolioTitle(title)}
        items={
          ind.projects.length
            ? ind.projects.map((p) => ({
                key: p.id,
                title: tr(locale, p.title, p.titleEn, p.titleAr),
                meta: p.client?.name ?? tr(locale, p.category, p.categoryEn, p.categoryAr),
                image: p.cover,
                href: `/work/${p.slug}`,
              }))
            : samples(ind.slug, 3).map((image, i) => ({
                key: `work-${i}`,
                title: c.sampleWork(localeDigits(locale, i + 1)),
                meta: c.sampleWorkMeta,
                image,
              }))
        }
        sampleLabel={c.sampleLabel}
      />

    </>
  );
}
