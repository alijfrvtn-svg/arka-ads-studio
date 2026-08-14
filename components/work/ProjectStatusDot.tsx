import { projectStatus } from "@/lib/constants";
import { tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * Delivery-state marker for a portfolio item: a small coloured dot plus its
 * label. The label is not optional decoration — colour alone would leave
 * colour-blind visitors unable to tell a finished project from one still in
 * production, which is the whole point of showing it.
 *
 * `onMedia` variant sits over a project cover, where the surrounding image
 * gives no contrast guarantee, so it carries its own dark scrim.
 */
export function ProjectStatusDot({
  status,
  locale = "fa",
  onMedia = false,
  className,
}: {
  status: string;
  locale?: Locale;
  onMedia?: boolean;
  className?: string;
}) {
  const s = projectStatus(status);
  const label = tr(locale, s.label, s.labelEn, s.labelAr);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full text-[11px] font-medium",
        onMedia
          ? "border border-white/15 bg-black/45 px-2.5 py-1 text-white backdrop-blur"
          : "text-foreground-muted",
        className,
      )}
    >
      <span
        className="relative grid h-2 w-2 shrink-0 place-items-center rounded-full"
        style={{ background: s.color }}
        aria-hidden
      >
        {/* Only the live state pulses — a finished project needs no attention. */}
        {s.value === "IN_PROGRESS" && (
          <span
            className="absolute inset-0 animate-ping-slow rounded-full"
            style={{ background: s.color }}
          />
        )}
      </span>
      {label}
    </span>
  );
}
