import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Check } from "lucide-react";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { ProjectCard } from "@/components/work/ProjectCard";
import { buildMetadata, breadcrumbJsonLd, serviceJsonLd, faqPageJsonLd } from "@/lib/seo";
import { localeNumber } from "@/lib/utils";
import { tr, trArr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Faq, PricingTier, WorkflowStep, Locale } from "@/types";

const COPY: Record<Locale, { defaultEyebrow: string; relatedProjects: string; readyHeading: (t: string) => string }> = {
  fa: { defaultEyebrow: "سرویس", relatedProjects: "پروژه‌های مرتبط", readyHeading: (t) => `آماده شروع ${t} هستید؟` },
  en: { defaultEyebrow: "Service", relatedProjects: "Related Projects", readyHeading: (t) => `Ready to start ${t}?` },
  ar: { defaultEyebrow: "خدمة", relatedProjects: "مشاريع ذات صلة", readyHeading: (t) => `هل أنت مستعد لبدء ${t}؟` },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const s = await db.service.findUnique({ where: { slug } });
  if (!s) return {};
  return buildMetadata({
    title: tr(locale, s.metaTitle ?? "", s.metaTitleEn, s.metaTitleAr) || tr(locale, s.title, s.titleEn, s.titleAr),
    description: tr(locale, s.metaDescription ?? "", s.metaDescriptionEn, s.metaDescriptionAr) || tr(locale, s.excerpt, s.excerptEn, s.excerptAr),
    path: `/services/${s.slug}`,
    image: s.cover || undefined,
    keywords: trArr<string>(locale, s.keywords, s.keywordsEn, s.keywordsAr),
    locale,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const s = await db.service.findUnique({
    where: { slug },
    include: {
      projects: {
        where: { published: true },
        take: 3,
        include: { client: { select: { name: true, nameEn: true } } },
      },
    },
  });
  if (!s) notFound();

  const features = trArr<string>(locale, s.features, s.featuresEn, s.featuresAr);
  const workflow = trArr<WorkflowStep>(locale, s.workflow, s.workflowEn, s.workflowAr);
  const faqs = trArr<Faq>(locale, s.faqs, s.faqsEn, s.faqsAr);
  const pricing = trArr<PricingTier>(locale, s.pricing, s.pricingEn, s.pricingAr);
  const title = tr(locale, s.title, s.titleEn, s.titleAr);
  const description = tr(locale, s.description, s.descriptionEn, s.descriptionAr);
  const priceUnit = tr(locale, s.priceUnit || "تومان", s.priceUnitEn, s.priceUnitAr);
  const c = COPY[locale];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([{ name: ui(locale).navHome, path: "/" }, { name: ui(locale).navServices, path: "/services" }, { name: title, path: `/services/${s.slug}` }]),
            serviceJsonLd({ name: title, description, path: `/services/${s.slug}` }),
            ...(faqs.length ? [faqPageJsonLd(faqs)] : []),
          ]),
        }}
      />
      <PageHero
        eyebrow={tr(locale, s.tagline || "", s.taglineEn, s.taglineAr) || c.defaultEyebrow}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navServices, href: "/services" }, { label: title }]}
        title={title}
        description={description}
        image={s.cover}
      >
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
            {ui(locale).ctaRequestConsult} <ArrowUpLeft className="h-5 w-5" />
          </Link>
          {s.priceFrom && (
            <span className="inline-flex items-center rounded-full border border-card-border px-6 py-3.5 text-sm text-foreground-muted ltr-nums">
              {ui(locale).priceFromPrefix} {localeNumber(locale, s.priceFrom)} {priceUnit}
            </span>
          )}
        </div>
      </PageHero>

      {/* features */}
      {features.length > 0 && (
        <Section>
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="flex items-start gap-3 rounded-2xl border border-card-border bg-surface p-5">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-foreground">{f}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* workflow */}
      {workflow.length > 0 && (
        <Section className="bg-background-2">
          <Container>
            <SectionHeading align="center" eyebrow={ui(locale).serviceWorkflowEyebrow} title={ui(locale).serviceWorkflowTitle} className="mx-auto mb-14 max-w-2xl" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {workflow.map((w, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="rounded-2xl border border-card-border bg-surface p-6">
                    <span className="font-display text-4xl font-extrabold text-outline">{w.step}</span>
                    <h3 className="mt-4 font-display text-lg font-bold text-foreground">{w.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* pricing — glassmorphism */}
      {pricing.length > 0 && (
        <Section>
          <Container>
            <SectionHeading align="center" eyebrow={ui(locale).servicePricingEyebrow} title={ui(locale).servicePricingTitle} className="mx-auto mb-14 max-w-2xl" />
            <div className="grid min-w-0 gap-5 md:grid-cols-3">
              {pricing.map((tier, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border p-7 ${tier.featured ? "border-primary/50 bg-primary/5" : "border-card-border glass"}`}>
                    {tier.featured && (
                      <span className="absolute left-5 top-5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{ui(locale).pricingFeaturedBadge}</span>
                    )}
                    <h3 className="font-display break-words text-lg font-bold text-foreground">{tier.name}</h3>
                    <div className="mt-4 flex items-end gap-1">
                      <span className="font-display break-words text-3xl font-extrabold text-foreground ltr-nums">{tier.price}</span>
                      {tier.unit && <span className="mb-1 text-sm text-foreground-muted">{tier.unit}</span>}
                    </div>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((f, k) => (
                        <li key={k} className="flex items-center gap-2.5 text-sm text-foreground-muted">
                          <Check className="h-4 w-4 shrink-0 text-primary" /> <span className="break-words">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/contact?plan=${encodeURIComponent(`${tier.name} (${title})`)}`}
                      className={`mt-7 inline-flex h-12 items-center justify-center rounded-xl font-semibold transition-all ${tier.featured ? "bg-primary text-primary-foreground hover:brightness-110" : "border border-card-border text-foreground hover:border-primary"}`}
                    >
                      {ui(locale).selectPlan}
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* portfolio */}
      {s.projects.length > 0 && (
        <Section className="bg-background-2">
          <Container>
            <SectionHeading eyebrow={ui(locale).portfolioEyebrow} title={c.relatedProjects} className="mb-10" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.projects.map((p) => (
                <ProjectCard key={p.id} project={p} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* faq */}
      {faqs.length > 0 && (
        <Section>
          <Container className="max-w-3xl">
            <SectionHeading align="center" eyebrow={ui(locale).serviceFaqEyebrow} title={ui(locale).serviceFaqTitle} className="mx-auto mb-10 max-w-2xl" />
            <Accordion items={faqs} />
          </Container>
        </Section>
      )}

      {/* cta */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-card-border p-12 text-center">
            <div className="reel-bg absolute inset-0 opacity-15" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">{c.readyHeading(title)}</h2>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
                {ui(locale).serviceCtaTalk} <ArrowUpLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
