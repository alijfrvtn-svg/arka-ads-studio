import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { DEPARTMENTS } from "@/lib/constants";

export function Departments() {
  return (
    <Section id="departments">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="۴ دپارتمان تخصصی"
            title={
              <>
                یک تیم، <span className="text-gradient">تمام تخصص‌ها</span>
              </>
            }
            description="از ایده تا اکران؛ همه‌ی آنچه برای ساختن یک برند متمایز لازم است، زیر یک سقف."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {DEPARTMENTS.map((d, i) => (
            <Reveal key={d.key} delay={i * 0.08}>
              <Link
                href="/services"
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-card-border bg-surface/40 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: d.accent }}
                />
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-xl border border-card-border bg-background/50 text-primary transition-colors group-hover:border-primary/40">
                  <Icon name={d.icon} className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground">{d.title}</h3>
                <p className="mt-1 text-xs uppercase tracking-widest text-foreground-faint">
                  {d.titleEn}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground-muted">{d.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  کشف خدمات
                  <ArrowUpLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
