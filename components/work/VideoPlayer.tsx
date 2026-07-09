"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

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
    return <video src={src} controls autoPlay className={cn("h-full w-full bg-black object-cover", className)} />;
  }
  return (
    <button onClick={() => setPlay(true)} className={cn("group relative block h-full w-full", className)} data-cursor>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 grid place-items-center bg-black/30 transition-colors group-hover:bg-black/40">
        <span className="relative grid h-20 w-20 place-items-center rounded-full bg-primary text-white transition-transform group-hover:scale-110">
          <span className="absolute inset-0 animate-ping-slow rounded-full bg-primary/50" />
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </div>
    </button>
  );
}
