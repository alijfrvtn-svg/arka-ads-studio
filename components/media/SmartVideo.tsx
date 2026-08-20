"use client";

import { getEmbedUrl } from "@/lib/embed";
import { EmbedFrame } from "./EmbedFrame";
import { cn } from "@/lib/utils";

/**
 * The one place that decides how a CMS video URL is rendered.
 *
 * Admins paste two very different things into the same fields — a direct file
 * (`…/clip.mp4`, `/api/media/<key>`) or an Aparat/YouTube/Instagram *page*
 * link. A page link in a `<video src>` renders nothing at all, which is exactly
 * how videos went missing: several call sites hardcoded `<video>` and only a
 * couple remembered to check. Everything that shows CMS video goes through here
 * now, so the two cases can never drift apart again.
 *
 * `background` marks a decorative backdrop sitting behind copy: it drops
 * pointer events (an iframe would otherwise swallow clicks meant for the CTA on
 * top of it) and hides controls.
 */
export function SmartVideo({
  src,
  poster,
  className,
  background = false,
  autoPlay = false,
  loop = false,
  muted = true,
  controls = false,
  preload = "metadata",
  title = "ویدیو",
  videoRef,
}: {
  src: string;
  poster?: string | null;
  className?: string;
  background?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: "none" | "metadata" | "auto";
  title?: string;
  videoRef?: React.Ref<HTMLVideoElement>;
}) {
  if (!src) return null;

  // Platform links can only autoplay when muted — browsers block the rest, and
  // an unmuted hero backdrop would be hostile anyway.
  const embedSrc = getEmbedUrl(src, {
    autoplay: autoPlay,
    loop,
    mute: background || muted,
    controls: background ? false : controls,
  });

  if (embedSrc) {
    return (
      <EmbedFrame
        src={embedSrc}
        title={title}
        href={src}
        decorative={background}
        className={cn(className, background && "pointer-events-none")}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster || undefined}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      controls={controls}
      playsInline
      preload={preload}
      className={cn(className, background && "pointer-events-none")}
    />
  );
}

/** True when the URL needs an iframe — i.e. it cannot be scrubbed, seeked or
 *  otherwise driven from JS, because it renders inside a third-party player. */
export function isEmbeddedVideo(src: string | null | undefined) {
  return !!src && getEmbedUrl(src) !== null;
}
