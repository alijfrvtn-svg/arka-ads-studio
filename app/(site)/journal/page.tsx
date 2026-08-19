import type { Metadata } from "next";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalFilter } from "@/components/journal/JournalFilter";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { tr, ui } from "@/lib/i18n";
import type { Locale } from "@/types";
import { getCategories } from "@/lib/queries";

const COPY: Record<Locale, { title: string; highlight: string; description: string; metaDescription: string }> = {
  fa: {
    title: "بینش و",
    highlight: "الهام",
    description: "آنچه در آرکا می‌آموزیم را با شما به اشتراک می‌گذاریم.",
    metaDescription: "بینش، ترند و مطالعه موردی از تیم آرکا؛ درباره برندینگ، پروداکشن و دیجیتال مارکتینگ.",
  },
  en: {
    title: "Insight and",
    highlight: "inspiration",
    description: "Sharing what we learn at ARKA with you.",
    metaDescription: "Insights, trends and case studies from the ARKA team — on branding, production and digital marketing.",
  },
  ar: {
    title: "رؤى و",
    highlight: "إلهام",
    description: "نشارككم ما نتعلمه في آركا.",
    metaDescription: "رؤى واتجاهات ودراسات حالة من فريق آركا؛ حول العلامة التجارية والإنتاج والتسويق الرقمي.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ title: ui(locale).navJournal, path: "/journal", description: COPY[locale].metaDescription, locale });
}

export default async function JournalPage() {
  const locale = await getLocale();
  const [posts, categories] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      include: { author: { select: { name: true, avatar: true } } },
    }),
    getCategories("POST"),
  ]);
  const c = COPY[locale];

  // The deck is the five most-read, ranked by views rather than by taste —
  // the top one has 833 against 12-25 for the rest, so the order is not a
  // close call. The grid below still lists all nine: the deck is a spotlight,
  // not a replacement for the archive.
  const top = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);

  // The taxonomy table has no POST rows, so the journal's categories are the
  // distinct strings the posts carry — the same list JournalFilter falls back
  // to. Order of first appearance, so a chip colour cannot move when a post is
  // added.
  const catOrder = Array.from(new Set(posts.map((p) => p.category)));

  // Both ends of the promise, read off the posts rather than written in.
  const minutes = posts.map((p) => p.readingMinutes).filter((m) => m > 0);
  const minMinutes = minutes.length ? Math.min(...minutes) : 0;
  const maxMinutes = minutes.length ? Math.max(...minutes) : 0;

  return (
    <>
      <JournalHero
        eyebrow={ui(locale).navJournal}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navJournal }]}
        title={<>{c.title} <span className="text-gradient">{c.highlight}</span></>}
        description={c.description}
        posts={top.map((p) => ({
          slug: p.slug,
          title: tr(locale, p.title, p.titleEn, p.titleAr),
          excerpt: tr(locale, p.excerpt, p.excerptEn, p.excerptAr),
          cover: p.cover,
          category: tr(locale, p.category, p.categoryEn, p.categoryAr),
          readingMinutes: p.readingMinutes,
          colourIndex: Math.max(0, catOrder.indexOf(p.category)),
        }))}
        minMinutes={minMinutes}
        maxMinutes={maxMinutes}
        locale={locale}
      />
      <section className="pb-24">
        <JournalFilter posts={posts} categories={categories} locale={locale} />
      </section>
    </>
  );
}
