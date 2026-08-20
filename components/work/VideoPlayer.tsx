"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmbedUrl } from "@/lib/embed";
import { EmbedFrame } from "@/components/media/EmbedFrame";

/**
 * Click-to-play video with a poster frame. Handles both a direct file and an
 * Aparat/YouTube/Instagram page link (see lib/embed.ts).
 *
 * Deliberately does not autoplay: it is used inside content, where a clip that
 * starts on its own competes with reading.
 */
export function VideoPlayer({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const [play, setPlay] = useState(false);

  if (play) {
    const embedUrl = getEmbedUrl(src, { autoplay: true });
    if (embedUrl) {
      return <EmbedFrame src={embedUrl} href={src} className={cn("h-full w-full bg-black", className)} />;
    }
    return <video src={src} controls autoPlay playsInline className={cn("h-full w-full bg-black object-cover", className)} />;
  }

  return (
    <button
      onClick={() => setPlay(true)}
      aria-label="پخش ویدیو"
      className={cn("group relative block h-full w-full", className)}
      data-cursor
    >
      {/* Linking a video without also setting a cover is common, and an <img>
          with an empty src renders as a broken-image icon — fall back to the
          brand gradient instead. */}
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="h-full w-full object-cover transition-all duration-700" />
      ) : (
        <span className="reel-bg block h-full w-full" />
      )}
      <span className="absolute inset-0 grid place-items-center bg-black/25 transition-colors duration-500 group-hover:bg-black/35">
        <span className="glass-onmedia relative grid h-20 w-20 place-items-center rounded-full transition-transform duration-500 [transition-timing-function:var(--ease-apple)] group-hover:scale-110">
          <span className="absolute inset-0 animate-ping-slow rounded-full border border-white/60" />
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </span>
    </button>
  );
}
