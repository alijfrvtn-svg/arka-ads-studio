import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn, toFa } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  breadcrumb,
  children,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumb && (
          <nav className="mb-2 flex items-center gap-1 text-xs text-foreground-faint">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {b.href ? (
                  <Link href={b.href} className="hover:text-primary">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground-muted">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-2xl font-bold text-foreground md:text-[1.75rem]">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-foreground-muted">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-2xl border border-card-border bg-surface", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
          {typeof title === "string" ? (
            <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  hint?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-card-border bg-surface p-5 transition-colors hover:border-primary/40">
      <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold text-foreground">
            {typeof value === "number" ? toFa(value) : value}
          </p>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-card-border bg-background/50 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {(delta !== undefined || hint) && (
        <div className="relative mt-3 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span className={cn("font-semibold", up ? "text-emerald-400" : "text-rose-400")}>
              {up ? "▲" : "▼"} {toFa(Math.abs(delta))}٪
            </span>
          )}
          {hint && <span className="text-foreground-faint">{hint}</span>}
        </div>
      )}
    </div>
  );
}

const STATUS: Record<string, { label: string; cls: string }> = {
  NEW: { label: "جدید", cls: "border-primary/30 bg-primary/10 text-primary" },
  CONTACTED: { label: "تماس گرفته", cls: "border-amber-400/30 bg-amber-400/10 text-amber-400" },
  PROPOSAL: { label: "پیشنهاد", cls: "border-sky/30 bg-sky/10 text-sky" },
  WON: { label: "برنده", cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" },
  LOST: { label: "از دست رفته", cls: "border-rose-400/30 bg-rose-400/10 text-rose-400" },
  PUBLISHED: { label: "منتشر شده", cls: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" },
  DRAFT: { label: "پیش‌نویس", cls: "border-foreground-faint/30 bg-card-hover text-foreground-muted" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: "border-card-border text-foreground-muted" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-card-border bg-surface/50 px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-card-border bg-background/50 text-foreground-faint">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display text-lg font-bold text-foreground">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-foreground-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
