import { cn } from "@/lib/utils";

/**
 * The entrance animation every section on the site uses.
 *
 * Plain elements with a class — no framer-motion, no client boundary, no
 * JavaScript at all. The animation lives in globals.css and is driven by the
 * scroll position; the long note there explains why it had to stop being a
 * script. The short version: this used to ship `opacity: 0` in the server HTML
 * and wait for a bundle to clear it, which on a slow link meant a white page.
 *
 * `y` and `delay` still shape the movement. `duration` and `once` are gone
 * from the behaviour: a scroll-driven animation has no duration — its progress
 * *is* the scroll position — and for the same reason it cannot play twice.
 * They are still accepted so no call site has to change.
 */
export function Reveal({
  children,
  y = 26,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  y?: number;
  /** Seconds, in the old API. Becomes how far behind the group this one lands. */
  delay?: number;
  className?: string;
  /** @deprecated No duration to set — the scroll position is the progress. */
  duration?: number;
  /** @deprecated A scroll-driven reveal cannot replay. */
  once?: boolean;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={
        {
          ...(y !== 26 ? { "--rv-y": `${y}px` } : null),
          // 0.09s of stagger in the old API read as roughly 6% of the range.
          ...(delay ? { "--rv-delay": `${Math.min(Math.round(delay * 66), 42)}%` } : null),
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

/** A group whose children arrive one after another rather than together. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("stagger", className)}>{children}</div>;
}

/** One member of a {@link Stagger}. Its position in the group sets its delay. */
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
