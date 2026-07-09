"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./db";
import { requirePermission } from "./auth";
import { hashPassword } from "./auth";
import { slugify } from "./utils";
import type { Credit, Metric } from "@/types";

// ————— helpers —————
const S = (fd: FormData, k: string, def = "") => (fd.get(k)?.toString() ?? def).trim();
const N = (fd: FormData, k: string, def = 0) => {
  const v = Number(fd.get(k));
  return Number.isFinite(v) ? v : def;
};
const B = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return v === "on" || v === "true" || v === "1";
};
const J = (x: unknown) => JSON.stringify(x ?? []);

function revalidateSite(...paths: string[]) {
  for (const p of paths) revalidatePath(p);
}

// ============================================================
// PROJECTS (flagship editor — object input)
// ============================================================
export interface ProjectInput {
  id?: string;
  slug: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  category: string;
  cover: string;
  poster?: string;
  heroVideo?: string;
  gallery: string[];
  year: number;
  location?: string;
  accent: string;
  featured: boolean;
  published: boolean;
  tags: string[];
  goal?: string;
  problem?: string;
  idea?: string;
  production?: string;
  marketing?: string;
  result?: string;
  metrics: Metric[];
  beforeImage?: string;
  afterImage?: string;
  credits: Credit[];
  clientId?: string;
  serviceSlugs: string[];
  industrySlugs: string[];
  seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; keywords: string[] };
}

export async function saveProject(input: ProjectInput) {
  await requirePermission("portfolio.manage");
  const slug = slugify(input.slug || input.title);
  const base = {
    slug,
    title: input.title,
    titleEn: input.titleEn || null,
    subtitle: input.subtitle || null,
    category: input.category,
    cover: input.cover,
    poster: input.poster || null,
    heroVideo: input.heroVideo || null,
    gallery: J(input.gallery),
    year: input.year,
    location: input.location || null,
    accent: input.accent,
    featured: input.featured,
    published: input.published,
    tags: J(input.tags),
    goal: input.goal || null,
    problem: input.problem || null,
    idea: input.idea || null,
    production: input.production || null,
    marketing: input.marketing || null,
    result: input.result || null,
    metrics: J(input.metrics),
    beforeImage: input.beforeImage || null,
    afterImage: input.afterImage || null,
    credits: J(input.credits),
  };
  const seoData = {
    metaTitle: input.seo.metaTitle || null,
    metaDescription: input.seo.metaDescription || null,
    ogImage: input.seo.ogImage || null,
    keywords: J(input.seo.keywords),
  };

  let id = input.id;
  if (id) {
    await db.project.update({
      where: { id },
      data: {
        ...base,
        client: input.clientId ? { connect: { id: input.clientId } } : { disconnect: true },
        services: { set: input.serviceSlugs.map((s) => ({ slug: s })) },
        industries: { set: input.industrySlugs.map((s) => ({ slug: s })) },
        seo: { upsert: { create: seoData, update: seoData } },
      },
    });
  } else {
    const created = await db.project.create({
      data: {
        ...base,
        client: input.clientId ? { connect: { id: input.clientId } } : undefined,
        services: { connect: input.serviceSlugs.map((s) => ({ slug: s })) },
        industries: { connect: input.industrySlugs.map((s) => ({ slug: s })) },
        seo: { create: seoData },
      },
    });
    id = created.id;
  }
  revalidateSite("/admin/portfolio", "/work", `/work/${slug}`, "/");
  return { ok: true, id };
}

export async function deleteProject(id: string) {
  await requirePermission("portfolio.manage");
  await db.project.delete({ where: { id } });
  revalidateSite("/admin/portfolio", "/work");
  return { ok: true };
}

export async function togglePublish(entity: string, id: string, value: boolean) {
  const permMap: Record<string, string> = {
    project: "portfolio.manage",
    post: "blog.manage",
    service: "services.manage",
    industry: "industries.manage",
    testimonial: "testimonials.manage",
  };
  await requirePermission(permMap[entity] ?? "settings.manage");
  const model = (db as any)[entity];
  await model.update({ where: { id }, data: { published: value } });
  revalidateSite(`/admin/${entity}s`, "/");
  return { ok: true };
}

