import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "glow" | "dark";
type Size = "sm" | "md" | "lg";

// On a white page contrast, not hue, is what ranks an action — so `primary`
// and `glow` are both ink, separated by material: `primary` is solid, `glow`
// is the liquid-glass pill with a specular sweep. `outline` is the clear glass
// counterpart for secondary actions.
const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(0,0,0,0.18),0_14px_34px_-14px_rgba(0,0,0,0.45)] hover:-translate-y-px hover:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_20px_44px_-16px_rgba(0,0,0,0.55)]",
  glow: "btn-glow",
  outline: "liquid liquid-clear",
  ghost: "text-foreground hover:bg-card-hover",
  dark: "bg-foreground text-background hover:opacity-90",
};
// Heights are tap targets first: `sm` was 36px, below the 44px floor, and it is
// what the header CTA uses — on a tablet that is a touch target, not a mouse one.
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[13px] gap-1.5 sm:h-11",
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
    "group inline-flex select-none items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-500 [transition-timing-function:var(--ease-apple)] active:scale-[0.98] focus-visible:outline-none",
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
