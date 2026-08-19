import type { Metadata } from "next";
import { Sparkles, Target, Gem, Zap, type LucideIcon } from "lucide-react";
import { AboutHero } from "@/components/about/AboutHero";
import { Section, Container, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { StatsBar } from "@/components/home/StatsBar";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { getStats, getTeam, getAboutPage } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { tr, ui } from "@/lib/i18n";
import { parseArr, labelOn, localeDigits, cn } from "@/lib/utils";
import { INDUSTRY_PAINT } from "@/lib/constants";
import { getLocale } from "@/lib/get-locale";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import type { Social } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const a = await getAboutPage(locale);
  return buildMetadata({ title: a.metaTitle, path: "/about", description: a.metaDescription, locale });
}

const ICONS: Record<string, LucideIcon> = { Target, Gem, Zap, Sparkles };

export default async function AboutPage() {
  const locale = await getLocale();
  const [team, stats, a] = await Promise.all([getTeam(), getStats(), getAboutPage(locale)]);
  const statData = stats.map((s) => ({ label: tr(locale, s.label, s.labelEn, s.labelAr), value: s.value, suffix: s.suffix }));

  return (
    <>
      <AboutHero
        eyebrow={a.heroEyebrow}
        breadcrumb={[{ label: ui(locale).navHome, href: "/" }, { label: ui(locale).navAbout }]}
        title={<HighlightedTitle title={a.heroTitle} highlight={a.heroTitleHighlight} />}
        description={a.heroDescription}
      />

      {/* story */}
      <Section>
        <Container>
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <div className="aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-card-border">
                <VideoPlayer src={a.storyVideo} poster={a.storyPoster} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <Eyebrow>{a.storyEyebrow}</Eyebrow>
                <h2 className="mt-5 font-display text-3xl font-bold tracking-[-0.028em] text-foreground md:text-4xl">
                  {a.storyHeading}
                </h2>
                <div className="mt-6 space-y-5 leading-loose text-foreground-muted">
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
          <SectionHeading align="center" eyebrow={a.valuesEyebrow} title={a.valuesHeading} className="mx-auto mb-16 max-w-2xl" />
          {/* The same poster the departments use on the homepage — 4:5, icon
              chip in the corner, copy at the foot — but filled with colour
              instead of a photograph, since a value has no picture of its own.
              Four values, four colours, one each. */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => {
              const I = ICONS[v.icon] ?? Sparkles;
              const colour = INDUSTRY_PAINT[i % INDUSTRY_PAINT.length];
              // Computed per hex, never paired by hand — see labelOn(). The
              // floor across these four is 5.70:1 (white on the violet).
              const label = labelOn(colour);
              const onDark = label === "#ffffff";
              return (
                <Reveal key={v.title} delay={i * 0.08} className="h-full">
                  <div
                    className="ind-row group aspect-[4/5] overflow-hidden rounded-[1.75rem] transition-all duration-700 [transition-timing-function:var(--ease-apple)] hover:-translate-y-1.5 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1),0_36px_70px_-30px_rgba(0,0,0,0.5)]"
                    style={{ background: colour, color: label }}
                  >
                    {/* The cast-glass shell, as on every other coloured surface
                        here. `.ind-row` is what gives it something to size to. */}
                    <span className="crystal" aria-hidden />
                    {/* One wrapper holds everything, and the chip is positioned
                        against it rather than against the card. `.ind-row`
                        forces `position: relative` on each of its own direct
                        children — that is the rule that lifts content above the
                        crystal — so a chip placed directly on the card had its
                        `absolute` overridden and dropped into the flex column
                        on top of the title. */}
                    <div className="relative flex h-full flex-col justify-end p-7">
                      <span
                        className={cn(
                          "absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-[15px] border",
                          onDark ? "border-white/35 bg-white/15" : "border-black/20 bg-black/[0.07]",
                        )}
                      >
                        <I className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-[1.35rem] font-bold leading-snug tracking-tight">{v.title}</h3>
                      {/* 0.85 is the measured floor: below it the description
                          drops under 4.5:1 on the violet. */}
                      <p className="mt-2.5 text-sm leading-relaxed" style={{ opacity: 0.85 }}>
                        {v.desc}
                      </p>
                    </div>
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
          <SectionHeading align="center" eyebrow={a.teamEyebrow} title={a.teamHeading} className="mx-auto mb-16 max-w-2xl" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => {
              const socials = parseArr<Social>(m.socials);
              return (
                <Reveal key={m.id} delay={i * 0.06}>
                  <div className="group relative overflow-hidden rounded-[1.5rem] border border-card-border">
                    <div className="relative aspect-[4/5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.avatar || ""} alt={m.name} className="h-full w-full object-cover transition-all duration-700 [transition-timing-function:var(--ease-apple)] group-hover:scale-[1.03]" />
                      {/* Near-opaque under the name, clear above it — team photos vary too
                          much to trust a thin scrim. */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.86)_30%,rgba(0,0,0,0.34)_60%,rgba(0,0,0,0)_100%)]" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <h3 className="font-display text-lg font-bold text-white">{tr(locale, m.name, m.nameEn, m.nameEn)}</h3>
                      <p className="text-sm text-white/70">{tr(locale, m.role, m.roleEn, m.roleAr)}</p>
                      <div className="mt-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {socials.map((s, k) => (
                          <span key={k} className="glass-onmedia grid h-8 w-8 place-items-center rounded-full">
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
          <SectionHeading align="center" eyebrow={a.timelineEyebrow} title={a.timelineHeading} className="mx-auto mb-16 max-w-2xl" />
          <div className="relative border-r-2 border-card-border pr-8">
            {a.timeline.map((t, i) => (
              <Reveal key={t.year + t.title} delay={i * 0.08}>
                <div className="relative pb-10 last:pb-0">
                  <span className="absolute -right-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-2 border-foreground bg-background">
                    <span className="h-2 w-2 rounded-full bg-foreground" />
                  </span>
                  <span className="font-display text-2xl font-extrabold text-gradient ltr-nums">{localeDigits(locale, t.year)}</span>
                  <h3 className="mt-1.5 font-display text-lg font-bold tracking-tight text-foreground">{t.title}</h3>
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

    </>
  );
}
