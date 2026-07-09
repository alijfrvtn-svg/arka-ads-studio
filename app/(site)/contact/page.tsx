import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "تماس با ما",
  path: "/contact",
  description: "بریف پروژه‌تان را بفرستید یا با تیم آرکا در تهران تماس بگیرید.",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="تماس"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "تماس" }]}
        title={<>بیایید <span className="text-gradient">شروع کنیم</span></>}
        description="ایده‌ای در سر دارید؟ فرم را پر کنید یا مستقیم با ما در ارتباط باشید."
      />

      <Section className="pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="rounded-2xl border border-card-border bg-surface/50 p-6 md:p-8">
                <ContactForm />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <ContactRow icon={MapPin} label="دفتر مرکزی" value={SITE.address} />
                  <ContactRow icon={Phone} label="تلفن" value={SITE.phoneDisplay} href={`tel:${SITE.phone}`} ltr />
                  <ContactRow icon={Mail} label="ایمیل" value={SITE.email} href={`mailto:${SITE.email}`} ltr />
                  <ContactRow icon={Clock} label="ساعات کاری" value="شنبه تا چهارشنبه، ۹ تا ۱۸" />
                </div>

                {/* dark-themed map */}
                <div className="relative overflow-hidden rounded-2xl border border-card-border">
                  <iframe
                    title="نقشه آرکا"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=51.38%2C35.72%2C51.44%2C35.77&layer=mapnik&marker=35.7448%2C51.4101"
                    className="h-64 w-full"
                    style={{ filter: "invert(0.92) hue-rotate(180deg) saturate(0.8) contrast(0.9)" }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-primary/10" />
                </div>

                <div className="rounded-2xl border border-card-border bg-surface/50 p-6">
                  <p className="mb-4 text-sm font-semibold text-foreground">ما را دنبال کنید</p>
                  <div className="flex gap-2">
                    {SITE.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full border border-card-border text-foreground-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                      >
                        <SocialIcon platform={s.platform} className="h-[18px] w-[18px]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ContactRow({ icon: Icon, label, value, href, ltr }: { icon: any; label: string; value: string; href?: string; ltr?: boolean }) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-card-border bg-surface/50 p-5 transition-colors hover:border-primary/40">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-foreground-faint">{label}</p>
        <p className={`mt-0.5 font-medium text-foreground ${ltr ? "ltr-nums" : ""}`}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
