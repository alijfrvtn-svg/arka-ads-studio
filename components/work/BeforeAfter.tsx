"use client";

import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

/** Interactive before/after comparison slider (drag to reveal). */
export function BeforeAfter({ before, after, locale = "fa" }: { before: string; after: string; locale?: Locale }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);

  const onMove = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-card-border"
      onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
      onClick={(e) => onMove(e.clientX)}
    >
      {/* after (full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={ui(locale).after} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">{ui(locale).after}</span>
      {/* before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={ui(locale).before} className="absolute inset-0 h-full w-full object-cover" style={{ width: `${10000 / pos}%`, maxWidth: "none" }} draggable={false} />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">{ui(locale).before}</span>
      </div>
      {/* handle */}
      <div className="absolute inset-y-0 z-10 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-primary text-white shadow-lg">
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
