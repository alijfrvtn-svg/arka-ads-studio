import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "glow" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_10px_40px_-12px_var(--primary)]",
  glow: "btn-glow text-white",
  outline: "border border-card-border text-foreground hover:border-primary hover:text-primary",
  ghost: "text-foreground hover:bg-card-hover",
  dark: "bg-foreground text-background hover:opacity-90",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2.5",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: BaseProps &
  (
    | ({ href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>)
  )) {
  const cls = cn(
    "group inline-flex select-none items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-300 active:scale-[0.98] focus-visible:outline-none",
    variants[variant],
    sizes[size],
    className,
  );
  if (href) {
    const isInternal = href.startsWith("/");
    if (isInternal) {
      return (
        <Link href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
