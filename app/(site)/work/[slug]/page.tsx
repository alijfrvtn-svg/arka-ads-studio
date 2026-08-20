import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Calendar, MapPin, Tag, Users2 } from "lucide-react";
import { db } from "@/lib/db";
import { Container, Section, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { BeforeAfter } from "@/components/work/BeforeAfter";
import { buildMetadata, creativeWorkJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { parseArr, localeDigits } from "@/lib/utils";
import { tr, trArr } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Credit, Metric } from "@/types";
import type { Locale } from "@/types";
import { ProjectStatusDot } from "@/components/work/ProjectStatusDot";
import { getUi } from "@/lib/site-copy";

const STORY_LABEL: Record<Locale, Record<"goal" | "problem" | "idea" | "production" | "marketing" | "result", string>> = {
  fa: { goal: "هدف", problem: "چالش", idea: "ایده", production: "تولید", marketing: "بازاریابی", result: "نتیجه" },
  en: { goal: "Goal", problem: "Challenge", idea: "Idea", production: "Production", marketing: "Marketing", result: "Result" },
  ar: { goal: "الهدف", problem: "التحدي", idea: "الفكرة", production: "الإنتاج", marketing: "التسويق", result: "النتيجة" },
};
const STORY_KEYS = ["goal", "problem", "idea", "production", "marketing", "result"] as const;

const COPY: Record<Locale, { beforeAfterEyebrow: string; beforeAfterHeading: string }> = {
  fa: { beforeAfterEyebrow: "قبل و بعد", beforeAfterHeading: "تحول را ببینید" },
  en: { beforeAfterEyebrow: "Before & After", beforeAfterHeading: "See the transformation" },
  ar: { beforeAfterEyebrow: "قبل وبعد", beforeAfterHeading: "شاهد التحول" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  // Interface strings, with anything edited in the panel applied. Cached per
  // request, so every component asking for it costs one query between them.
  const t = await getUi(locale);
  const p = await db.project.findUnique({ where: { slug }, include: { seo: true } });
  if (!p) return {};
  return buildMetadata({
    title: tr(locale, p.seo?.metaTitle ?? "", p.seo?.metaTitleEn, p.seo?.metaTitleAr) || tr(locale, p.title, p.titleEn, p.titleAr),
    description: tr(locale, p.seo?.metaDescription ?? "", p.seo?.metaDescriptionEn, p.seo?.metaDescriptionAr) || tr(locale, p.subtitle ?? "", p.subtitleEn, p.subtitleAr),
    path: `/work/${p.slug}`,
    image: p.seo?.ogImage || p.cover,
    keywords: trArr<string>(locale, p.seo?.keywords ?? "[]", p.seo?.keywordsEn, p.seo?.keywordsAr),
    type: "article",
    locale,
  });
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getUi(locale);
  const p = await db.project.findUnique({
    where: { slug },
    include: { client: true, services: true, industries: true, seo: true },
  });
  if (!p) notFound();

  // Raw SQL bypasses Prisma's @updatedAt hook so a page view doesn't corrupt sitemap lastmod freshness signals.
  await db.$executeRaw`UPDATE "Project" SET views = views + 1 WHERE id = ${p.id}`.catch(() => {});

  const gallery = parseArr<string>(p.gallery);
  const metrics = trArr<Metric>(locale, p.metrics, p.metricsEn, p.metricsAr);
  const credits = trArr<Credit>(locale, p.credits, p.creditsEn, p.creditsAr);
  const tags = trArr<string>(locale, p.tags, p.tagsEn, p.tagsAr);
  const title = tr(locale, p.title, p.titleEn, p.titleAr);
  const subtitle = tr(locale, p.subtitle ?? "", p.subtitleEn, p.subtitleAr);
  const category = tr(locale, p.category, p.categoryEn, p.categoryAr);
  const location = tr(locale, p.location ?? "", p.locationEn, p.locationAr);
  const next = await db.project.findFirst({
    where: { published: true, id: { not: p.id } },
    orderBy: { order: "asc" },
    select: { slug: true, title: true, titleEn: true, titleAr: true, cover: true, category: true },
  });
  const c = COPY[locale];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd({ title, description: subtitle, image: p.cover, path: `/work/${p.slug}`, client: p.client?.name })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: t.navHome, path: "/" }, { name: t.navWork, path: "/work" }, { name: title, path: `/work/${p.slug}` }])) }} />

      {/* hero */}
      <section className="relative flex min-h-[86vh] items-end overflow-hidden pb-16 pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.cover} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/25" />
        <Container className="relative">
          <Reveal>
            <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="transition-colors hover:text-white">{t.navHome}</Link> ‹
              <Link href="/work" className="transition-colors hover:text-white">{t.navWork}</Link>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass-onmedia inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
                {category}
              </span>
              <ProjectStatusDot status={p.status} locale={locale} onMedia mono />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-5 max-w-4xl font-display text-3xl font-extrabold leading-[1.15] tracking-[-0.03em] text-white balance sm:text-4xl md:text-6xl md:leading-[1.02] lg:text-7xl">
              {title}
            </h1>
          </Reveal>
          {subtitle && (
            <Reveal delay={0.15}>
              <p className="mt-5 max-w-2xl text-lg text-white/80">{subtitle}</p>
            </Reveal>
          )}
        </Container>
      </section>

      {/* meta bar */}
      <div className="seam-top seam-bottom bg-surface/40">
        <Container>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            <Meta icon={Users2} label={t.metaClient} value={p.client ? tr(locale, p.client.name, p.client.nameEn, p.client.nameEn) : "—"} />
            <Meta icon={Calendar} label={t.metaYear} value={localeDigits(locale, p.year)} />
            <Meta icon={MapPin} label={t.metaLocation} value={location || "—"} />
            {/* No services linked means the row has nothing to say, and an em dash
                is not an answer — it is the absence of one taking up a column.
                Set them on the project under «ارتباطات و برچسب‌ها». */}
            {p.services.length > 0 && (
              <Meta
                icon={Tag}
                label={t.footerServices}
                value={p.services.map((s) => tr(locale, s.title, s.titleEn, s.titleAr)).join(locale === "fa" ? "، " : ", ")}
              />
            )}
          </div>
        </Container>
      </div>

      {/* metrics */}
      {metrics.length > 0 && (
        <Section>
          <Container>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {metrics.map((m, i) => (
                <Reveal key={i} delay={i * 0.08} className="rounded-2xl border border-card-border bg-surface p-8 text-center">
                  <div className="font-display text-4xl font-extrabold text-gradient md:text-5xl">
                    {m.value}
                    <span className="text-2xl text-foreground-muted"> {m.suffix}</span>
                  </div>
                  <div className="mt-2 text-sm text-foreground-muted">{m.label}</div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* storytelling */}
      <Section className="bg-background-2">
        <Container>
          <div className="mx-auto max-w-3xl space-y-16">
            {STORY_KEYS.map((key, i) => {
              const enKey = `${key}En` as const;
              const arKey = `${key}Ar` as const;
              const text = tr(locale, p[key] ?? "", p[enKey], p[arKey]);
              if (!text) return null;
              return (
                <Reveal key={key} delay={0.05}>
                  <div className="flex gap-6">
                    <div className="shrink-0">
                      <span className="font-display text-5xl font-extrabold text-outline">
                        {localeDigits(locale, i + 1).padStart(2, locale === "fa" ? "۰" : "0")}
                      </span>
                    </div>
                    <div>
                      <Eyebrow>{STORY_LABEL[locale][key]}</Eyebrow>
                      <p className="mt-3 text-lg leading-loose text-foreground-muted">{text}</p>
                      {key === "production" && gallery.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {gallery.slice(0, 2).map((g, k) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={k} src={g} alt="" className="aspect-video w-full rounded-xl border border-card-border object-cover" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* video */}
      {p.heroVideo && (
        <Section>
          <Container>
            <Reveal>
              <div className="aspect-video overflow-hidden rounded-2xl border border-card-border">
                <VideoPlayer src={p.heroVideo} poster={p.poster || p.cover} />
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      {/* before/after */}
      {p.beforeImage && p.afterImage && (
        <Section className="bg-background-2">
          <Container>
            <div className="mx-auto max-w-4xl">
              <Reveal>
                <div className="mb-6 text-center">
                  <Eyebrow>{c.beforeAfterEyebrow}</Eyebrow>
                  <h2 className="mt-3 font-display text-3xl font-bold text-foreground">{c.beforeAfterHeading}</h2>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <BeforeAfter before={p.beforeImage} after={p.afterImage} locale={locale} />
              </Reveal>
            </div>
          </Container>
        </Section>
      )}

      {/* gallery */}
      {gallery.length > 0 && (
        <Section>
          <Container>
            {/* A grid, not masonry.
                ------------------------------------------------------------
                This was `columns-*`, which is CSS multi-column: it fills one
                column top to bottom before starting the next, and every cell
                keeps its own natural height. With product shots of differing
                proportions that produces a ragged wall — rows that do not line
                up, columns that end at different heights, and a reading order
                that goes down rather than across.

                A grid with one shared ratio fixes all of it at once: every cell
                is the same box, rows align, and the order matches the way the
                page is read. `object-contain` on a white ground rather than
                `cover`, because these are products photographed on white — a
                cover crop would cut the very thing the photograph is of. */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {gallery.map((g, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
                  <div className="aspect-square overflow-hidden rounded-2xl border border-card-border bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain transition-transform duration-700 [transition-timing-function:var(--ease-apple)] hover:scale-[1.03]"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* credits + tags */}
      <Section className="bg-background-2">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            {credits.length > 0 && (
              <div>
                <Eyebrow>{t.credits}</Eyebrow>
                <dl className="mt-5 space-y-3">
                  {credits.map((cr, i) => (
                    <div key={i} className="flex justify-between border-b border-card-border pb-3">
                      <dt className="text-foreground-muted">{cr.role}</dt>
                      <dd className="font-medium text-foreground">{cr.name}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {tags.length > 0 && (
              <div>
                <Eyebrow>{t.tagsLabel}</Eyebrow>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t} className="rounded-full border border-card-border px-4 py-2 text-sm text-foreground-muted">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* next project */}
      {next && (
        <Link href={`/work/${next.slug}`} className="group relative block overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={next.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-[900ms] [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-background/75" />
          <Container className="relative py-32 text-center">
            <p className="text-[0.78rem] uppercase tracking-[0.18em] text-foreground-faint lg:text-[0.7rem] lg:tracking-[0.3em]">{t.nextProject}</p>
            <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">{tr(locale, next.title, next.titleEn, next.titleAr)}</h2>
            <span className="liquid liquid-raised mt-10 inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold">
              <span className="inline-flex items-center gap-2">
                {t.viewProject} <ArrowUpLeft className="h-5 w-5 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
              </span>
            </span>
          </Container>
        </Link>
      )}
    </article>
  );
}

function Meta({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-foreground-faint">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}
