import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowUpLeft, Clock, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/Section";
import { StickyTOC } from "@/components/journal/StickyTOC";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { parseArr, slugify, faDate, toFa } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await db.post.findUnique({ where: { slug } });
  if (!p) return {};
  return buildMetadata({
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.excerpt,
    path: `/journal/${p.slug}`,
    image: p.ogImage || p.cover,
    keywords: parseArr<string>(p.keywords),
    type: "article",
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await db.post.findUnique({ where: { slug }, include: { author: { select: { name: true, avatar: true } } } });
  if (!p) notFound();

  await db.post.update({ where: { id: p.id }, data: { views: { increment: 1 } } }).catch(() => {});

  // render markdown + inject heading ids + build TOC
  const rawHtml = marked.parse(p.content, { async: false }) as string;
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
  const tags = parseArr<string>(p.tags);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd({ title: p.title, description: p.excerpt, image: p.cover, path: `/journal/${p.slug}`, datePublished: p.publishedAt, author: p.author?.name })) }} />

      {/* hero */}
      <header className="relative overflow-hidden pb-10 pt-36 md:pt-44">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <Container className="relative max-w-4xl">
          <nav className="mb-5 text-xs text-foreground-muted">
            <Link href="/" className="hover:text-primary">خانه</Link> ‹ <Link href="/journal" className="hover:text-primary">ژورنال</Link>
          </nav>
          <span className="eyebrow">{p.category}</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] text-foreground balance md:text-5xl">{p.title}</h1>
          <p className="mt-5 text-lg text-foreground-muted">{p.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            {p.author && (
              <span className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.author.avatar && <img src={p.author.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />}
                {p.author.name}
              </span>
            )}
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {faDate(p.publishedAt)}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {toFa(p.readingMinutes)} دقیقه مطالعه</span>
          </div>
        </Container>
      </header>

      {/* cover */}
      <Container className="max-w-5xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.cover} alt={p.title} className="aspect-[16/9] w-full rounded-2xl border border-card-border object-cover" />
      </Container>

      {/* body + TOC */}
      <Container className="max-w-5xl py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
          <div className="prose-arka max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <StickyTOC items={toc} />
              <div className="mt-8 rounded-2xl border border-card-border bg-surface p-5">
                <p className="font-display font-bold text-foreground">پروژه‌ای دارید؟</p>
                <p className="mt-1 text-sm text-foreground-muted">با تیم آرکا صحبت کنید.</p>
                <Link href="/contact" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
                  شروع پروژه <ArrowUpLeft className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-card-border pt-8">
            {tags.map((t) => <span key={t} className="rounded-full border border-card-border px-4 py-1.5 text-sm text-foreground-muted">{t}</span>)}
          </div>
        )}
      </Container>

      {/* related */}
      {related.length > 0 && (
        <section className="border-t border-card-border bg-background-2 py-16">
          <Container className="max-w-5xl">
            <h2 className="mb-8 font-display text-2xl font-bold text-foreground">مطالب مرتبط</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link key={r.id} href={`/journal/${r.slug}`} className="group flex gap-4 rounded-2xl border border-card-border bg-surface p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.cover} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" />
                  <div>
                    <span className="text-xs text-primary">{r.category}</span>
                    <h3 className="mt-1 font-display font-bold leading-snug text-foreground group-hover:text-primary">{r.title}</h3>
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
