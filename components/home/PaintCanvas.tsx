"use client";

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
 * ── Why there are two of them ─────────────────────────────────────────────
 * The painting is 1600x780 — a wide band, which is the shape the section is on
 * a desktop. On a phone that same section is 375 wide and about 1950 tall, and
 * `slice` covers a box that shape by scaling the artwork 2.5x and cropping it:
 * measured on the live site, the painting rendered 4014px wide inside a 375px
 * box, 1819px cut off each side, 9% of its width visible and three of its
 * twenty-eight shapes surviving. What reached the phone was one enormous flat
 * blob — not a cropped painting, just a colour.
 *
 * A landscape composition cannot be made to work in a portrait box by any
 * amount of fitting, so below lg a second one takes over: same palette, same
 * three passes, same filters, laid out down the length instead of across it.
 * Its filter numbers are its own — a 52-unit blur reads as gentle across 1600
 * units and swallows everything across 400.
 */
export function PaintCanvas() {
  return (
    <>
      <PaintLandscape />
      <PaintPortrait />
    </>
  );
}

/** The wide band. Shown from lg up. */
function PaintLandscape() {
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
        <ellipse cx="230" cy="120" rx="430" ry="250" fill="#FF6B5B" />
        <ellipse cx="1380" cy="140" rx="420" ry="240" fill="#FFB902" />
        <ellipse cx="1290" cy="660" rx="470" ry="260" fill="#cbe9f9" />
        <ellipse cx="330" cy="690" rx="360" ry="215" fill="#37192c" opacity="0.5" />
        <ellipse cx="800" cy="360" rx="520" ry="300" fill="#cbe9f9" opacity="0.75" />
        <ellipse cx="820" cy="60" rx="330" ry="150" fill="#FFB902" opacity="0.7" />
        <ellipse cx="700" cy="760" rx="330" ry="160" fill="#FF6B5B" opacity="0.62" />
      </g>

      {/* Torn masses. Where two of these overlap the colours meet at full
          strength, which is where the contrast in the painting comes from. */}
      <g filter="url(#wf-splat)" opacity="0.95">
        <ellipse cx="190" cy="95" rx="260" ry="130" fill="#FF6B5B" />
        <ellipse cx="1430" cy="120" rx="245" ry="125" fill="#FFB902" />
        <ellipse cx="1230" cy="700" rx="285" ry="130" fill="#cbe9f9" />
        <ellipse cx="360" cy="720" rx="215" ry="100" fill="#37192c" opacity="0.9" />
      </g>
      <g filter="url(#wf-splat2)" opacity="0.9">
        <ellipse cx="560" cy="150" rx="210" ry="95" fill="#FFB902" />
        <ellipse cx="1090" cy="130" rx="190" ry="88" fill="#FF6B5B" opacity="0.9" />
        <ellipse cx="860" cy="690" rx="230" ry="105" fill="#cbe9f9" />
        <ellipse cx="1520" cy="420" rx="180" ry="150" fill="#FF6B5B" opacity="0.75" />
        <ellipse cx="80" cy="420" rx="175" ry="150" fill="#FFB902" opacity="0.72" />
      </g>

      {/* Flecks — satellites are what make it read as thrown. */}
      <g filter="url(#wf-fleck)">
        <circle cx="392" cy="196" r="15" fill="#37192c" opacity="0.8" />
        <circle cx="452" cy="92" r="9" fill="#FF6B5B" />
        <circle cx="1300" cy="226" r="13" fill="#37192c" opacity="0.75" />
        <circle cx="1215" cy="118" r="8" fill="#FFB902" />
        <circle cx="1092" cy="700" r="13" fill="#37192c" opacity="0.6" />
        <circle cx="1010" cy="748" r="9" fill="#cbe9f9" />
        <circle cx="470" cy="712" r="10" fill="#37192c" opacity="0.7" />
        <circle cx="176" cy="612" r="8" fill="#37192c" opacity="0.6" />
        <circle cx="905" cy="86" r="7" fill="#FF6B5B" />
        <circle cx="700" cy="120" r="6" fill="#37192c" opacity="0.5" />
        <circle cx="1450" cy="560" r="9" fill="#37192c" opacity="0.5" />
        <circle cx="250" cy="470" r="7" fill="#FF6B5B" opacity="0.8" />
      </g>
    </svg>
  );
}

/**
 * The same painting, composed down a tall box. Shown below lg.
 *
 * 400x1600 rather than a literal match for the phone's ~0.19 ratio: an exact
 * match would have to change per section, since the band is 1957 tall on the
 * homepage and 1563 on an industry page. At this ratio `slice` keeps 77% of the
 * width on the taller one and 96% on the shorter — against 9% before — so the
 * composition survives in both.
 *
 * Colour runs down the length rather than across it, alternating sides, so
 * scrolling the band passes through all four rather than sitting in one.
 */
