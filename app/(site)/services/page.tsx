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
import { faNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "خدمات",
  path: "/services",
  description: "ده سرویس تخصصی آرکا در چهار دپارتمان: فیلم و پروداکشن، دیجیتال مارکتینگ، برندینگ و طراحی، استراتژی و محتوا.",
});

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="خدمات"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "خدمات" }]}
        title={<>هر آنچه برند شما <span className="text-gradient">نیاز دارد</span></>}
        description="از ایده تا اجرا و تحلیل؛ ده سرویس تخصصی، زیر یک سقف."
      />
      <Section>
        <Container className="space-y-16">
          {DEPARTMENTS.map((dept) => {
            const items = services.filter((s) => s.department === dept.key);
            if (!items.length) return null;
            return (
              <div key={dept.key}>
                <Reveal>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-card-border bg-surface text-primary">
                      <Icon name={dept.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">{dept.title}</h2>
                      <p className="text-xs uppercase tracking-widest text-foreground-faint">{dept.titleEn}</p>
                    </div>
                  </div>
                </Reveal>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((s, i) => (
                    <Reveal key={s.id} delay={i * 0.06}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-card-border bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50"
                      >
                        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
                          <Icon name={s.icon} className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                        {s.tagline && <p className="mt-1 text-xs text-primary">{s.tagline}</p>}
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted">{s.excerpt}</p>
                        <div className="mt-5 flex items-center justify-between border-t border-card-border pt-4">
                          <span className="text-xs text-foreground-faint ltr-nums">{s.priceFrom ? `از ${faNumber(s.priceFrom)} ت` : ""}</span>
                          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                            جزئیات <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
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
