import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { SITE } from "@/lib/constants";

export function FinalCTA() {
  return (
    <section className="section">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-card-border px-6 py-20 text-center md:px-16 md:py-28">
          <div className="reel-bg absolute inset-0 opacity-20" />
          <div className="absolute inset-0 dotgrid opacity-30" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="relative">
            <Reveal>
              <p className="eyebrow mx-auto w-fit">آماده‌اید متمایز شوید؟</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight text-foreground balance md:text-6xl">
                بیایید برندی بسازیم که <span className="text-gradient">فراموش نشود</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-foreground-muted">
                یک ایده کافی است. باقی مسیر را با هم می‌سازیم.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  شروع پروژه
                  <ArrowUpLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </Link>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-card-border px-8 py-4 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <span className="ltr-nums">{SITE.phoneDisplay}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
