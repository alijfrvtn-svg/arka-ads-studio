"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The panel's building blocks, in the iOS 26 idiom.
 *
 * These are deliberately small and dumb. Everything visual lives in
 * `app/admin/ios.css`; this file only decides what markup carries which class,
 * so the look can be adjusted in one place without touching thirty pages.
 *
 * The old primitives in `ui.tsx` and `form.tsx` are left alone — thirty-odd
 * pages still import them, and they keep working while pages move across one
 * at a time.
 */

/* ————— page chrome ————— */

/**
 * The large title, with the actions that belong to the page beside it.
 *
 * On a real device this collapses into the nav bar as you scroll. That is a
 * scroll-linked effect, and on this project scroll-linked effects have earned
 * their scepticism, so it is a plain block: the title is simply large, and the
 * nav bar above it carries the section name.
 */
export function IosTitle({
  title,
  subtitle,
  action,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 px-1 pb-5 pt-2">
      <div className="min-w-0">
        <h1 className="ios-large-title">{title}</h1>
        {subtitle && <p className="ios-subhead mt-1 text-[var(--ios-label-2)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** A grouped section: caption in the gutter, rounded card beneath it. */
export function IosGroup({
  header,
  footer,
  children,
  className,
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-6", className)}>
      {header && <div className="ios-group-header">{header}</div>}
      <div className="ios-group">{children}</div>
      {footer && <div className="ios-group-footer">{footer}</div>}
    </section>
  );
}

/**
 * One row.
 *
 * `href` makes it a link with a chevron, which is the list idiom for "this
 * opens something". Without one it is a plain row that holds a control.
 */
export function IosRow({
  icon,
  tint,
  label,
  detail,
  value,
  href,
  onClick,
  trailing,
  className,
}: {
  icon?: React.ReactNode;
  /** Colour behind the leading icon — a system colour, not a brand one. */
  tint?: string;
  label: React.ReactNode;
  detail?: React.ReactNode;
  value?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  className?: string;
}) {
  const body = (
    <>
      {icon && (
        <span
          className="grid h-[29px] w-[29px] flex-none place-items-center rounded-[7px] text-white"
          style={{ background: tint ?? "var(--ios-blue)" }}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="ios-body block truncate">{label}</span>
        {detail && <span className="ios-footnote block truncate text-[var(--ios-label-2)]">{detail}</span>}
      </span>
      {value && <span className="ios-body flex-none text-[var(--ios-label-2)]">{value}</span>}
      {trailing}
      {/* Points to the inline end, which in this RTL panel is the left. */}
      {href && <ChevronLeft className="h-4 w-4 flex-none text-[var(--ios-label-3)]" />}
    </>
  );

  const cls = cn("ios-row", icon && "ios-row-icon", className);

  if (href) {
    return (
      <Link href={href} className={cls}>
        {body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {body}
      </button>
    );
  }
  return <div className={cls}>{body}</div>;
}

/* ————— controls ————— */

/** The switch. A real checkbox underneath, so forms and keyboards still work. */
export function IosSwitch({
  name,
  checked,
  onChange,
  defaultChecked,
}: {
  name?: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  defaultChecked?: boolean;
}) {
  const controlled = checked !== undefined;
  return (
    <label className="relative inline-flex flex-none cursor-pointer items-center">
      <input
        type="checkbox"
        name={name}
        className="ios-switch-input peer sr-only"
        {...(controlled ? { checked, onChange: (e) => onChange?.(e.target.checked) } : { defaultChecked })}
      />
      <span
        aria-hidden
        className="ios-switch peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ios-blue)]"
      />
    </label>
  );
}

/** Segmented control. One of n, the shape Apple uses instead of tabs in a form. */
export function IosSegmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="ios-segmented" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          data-on={o.value === value}
          onClick={() => onChange(o.value)}
          className="ios-segment"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A labelled row that holds an input, which is how a form looks in a list. */
export function IosFieldRow({
  label,
  children,
  stacked,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  /** For textareas and anything else too tall to sit beside its label. */
  stacked?: boolean;
}) {
  if (stacked) {
    return (
      <div className="ios-row flex-col items-stretch gap-1.5 py-3">
        <span className="ios-footnote text-[var(--ios-label-2)]">{label}</span>
        {children}
      </div>
    );
  }
  return (
    <div className="ios-row">
      <span className="ios-body w-[38%] flex-none text-[var(--ios-label)]">{label}</span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

export function IosButton({
  variant = "filled",
  className,
  ...props
}: { variant?: "filled" | "tinted" | "plain" | "destructive" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "ios-btn",
        variant === "filled" && "ios-btn-filled",
        variant === "tinted" && "ios-btn-tinted",
        variant === "plain" && "ios-btn-plain",
        variant === "destructive" && "ios-btn-destructive",
        className,
      )}
    />
  );
}

/** A status pill in a system colour. */
export function IosBadge({ tone = "gray", children }: { tone?: "gray" | "green" | "orange" | "red" | "blue"; children: React.ReactNode }) {
  const map: Record<string, string> = {
    gray: "var(--ios-label-2)",
    green: "var(--ios-green)",
    orange: "var(--ios-orange)",
    red: "var(--ios-red)",
    blue: "var(--ios-blue)",
  };
  const c = map[tone] ?? map.gray;
  return (
    <span className="ios-badge" style={{ background: `color-mix(in srgb, ${c} 16%, transparent)`, color: c }}>
      {children}
    </span>
  );
}

/** Nothing here yet — said the way the system says it. */
export function IosEmpty({ icon, title, detail, action }: { icon?: React.ReactNode; title: string; detail?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      {icon && <span className="mb-1 text-[var(--ios-label-3)]">{icon}</span>}
      <p className="ios-headline">{title}</p>
      {detail && <p className="ios-subhead max-w-sm text-[var(--ios-label-2)]">{detail}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
