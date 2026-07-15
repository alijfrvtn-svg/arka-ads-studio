import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpLeft, Check } from "lucide-react";
import { db } from "@/lib/db";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { ProjectCard } from "@/components/work/ProjectCard";
import { buildMetadata } from "@/lib/seo";
import { parseArr } from "@/lib/utils";
import { getEmbedUrl } from "@/lib/embed";
import { EmbedFrame } from "@/components/media/EmbedFrame";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = await db.industry.findUnique({ where: { slug } });
  if (!ind) return {};
  return buildMetadata({
    title: ind.metaTitle || `صنعت ${ind.title}`,
    description: ind.metaDescription || ind.excerpt,
    path: `/industries/${ind.slug}`,
    image: ind.cover || undefined,
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = await db.industry.findUnique({
    where: { slug },
    include: {
      projects: { where: { published: true }, take: 6, include: { client: { select: { name: true } } } },
    },
  });
  if (!ind) notFound();
  const approach = parseArr<string>(ind.approach);

  return (
    <>
      {/* hero with industry video */}
      <section className="relative flex min-h-[70vh] items-end overflow-hidden pb-16 pt-40">
        {ind.heroVideo && getEmbedUrl(ind.heroVideo, { autoplay: true, mute: true, loop: true }) ? (
          <EmbedFrame
            src={getEmbedUrl(ind.heroVideo, { autoplay: true, mute: true, loop: true })!}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
          />
        ) : ind.heroVideo ? (
          <video src={ind.heroVideo} poster={ind.cover ?? undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-50" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          ind.cover && <img src={ind.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/25" />
        <Container className="relative">
          <Reveal>
            <nav className="mb-4 text-xs text-foreground-muted">
              <Link href="/" className="hover:text-primary">خانه</Link> ‹ <Link href="/industries" className="hover:text-primary">صنایع</Link>
            </nav>
          </Reveal>
          <Reveal delay={0.05}>
            <span className="eyebrow">راهکار صنعتی</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 font-display text-5xl font-extrabold text-foreground md:text-7xl">{ind.title}</h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-2xl text-lg text-foreground-muted">{ind.description}</p>
          </Reveal>
        </Container>
      </section>

      {/* approach */}
      {approach.length > 0 && (
        <Section>
          <Container>
            <SectionHeading eyebrow="رویکرد ما" title={`چگونه به صنعت ${ind.title} نگاه می‌کنیم`} className="mb-12 max-w-3xl" />
            <div className="grid gap-4 md:grid-cols-2">
              {approach.map((a, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-4 rounded-2xl border border-card-border bg-surface p-6">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary">{i + 1}</span>
                    <p className="text-foreground">{a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* portfolio */}
      {ind.projects.length > 0 && (
        <Section className="bg-background-2">
          <Container>
            <SectionHeading eyebrow="نمونه‌کار" title={`پروژه‌های صنعت ${ind.title}`} className="mb-10" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ind.projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          </Container>
        </Section>
      )}

      {/* cta */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-card-border p-12 text-center">
            <div className="reel-bg absolute inset-0 opacity-15" />
            <div className="relative">
              <h2 className="font-display text-3xl font-extrabold text-foreground md:text-4xl">برند شما در صنعت {ind.title} فعال است؟</h2>
              <p className="mx-auto mt-3 max-w-xl text-foreground-muted">بیایید درباره‌ی رشد برند شما گفت‌وگو کنیم.</p>
              <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
                شروع گفت‌وگو <ArrowUpLeft className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
