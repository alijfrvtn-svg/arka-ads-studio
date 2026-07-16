import { Container } from "@/components/ui/Section";
import { Counter } from "@/components/fx/Counter";
import { Reveal } from "@/components/fx/Reveal";
import type { Locale } from "@/types";

export function StatsBar({ stats, locale = "fa" }: { stats: { label: string; value: number; suffix: string }[]; locale?: Locale }) {
  return (
    <section className="relative overflow-hidden border-y border-card-border py-20">
      <div className="reel-bg absolute inset-0 opacity-[0.12]" />
      <div className="absolute inset-0 dotgrid opacity-40" />
      <Container className="relative">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 lg:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="font-display text-4xl font-extrabold text-foreground md:text-5xl lg:text-6xl">
                <Counter value={s.value} suffix={s.suffix} locale={locale} />
              </div>
              <div className="mt-3 text-sm text-foreground-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
