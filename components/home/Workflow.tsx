import { Section, Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/fx/Reveal";
import { Icon } from "@/components/ui/Icon";
import { HighlightedTitle } from "@/components/ui/HighlightedTitle";
import { toFa } from "@/lib/utils";
import type { HomeContent } from "@/lib/queries";

export function Workflow({ content }: { content: HomeContent }) {
  return (
    <Section id="process">
      <Container>
        <SectionHeading
          align="center"
          eyebrow={content.workflowEyebrow}
          title={<HighlightedTitle title={content.workflowHeading} highlight={content.workflowHeadingHighlight} />}
          description={content.workflowDescription}
          className="mx-auto mb-16 max-w-2xl"
        />

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute inset-x-0 top-9 hidden h-px bg-gradient-to-l from-transparent via-card-border to-transparent lg:block" />
          {content.workflowSteps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6 grid h-18 w-18 place-items-center rounded-2xl border border-card-border bg-surface p-5 text-primary">
                  <Icon name={s.icon} className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {toFa(String(i + 1).padStart(2, "0"))}
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
