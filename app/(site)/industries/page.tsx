import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container } from "@/components/ui/Section";
import { IndustryShowcase } from "@/components/industries/IndustryShowcase";
import { getIndustries } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

const COPY: Record<Locale, { title: string; highlight: string; description: string; metaDescription: string }> = {
  fa: {
    title: "تخصص در",
    highlight: "هر صنعت",
    description: "نشانگر را روی هر صنعت ببرید و رویکرد اختصاصی ما را کشف کنید.",
    metaDescription: "راهکارهای خلاق و دیجیتال اختصاصی آرکا برای ۱۲ صنعت؛ از پزشکی و خودرو تا فشن و فین‌تک.",
  },
  en: {
    title: "Expertise in",
    highlight: "every industry",
    description: "Hover over an industry to discover our dedicated approach.",
    metaDescription: "ARKA's creative and digital solutions across 12 industries — from medical and automotive to fashion and fintech.",
  },
  ar: {
    title: "خبرة في",
    highlight: "كل صناعة",
    description: "مرّر المؤشر فوق أي صناعة لاكتشاف نهجنا المخصص لها.",
    metaDescription: "حلول آركا الإبداعية والرقمية المخصصة لـ 12 صناعة؛ من الطب والسيارات إلى الموضة والتكنولوجيا المالية.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({
    title: ui(locale).navIndustries,
    path: "/industries",
    description: COPY[locale].metaDescription,
  });
}

export default async function IndustriesPage() {
  const locale = await getLocale();
  const industries = await getIndustries();
  const c = COPY[locale];
  return (
    <>
      <PageHero
        eyebrow={ui(locale).navIndustries}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navIndustries }]}
        title={<>{c.title} <span className="text-gradient">{c.highlight}</span></>}
        description={c.description}
      />
      <Section>
        <Container>
          <IndustryShowcase industries={industries} locale={locale} />
        </Container>
      </Section>
    </>
  );
}
