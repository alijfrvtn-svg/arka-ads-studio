import { cn } from "@/lib/utils";

/** ARKA fast-forward / double-play mark, recreated from the brand sheet.
 *
 * This is the one element on the public site that keeps ARKA blue at full
 * strength. Everything around it is ink on paper; the mark is the identity
 * itself, and draining it to grey would be redrawing the brand rather than
 * restyling the site. `mono` still forces currentColor for the places that need
 * a single-colour mark (the client marquee, print, favicons). */
export function LogoMark({
  className,
  mono = false,
  boxed = false,
}: {
  className?: string;
  mono?: boolean;
  boxed?: boolean;
}) {
  const id = mono ? "m" : "c";
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("h-8 w-8", className)}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id={`arka-a-${id}`} x1="6" y1="10" x2="40" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-sky)" />
          <stop offset="1" stopColor="var(--brand-azure)" />
        </linearGradient>
        <linearGradient id={`arka-b-${id}`} x1="26" y1="10" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-azure)" />
          <stop offset="1" stopColor="var(--brand-navy)" />
        </linearGradient>
        <linearGradient id={`arka-box-${id}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-azure)" />
          <stop offset="1" stopColor="var(--brand-royal)" />
        </linearGradient>
      </defs>
      {boxed && <rect width="64" height="64" rx="18" fill={`url(#arka-box-${id})`} />}
      <path
        d={boxed ? "M16 16 L38 32 L16 48 Z" : "M9 13 L35 32 L9 51 Z"}
        fill={boxed ? "#ffffff" : mono ? "currentColor" : `url(#arka-a-${id})`}
        fillOpacity={boxed ? 0.95 : mono ? 0.55 : 1}
        stroke={boxed ? "#ffffff" : mono ? "currentColor" : `url(#arka-a-${id})`}
        strokeOpacity={boxed ? 0.95 : mono ? 0.55 : 1}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path
        d={boxed ? "M34 16 L52 32 L34 48 Z" : "M29 13 L55 32 L29 51 Z"}
        fill={boxed ? "#c9c9c9" : mono ? "currentColor" : `url(#arka-b-${id})`}
        stroke={boxed ? "#c9c9c9" : mono ? "currentColor" : `url(#arka-b-${id})`}
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Full logo lockup: mark + ARKA wordmark (+ optional tagline). */
export function Logo({
  withWordmark = true,
  tagline = false,
  mono = false,
  className,
  markClassName,
}: {
  withWordmark?: boolean;
  tagline?: boolean;
  mono?: boolean;
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} dir="ltr">
      <LogoMark mono={mono} className={markClassName} />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[1.35rem] font-extrabold tracking-[-0.02em] text-foreground">
            ARKA
          </span>
          {tagline && (
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-foreground-muted">
              digital marketing
            </span>
          )}
        </span>
      )}
    </span>
  );
}