// ============================================================
// POSTS (markdown editor — object input)
// ============================================================
export interface PostInput {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  content: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  readingMinutes: number;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords: string[];
}

export async function savePost(input: PostInput) {
  await requirePermission("blog.manage");
  const slug = slugify(input.slug || input.title);
  const data = {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    cover: input.cover,
    content: input.content,
    category: input.category,
    tags: J(input.tags),
    featured: input.featured,
    published: input.published,
    readingMinutes: input.readingMinutes,
    metaTitle: input.metaTitle || null,
    metaDescription: input.metaDescription || null,
    ogImage: input.ogImage || null,
    keywords: J(input.keywords),
  };
  let id = input.id;
  if (id) {
    await db.post.update({ where: { id }, data });
  } else {
    const u = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } });
    const created = await db.post.create({ data: { ...data, authorId: u?.id } });
    id = created.id;
  }
  revalidateSite("/admin/journal", "/journal", `/journal/${slug}`);
  return { ok: true, id };
}

export async function deletePost(id: string) {
  await requirePermission("blog.manage");
  await db.post.delete({ where: { id } });
  revalidateSite("/admin/journal", "/journal");
  return { ok: true };
}

// ============================================================
// MEDIA
// ============================================================
export async function createMedia(fd: FormData) {
  await requirePermission("media.manage");
  const url = S(fd, "url");
  if (!url) return { ok: false, error: "آدرس فایل الزامی است" };
  await db.media.create({
    data: {
      url,
      type: S(fd, "type", "IMAGE"),
      name: S(fd, "name", "فایل جدید"),
      alt: S(fd, "alt") || null,
      folder: S(fd, "folder", "uploads"),
    },
  });
  revalidateSite("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string) {
  await requirePermission("media.manage");
  const item = await db.media.delete({ where: { id } });
  // Best-effort: also remove the underlying file if it was a real upload
  // (URLs pasted from elsewhere, e.g. Aparat/YouTube links, are left alone).
  const match = item.url.match(/^\/api\/media\/(.+)$/);
  if (match) {
    try {
      const { getStore } = await import("@netlify/blobs");
      await getStore("media").delete(match[1]);
    } catch {
      // non-fatal — an orphaned blob doesn't affect the site
    }
  }
  revalidateSite("/admin/media");
  return { ok: true };
}

// ============================================================
// CLIENTS
// ============================================================
export async function saveClient(fd: FormData) {
  await requirePermission("clients.manage");
  const id = S(fd, "id");
  const data = {
    name: S(fd, "name"),
    nameEn: S(fd, "nameEn") || null,
    logo: S(fd, "logo") || null,
    website: S(fd, "website") || null,
    industry: S(fd, "industry") || null,
    featured: B(fd, "featured"),
  };
  if (id) await db.client.update({ where: { id }, data });
  else await db.client.create({ data });
  revalidateSite("/admin/clients", "/");
  redirect("/admin/clients");
}

export async function deleteClient(id: string) {
  await requirePermission("clients.manage");
  await db.client.delete({ where: { id } });
  revalidateSite("/admin/clients");
  return { ok: true };
}

// ============================================================
// TESTIMONIALS
// ============================================================
export async function saveTestimonial(fd: FormData) {
  await requirePermission("testimonials.manage");
  const id = S(fd, "id");
  const data = {
    author: S(fd, "author"),
    role: S(fd, "role") || null,
    company: S(fd, "company") || null,
    avatar: S(fd, "avatar") || null,
    quote: S(fd, "quote"),
    rating: N(fd, "rating", 5),
    featured: B(fd, "featured"),
    published: B(fd, "published"),
  };
  if (id) await db.testimonial.update({ where: { id }, data });
  else await db.testimonial.create({ data });
  revalidateSite("/admin/testimonials", "/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requirePermission("testimonials.manage");
  await db.testimonial.delete({ where: { id } });
  revalidateSite("/admin/testimonials");
  return { ok: true };
}

// ============================================================
// SERVICES
// ============================================================
export async function saveService(fd: FormData) {
  await requirePermission("services.manage");
  const id = S(fd, "id");
  const parseLines = (k: string) =>
    S(fd, k)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  const data = {
    slug: slugify(S(fd, "slug") || S(fd, "title")),
    title: S(fd, "title"),
    titleEn: S(fd, "titleEn") || null,
    titleAr: S(fd, "titleAr") || null,
    tagline: S(fd, "tagline") || null,
    excerpt: S(fd, "excerpt"),
    description: S(fd, "description"),
    department: S(fd, "department", "FILM"),
    icon: S(fd, "icon", "Sparkles"),
    cover: S(fd, "cover") || null,
    priceFrom: N(fd, "priceFrom") || null,
    features: J(parseLines("features")),
    published: B(fd, "published"),
    metaTitle: S(fd, "metaTitle") || null,
    metaDescription: S(fd, "metaDescription") || null,
  };
  if (id) await db.service.update({ where: { id }, data });
  else await db.service.create({ data });
  revalidateSite("/admin/services", "/services", `/services/${data.slug}`);
  redirect("/admin/services");
}

export async function deleteService(id: string) {
  await requirePermission("services.manage");
  await db.service.delete({ where: { id } });
  revalidateSite("/admin/services", "/services");
  return { ok: true };
}

// ============================================================
// INDUSTRIES
// ============================================================
export async function saveIndustry(fd: FormData) {
  await requirePermission("industries.manage");
  const id = S(fd, "id");
  const data = {
    slug: slugify(S(fd, "slug") || S(fd, "title")),
    title: S(fd, "title"),
    titleEn: S(fd, "titleEn") || null,
    excerpt: S(fd, "excerpt"),
    description: S(fd, "description"),
    icon: S(fd, "icon", "Building2"),
    cover: S(fd, "cover") || null,
    heroVideo: S(fd, "heroVideo") || null,
    published: B(fd, "published"),
  };
  if (id) await db.industry.update({ where: { id }, data });
  else await db.industry.create({ data });
  revalidateSite("/admin/industries", "/industries", `/industries/${data.slug}`);
  redirect("/admin/industries");
}

export async function deleteIndustry(id: string) {
  await requirePermission("industries.manage");
  await db.industry.delete({ where: { id } });
  revalidateSite("/admin/industries", "/industries");
  return { ok: true };
}

// ============================================================
// USERS / ROLES
// ============================================================
export async function saveUser(fd: FormData) {
  await requirePermission("users.manage");
  const id = S(fd, "id");
  const permissions = fd.getAll("permissions").map((p) => p.toString());
  const base = {
    name: S(fd, "name"),
    email: S(fd, "email").toLowerCase(),
    role: S(fd, "role", "EDITOR"),
    bio: S(fd, "bio") || null,
    avatar: S(fd, "avatar") || null,
    active: B(fd, "active"),
    permissions: J(permissions),
  };
  const password = S(fd, "password");
  if (id) {
    await db.user.update({
      where: { id },
      data: password ? { ...base, password: await hashPassword(password) } : base,
    });
  } else {
    await db.user.create({
      data: { ...base, password: await hashPassword(password || "Arka@2026!") },
    });
  }
  revalidateSite("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  await requirePermission("users.manage");
  await db.user.delete({ where: { id } });
  revalidateSite("/admin/users");
  return { ok: true };
}

// ============================================================
// LEADS (CRM)
// ============================================================
export async function updateLeadStatus(id: string, status: string) {
  await requirePermission("leads.view");
  await db.lead.update({ where: { id }, data: { status } });
  revalidateSite("/admin/leads", "/admin");
  return { ok: true };
}

export async function deleteLead(id: string) {
  await requirePermission("leads.manage");
  await db.lead.delete({ where: { id } });
  revalidateSite("/admin/leads");
  return { ok: true };
}

// ============================================================
// SETTINGS
// ============================================================
export async function saveSettings(fd: FormData) {
  await requirePermission("settings.manage");
  const value = {
    heroHeadline: S(fd, "heroHeadline"),
    contactEmail: S(fd, "contactEmail"),
    primaryColor: S(fd, "primaryColor", "#6699ff"),
    maintenance: B(fd, "maintenance"),
    defaultLocale: S(fd, "defaultLocale", "fa"),
    locales: ["fa", "en", "ar"],
  };
  await db.setting.upsert({
    where: { key: "site" },
    create: { key: "site", value: J(value) },
    update: { value: J(value) },
  });
  revalidateSite("/admin/settings", "/");
  redirect("/admin/settings");
}
