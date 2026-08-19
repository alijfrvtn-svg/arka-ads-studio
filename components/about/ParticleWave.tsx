"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { INDUSTRY_PAINT } from "@/lib/constants";

/**
 * The live background on the About hero.
 *
 * A grid of points on a surface that undulates and recedes — the reference was
 * a vertical particle ribbon glowing on black; this is the same construction
 * turned landscape and inverted onto white, which changes what carries it.
 * On black a particle reads by glow; on white glow is invisible, so depth is
 * carried by size and opacity instead and every dot stays a solid, saturated
 * mark. That is what keeps it high contrast rather than a pale wash.
 *
 * Drawn rather than filmed. A video of this would be megabytes, would be locked
 * to one colour, and would have to be re-exported to change anything; the whole
 * thing here is a few hundred lines of arithmetic and recolours by editing an
 * array.
 *
 * Cost control, because this runs every frame:
 *   - fillRect, not arc. Squares at 1-3px are indistinguishable from circles at
 *     this size and are several times cheaper per dot.
 *   - One fillStyle per frame, not per dot. The colour is uniform, so the whole
 *     grid is drawn in alpha bands rather than restyled 5,000 times.
 *   - It stops completely when scrolled out of view, and never starts under
 *     prefers-reduced-motion, which gets a single static frame instead.
 */

/** The four site colours, starting on the red. */
const CYCLE = [INDUSTRY_PAINT[0], INDUSTRY_PAINT[1], INDUSTRY_PAINT[3], INDUSTRY_PAINT[2]];

/** Seconds each colour holds before it has fully become the next one. */
const HOLD = 10;
/** How much of that is spent crossfading. The rest is the colour held steady,
 *  so it is a colour that changes rather than a permanent transition. */
const BLEND = 3;

/** Column count at full width. Narrow screens get proportionally fewer — the
 *  spacing is what reads, not the absolute count, and a phone should not be
 *  asked to place a desktop's worth of dots every frame. */
const COLS = 150;
const ROWS = 34;
const MIN_COLS = 68;

/** Alpha is quantised into this many bands so the whole grid draws with a
 *  handful of fillStyle changes instead of one per dot. */
const BANDS = 14;

function hex(h: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

const RGB = CYCLE.map(hex);

/** Straight RGB interpolation, as asked. */
function mix(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function ParticleWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    // Capped at 2: past that the dot count quadruples for a difference nobody
    // can see on a field of 1px marks.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;

      // ── colour ──
      const span = t / HOLD;
      const i = Math.floor(span) % RGB.length;
      const into = (span - Math.floor(span)) * HOLD;
      // Held for HOLD-BLEND seconds, then eased across into the next.
      const raw = into <= HOLD - BLEND ? 0 : (into - (HOLD - BLEND)) / BLEND;
      const k = raw * raw * (3 - 2 * raw); // smoothstep, so neither end snaps
      const [r, g, b] = mix(RGB[i], RGB[(i + 1) % RGB.length], k);

      ctx.clearRect(0, 0, w, h);

      // ── the surface ──
      // The band fills most of the frame and the mask on the canvas thins its
      // top, so the copy sits on a mist and the solid body stays low.
      const baseY = h * 0.56;
      const bandH = h * 0.82;
      const amp = h * 0.2;

      // Bucket the dots by alpha band, then draw each band in one pass.
      const buckets: number[][] = Array.from({ length: BANDS }, () => []);

      const cols = Math.max(MIN_COLS, Math.min(COLS, Math.round(w / 8.5)));

      for (let ri = 0; ri < ROWS; ri++) {
        // 0 far, 1 near.
        const d = ri / (ROWS - 1);
        // Rows spread apart as they come forward, which is the whole of the
        // perspective — no matrix, no z divide.
        const spread = 0.72 + 0.4 * d;
        const size = 1 + 2.1 * d;
        // Reaches 1 at the front row. The brief was high contrast and colours
        // that are not washed out, so the nearest dots are the full hex on
        // white rather than a tint of it — depth comes off the far rows fading
        // away, not off the near ones being held back.
        const rowAlpha = 0.05 + 0.95 * Math.pow(d, 1.6);

        for (let ci = 0; ci < cols; ci++) {
          const u = ci / (cols - 1);
          // Three sines at unrelated periods, so the crest never repeats
          // across the width and the surface does not read as a wallpaper.
          const wave =
            Math.sin(u * 6.1 + t * 0.55 + d * 2.4) * 0.55 +
            Math.sin(u * 2.7 - t * 0.31 + d * 1.1) * 0.3 +
            Math.sin(u * 11.3 + t * 0.19 - d * 3.0) * 0.15;

          const x = (u - 0.5) * w * spread + w * 0.5;
          const y = baseY + (d - 0.5) * bandH + wave * amp * (0.35 + 0.65 * d);

          if (x < -8 || x > w + 8 || y < -8 || y > h + 8) continue;

          // The crest catches the light: dots near the top of their own swing
          // are brighter, which is what makes it a surface rather than a fog.
          // The crest only ever takes a fifth off the top. Three sines rarely
          // align, so a wider swing here meant the nearest dots never actually
          // reached the hex — measured at 216/255 before this, which is a tint
          // of the colour rather than the colour.
          const a = rowAlpha * (0.8 + 0.2 * (0.5 - wave * 0.5));
          const band = Math.min(BANDS - 1, Math.max(0, Math.round(a * (BANDS - 1))));
          buckets[band].push(x, y, size);
        }
      }

      for (let band = 1; band < BANDS; band++) {
        const arr = buckets[band];
        if (!arr.length) continue;
        ctx.fillStyle = `rgba(${r},${g},${b},${(band / (BANDS - 1)).toFixed(3)})`;
        for (let k2 = 0; k2 < arr.length; k2 += 3) {
          const s = arr[k2 + 2];
          ctx.fillRect(arr[k2], arr[k2 + 1], s, s);
        }
      }

      if (running && !reduced) raf = requestAnimationFrame(draw);
    };

    // The first frame is drawn straight away rather than waited for. rAF does
    // not fire in a background tab or a hidden document, and a background whose
    // only content lives inside the animation loop is a blank rectangle
    // wherever that loop is late. Reduced motion keeps this frame and stops.
    draw(start);
    if (!reduced) raf = requestAnimationFrame(draw);

    // Setting canvas.width wipes the surface, so a resize has to be followed
    // by a draw immediately. Waiting for the next frame leaves it blank while
    // the loop is paused off-screen, or while rAF is throttled.
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    // Nothing runs while it is off screen. A full-width grid redrawn sixty
    // times a second behind a page the reader has scrolled past is pure heat.
    const io = new IntersectionObserver(
      ([e]) => {
        if (reduced) return;
        if (e.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
