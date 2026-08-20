"use client";

import { useAppearance } from "@/components/providers/Appearance";

/**
 * Paint thrown across the whole canvas.
 *
 * Shapes start as plain ellipses and are torn apart by feDisplacementMap driven
 * by fractal noise, so nothing reads as a geometric form once the filter has
 * run. Three passes: broad soft washes that leave no bare white anywhere, torn
 * masses on top whose overlaps are where the colours meet at full strength, and
 * flecks so it reads as thrown rather than placed.
 *
 * Legibility is NOT handled here by keeping paint away from the text — that was
 * the first attempt and it left a large white void through the middle of the
 * section. Instead the colour runs edge to edge and each text block carries its
 * own local clearing (`.wf-plate` in globals.css), which reads as a lighter
 * passage in the painting rather than as a box. See that rule for the numbers.
 *
 * ── Desktop only ──────────────────────────────────────────────────────────
 * This is 1600x780, a wide band, which is the shape the section has from lg
 * up. Below that it is not drawn at all: a phone's version of this section is
 * a tall column roughly 375x1950, and a filtered SVG that size is the first
 * layer iOS Safari discards under memory pressure and the slowest to rebuild —
 * scrolling back up showed white where the painting had been while the browser
 * re-ran feTurbulence. A phone gets the same four colours as CSS gradients
 * instead; see `.paint-canvas` in globals.css.
 */
export function PaintCanvas() {
  // The six the band is painted with. Literal hex until now, which is why
  // editing the palette in the panel changed every coloured surface on the
  // site except this one.
  const { sitePaint: P } = useAppearance();
  return (
    <svg
      aria-hidden
      focusable="false"
      className="paint-landscape pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1600 780"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="wf-splat" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.014" numOctaves="4" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="150" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-splat2" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.013 0.008" numOctaves="4" seed="63" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="135" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-fleck" x="-70%" y="-70%" width="240%" height="240%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="41" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="36" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-soft" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="52" />
        </filter>
      </defs>

      {/* Ground: broad washes that reach right across the canvas, so there is
          no bare white left anywhere. */}
      <g filter="url(#wf-soft)" opacity="0.92">
        <ellipse cx="230" cy="120" rx="430" ry="250" fill={P[0]} />
        <ellipse cx="1380" cy="140" rx="420" ry="240" fill={P[2]} />
        <ellipse cx="1290" cy="660" rx="470" ry="260" fill={P[4]} />
        <ellipse cx="330" cy="690" rx="360" ry="215" fill={P[5]} opacity="0.5" />
        <ellipse cx="800" cy="360" rx="520" ry="300" fill={P[4]} opacity="0.75" />
        <ellipse cx="820" cy="60" rx="330" ry="150" fill={P[2]} opacity="0.7" />
        <ellipse cx="700" cy="760" rx="330" ry="160" fill={P[0]} opacity="0.62" />
      </g>

      {/* Torn masses. Where two of these overlap the colours meet at full
          strength, which is where the contrast in the painting comes from. */}
      <g filter="url(#wf-splat)" opacity="0.95">
        <ellipse cx="190" cy="95" rx="260" ry="130" fill={P[0]} />
        <ellipse cx="1430" cy="120" rx="245" ry="125" fill={P[2]} />
        <ellipse cx="1230" cy="700" rx="285" ry="130" fill={P[4]} />
        <ellipse cx="360" cy="720" rx="215" ry="100" fill={P[5]} opacity="0.9" />
      </g>
      <g filter="url(#wf-splat2)" opacity="0.9">
        <ellipse cx="560" cy="150" rx="210" ry="95" fill={P[2]} />
        <ellipse cx="1090" cy="130" rx="190" ry="88" fill={P[0]} opacity="0.9" />
        <ellipse cx="860" cy="690" rx="230" ry="105" fill={P[4]} />
        <ellipse cx="1520" cy="420" rx="180" ry="150" fill={P[0]} opacity="0.75" />
        <ellipse cx="80" cy="420" rx="175" ry="150" fill={P[2]} opacity="0.72" />
      </g>

      {/* Flecks — satellites are what make it read as thrown. */}
      <g filter="url(#wf-fleck)">
        <circle cx="392" cy="196" r="15" fill={P[5]} opacity="0.8" />
        <circle cx="452" cy="92" r="9" fill={P[0]} />
        <circle cx="1300" cy="226" r="13" fill={P[5]} opacity="0.75" />
        <circle cx="1215" cy="118" r="8" fill={P[2]} />
        <circle cx="1092" cy="700" r="13" fill={P[5]} opacity="0.6" />
        <circle cx="1010" cy="748" r="9" fill={P[4]} />
        <circle cx="470" cy="712" r="10" fill={P[5]} opacity="0.7" />
        <circle cx="176" cy="612" r="8" fill={P[5]} opacity="0.6" />
        <circle cx="905" cy="86" r="7" fill={P[0]} />
        <circle cx="700" cy="120" r="6" fill={P[5]} opacity="0.5" />
        <circle cx="1450" cy="560" r="9" fill={P[5]} opacity="0.5" />
        <circle cx="250" cy="470" r="7" fill={P[0]} opacity="0.8" />
      </g>
    </svg>
  );
}