function PaintPortrait() {
  return (
    <svg
      aria-hidden
      focusable="false"
      className="paint-portrait pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 400 1600"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Scaled for this box, not the wide one: the tearing is a displacement
            in user units, and 150 of them across 400 is not a torn edge, it is
            a different shape entirely.

            Two octaves rather than four. Four is what the wide canvas uses and
            what made it too expensive to hand a phone; at a quarter the width
            the second octave is already below the size of a rendered pixel, so
            the ones after it cost time and change nothing. */}
        <filter id="wf-p-splat" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.010" numOctaves="2" seed="17" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="52" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-p-splat2" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.017" numOctaves="2" seed="63" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="44" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-p-fleck" x="-70%" y="-70%" width="240%" height="240%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="41" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wf-p-soft" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      {/* Ground: broad washes reaching both edges the whole way down, so the
          band never falls back to bare white however tall the section gets. */}
      <g filter="url(#wf-p-soft)" opacity="0.92">
        <ellipse cx="80" cy="110" rx="230" ry="180" fill="#FF6B5B" />
        <ellipse cx="340" cy="270" rx="215" ry="185" fill="#FFB902" />
        <ellipse cx="90" cy="500" rx="235" ry="195" fill="#cbe9f9" />
        <ellipse cx="330" cy="720" rx="215" ry="185" fill="#FFB902" opacity="0.78" />
        <ellipse cx="90" cy="930" rx="230" ry="190" fill="#37192c" opacity="0.5" />
        <ellipse cx="335" cy="1140" rx="215" ry="190" fill="#cbe9f9" />
        <ellipse cx="85" cy="1340" rx="230" ry="190" fill="#FF6B5B" opacity="0.72" />
        <ellipse cx="330" cy="1520" rx="215" ry="175" fill="#FFB902" opacity="0.68" />
        {/* One long wash down the middle, so the two columns of blobs read as
            one painting rather than as a left edge and a right edge. */}
        <ellipse cx="200" cy="800" rx="250" ry="430" fill="#cbe9f9" opacity="0.42" />
      </g>

      {/* Torn masses. Where two overlap is where the colour is at full strength. */}
      <g filter="url(#wf-p-splat)" opacity="0.95">
        <ellipse cx="75" cy="95" rx="145" ry="100" fill="#FF6B5B" />
        <ellipse cx="345" cy="285" rx="135" ry="98" fill="#FFB902" />
        <ellipse cx="85" cy="520" rx="148" ry="104" fill="#cbe9f9" />
        <ellipse cx="335" cy="750" rx="132" ry="96" fill="#FFB902" opacity="0.85" />
        <ellipse cx="80" cy="950" rx="142" ry="100" fill="#37192c" opacity="0.9" />
      </g>
      <g filter="url(#wf-p-splat2)" opacity="0.9">
        <ellipse cx="315" cy="1150" rx="138" ry="100" fill="#cbe9f9" />
        <ellipse cx="80" cy="1355" rx="145" ry="104" fill="#FF6B5B" />
        <ellipse cx="330" cy="1530" rx="132" ry="94" fill="#FFB902" />
        <ellipse cx="215" cy="360" rx="120" ry="82" fill="#FF6B5B" opacity="0.78" />
        <ellipse cx="185" cy="1265" rx="126" ry="88" fill="#37192c" opacity="0.55" />
      </g>

      {/* Flecks — satellites are what make it read as thrown. */}
      <g filter="url(#wf-p-fleck)">
        <circle cx="250" cy="180" r="11" fill="#37192c" opacity="0.75" />
        <circle cx="150" cy="300" r="7" fill="#FF6B5B" />
        <circle cx="290" cy="470" r="9" fill="#37192c" opacity="0.6" />
        <circle cx="120" cy="640" r="12" fill="#37192c" opacity="0.7" />
        <circle cx="300" cy="880" r="8" fill="#FFB902" />
        <circle cx="140" cy="1060" r="10" fill="#37192c" opacity="0.55" />
        <circle cx="270" cy="1230" r="7" fill="#cbe9f9" />
        <circle cx="115" cy="1440" r="9" fill="#37192c" opacity="0.6" />
        <circle cx="310" cy="1600" r="8" fill="#FF6B5B" opacity="0.8" />
        <circle cx="205" cy="60" r="6" fill="#37192c" opacity="0.5" />
      </g>
    </svg>
  );
}
