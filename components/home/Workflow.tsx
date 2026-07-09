import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";

const STEPS = [
  { n: "۰۱", title: "کشف و استراتژی", desc: "شناخت عمیق برند، بازار و اهداف؛ ترسیم نقشه‌راه دقیق.", icon: "Target" },
  { n: "۰۲", title: "ایده و کانسپت", desc: "خلق ایده مرکزی و روایتی که برند شما را متمایز می‌کند.", icon: "Sparkles" },
  { n: "۰۳", title: "تولید و اجرا", desc: "اجرای حرفه‌ای با بالاترین استانداردهای سینمایی و فنی.", icon: "Clapperboard" },
  { n: "۰۴", title: "انتشار و تحلیل", desc: "انتشار چندکاناله و بهینه‌سازی مستمر بر پایه داده.", icon: "TrendingUp" },
];

export function Workflow() {
  return (
    <Section id="process">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="فرایند کار"
          title={
            <>
              مسیری شفاف تا <span className="text-gradient">تأثیر واقعی</span>
            </>
          }
          description="چهار گام روشن که خلاقیت را به نتیجه‌ی تجاری تبدیل می‌کند."
          className="mx-auto mb-16 max-w-2xl"
        />

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute inset-x-0 top-9 hidden h-px bg-gradient-to-l from-transparent via-card-border to-transparent lg:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6 grid h-18 w-18 place-items-center rounded-2xl border border-card-border bg-surface p-5 text-primary">
                  <Icon name={s.icon} className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {s.n}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground-muted">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
