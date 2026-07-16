import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { WorkFilter } from "@/components/work/WorkFilter";
import { getAllProjects } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

const COPY: Record<Locale, { title: string; highlight: string; description: string; metaDescription: string }> = {
  fa: {
    title: "کارهایی که",
    highlight: "تأثیر گذاشتند",
    description: "هر پروژه یک داستان است؛ از چالش برند تا نتیجه‌ای که با عدد اندازه‌گیری می‌شود.",
    metaDescription: "مجموعه‌ای از کیس‌استادی‌ها و پروژه‌های شاخص آرکا؛ از برندفیلم سینمایی تا کمپین‌های دیجیتال.",
  },
  en: {
    title: "Work that",
    highlight: "made an impact",
    description: "Every project is a story — from a brand's challenge to a result measured in numbers.",
    metaDescription: "A collection of ARKA's case studies and flagship projects — from cinematic brand films to digital campaigns.",
  },
  ar: {
    title: "أعمال",
    highlight: "تركت أثرًا",
    description: "كل مشروع قصة؛ من تحدي العلامة التجارية إلى نتيجة تُقاس بالأرقام.",
    metaDescription: "مجموعة من دراسات الحالة والمشاريع الرائدة لآركا؛ من أفلام العلامات السينمائية إلى الحملات الرقمية.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ title: ui(locale).navWork, path: "/work", description: COPY[locale].metaDescription });
}

export default async function WorkPage() {
  const locale = await getLocale();
  const projects = await getAllProjects();
  const c = COPY[locale];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: ui(locale).navHome, path: "/" },
            { name: ui(locale).navWork, path: "/work" },
          ])),
        }}
      />
      <PageHero
        eyebrow={ui(locale).portfolioEyebrow}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navWork }]}
        title={<>{c.title} <span className="text-gradient">{c.highlight}</span></>}
        description={c.description}
      />
      <section className="pb-24">
        <WorkFilter projects={projects} locale={locale} />
      </section>
    </>
  );
}
