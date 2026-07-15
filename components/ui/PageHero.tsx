import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Container, Eyebrow } from "./Section";
import { Reveal } from "@/components/fx/Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  image,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  image?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 md:pt-44">
      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background" />
        </>
      )}
      <div className="hero-grid absolute inset-0 opacity-50" />
      <div className="aurora animate-aurora-1 -left-32 -top-24 h-96 w-96 bg-primary/20" />
      <Container className="relative">
        {breadcrumb && (
          <Reveal>
            <nav className="mb-5 flex items-center gap-1.5 text-xs text-foreground-faint">
              {breadcrumb.map((b, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {b.href ? (
                    <Link href={b.href} className="hover:text-primary">{b.label}</Link>
                  ) : (
                    <span className="text-foreground-muted">{b.label}</span>
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
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground balance sm:text-5xl md:text-6xl lg:text-7xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground-muted">{description}</p>
          </Reveal>
        )}
        {children && <Reveal delay={0.15}>{children}</Reveal>}
      </Container>
    </section>
  );
}
