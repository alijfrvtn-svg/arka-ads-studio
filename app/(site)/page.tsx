import { HeroShowcase } from "@/components/home/HeroShowcase";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { Departments } from "@/components/home/Departments";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Workflow } from "@/components/home/Workflow";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { IndustriesAccordion } from "@/components/home/IndustriesAccordion";
import {
  getClients,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getStats,
  getHomePage,
  getCategories,
  getHeroShowcase,
  getIndustries,
} from "@/lib/queries";
import { getLocale } from "@/lib/get-locale";
import { tr, ui } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ path: "/", locale });
}

export default async function HomePage() {
  const locale = await getLocale();
  const [projects, stats, testimonials, clients, content, departments, showcase, industries] = await Promise.all([
    getFeaturedProjects(7),
    getStats(),
    getFeaturedTestimonials(),
    getClients(),
    getHomePage(locale),
    getCategories("DEPARTMENT"),
    getHeroShowcase(locale),
    getIndustries(),
  ]);

  const t = ui(locale);
  const statData = stats.map((s) => ({ label: tr(locale, s.label, s.labelEn, s.labelAr), value: s.value, suffix: s.suffix }));
  const testimonialData = testimonials.map((t) => ({
    id: t.id,
    author: t.author,
    role: tr(locale, t.role ?? "", t.roleEn, t.roleAr) || null,
    company: tr(locale, t.company ?? "", t.client?.nameEn, t.client?.nameEn) || null,
    avatar: t.avatar,
    quote: tr(locale, t.quote, t.quoteEn, t.quoteAr),
    rating: t.rating,
  }));

  return (
    <>
      <HeroShowcase slides={showcase} locale={locale} />
      <TrustMarquee clients={clients.map((c) => ({ name: tr(locale, c.name, c.nameEn, c.nameEn) }))} caption={content.trustCaption} />
      <Departments content={content} departments={departments} locale={locale} />
      <FeaturedWork projects={projects} content={content} locale={locale} />
      <Workflow content={content} locale={locale} />
      <StatsBar stats={statData} locale={locale} />
      <Testimonials items={testimonialData} content={content} locale={locale} />
      {/* Replaced the closing CTA here (it still runs on /about). The footer
          already carries a CTA strip on every page, so the last thing on the
          homepage is better spent answering "do you work in my field". */}
      <IndustriesAccordion
        industries={industries}
        eyebrow={t.industriesEyebrow}
        heading={t.industriesHeading}
        description={t.industriesDescription}
        locale={locale}
      />
    </>
  );
}
