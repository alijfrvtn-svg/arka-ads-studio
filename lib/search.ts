import { db } from "./db";
import { tr } from "./i18n";
import type { Locale } from "@/types";

/**
 * Cross-content search shared by the public site bar and the admin palette.
 *
 * Persian has no stemming here on purpose — a `contains` match against the
 * fields a visitor would actually type is predictable and needs no extension,
 * and this content set is small enough that it stays fast. If the corpus grows
 * past a few thousand rows, swap the per-model queries for a Postgres tsvector
 * index; the shape of `SearchHit` is what callers depend on, not the mechanism.
 */

export interface SearchHit {
  id: string;
  type: "project" | "post" | "service" | "industry" | "client" | "lead";
  title: string;
  subtitle?: string | null;
  href: string;
  image?: string | null;
  badge?: string | null;
}

const TYPE_LABEL: Record<SearchHit["type"], string> = {
  project: "نمونه‌کار",
  post: "مقاله",
  service: "خدمت",
  industry: "صنعت",
  client: "مشتری",
  lead: "سرنخ",
};

export const searchTypeLabel = (t: SearchHit["type"]) => TYPE_LABEL[t];

/** Persian users type both ی/ي and ک/ك; normalising both sides means a query
 *  copied from Word still matches content typed on a phone keyboard. */
export function normalize(s: string) {
  return s
    .replace(/[يی]/g, "ی")
    .replace(/[كک]/g, "ک")
    .replace(/‌/g, " ")
    .trim();
}

const like = (q: string) => ({ contains: q, mode: "insensitive" as const });

/** Published content only — this is what anonymous visitors may see. */
export async function searchPublic(query: string, locale: Locale = "fa", take = 8): Promise<SearchHit[]> {
  const q = normalize(query);
  if (q.length < 2) return [];

  const [projects, posts, services, industries] = await Promise.all([
    db.project.findMany({
      where: {
        published: true,
        OR: [{ title: like(q) }, { titleEn: like(q) }, { subtitle: like(q) }, { category: like(q) }, { tags: like(q) }],
      },
      select: { id: true, slug: true, title: true, titleEn: true, titleAr: true, subtitle: true, cover: true, category: true },
      take,
    }),
    db.post.findMany({
      where: {
        published: true,
        OR: [{ title: like(q) }, { titleEn: like(q) }, { excerpt: like(q) }, { category: like(q) }, { tags: like(q) }],
      },
      select: { id: true, slug: true, title: true, titleEn: true, titleAr: true, excerpt: true, cover: true, category: true },
      take,
    }),
    db.service.findMany({
      where: { published: true, OR: [{ title: like(q) }, { titleEn: like(q) }, { excerpt: like(q) }, { tagline: like(q) }] },
      select: { id: true, slug: true, title: true, titleEn: true, titleAr: true, excerpt: true, cover: true },
      take,
    }),
    db.industry.findMany({
      where: { published: true, OR: [{ title: like(q) }, { titleEn: like(q) }, { excerpt: like(q) }] },
      select: { id: true, slug: true, title: true, titleEn: true, titleAr: true, excerpt: true, cover: true },
      take,
    }),
  ]);

  return [
    ...projects.map((p): SearchHit => ({
      id: p.id, type: "project", title: tr(locale, p.title, p.titleEn, p.titleAr),
      subtitle: p.subtitle, href: `/work/${p.slug}`, image: p.cover, badge: p.category,
    })),
    ...services.map((s): SearchHit => ({
      id: s.id, type: "service", title: tr(locale, s.title, s.titleEn, s.titleAr),
      subtitle: s.excerpt, href: `/services/${s.slug}`, image: s.cover,
    })),
    ...posts.map((p): SearchHit => ({
      id: p.id, type: "post", title: tr(locale, p.title, p.titleEn, p.titleAr),
      subtitle: p.excerpt, href: `/journal/${p.slug}`, image: p.cover, badge: p.category,
    })),
    ...industries.map((i): SearchHit => ({
      id: i.id, type: "industry", title: tr(locale, i.title, i.titleEn, i.titleAr),
      subtitle: i.excerpt, href: `/industries/${i.slug}`, image: i.cover,
    })),
  ];
}

/** Everything, including drafts and CRM records — admin-only, and every link
 *  points at the editor rather than the public page. */
export async function searchAdmin(query: string, take = 6): Promise<SearchHit[]> {
  const q = normalize(query);
  if (q.length < 2) return [];

  const [projects, posts, services, industries, clients, leads] = await Promise.all([
    db.project.findMany({
      where: { OR: [{ title: like(q) }, { titleEn: like(q) }, { slug: like(q) }, { category: like(q) }] },
      select: { id: true, title: true, category: true, cover: true, published: true },
      take,
    }),
    db.post.findMany({
      where: { OR: [{ title: like(q) }, { titleEn: like(q) }, { slug: like(q) }, { category: like(q) }] },
      select: { id: true, title: true, category: true, cover: true, published: true },
      take,
    }),
    db.service.findMany({
      where: { OR: [{ title: like(q) }, { titleEn: like(q) }, { slug: like(q) }] },
      select: { id: true, title: true, excerpt: true, published: true },
      take,
    }),
    db.industry.findMany({
      where: { OR: [{ title: like(q) }, { titleEn: like(q) }, { slug: like(q) }] },
      select: { id: true, title: true, excerpt: true, published: true },
      take,
    }),
    db.client.findMany({
      where: { OR: [{ name: like(q) }, { nameEn: like(q) }, { industry: like(q) }] },
      select: { id: true, name: true, industry: true, logo: true },
      take,
    }),
    db.lead.findMany({
      where: { OR: [{ name: like(q) }, { email: like(q) }, { company: like(q) }, { phone: like(q) }] },
      select: { id: true, name: true, email: true, status: true },
      take,
    }),
  ]);

  const draft = (published: boolean) => (published ? null : "پیش‌نویس");

  return [
    ...projects.map((p): SearchHit => ({
      id: p.id, type: "project", title: p.title, subtitle: p.category,
      href: `/admin/portfolio/${p.id}`, image: p.cover, badge: draft(p.published),
    })),
    ...posts.map((p): SearchHit => ({
      id: p.id, type: "post", title: p.title, subtitle: p.category,
      href: `/admin/journal/${p.id}`, image: p.cover, badge: draft(p.published),
    })),
    ...services.map((s): SearchHit => ({
      id: s.id, type: "service", title: s.title, subtitle: s.excerpt,
      href: `/admin/services/${s.id}`, badge: draft(s.published),
    })),
    ...industries.map((i): SearchHit => ({
      id: i.id, type: "industry", title: i.title, subtitle: i.excerpt,
      href: `/admin/industries/${i.id}`, badge: draft(i.published),
    })),
    ...clients.map((c): SearchHit => ({
      id: c.id, type: "client", title: c.name, subtitle: c.industry,
      href: `/admin/clients/${c.id}`, image: c.logo,
    })),
    ...leads.map((l): SearchHit => ({
      id: l.id, type: "lead", title: l.name, subtitle: l.email, href: "/admin/leads", badge: l.status,
    })),
  ];
}
