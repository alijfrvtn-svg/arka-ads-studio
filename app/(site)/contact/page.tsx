import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { getContactPage } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { ui } from "@/lib/i18n";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = await getContactPage(locale);
  return buildMetadata({ title: c.metaTitle, path: "/contact", description: c.metaDescription, locale });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const c = await getContactPage(locale);
  const bboxLat = 0.03;
  const bboxLng = 0.03;
  const bbox = `${c.mapLng - bboxLng}%2C${c.mapLat - bboxLat}%2C${c.mapLng + bboxLng}%2C${c.mapLat + bboxLat}`;

  return (
    <>
      <PageHero
        eyebrow={c.heroEyebrow}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navContact }]}
        title={<HighlightedTitle title={c.heroTitle} highlight={c.heroTitleHighlight} />}
        description={c.heroDescription}
      />

      <Section className="pt-0">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="rounded-2xl border border-card-border bg-surface/50 p-6 md:p-8">
                {/* ContactForm reads ?plan=/?service= via useSearchParams. Now
                    that this page prerenders (it stopped being forced-dynamic
                    when the site layout's cookie read went away), that hook
                    needs its own boundary or the whole route bails out of
                    static generation. */}
                <Suspense fallback={<div className="min-h-[32rem]" />}>
                  <ContactForm serviceOptions={c.serviceOptions} budgetOptions={c.budgetOptions} locale={locale} />
                </Suspense>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <ContactRow icon={MapPin} label={ui(locale).contactRowOffice} value={c.address} />
                  <ContactRow icon={Phone} label={ui(locale).contactRowPhone} value={c.phoneDisplay} href={`tel:${c.phone}`} ltr />
                  <ContactRow icon={Mail} label={ui(locale).contactRowEmail} value={c.email} href={`mailto:${c.email}`} ltr />
                  <ContactRow icon={Clock} label={ui(locale).contactRowHours} value={c.officeHours} />
                </div>

                {/* The map is interface, not imagery, so it stays achromatic.
                    Greyscale rather than the old invert(), which existed only
                    to fake dark tiles for the dark theme. */}
                <div className="relative overflow-hidden rounded-[1.5rem] border border-card-border">
                  <iframe
                    title={ui(locale).mapTitle}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${c.mapLat}%2C${c.mapLng}`}
                    className="h-64 w-full"
                    style={{ filter: "grayscale(1) contrast(1.04)" }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                </div>

                <div className="rounded-[1.5rem] border border-card-border bg-surface-2 p-7">
                  <p className="mb-4 text-sm font-semibold text-foreground">{ui(locale).footerFollowUs}</p>
                  <div className="flex gap-2">
                    {c.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="liquid liquid-clear grid h-11 w-11 place-items-center rounded-full text-foreground-muted hover:text-foreground"
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
    <div className="flex items-start gap-4 rounded-[1.25rem] border border-card-border bg-surface-2 p-6 transition-all duration-500 [transition-timing-function:var(--ease-apple)] hover:border-foreground/25 hover:bg-background hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(0,0,0,0.3)]">
      <span className="liquid-clear grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-foreground">
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
