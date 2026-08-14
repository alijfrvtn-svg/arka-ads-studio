// Placeholder media used only as a last-resort fallback when a CMS field is
// still empty.
//
// These used to point at commondatastorage.googleapis.com (Big Buck Bunny) and
// picsum.photos/i.pravatar.cc. All three are unreachable from Iran without a
// VPN, so a visitor on a normal connection sat waiting on requests that could
// never resolve — the single biggest cause of the "site won't load" reports.
// Nothing here reaches the network any more: the poster is an inline SVG data
// URI and the video slots are empty, which every consumer already treats as
// "render the brand gradient instead".
//
// Real media belongs in the Media Library (stored on Netlify Blobs and served
// same-origin from /api/media/…), or as an Aparat/YouTube link.

/** 1×1 brand-navy gradient, inlined so it costs no request and cannot be blocked. */
const BRAND_POSTER =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#04060d"/><stop offset="0.55" stop-color="#162d73"/><stop offset="1" stop-color="#6699ff"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>`,
  );

export const SAMPLE = {
  showreel: "",
  showreelPoster: BRAND_POSTER,
  reels: ["", "", "", ""],
  bts: [BRAND_POSTER, BRAND_POSTER, BRAND_POSTER, BRAND_POSTER],
};

/** Placeholder image slot. Returns the inline brand poster rather than calling
 *  out to a third-party image host. `seed`/`w`/`h` are kept so existing call
 *  sites don't need touching. */
export const img = (_seed: string, _w = 1200, _h = 800) => BRAND_POSTER;
