"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

/**
 * Thin iframe wrapper for embedded video platforms (Aparat/YouTube/Instagram).
 * Kept as a tiny dedicated component so every call site renders embeds
 * identically and safely (no inline style/attr drift).
 *
 * ── Why it watches for a player that never arrives ─────────────────────────
 * The site's audience is in Iran, and every YouTube domain is unreachable from
 * there: www.youtube.com, youtube-nocookie.com, img.youtube.com and i.ytimg.com
 * all fail to complete a TCP handshake — measured, `tcp=0.000000s`, not slow but
 * refused. A blocked iframe does not fire `onError`; it simply stays blank. So
 * a visitor who clicks play gets a black rectangle and no idea why.
 *
 * That is worth a few lines: if nothing has loaded after a short wait, say so
 * plainly and offer the link, so the reader knows the site is not broken and
 * knows what to do about it. Where the platform *is* reachable the notice never
 * appears, because `onLoad` fires first and cancels it.
 */
export function EmbedFrame({
  src,
  className,
  title = "ویدیو",
  /** The page the embed came from, for the "open it there" fallback. */
  href,
  /**
   * Background footage rather than something anyone came to watch.
   *
   * A blocked decorative embed must fail *silently* — a notice about VPNs
   * appearing behind a hero headline would itself look like the breakage it is
   * trying to explain. These are already `pointer-events-none` and half
   * transparent; when they do not load, nothing should take their place.
   */
  decorative,
}: {
  src: string;
  className?: string;
  title?: string;
  href?: string;
  decorative?: boolean;
}) {
  const [blocked, setBlocked] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    // Long enough that a slow-but-working player is never accused, short
    // enough that nobody sits staring at a black box.
    const t = setTimeout(() => {
      if (!loaded.current) setBlocked(true);
    }, 6000);
    return () => clearTimeout(t);
  }, [src]);

  if (blocked && decorative) return null;

  if (blocked) {
    return (
      <div className={className} style={{ display: "grid", placeItems: "center", padding: "1.5rem" }}>
        <div className="max-w-sm text-center">
          <p className="text-sm font-semibold text-white">این ویدیو روی یوتیوب میزبانی می‌شود</p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/70">
            دسترسی به یوتیوب از ایران بدون تغییر آی‌پی ممکن نیست. سایت مشکلی ندارد.
          </p>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 text-sm font-medium text-white transition-colors hover:bg-white/20"
            >
              باز کردن در یوتیوب
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      className={className}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      loading="lazy"
      onLoad={() => {
        loaded.current = true;
      }}
      style={{ border: 0 }}
    />
  );
}
