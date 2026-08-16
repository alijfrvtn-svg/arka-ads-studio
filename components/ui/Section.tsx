import { cn } from "@/lib/utils";
import { Reveal } from "@/components/fx/Reveal";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("container-x", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("section", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-[-0.028em] text-foreground balance sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-foreground-muted md:text-lg",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function Badge({
  children,
  className,
  tone = "default",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "default" | "primary" | "success" | "warn" | "danger";
}) {
  // Monochrome: severity is carried by ink density and weight, not hue —
  // "danger" is the boldest, "default" the lightest. Anywhere the distinction
  // has to survive a glance, pair the badge with a word.
  const tones = {
    default: "border-card-border bg-surface-2 text-foreground-muted",
    primary: "border-foreground/20 bg-foreground/[0.06] text-foreground",
    success: "border-foreground/25 bg-foreground/[0.05] font-semibold text-foreground",
    warn: "border-foreground/40 bg-foreground/[0.08] font-semibold text-foreground",
    danger: "border-transparent bg-foreground font-semibold text-background",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
