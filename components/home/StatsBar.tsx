import { Container } from "@/components/ui/Section";
import { Counter } from "@/components/fx/Counter";
import { Reveal } from "@/components/fx/Reveal";
import type { Locale } from "@/types";

/**
 * The numbers, on a slab of black glass.
 *
 * This section sits between the painted process section and the coloured
 * industry rows, and as flat white it read as a gap rather than as a section.
 * Ink is the rhythm break: loud, then hard black, then colour again — and it
 * finally gives the figures the weight they were asking for.
 *
 * The material is `.ink-surface`, the same class the footer uses, so the two
 * black passages on the page are the same glass rather than two lookalikes.
 * It brings its own inverted tokens with it, which is why nothing here carries
 * a colour class.
 *
 * Full-bleed on purpose: a rounded card would read as one more panel floating
 * on the page, where the point is a band cutting straight across it.
 */
export function StatsBar({ stats, locale = "fa" }: { stats: { label: string; value: number; suffix: string }[]; locale?: Locale }) {
  return (
    <section className="ink-surface relative overflow-hidden py-24 md:py-28">
      <Container className="relative">
        <div className="grid grid-cols-2 gap-y-14 md:grid-cols-4 lg:grid-cols-5">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="text-center">
              <div className="font-display text-5xl font-extrabold tracking-[-0.03em] text-foreground md:text-6xl lg:text-[4.25rem]">
                <Counter value={s.value} suffix={s.suffix} locale={locale} />
              </div>
              <div className="mt-4 text-sm text-foreground-muted">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
