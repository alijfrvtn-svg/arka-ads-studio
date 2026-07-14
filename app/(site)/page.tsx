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
} from "@/lib/queries";

export default async function HomePage() {
  const [projects, stats, testimonials, clients] = await Promise.all([
    getFeaturedProjects(7),
    getStats(),
    getFeaturedTestimonials(),
    getClients(),
  ]);

  const statData = stats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix }));

  return (
    <>
      <Hero />
      <TrustMarquee clients={clients.map((c) => ({ name: c.name, nameEn: c.nameEn }))} />
      <Departments />
      <FeaturedWork projects={projects} />
      <Workflow />
      <StatsBar stats={statData} />
      <Testimonials items={testimonials} />
      <FinalCTA />
    </>
  );
}
