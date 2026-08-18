import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";

/**
 * Services hero — white page, soft colour blooming from the floor.
 *
 * The copy sits in clean whitespace at the top; the colour lives entirely in
 * the lower half as a handful of wide, heavily blurred radials that bleed into
 * one another. Nothing has an edge — at this blur the eight brand colours stop
 * reading as eight separate blobs and become one continuous wash, which is the
 * whole effect.
 *
 * Contrast is handled by placement rather than by a scrim: the bloom's box
 * starts below the last line of copy, so text is always ink on plain white and
 * no part of the gradient has to be dimmed to protect it. The bottom padding
 * exists to buy that clearance — at the first sizing the description overlapped
 * the bloom by 209px and only the mask was hiding it, which is a coincidence
 * rather than a rule.
 *
 * Replaces a ruled lattice that filled the same space with 24 bordered cells.
 * Same copy, same whitespace, none of the noise.
 */
export function ServicesHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="services-hero relative overflow-hidden pb-56 pt-36 md:pb-72 md:pt-44">
      {/* The bloom. Anchored to the bottom edge and fading out well before the
          copy, so it never sits behind type. */}
      <div className="services-bloom pointer-events-none absolute inset-x-0 bottom-0 h-[34%]" aria-hidden />

      <div className="container-x relative">
        {breadcrumb && (
          <nav className="mb-6 flex flex-wrap items-center justify-center text-xs text-foreground-faint">
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

        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <Reveal>
              <span className="eyebrow mx-auto w-fit">{eyebrow}</span>
            </Reveal>
          )}
          <Reveal delay={0.05}>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-foreground balance sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
          </Reveal>
          {description && (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-foreground-muted md:text-lg">
                {description}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
