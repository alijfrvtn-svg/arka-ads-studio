import type { Metadata } from "next";
import { Sparkles, Target, Gem, Zap, type LucideIcon } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { StatsBar } from "@/components/home/StatsBar";
import { FinalCTA } from "@/components/home/FinalCTA";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { getStats, getTeam, getAboutPage, getHomePage, getContactPage } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { tr, ui } from "@/lib/i18n";
import { parseArr } from "@/lib/utils";
import { getLocale } from "@/lib/get-locale";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { Social } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const a = await getAboutPage(locale);
  return buildMetadata({ title: a.metaTitle, path: "/about", description: a.metaDescription });
}

const ICONS: Record<string, LucideIcon> = { Target, Gem, Zap, Sparkles };

export default async function AboutPage() {
  const locale = await getLocale();
  const [team, stats, a, home, contact] = await Promise.all([
    getTeam(),
    getStats(),
    getAboutPage(locale),
    getHomePage(locale),
    getContactPage(locale),
  ]);
  const statData = stats.map((s) => ({ label: tr(locale, s.label, s.labelEn, s.labelAr), value: s.value, suffix: s.suffix }));

  return (
    <>
      <PageHero
        eyebrow={a.heroEyebrow}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navAbout }]}
        title={<HighlightedTitle title={a.heroTitle} highlight={a.heroTitleHighlight} />}
        description={a.heroDescription}
      />

      {/* story */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-card-border">
                <VideoPlayer src={a.storyVideo} poster={a.storyPoster} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <Eyebrow>{a.storyEyebrow}</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                  {a.storyHeading}
                </h2>
                <div className="mt-5 space-y-4 leading-loose text-foreground-muted">
                  {a.storyParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <StatsBar stats={statData} locale={locale} />

      {/* values */}
      <Section>
        <Container>
          <SectionHeading align="center" eyebrow={a.valuesEyebrow} title={a.valuesHeading} className="mx-auto mb-14 max-w-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => {
              const I = ICONS[v.icon] ?? Sparkles;
              return (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="h-full rounded-2xl border border-card-border bg-surface p-6">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
                      <I className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* team */}
      <Section className="bg-background-2">
        <Container>
          <SectionHeading align="center" eyebrow={a.teamEyebrow} title={a.teamHeading} className="mx-auto mb-14 max-w-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => {
              const socials = parseArr<Social>(m.socials);
              return (
                <Reveal key={m.id} delay={i * 0.06}>
                  <div className="group relative overflow-hidden rounded-2xl border border-card-border">
                    <div className="relative aspect-[4/5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.avatar || ""} alt={m.name} className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display text-lg font-bold text-white">{tr(locale, m.name, m.nameEn, null)}</h3>
                      <p className="text-sm text-white/70">{tr(locale, m.role, m.roleEn, m.roleAr)}</p>
                      <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {socials.map((s, k) => (
                          <span key={k} className="grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white">
                            <SocialIcon platform={s.platform} className="h-4 w-4" />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* timeline */}
      <Section>
        <Container className="max-w-3xl">
          <SectionHeading align="center" eyebrow={a.timelineEyebrow} title={a.timelineHeading} className="mx-auto mb-14 max-w-2xl" />
          <div className="relative border-r-2 border-card-border pr-8">
            {a.timeline.map((t, i) => (
              <Reveal key={t.year + t.title} delay={i * 0.08}>
                <div className="relative pb-10 last:pb-0">
                  <span className="absolute -right-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-primary bg-background">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <span className="font-display text-2xl font-extrabold text-gradient">{t.year}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-foreground-muted">{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* BTS gallery */}
      <Section className="bg-background-2">
        <Container>
          <SectionHeading eyebrow={a.galleryEyebrow} title={a.galleryHeading} className="mb-10" />
          <div className="grid gap-4 md:grid-cols-3">
            <Reveal className="md:col-span-2">
              <div className="aspect-video overflow-hidden rounded-2xl border border-card-border">
                <VideoPlayer src={a.galleryVideo} poster={a.galleryPoster} />
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {a.galleryImages.map((b, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b} alt="" className="aspect-video w-full rounded-2xl border border-card-border object-cover" />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <FinalCTA content={home} phone={contact.phone} phoneDisplay={contact.phoneDisplay} />
    </>
  );
}
