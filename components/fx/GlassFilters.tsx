/**
 * SVG displacement map behind `.liquid-refract` (see app/globals.css).
 *
 * A `backdrop-filter: blur()` frosts what is behind a panel; it does not *bend*
 * it. Real glass bends light most at its edges, which is the single cue that
 * separates Apple's Liquid Glass from a plain translucent box — so this filter
 * warps the backdrop with `feDisplacementMap`, driven by a map whose red
 * channel carries the horizontal offset and green channel the vertical one
 * (128 = no shift, 0 = −scale, 255 = +scale).
 *
 * The map is assembled from two gradients rather than a baked PNG so it scales
 * to any panel size:
 *
 *   mapX — horizontal ramp in R only: hard shift inward at the left/right
 *          edges, flat 128 across the middle 60%.
 *   mapY — the same vertically, in G only.
 *
 * `feComposite operator="arithmetic" k2="1" k3="1"` adds them, so the two
 * single-channel maps merge into one rgb(x, y, 0) field without either
 * clobbering the other.
 *
 * Rendered once at the document root; every glass surface points at the same
 * filter id.
 */

// Flat middle, steep edges — the refraction stays out of the way of content
// and only shows where a real bevel would catch it.
const MAP_X =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">` +
      `<stop offset="0%" stop-color="rgb(0,0,0)"/>` +
      `<stop offset="20%" stop-color="rgb(128,0,0)"/>` +
      `<stop offset="80%" stop-color="rgb(128,0,0)"/>` +
      `<stop offset="100%" stop-color="rgb(255,0,0)"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" fill="url(#g)"/></svg>`,
  );

const MAP_Y =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0%" stop-color="rgb(0,0,0)"/>` +
      `<stop offset="20%" stop-color="rgb(0,128,0)"/>` +
      `<stop offset="80%" stop-color="rgb(0,128,0)"/>` +
      `<stop offset="100%" stop-color="rgb(0,255,0)"/>` +
      `</linearGradient></defs>` +
      `<rect width="100" height="100" fill="url(#g)"/></svg>`,
  );

export function GlassFilters() {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
    >
      <defs>
        <filter id="arka-refract" colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
          <feImage href={MAP_X} preserveAspectRatio="none" result="mapX" />
          <feImage href={MAP_Y} preserveAspectRatio="none" result="mapY" />
          <feComposite in="mapX" in2="mapY" operator="arithmetic" k2="1" k3="1" result="map" />
          {/* Softening the map is what turns a crease at the edge into a
              rounded bevel. */}
          <feGaussianBlur in="map" stdDeviation="1.4" result="mapSoft" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="mapSoft"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
