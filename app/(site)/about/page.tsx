import type { Metadata } from "next";
import { Sparkles, Target, Gem, Zap } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container, SectionHeading, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { StatsBar } from "@/components/home/StatsBar";
import { FinalCTA } from "@/components/home/FinalCTA";
import { VideoPlayer } from "@/components/work/VideoPlayer";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { getStats, getTeam } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { SAMPLE } from "@/lib/media";
import { parseArr, toFa } from "@/lib/utils";
import type { Social } from "@/types";

export const metadata: Metadata = buildMetadata({
  title: "درباره ما",
  path: "/about",
  description: "آرکا؛ تیمی از ذهن‌های خلاق که برندها را با روایت بصری سینمایی متحول می‌کنند.",
});

const VALUES = [
  { icon: "Target", title: "استراتژی‌محور", desc: "هر تصمیم خلاقانه ریشه در داده و هدف دارد." },
  { icon: "Gem", title: "کیفیت بی‌سازش", desc: "استانداردهای سینمایی در هر فریم و پیکسل." },
  { icon: "Zap", title: "سرعت و چابکی", desc: "تحویل به‌موقع بدون قربانی‌کردن کیفیت." },
  { icon: "Sparkles", title: "خلاقیت بی‌مرز", desc: "ایده‌هایی که مرزها را جابه‌جا می‌کنند." },
];
const ICONS: Record<string, any> = { Target, Gem, Zap, Sparkles };

const TIMELINE = [
  { year: "۱۳۹۶", title: "تولد آرکا", desc: "با یک دوربین و یک رؤیا، کار را آغاز کردیم." },
  { year: "۱۳۹۸", title: "اولین کمپین ملی", desc: "نخستین برندفیلمی که در تلویزیون ملی پخش شد." },
  { year: "۱۴۰۰", title: "دپارتمان دیجیتال", desc: "افزودن پرفورمنس مارکتینگ و سئو به خدمات." },
  { year: "۱۴۰۲", title: "جوایز خلاقیت", desc: "کسب چند جایزه ملی و بین‌المللی طراحی." },
  { year: "۱۴۰۴", title: "بیش از ۴۸۰ پروژه", desc: "همراهی با ۱۲۰ برند در ۱۲ صنعت مختلف." },
];

export default async function AboutPage() {
  const [team, stats] = await Promise.all([getTeam(), getStats()]);
  const statData = stats.map((s) => ({ label: s.label, value: s.value, suffix: s.suffix }));

  return (
    <>
      <PageHero
        eyebrow="درباره آرکا"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
        title={<>ذهن‌های پشتِ <span className="text-gradient">جادو</span></>}
        description="ما فقط محتوا نمی‌سازیم؛ برای برندها روایت می‌سازیم، تجربه خلق می‌کنیم و تأثیر می‌گذاریم."
      />

      {/* story */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-card-border">
                <VideoPlayer src={SAMPLE.reels[0]} poster={SAMPLE.bts[0]} />
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <Eyebrow>داستان ما</Eyebrow>
                <h2 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
                  یک پروداکشن‌هاوس، نه صرفاً یک آژانس
                </h2>
                <div className="mt-5 space-y-4 leading-loose text-foreground-muted">
                  <p>آرکا در سال ۱۳۹۶ با این باور متولد شد که برندهای بزرگ با روایت‌های بزرگ ساخته می‌شوند. ما ترکیبی از هنر سینما، تفکر استراتژیک و داده هستیم.</p>
                  <p>امروز، تیمی چندتخصصی از کارگردان، طراح، استراتژیست و بازاریاب، زیر یک سقف گرد آمده‌اند تا مشکلات واقعی برندها را حل کنند.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <StatsBar stats={statData} />

      {/* values */}
      <Section>
        <Container>
          <SectionHeading align="center" eyebrow="ارزش‌ها" title="آنچه ما را متمایز می‌کند" className="mx-auto mb-14 max-w-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const I = ICONS[v.icon];
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
          <SectionHeading align="center" eyebrow="تیم" title="ذهن‌های خلاق آرکا" className="mx-auto mb-14 max-w-2xl" />
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
                      <h3 className="font-display text-lg font-bold text-white">{m.name}</h3>
                      <p className="text-sm text-white/70">{m.role}</p>
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
          <SectionHeading align="center" eyebrow="مسیر رشد" title="سفر آرکا در یک نگاه" className="mx-auto mb-14 max-w-2xl" />
          <div className="relative border-r-2 border-card-border pr-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08}>
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
          <SectionHeading eyebrow="پشت صحنه" title="جادو چگونه ساخته می‌شود" className="mb-10" />
          <div className="grid gap-4 md:grid-cols-3">
            <Reveal className="md:col-span-2">
              <div className="aspect-video overflow-hidden rounded-2xl border border-card-border">
                <VideoPlayer src={SAMPLE.reels[1]} poster={SAMPLE.bts[1]} />
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              {SAMPLE.bts.slice(2, 4).map((b, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b} alt="" className="aspect-video w-full rounded-2xl border border-card-border object-cover" />
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}
