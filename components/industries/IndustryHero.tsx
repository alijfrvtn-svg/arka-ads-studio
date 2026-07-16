"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/fx/Reveal";
import { EmbedFrame } from "@/components/media/EmbedFrame";
import { getEmbedUrl } from "@/lib/embed";
import { cn } from "@/lib/utils";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

/**
 * Static cover + title/description by default; hovering the background
 * (not the text) crossfades into the hero video and fades the text out.
 * Hovering back onto the text area cancels the video immediately.
 */
export function IndustryHero({
  title,
  description,
  cover,
  heroVideo,
  locale = "fa",
}: {
  title: string;
  description: string;
  cover: string | null;
  heroVideo: string | null;
  locale?: Locale;
}) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embedUrl = heroVideo ? getEmbedUrl(heroVideo, { autoplay: true, mute: true, loop: true }) : null;
  const active = hover && !!heroVideo;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  return (
    <section
      className="relative flex min-h-[70vh] items-end overflow-hidden pb-16 pt-40"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            active ? "opacity-0" : "opacity-50",
          )}
        />
      )}
      {heroVideo &&
        (embedUrl ? (
          <EmbedFrame
            src={embedUrl}
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              active ? "opacity-50" : "opacity-0",
            )}
          />
        ) : (
          <video
            ref={videoRef}
            src={heroVideo}
            poster={cover ?? undefined}
            muted
            loop
            playsInline
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              active ? "opacity-50" : "opacity-0",
            )}
          />
        ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/25" />
      <div
        className="container-x relative transition-opacity duration-500"
        style={{ opacity: active ? 0 : 1 }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHover(false);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setHover(true);
        }}
      >
        <Reveal>
          <nav className="mb-4 text-xs text-foreground-muted">
            <Link href="/" className="hover:text-primary">{ui(locale).navHome}</Link> ‹ <Link href="/industries" className="hover:text-primary">{ui(locale).navIndustries}</Link>
          </nav>
        </Reveal>
        <Reveal delay={0.05}>
          <span className="eyebrow">{ui(locale).industryHeroEyebrow}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl font-extrabold text-foreground md:text-7xl">{title}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-2xl text-lg text-foreground-muted">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
