import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { parseArr } from "@/lib/utils";
import type { ProjectInput } from "@/lib/actions";
import type { Credit, Metric } from "@/types";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, clients, services, industries] = await Promise.all([
    db.project.findUnique({
      where: { id },
      include: { services: { select: { slug: true } }, industries: { select: { slug: true } }, seo: true },
    }),
    db.client.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.service.findMany({ select: { slug: true, title: true }, orderBy: { order: "asc" } }),
    db.industry.findMany({ select: { slug: true, title: true }, orderBy: { order: "asc" } }),
  ]);

  if (!project) notFound();

  const initial: ProjectInput = {
    id: project.id,
    slug: project.slug,
    title: project.title,
    titleEn: project.titleEn ?? "",
    titleAr: project.titleAr ?? "",
    subtitle: project.subtitle ?? "",
    subtitleEn: project.subtitleEn ?? "",
    subtitleAr: project.subtitleAr ?? "",
    category: project.category,
    categoryEn: project.categoryEn ?? "",
    categoryAr: project.categoryAr ?? "",
    cover: project.cover,
    poster: project.poster ?? "",
    heroVideo: project.heroVideo ?? "",
    gallery: parseArr<string>(project.gallery),
    year: project.year,
    location: project.location ?? "",
    locationEn: project.locationEn ?? "",
    locationAr: project.locationAr ?? "",
    accent: project.accent,
    featured: project.featured,
    published: project.published,
    tags: parseArr<string>(project.tags),
    tagsEn: parseArr<string>(project.tagsEn),
    tagsAr: parseArr<string>(project.tagsAr),
    goal: project.goal ?? "",
    goalEn: project.goalEn ?? "",
    goalAr: project.goalAr ?? "",
    problem: project.problem ?? "",
    problemEn: project.problemEn ?? "",
    problemAr: project.problemAr ?? "",
    idea: project.idea ?? "",
    ideaEn: project.ideaEn ?? "",
    ideaAr: project.ideaAr ?? "",
    production: project.production ?? "",
    productionEn: project.productionEn ?? "",
    productionAr: project.productionAr ?? "",
    marketing: project.marketing ?? "",
    marketingEn: project.marketingEn ?? "",
    marketingAr: project.marketingAr ?? "",
    result: project.result ?? "",
    resultEn: project.resultEn ?? "",
    resultAr: project.resultAr ?? "",
    metrics: parseArr<Metric>(project.metrics),
    metricsEn: parseArr<Metric>(project.metricsEn),
    metricsAr: parseArr<Metric>(project.metricsAr),
    beforeImage: project.beforeImage ?? "",
    afterImage: project.afterImage ?? "",
    credits: parseArr<Credit>(project.credits),
    creditsEn: parseArr<Credit>(project.creditsEn),
    creditsAr: parseArr<Credit>(project.creditsAr),
    clientId: project.clientId ?? "",
    serviceSlugs: project.services.map((s) => s.slug),
    industrySlugs: project.industries.map((i) => i.slug),
    seo: {
      metaTitle: project.seo?.metaTitle ?? "",
      metaTitleEn: project.seo?.metaTitleEn ?? "",
      metaTitleAr: project.seo?.metaTitleAr ?? "",
      metaDescription: project.seo?.metaDescription ?? "",
      metaDescriptionEn: project.seo?.metaDescriptionEn ?? "",
      metaDescriptionAr: project.seo?.metaDescriptionAr ?? "",
      ogImage: project.seo?.ogImage ?? "",
      keywords: parseArr<string>(project.seo?.keywords),
      keywordsEn: parseArr<string>(project.seo?.keywordsEn),
      keywordsAr: parseArr<string>(project.seo?.keywordsAr),
    },
  };

  return (
    <ProjectEditor
      initial={initial}
      clients={clients}
      services={services.map((s) => ({ value: s.slug, label: s.title }))}
      industries={industries.map((i) => ({ value: i.slug, label: i.title }))}
    />
  );
}
