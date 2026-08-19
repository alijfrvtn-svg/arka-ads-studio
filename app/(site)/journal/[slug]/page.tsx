import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowUpLeft, Clock, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/Section";
import { StickyTOC } from "@/components/journal/StickyTOC";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { slugify, localeDate, localeNumber, labelOn, paintSeed } from "@/lib/utils";
import { INDUSTRY_PAINT, TEXT_PAINT } from "@/lib/constants";
import { tr, trArr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Locale } from "@/types";

const COPY: Record<Locale, { ctaTitle: string; ctaBody: string }> = {
  fa: { ctaTitle: "پروژه‌ای دارید؟", ctaBody: "با تیم آرکا صحبت کنید." },
  en: { ctaTitle: "Have a project?", ctaBody: "Talk to the ARKA team." },
  ar: { ctaTitle: "لديك مشروع؟", ctaBody: "تحدث إلى فريق آركا." },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await db.post.findUnique({ where: { slug } });
  if (!p) return {};
  return buildMetadata({
    title: tr(locale, p.metaTitle ?? "", p.metaTitleEn, p.metaTitleAr) || tr(locale, p.title, p.titleEn, p.titleAr),
    description: tr(locale, p.metaDescription ?? "", p.metaDescriptionEn, p.metaDescriptionAr) || tr(locale, p.excerpt, p.excerptEn, p.excerptAr),
    path: `/journal/${p.slug}`,
    image: p.ogImage || p.cover,
    keywords: trArr<string>(locale, p.keywords, p.keywordsEn, p.keywordsAr),
    type: "article",
    locale,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await db.post.findUnique({ where: { slug }, include: { author: { select: { name: true, avatar: true } } } });
  if (!p) notFound();

  // Raw SQL bypasses Prisma's @updatedAt hook so a page view doesn't corrupt sitemap lastmod freshness signals.
  await db.$executeRaw`UPDATE "Post" SET views = views + 1 WHERE id = ${p.id}`.catch(() => {});

  const title = tr(locale, p.title, p.titleEn, p.titleAr);
  const excerpt = tr(locale, p.excerpt, p.excerptEn, p.excerptAr);
  const category = tr(locale, p.category, p.categoryEn, p.categoryAr);
  const content = tr(locale, p.content, p.contentEn, p.contentAr);

  // render markdown + inject heading ids + build TOC
  const rawHtml = marked.parse(content, { async: false }) as string;
  const toc: { level: number; text: string; id: string }[] = [];
  const html = rawHtml.replace(/<h([23])>(.*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = inner.replace(/<[^>]+>/g, "");
    const id = slugify(text) || `h-${toc.length}`;
    toc.push({ level: Number(lvl), text, id });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });

  const related = await db.post.findMany({
    where: { published: true, id: { not: p.id }, category: p.category },
    take: 2,
    orderBy: { publishedAt: "desc" },
  });
  const tags = trArr<string>(locale, p.tags, p.tagsEn, p.tagsAr);

  /**
   * A colour per tag: the pure four here, because a pill is a filled shape and
   * its label colour is computed per hex.
   *
   * The colour comes from the tag itself rather than from its position, so a
   * tag keeps the same one across every article it appears on and a new tag is
   * coloured the moment it is written — nothing to record anywhere. The second
   * step is the site's own rule everywhere else colour is placed: no colour
   * ever touches itself, so a run that would repeat is nudged to the next one.
   */
  const tagColours = tags.reduce<{ tag: string; colour: string }[]>((acc, tag) => {
    let idx = paintSeed(tag) % INDUSTRY_PAINT.length;
    const prev = acc[acc.length - 1]?.colour;
    if (prev && INDUSTRY_PAINT[idx] === prev) idx = (idx + 1) % INDUSTRY_PAINT.length;
    acc.push({ tag, colour: INDUSTRY_PAINT[idx] });
    return acc;
  }, []);
  const c = COPY[locale];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title, description: excerpt, image: p.cover, path: `/journal/${p.slug}`, datePublished: p.publishedAt, author: p.author?.name })) }} />

      {/* hero */}
      <header className="relative overflow-hidden pb-14 pt-40 md:pt-52">
        <Container className="relative max-w-4xl">
          <nav className="mb-5 text-xs text-foreground-muted">
            <Link href="/" className="transition-colors hover:text-foreground">{ui(locale).navHome}</Link> ‹ <Link href="/journal" className="transition-colors hover:text-foreground">{ui(locale).navJournal}</Link>
          </nav>
          <span className="eyebrow">{category}</span>
          {/* The headline takes one of the four, picked from the slug so the
              article keeps the same colour on every visit and a new article
              gets one the moment it is written. TEXT_PAINT rather than
              INDUSTRY_PAINT: two of the raw four cannot be set as type on
              white at all. */}
          <h1
            className="mt-5 font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] balance md:text-5xl"
            style={{ color: TEXT_PAINT[paintSeed(p.slug) % TEXT_PAINT.length] }}
          >
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground-muted">{excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            {p.author && (
              <span className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.author.avatar && <img src={p.author.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />}
                {p.author.name}
              </span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {localeDate(locale, p.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {localeNumber(locale, p.readingMinutes)} {ui(locale).readingMinutesSuffix}</span>
          </div>
        </Container>
      </header>

      {/* cover */}
      <Container className="max-w-5xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.cover} alt={title} className="aspect-[16/9] w-full rounded-[1.75rem] border border-card-border object-cover" />
      </Container>

      {/* body + TOC */}
      <Container className="max-w-5xl py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
          <div className="prose-arka max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <StickyTOC items={toc} locale={locale} />
              <div className="mt-8 rounded-[1.25rem] border border-card-border bg-surface-2 p-6">
                <p className="font-display font-bold text-foreground">{c.ctaTitle}</p>
                <p className="mt-1 text-sm text-foreground-muted">{c.ctaBody}</p>
                <Link href="/contact" className="liquid liquid-raised mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold">
                  <span className="inline-flex items-center gap-2">
                    {ui(locale).ctaStartProject} <ArrowUpLeft className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-card-border pt-8">
            {tagColours.map(({ tag, colour }) => (
              <span
                key={tag}
                className="rounded-full px-4 py-1.5 text-sm font-medium"
                style={{ background: colour, color: labelOn(colour) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Container>

      {/* related */}
      {related.length > 0 && (
        <section className="seam-top bg-surface-2 py-20">
          <Container className="max-w-5xl">
            <h2 className="mb-10 font-display text-2xl font-bold tracking-tight text-foreground">{ui(locale).relatedPosts}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.id} href={`/journal/${r.slug}`} className="group flex gap-4 rounded-[1.25rem] border border-card-border bg-surface p-4 transition-all duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_44px_-26px_rgba(0,0,0,0.32)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.cover} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover transition-all duration-700" />
                  <div>
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-foreground-faint">{tr(locale, r.category, r.categoryEn, r.categoryAr)}</span>
                    <h3 className="mt-1.5 font-display font-bold leading-snug tracking-tight text-foreground">{tr(locale, r.title, r.titleEn, r.titleAr)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
