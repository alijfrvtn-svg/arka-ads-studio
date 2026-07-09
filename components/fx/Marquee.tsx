"use client";

import { cn } from "@/lib/utils";

/** Seamless infinite marquee (content duplicated for the loop). */
export function Marquee({
  children,
  speed = 42,
  reverse = false,
  pauseOnHover = true,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("group relative overflow-hidden", pauseOnHover && "marquee-paused", className)}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
