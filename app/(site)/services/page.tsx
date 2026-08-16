import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getServices } from "@/lib/queries";
import { DEPARTMENTS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { localeNumber } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import type { Locale } from "@/types";

const COPY: Record<Locale, { title: string; highlight: string; description: string; metaDescription: string; details: string; priceUnit: string }> = {
  fa: {
    title: "هر آنچه برند شما",
    highlight: "نیاز دارد",
    description: "از ایده تا اجرا و تحلیل؛ ده سرویس تخصصی، زیر یک سقف.",
    metaDescription: "ده سرویس تخصصی آرکا در چهار دپارتمان: فیلم و پروداکشن، دیجیتال مارکتینگ، برندینگ و طراحی، استراتژی و محتوا.",
    details: "جزئیات",
    priceUnit: "ت",
  },
  en: {
    title: "Everything your brand",
    highlight: "needs",
    description: "From idea to execution and analysis — ten specialized services, under one roof.",
    metaDescription: "ARKA's ten specialized services across four departments: Film & Production, Digital Marketing, Branding & Design, Strategy & Content.",
    details: "Details",
    priceUnit: "Toman",
  },
  ar: {
    title: "كل ما تحتاجه",
    highlight: "علامتك التجارية",
    description: "من الفكرة إلى التنفيذ والتحليل؛ عشر خدمات متخصصة تحت سقف واحد.",
    metaDescription: "عشر خدمات متخصصة من آركا في أربعة أقسام: الأفلام والإنتاج، التسويق الرقمي، العلامة التجارية والتصميم، الاستراتيجية والمحتوى.",
    details: "التفاصيل",
    priceUnit: "تومان",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ title: ui(locale).navServices, path: "/services", description: COPY[locale].metaDescription, locale });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const services = await getServices();
  const c = COPY[locale];
  return (
    <>
      <PageHero
        eyebrow={ui(locale).navServices}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navServices }]}
        title={<>{c.title} <span className="text-gradient">{c.highlight}</span></>}
        description={c.description}
      />
      <Section>
        <Container className="space-y-24">
          {DEPARTMENTS.map((dept) => {
            const items = services.filter((s) => s.department === dept.key);
            if (!items.length) return null;
            return (
              <div key={dept.key}>
                <Reveal>
                  <div className="mb-8 flex items-center gap-3.5">
                    <span className="liquid-clear grid h-10 w-10 place-items-center rounded-[11px] text-foreground">
                      <Icon name={dept.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{tr(locale, dept.title, dept.titleEn, dept.titleAr)}</h2>
                      {locale === "fa" && <p className="text-[0.65rem] uppercase tracking-[0.25em] text-foreground-faint">{dept.titleEn}</p>}
                    </div>
                  </div>
                </Reveal>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((s, i) => (
                    <Reveal key={s.id} delay={i * 0.06}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex h-full flex-col rounded-[1.5rem] border border-card-border bg-surface p-7 transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 hover:border-foreground/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_28px_60px_-32px_rgba(0,0,0,0.35)]"
                      >
                        <div className="liquid-clear mb-5 grid h-12 w-12 place-items-center rounded-[13px] text-foreground">
                          <Icon name={s.icon} className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{tr(locale, s.title, s.titleEn, s.titleAr)}</h3>
                        {s.tagline && <p className="mt-1.5 text-xs text-foreground-faint">{tr(locale, s.tagline, s.taglineEn, s.taglineAr)}</p>}
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">{tr(locale, s.excerpt, s.excerptEn, s.excerptAr)}</p>
                        <div className="mt-6 flex items-center justify-between border-t border-card-border pt-5">
                          <span className="text-xs text-foreground-faint ltr-nums">{s.priceFrom ? `${ui(locale).priceFromPrefix} ${localeNumber(locale, s.priceFrom)} ${c.priceUnit}` : ""}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                            {c.details} <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              </div>
            );
          })}
        </Container>
      </Section>
    </>
  );
}
