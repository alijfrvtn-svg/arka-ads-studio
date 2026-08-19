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
const COLS = 192;
const ROWS = 38;
const MIN_COLS = 84;

/**
 * The dent under the pointer.
 *
 * RADIUS is how wide the well is, as a share of the shorter side; DEPTH how far
 * the surface gives, as a share of the canvas height. The dot also thickens and
 * darkens inside it, because material that is compressed gets denser — that is
 * what reads as pressing into something soft rather than as a hole cut in it.
 *
 * FOLLOW and RELAX are how fast the well tracks the pointer and how fast it
 * fills back in. Both deliberately slow: instant would make it a cursor sprite,
 * and the lag is the whole difference between a surface and a decal.
 */
const DENT_RADIUS = 0.34;
const DENT_DEPTH = 0.16;
const DENT_FOLLOW = 0.14;
const DENT_RELAX = 0.07;

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

    /**
     * Whether this device has a pointer that could press into the surface.
     *
     * Not a width query: a touch laptop is wide and still has no hover, and a
     * stylus tablet is narrow and does. The dent is meaningless without a
     * pointer that hovers, so it is bound to the capability rather than to a
     * breakpoint.
     */
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    /**
     * Phones pay twice for pixel ratio — once in the dots they have to place
     * and once in the fill they have to push — and they have the least to
     * spend. 1.5 is indistinguishable from 2 on a field of 2px marks.
     */
    const small = window.matchMedia("(max-width: 1023px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);

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

    // Where the well is, where it is heading, and how far in it is pressed.
    // In canvas-local px; all of it stays at rest until the pointer arrives.
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, press: 0, want: 0 };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ptr.tx = x;
      ptr.ty = y;
      // A margin, so the well starts forming as the pointer approaches the
      // surface rather than snapping into existence at its edge.
      const m = 80;
      ptr.want = x >= -m && x <= r.width + m && y >= -m && y <= r.height + m ? 1 : 0;
      // First contact: put the well where the pointer is instead of sliding it
      // across the whole surface from the top-left corner.
      if (ptr.press < 0.001) {
        ptr.x = x;
        ptr.y = y;
      }
    };
    const onOut = () => {
      ptr.want = 0;
    };

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

      // The well eases toward the pointer and relaxes back more slowly than it
      // forms, which is how something soft behaves.
      ptr.x += (ptr.tx - ptr.x) * DENT_FOLLOW;
      ptr.y += (ptr.ty - ptr.y) * DENT_FOLLOW;
      ptr.press += (ptr.want - ptr.press) * (ptr.want > ptr.press ? DENT_FOLLOW : DENT_RELAX);

      const dentR = Math.max(90, Math.min(w, h) * DENT_RADIUS);
      const dent2R2 = 2 * dentR * dentR;
      const dentCut = (dentR * 3) * (dentR * 3);
      const dentY = h * DENT_DEPTH;
      const pressing = ptr.press > 0.004;

      ctx.clearRect(0, 0, w, h);

      // ── the surface ──
      // The band runs off the bottom of the frame rather than stopping inside
      // it: the nearest rows sit past h and are clipped, so the wave cannot
      // leave a white margin under itself wherever the sine happens to lift it.
      // The mask on the canvas thins the top, so the copy still sits on a mist.
      const baseY = h * 0.66;
      const bandH = h * 0.98;
      const amp = h * 0.2;

      // Bucket the dots by alpha band, then draw each band in one pass.
      const buckets: number[][] = Array.from({ length: BANDS }, () => []);

      // Spacing, not count, is what reads — and the rows are now up to 1.37x
      // the canvas wide, so the same count spread over more ground came out a
      // third thinner. The divisor is set from the spread to hold the gap
      // between dots where it was.
      const cols = Math.max(MIN_COLS, Math.min(COLS, Math.round(w / 6.7)));

      // Fewer rows on a phone as well as fewer columns: the surface reads by
      // its spacing, and at this width the back rows overlap anyway.
      const rows = small ? 26 : ROWS;

      for (let ri = 0; ri < rows; ri++) {
        // 0 far, 1 near.
        const d = ri / (rows - 1);
        // Rows widen as they come forward, which is the whole of the
        // perspective — no matrix, no z divide. It starts above 1 so even the
        // farthest row is wider than the canvas: at 0.72 the back of the
        // surface was inset by 14% a side and left white wedges in the top
        // corners. Depth still reads, from size and opacity and the spacing.
        const spread = 1.05 + 0.32 * d;
        const size = 1.7 + 2.7 * d;
        // Reaches 1 at the front row: the nearest dots are the full hex on
        // white rather than a tint of it. The floor and the exponent are what
        // carry weight into the back — at 0.13 and 1.6 the far rows were almost
        // gone, and even at 0.13 and 1.25 the whole surface still read as a
        // wash rather than as colour. Depth comes off the row spacing and the
        // dot size as much as off the fade.
        const rowAlpha = 0.3 + 0.7 * Math.pow(d, 1.15);

        for (let ci = 0; ci < cols; ci++) {
          const u = ci / (cols - 1);
          // Three sines at unrelated periods, so the crest never repeats
          // across the width and the surface does not read as a wallpaper.
          const wave =
            Math.sin(u * 6.1 + t * 0.55 + d * 2.4) * 0.55 +
            Math.sin(u * 2.7 - t * 0.31 + d * 1.1) * 0.3 +
            Math.sin(u * 11.3 + t * 0.19 - d * 3.0) * 0.15;

          const x = (u - 0.5) * w * spread + w * 0.5;
          let y = baseY + (d - 0.5) * bandH + wave * amp * (0.35 + 0.65 * d);

          let squash = 0;
          if (pressing) {
            const dx = x - ptr.x;
            const dy = y - ptr.y;
            const q = dx * dx + dy * dy;
            // Past three radii the gaussian is under 0.0001 — not worth an
            // exp() call on every one of five thousand dots.
            if (q < dentCut) {
              // Tapered against the bottom edge. The nearest rows already sit
              // within a few px of it, so an untapered well would push them out
              // of frame and read as dots vanishing rather than as a surface
              // giving way. Physically it is the same thing: the sheet is
              // pinned at the edge and cannot dip there.
              const room = Math.min(1, (h - y) / (h * 0.3));
              squash = Math.exp(-q / dent2R2) * ptr.press * Math.max(0, room);
              y += dentY * squash;
            }
          }

          if (x < -8 || x > w + 8 || y < -8 || y > h + 8) continue;

          // The crest catches the light, which is what makes this a surface
          // rather than a fog — but it only ever takes a fifth off the top.
          // Three sines rarely align, so a wider swing meant the nearest dots
          // never actually reached the hex: measured at 216/255, a tint of the
          // colour rather than the colour. The last term is the compression in
          // the well, where the material gets denser.
          const a = rowAlpha * (0.88 + 0.12 * (0.5 - wave * 0.5)) * (1 + 0.4 * squash);
          const band = Math.min(BANDS - 1, Math.max(0, Math.round(a * (BANDS - 1))));
          buckets[band].push(x, y, size * (1 + 0.5 * squash));
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
    if (!reduced && finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onMove, { passive: true });
      document.addEventListener("pointerleave", onOut);
    }

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
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onOut);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
