import { cn } from "@/lib/utils";

/**
 * Person avatar with an initials fallback.
 *
 * Every call site used to fall back to `i.pravatar.cc`, which is unreachable
 * from Iran — so the "default" avatar was a broken image for the panel's actual
 * users. Initials need no network at all.
 */
export function Avatar({
  src,
  name,
  className,
}: {
  src?: string | null;
  name: string;
  className?: string;
}) {
  const initial = name.trim().charAt(0) || "؟";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt=""
        className={cn("shrink-0 rounded-full border border-card-border object-cover", className)}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-card-border bg-primary/10 font-bold text-primary",
        className,
      )}
    >
      {initial}
    </span>
  );
}
