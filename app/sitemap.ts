import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const [projects, services, industries, posts] = await Promise.all([
    db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.industry.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const routes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/work`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/journal`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  return [
    ...routes,
    ...projects.map((p) => ({ url: `${base}/work/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt, priority: 0.7 })),
    ...industries.map((i) => ({ url: `${base}/industries/${i.slug}`, lastModified: i.updatedAt, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${base}/journal/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
  ];
}
