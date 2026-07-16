import { Hero } from "@/components/home/Hero";
import { TrustMarquee } from "@/components/home/TrustMarquee";
import { Departments } from "@/components/home/Departments";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Workflow } from "@/components/home/Workflow";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { FinalCTA } from "@/components/home/FinalCTA";
import {
  getClients,
  getFeaturedProjects,
  getFeaturedTestimonials,
  getStats,
  getHomePage,
  getContactPage,
} from "@/lib/queries";
import { getLocale } from "@/lib/get-locale";
import { tr } from "@/lib/i18n";

export default async function HomePage() {
  const locale = await getLocale();
  const [projects, stats, testimonials, clients, content, contact] = await Promise.all([
    getFeaturedProjects(7),
    getStats(),
    getFeaturedTestimonials(),
    getClients(),
    getHomePage(locale),
    getContactPage(locale),
  ]);

  const statData = stats.map((s) => ({ label: tr(locale, s.label, s.labelEn, s.labelAr), value: s.value, suffix: s.suffix }));
  const testimonialData = testimonials.map((t) => ({
    id: t.id,
    author: t.author,
    role: tr(locale, t.role ?? "", t.roleEn, t.roleAr) || null,
    company: t.company,
    avatar: t.avatar,
    quote: tr(locale, t.quote, t.quoteEn, t.quoteAr),
    rating: t.rating,
  }));

  return (
    <>
      <Hero stats={statData} content={content} locale={locale} />
      <TrustMarquee clients={clients.map((c) => ({ name: tr(locale, c.name, c.nameEn, null) }))} caption={content.trustCaption} />
      <Departments content={content} locale={locale} />
      <FeaturedWork projects={projects} content={content} locale={locale} />
      <Workflow content={content} locale={locale} />
      <StatsBar stats={statData} locale={locale} />
      <Testimonials items={testimonialData} content={content} locale={locale} />
      <FinalCTA content={content} phone={contact.phone} phoneDisplay={contact.phoneDisplay} />
    </>
  );
}
