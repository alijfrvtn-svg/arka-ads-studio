import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { WaveHero } from "@/components/ui/WaveHero";
import { Section, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { labelOn } from "@/lib/utils";

import { getContactPage } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { getAppearance } from "@/lib/appearance";
import { getUi } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // Interface strings, with anything edited in the panel applied. Cached per
  // request, so every component asking for it costs one query between them.
  const t = await getUi(locale);
  const c = await getContactPage(locale);
  return buildMetadata({ title: c.metaTitle, path: "/contact", description: c.metaDescription, locale });
}

export default async function ContactPage() {
  // The live identity, edited in the panel; falls back to the shipped
  // constants when nothing is saved. Cached per request.
  const { departmentGradient: DEPARTMENT_DESC_GRADIENT, industryPaint: INDUSTRY_PAINT } = await getAppearance();
  // The teal of the four supplied pairs. Derived here rather than at module
  // scope now that the palette is read per request.
  const SOCIAL_GRADIENT = DEPARTMENT_DESC_GRADIENT.DIGITAL;
  const locale = await getLocale();
  const t = await getUi(locale);
  const c = await getContactPage(locale);
  const bboxLat = 0.03;
  const bboxLng = 0.03;
  const bbox = `${c.mapLng - bboxLng}%2C${c.mapLat - bboxLat}%2C${c.mapLng + bboxLng}%2C${c.mapLat + bboxLat}`;

  return (
    <>
      <WaveHero
        eyebrow={c.heroEyebrow}
        breadcrumb={[{ label: t.navHome, href: "/" }, { label: t.navContact }]}
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

              {/* Under the form, which is where someone lands once they have
                  decided not to fill it in. The teal of the four supplied
                  pairs: the one that is neither the near-black of the footer
                  nor the light violet, which would put white icons at 4.90:1.
                  Here white sits at 8.70:1 against the lighter stop. */}
              <div
                className="relative isolate mt-6 overflow-hidden rounded-[1.5rem] p-7"
                style={{ background: `linear-gradient(150deg, ${SOCIAL_GRADIENT[0]} 0%, ${SOCIAL_GRADIENT[1]} 100%)` }}
              >
                <span className="crystal" aria-hidden />
                <div className="relative flex flex-wrap items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-white">{t.footerFollowUs}</p>
                  <div className="flex gap-2">
                    {c.socials.map((s) => (
                      <a
                        key={s.platform}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={s.label}
                        className="grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-500 hover:bg-white/20"
                      >
                        <SocialIcon platform={s.platform} className="h-[18px] w-[18px]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="space-y-6">
                {/* One of the four per row, in order — the same four that
                    carry every other coloured surface on the site. */}
                <div className="space-y-4">
                  <ContactRow colour={INDUSTRY_PAINT[0]} icon={MapPin} label={t.contactRowOffice} value={c.address} />
                  <ContactRow colour={INDUSTRY_PAINT[1]} icon={Phone} label={t.contactRowPhone} value={c.phoneDisplay} href={`tel:${c.phone}`} ltr />
                  <ContactRow colour={INDUSTRY_PAINT[2]} icon={Mail} label={t.contactRowEmail} value={c.email} href={`mailto:${c.email}`} ltr />
                  <ContactRow colour={INDUSTRY_PAINT[3]} icon={Clock} label={t.contactRowHours} value={c.officeHours} />
                </div>

                {/* The tiles keep their own colour now — parks green, water
                    blue, roads picked out — which is what makes a map legible
                    as a map rather than as a grey texture. It was greyscaled to
                    match the achromatic pass; that no longer holds now the page
                    carries colour of its own. */}
                <div className="relative overflow-hidden rounded-[1.5rem] border border-card-border">
                  <iframe
                    title={t.mapTitle}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${c.mapLat}%2C${c.mapLng}`}
                    className="h-64 w-full"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  ltr,
  colour,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
  ltr?: boolean;
  colour: string;
}) {
  // Computed per hex, never paired by hand: these four span a coral and a gold
  // that want ink and a blue and a violet that want white. Floor across the set
  // is 5.70:1 for the value and 4.55:1 for the label at 0.8.
  const ink = labelOn(colour);
  const onDark = ink === "#ffffff";
  const inner = (
    <div
      className="ind-row flex items-start gap-4 overflow-hidden rounded-[1.25rem] p-6 transition-all duration-500 [transition-timing-function:var(--ease-apple)] hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_44px_-24px_rgba(0,0,0,0.45)]"
      style={{ background: colour, color: ink }}
    >
      <span className="crystal" aria-hidden />
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border ${
          onDark ? "border-white/35 bg-white/15" : "border-black/20 bg-black/[0.07]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs" style={{ opacity: 0.8 }}>
          {label}
        </p>
        <p className={`mt-0.5 font-semibold ${ltr ? "ltr-nums" : ""}`}>{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}
