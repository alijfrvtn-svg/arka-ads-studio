import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JournalFilter } from "@/components/journal/JournalFilter";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

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
  return buildMetadata({ title: ui(locale).navJournal, path: "/journal", description: COPY[locale].metaDescription });
}

export default async function JournalPage() {
  const locale = await getLocale();
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: { author: { select: { name: true, avatar: true } } },
  });
  const c = COPY[locale];

  return (
    <>
      <PageHero
        eyebrow={ui(locale).navJournal}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navJournal }]}
        title={<>{c.title} <span className="text-gradient">{c.highlight}</span></>}
        description={c.description}
      />
      <section className="pb-24">
        <JournalFilter posts={posts} locale={locale} />
      </section>
    </>
  );
}
