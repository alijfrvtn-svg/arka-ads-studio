import { PaintCanvas } from "./PaintCanvas";

/**
 * One canvas behind several sections.
 *
 * The process section and the stats row each used to paint their own, and where
 * they met the two paintings collided on a hard horizontal edge — two pictures
 * butted together rather than one continuous ground. Hoisting the canvas to a
 * band that spans both removes the seam by removing the second painting.
 *
 * Sections inside pass `painted={false}` so they render transparent and let this
 * one show through. They keep their own canvas when used alone — StatsBar still
 * appears by itself on /about — which is why this is a wrapper rather than
 * something baked into them.
 */
export function PaintedBand({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="paint-canvas absolute inset-0" aria-hidden>
        <PaintCanvas />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}
