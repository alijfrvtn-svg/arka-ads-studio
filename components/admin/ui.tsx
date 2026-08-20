import Link from "next/link";
import { ChevronLeft, type LucideIcon } from "lucide-react";
import { cn, toFa } from "@/lib/utils";

/**
 * The panel's content primitives, in soft-UI glass.
 *
 * Every page under /admin builds from these four, which is why they were worth
 * rewriting instead of thirty-three pages: change the card here and the whole
 * panel changes with it.
 *
 * The grammar is the one in `app/admin/ios.css` — a surface is either raised
 * (two lights, highlight from the top inline-start, shadow from the bottom
 * inline-end) or recessed (the same pair inverted and moved inside). Raised
 * means you can act on it; recessed means it receives. Nothing is outlined,
 * because a border and a moulded edge are two different explanations of where
 * a surface stops, and using both reads as neither.
 *
 * iOS structure underneath is untouched: 44px rows, separators inset to the
 * label, and the same type scale.
 */

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
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {breadcrumb && (
          <nav className="mb-2 flex items-center gap-1 text-[0.8125rem] text-[var(--ios-label-3)]">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {b.href ? (
                  <Link href={b.href} className="text-[var(--ios-blue)]">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-[var(--ios-label-2)]">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronLeft className="h-3 w-3" />}
              </span>
            ))}
          </nav>
        )}
        <h1 className="ios-large-title">{title}</h1>
        {description && <p className="ios-subhead mt-1.5 text-[var(--ios-label-2)]">{description}</p>}
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
  /** For cards holding something already opaque — a chart, a photograph. */
  solid,
  children,
}: {
  title?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  solid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("ios-group", solid && "ios-group-solid", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          {typeof title === "string" ? <h3 className="ios-headline">{title}</h3> : title}
          {action}
        </div>
      )}
      <div className={cn("p-5", (title || action) && "pt-0", bodyClassName)}>{children}</div>
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
  // `null` means "measured, but there is no prior period to compare with" —
  // rendered as no arrow at all. `undefined` means the metric has no trend.
  delta?: number | null;
  icon: LucideIcon;
  hint?: string;
}) {
  const showDelta = typeof delta === "number";
  const up = (delta ?? 0) >= 0;
  return (
    <div className="ios-group p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="ios-subhead text-[var(--ios-label-2)]">{label}</p>
          <p className="ios-title-1 mt-1.5">{typeof value === "number" ? toFa(value) : value}</p>
        </div>
        {/* The icon sits in its own recessed well, which is what keeps a row of
            these reading as one moulded panel rather than as four boxes. */}
        <span
          className="grid h-11 w-11 flex-none place-items-center rounded-[13px] text-[var(--ios-blue)]"
          style={{ background: "rgba(255,255,255,0.34)", boxShadow: "var(--neo-inset)" }}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {(showDelta || hint) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.75rem]">
          {showDelta && (
            <span
              className="font-semibold"
              style={{ color: up ? "var(--ios-green)" : "var(--ios-red)" }}
            >
              {up ? "▲" : "▼"} {toFa(Math.abs(delta as number))}٪
            </span>
          )}
          {hint && <span className="text-[var(--ios-label-3)]">{hint}</span>}
        </div>
      )}
    </div>
  );
}

/**
 * Status, as a tinted pill.
 *
 * The colours are the system ones rather than the site's four: a badge saying
 * "lost" in the brand coral would be reading as decoration when it is meant to
 * be reading as state.
 */
const STATUS: Record<string, { label: string; tone: string }> = {
  NEW: { label: "جدید", tone: "var(--ios-blue)" },
  CONTACTED: { label: "تماس گرفته", tone: "var(--ios-orange)" },
  PROPOSAL: { label: "پیشنهاد", tone: "var(--ios-teal)" },
  WON: { label: "برنده", tone: "var(--ios-green)" },
  LOST: { label: "از دست رفته", tone: "var(--ios-red)" },
  PUBLISHED: { label: "منتشر شده", tone: "var(--ios-green)" },
  DRAFT: { label: "پیش‌نویس", tone: "var(--ios-label-2)" },
  TODO: { label: "در انتظار", tone: "var(--ios-blue)" },
  IN_PROGRESS: { label: "در حال انجام", tone: "var(--ios-orange)" },
  DONE: { label: "انجام‌شده", tone: "var(--ios-green)" },
  CANCELLED: { label: "لغوشده", tone: "var(--ios-red)" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, tone: "var(--ios-label-2)" };
  return (
    <span
      className="ios-badge"
      style={{ background: `color-mix(in srgb, ${s.tone} 16%, transparent)`, color: s.tone }}
    >
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
    <div className="ios-group flex flex-col items-center justify-center px-6 py-16 text-center">
      <span
        className="mb-4 grid h-14 w-14 place-items-center rounded-[17px] text-[var(--ios-label-3)]"
        style={{ background: "rgba(255,255,255,0.34)", boxShadow: "var(--neo-inset)" }}
      >
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="ios-title-3">{title}</h3>
      {description && <p className="ios-subhead mt-1.5 max-w-sm text-[var(--ios-label-2)]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
