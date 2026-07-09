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
    subtitle: project.subtitle ?? "",
    category: project.category,
    cover: project.cover,
    poster: project.poster ?? "",
    heroVideo: project.heroVideo ?? "",
    gallery: parseArr<string>(project.gallery),
    year: project.year,
    location: project.location ?? "",
    accent: project.accent,
    featured: project.featured,
    published: project.published,
    tags: parseArr<string>(project.tags),
    goal: project.goal ?? "",
    problem: project.problem ?? "",
    idea: project.idea ?? "",
    production: project.production ?? "",
    marketing: project.marketing ?? "",
    result: project.result ?? "",
    metrics: parseArr<Metric>(project.metrics),
    beforeImage: project.beforeImage ?? "",
    afterImage: project.afterImage ?? "",
    credits: parseArr<Credit>(project.credits),
    clientId: project.clientId ?? "",
    serviceSlugs: project.services.map((s) => s.slug),
    industrySlugs: project.industries.map((i) => i.slug),
    seo: {
      metaTitle: project.seo?.metaTitle ?? "",
      metaDescription: project.seo?.metaDescription ?? "",
      ogImage: project.seo?.ogImage ?? "",
      keywords: parseArr<string>(project.seo?.keywords),
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
