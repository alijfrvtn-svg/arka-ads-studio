import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ParticleWave } from "./ParticleWave";

/**
 * The About hero, over a live background.
 *
 * The wave is a drawn surface rather than a video — see ParticleWave. It runs
 * low and wide in the frame; the copy sits above it and stops where it begins,
 * so type and dots never share the same ground and the ink never needs a scrim
 * to survive. The page stays white paper that happens to be moving at the foot
 * of the hero.
 */
export function AboutHero({
  eyebrow,
  title,
  description,
  breadcrumb,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative isolate overflow-hidden pb-40 pt-40 md:pb-52 md:pt-52">
      {/* Anchored to the foot of the section rather than inset-0, and masked so
          it fades in over its own top third. The surface is dense and solid at
          the bottom of the frame where nothing is set, and by the height the
          copy occupies it has thinned to a mist — so the wave is a background
          the type sits on rather than something the type has to survive. */}
      <ParticleWave className="about-wave pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[62%] w-full" />

      <Container className="relative">
        {breadcrumb && (
          <Reveal>
            <nav className="-mx-2 mb-5 flex flex-wrap items-center text-xs text-foreground-faint">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="inline-flex min-h-11 items-center px-2 transition-colors hover:text-foreground">
                      {b.label}
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-11 items-center px-2 text-foreground-muted">{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
                </span>
              ))}
            </nav>
          </Reveal>
        )}

        {eyebrow && (
          <Reveal>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground balance sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>

        {description && (
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-foreground-muted">{description}</p>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
