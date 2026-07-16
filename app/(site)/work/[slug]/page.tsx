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
import { parseArr, localeNumber } from "@/lib/utils";
import { tr, trArr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Credit, Metric } from "@/types";
import type { Locale } from "@/types";

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
  const p = await db.project.findUnique({ where: { slug }, include: { seo: true } });
  if (!p) return {};
  return buildMetadata({
    title: tr(locale, p.seo?.metaTitle ?? "", p.seo?.metaTitleEn, p.seo?.metaTitleAr) || tr(locale, p.title, p.titleEn, p.titleAr),
    description: tr(locale, p.seo?.metaDescription ?? "", p.seo?.metaDescriptionEn, p.seo?.metaDescriptionAr) || tr(locale, p.subtitle ?? "", p.subtitleEn, p.subtitleAr),
    path: `/work/${p.slug}`,
    image: p.seo?.ogImage || p.cover,
    keywords: trArr<string>(locale, p.seo?.keywords ?? "[]", p.seo?.keywordsEn, p.seo?.keywordsAr),
    type: "article",
  });
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const p = await db.project.findUnique({
    where: { slug },
    include: { client: true, services: true, industries: true, seo: true },
  });
  if (!p) notFound();

  await db.project.update({ where: { id: p.id }, data: { views: { increment: 1 } } }).catch(() => {});

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: ui(locale).navHome, path: "/" }, { name: ui(locale).navWork, path: "/work" }, { name: title, path: `/work/${p.slug}` }])) }} />

      {/* hero */}
      <section className="relative flex min-h-[86vh] items-end overflow-hidden pb-16 pt-32">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.cover} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        <Container className="relative">
          <Reveal>
            <nav className="mb-5 flex items-center gap-1.5 text-xs text-white/70">
              <Link href="/" className="hover:text-primary">{ui(locale).navHome}</Link> ‹
              <Link href="/work" className="hover:text-primary">{ui(locale).navWork}</Link>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white backdrop-blur">
              {category}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] text-white balance md:text-6xl lg:text-7xl">
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
      <div className="border-y border-card-border bg-surface/40">
        <Container>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            <Meta icon={Users2} label={ui(locale).metaClient} value={p.client?.name ?? "—"} />
            <Meta icon={Calendar} label={ui(locale).metaYear} value={localeNumber(locale, p.year)} />
            <Meta icon={MapPin} label={ui(locale).metaLocation} value={location || "—"} />
            <Meta icon={Tag} label={ui(locale).footerServices} value={p.services.map((s) => tr(locale, s.title, s.titleEn, s.titleAr)).join(locale === "fa" ? "، " : ", ") || "—"} />
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
                        {localeNumber(locale, i + 1).padStart(2, locale === "fa" ? "۰" : "0")}
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
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {gallery.map((g, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06} className="break-inside-avoid">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g} alt="" className="w-full rounded-2xl border border-card-border" />
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
                <Eyebrow>{ui(locale).credits}</Eyebrow>
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
                <Eyebrow>{ui(locale).tagsLabel}</Eyebrow>
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
          <img src={next.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-background/70" />
          <Container className="relative py-24 text-center">
            <p className="text-sm text-foreground-muted">{ui(locale).nextProject}</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-extrabold text-foreground md:text-5xl">{tr(locale, next.title, next.titleEn, next.titleAr)}</h2>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
              {ui(locale).viewProject} <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
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
