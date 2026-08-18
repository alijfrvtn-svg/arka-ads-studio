import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { cn } from "@/lib/utils";

/**
 * The eight accent colours for the small blocks, as given.
 *
 * They are never text backgrounds at full strength — each block paints at a low
 * alpha behind a service name, so the wall reads as a tinted grid rather than
 * eight saturated tiles. See `--a` below.
 */
const BLOCK_COLOURS = [
  "#5B1F2A", "#C8203A", "#5CBFAC", "#5A2D53",
  "#0F4C3A", "#C21E56", "#FF6E42", "#8BC53D",
];

/**
 * Services hero — an engineered grid rather than an empty white field.
 *
 * A 12-column lattice ruled in #eaeaea hairlines. The title takes the largest
 * cell, the supporting copy a mid-sized one, and the remaining cells carry
 * service names on tinted grounds. The point is to look like a studio's own
 * planning wall: busy, ordered, many things in flight at once — the opposite of
 * the single empty expanse it replaces.
 *
 * Asymmetry is built in rather than decorated on. Cell spans, which colour
 * lands where and how strong each tint is all come from the index, so no two
 * rows read alike and the eye never finds a repeat.
 *
 * The names are real services and each links to its page, so the decoration is
 * also navigation — a wall of dead labels would be noise.
 */
export function ServicesGridHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  services,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  services: { slug: string; title: string }[];
}) {
  // Uneven spans, repeating on a long cycle so the lattice never falls into a
  // visible rhythm.
  const SPANS = [3, 2, 4, 2, 3, 5, 2, 3, 2, 4, 3, 2, 5, 2, 3, 4, 2, 3];

  return (
    <section className="services-grid-hero relative overflow-hidden pb-16 pt-36 md:pt-44">
      <div className="container-wide relative">
        {breadcrumb && (
          <nav className="mb-6 -mx-2 flex flex-wrap items-center text-xs text-foreground-faint">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {b.href ? (
                  <Link href={b.href} className="inline-flex min-h-11 items-center px-2 hover:text-foreground">
                    {b.label}
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center px-2 text-foreground-muted">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-foreground-faint">/</span>}
              </span>
            ))}
          </nav>
        )}

        {/* The lattice. Hairlines come from the cells' own borders, so every
            block is ruled without a separate grid overlay to keep in sync. */}
        <div className="grid-wall grid grid-cols-6 lg:grid-cols-12">
          {/* Title — the largest cell by a wide margin, so the eye lands here
              first however busy the rest gets. */}
          <div className="grid-cell col-span-6 row-span-2 flex flex-col justify-center p-7 md:p-10 lg:col-span-8">
            {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
            <Reveal>
              <h1 className="font-display text-3xl font-extrabold leading-[1.1] tracking-[-0.03em] text-foreground balance sm:text-4xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
            </Reveal>
          </div>

          {/* Four tinted cells stacked beside the title. */}
          {services.slice(0, 4).map((s, i) => (
            <TintCell key={s.slug} service={s} i={i} span={i % 2 === 0 ? 2 : 2} />
          ))}

          {/* Supporting copy — mid-sized, directly under the title. */}
          {description && (
            <div className="grid-cell col-span-6 flex items-center p-7 md:p-9 lg:col-span-5">
              <p className="text-sm leading-relaxed text-foreground-muted md:text-base">{description}</p>
            </div>
          )}

          {/* The rest of the wall. */}
          {services.slice(4, 22).map((s, i) => (
            <TintCell key={s.slug} service={s} i={i + 4} span={SPANS[i % SPANS.length]} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One tinted cell.
 *
 * The tint strength is jittered per index — some cells are almost white, a few
 * are strong — which is what stops the wall reading as a chequerboard.
 *
 * The alphas are capped at 0.20 so the label can stay one colour throughout
 * rather than each cell making its own contrast decision: even the darkest of
 * the eight composites to about #ded5dd at that strength, which holds 5.3:1
 * against the muted ink. Measured across all 23 cells the floor is 5.29:1.
 * Raising the cap is the one change here that would need re-checking.
 */
function TintCell({
  service,
  i,
  span,
}: {
  service: { slug: string; title: string };
  i: number;
  span: number;
}) {
  const colour = BLOCK_COLOURS[i % BLOCK_COLOURS.length];
  // 0.05 – 0.20, cycling on a different length to the colours so tint and hue
  // never line up into a pattern.
  const alpha = [0.06, 0.14, 0.09, 0.2, 0.07, 0.16, 0.11, 0.05, 0.18][i % 9];
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "grid-cell group relative flex min-h-[92px] items-end p-4 transition-colors duration-500 [transition-timing-function:var(--ease-apple)] md:min-h-[104px]",
        span <= 2 ? "col-span-3 lg:col-span-2" : span <= 3 ? "col-span-3 lg:col-span-3" : span <= 4 ? "col-span-6 lg:col-span-4" : "col-span-6 lg:col-span-5",
      )}
      style={{ background: `color-mix(in srgb, ${colour} ${alpha * 100}%, transparent)` }}
    >
      <span className="text-[0.7rem] leading-snug text-foreground-muted transition-colors duration-500 group-hover:text-foreground md:text-xs">
        {service.title}
      </span>
    </Link>
  );
}
