// Detects video links from known platforms (Aparat, YouTube, Instagram) and
// converts them into an iframe-embeddable URL. Direct file links (mp4/webm/…)
// return null here and are rendered with a native <video> tag instead —
// existing content (Google sample videos, direct CDN links, etc.) is
// completely unaffected.

export interface EmbedOptions {
  autoplay?: boolean;
  loop?: boolean;
  mute?: boolean;
  controls?: boolean;
}

type Platform = "aparat" | "youtube" | "instagram" | null;

function detectPlatform(url: string): Platform {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("aparat.com")) return "aparat";
    if (host.includes("youtube.com") || host === "youtu.be" || host === "m.youtube.com") return "youtube";
    if (host.includes("instagram.com")) return "instagram";
    return null;
  } catch {
    return null;
  }
}

/** True for URLs that point directly at a playable video file. */
export function isDirectFileUrl(url: string): boolean {
  return /\.(mp4|webm|ogv|ogg|mov|m3u8)(\?.*)?$/i.test(url);
}

/**
 * Returns an iframe-embeddable URL for a known video platform link, or
 * `null` if the URL isn't recognized (meaning it should be treated as a
 * direct file and played with a native <video> element).
 */
export function getEmbedUrl(url: string | null | undefined, opts: EmbedOptions = {}): string | null {
  if (!url) return null;
  const platform = detectPlatform(url);
  if (!platform) return null;

  try {
    if (platform === "aparat") {
      let embedBase = url;
      if (!url.includes("/embed/")) {
        const match = url.match(/aparat\.com\/(?:v|video\/video)\/([a-zA-Z0-9_-]+)/);
        if (!match) return null;
        embedBase = `https://www.aparat.com/video/video/embed/videohash/${match[1]}/vt/frame`;
      }
      const [base, existingQs] = embedBase.split("?");
      const params = new URLSearchParams(existingQs);
      if (opts.autoplay) params.set("autoplay", "true");
      if (opts.mute) params.set("mute", "true");
      const qs = params.toString();
      return qs ? `${base}?${qs}` : base;
    }

    if (platform === "youtube") {
      const u = new URL(url);
      let id = "";
      if (u.hostname === "youtu.be") id = u.pathname.slice(1);
      else if (u.pathname.startsWith("/embed/")) id = u.pathname.split("/embed/")[1] ?? "";
      else if (u.pathname.startsWith("/shorts/")) id = u.pathname.split("/shorts/")[1] ?? "";
      else id = u.searchParams.get("v") ?? "";
      id = id.split("/")[0].split("?")[0];
      if (!id) return null;

      const params = new URLSearchParams();
      if (opts.autoplay) params.set("autoplay", "1");
      if (opts.mute) params.set("mute", "1");
      if (opts.loop) {
        params.set("loop", "1");
        params.set("playlist", id);
      }
      if (opts.controls === false) params.set("controls", "0");
      params.set("rel", "0");
      return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    }

    if (platform === "instagram") {
      const clean = url.split("?")[0].replace(/\/$/, "");
      return `${clean}/embed`;
    }
  } catch {
    return null;
  }

  return null;
}

export function isEmbedUrl(url: string | null | undefined): boolean {
  return getEmbedUrl(url) !== null;
}
