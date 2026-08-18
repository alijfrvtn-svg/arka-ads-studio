import { cn } from "@/lib/utils";

/**
 * The ARKA wordmark.
 *
 * One asset for the whole site, painted with `currentColor` through a CSS mask
 * (see `.arka-logo` in globals.css) rather than shipped as a coloured image.
 * That is what lets the same file sit as ink on the white pages and as white on
 * the black footer without a second file or a `mono` prop — it simply inherits
 * the colour of wherever it is placed.
 *
 * The mark replaces the earlier lockup, which was a hand-drawn SVG glyph plus
 * the words "ARKA" and "digital marketing" set in type. The new artwork already
 * contains the name, so there is no text beside it any more.
 *
 * Size it by height only — `h-7`, `h-9`. The width follows from the artwork's
 * own 900:153 through `aspect-ratio`, so passing a square (`h-8 w-8`) would
 * squash it.
 */
export function Logo({ className }: { className?: string }) {
  return <span role="img" aria-label="آرکا" className={cn("arka-logo h-7", className)} />;
}
