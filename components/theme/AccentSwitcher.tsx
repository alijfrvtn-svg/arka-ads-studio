"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Palette } from "lucide-react";
import { ACCENTS, useAccent } from "./AccentProvider";
import { cn } from "@/lib/utils";

/**
 * Header control for the visitor's identity colour. Deliberately a disclosure
 * (button → panel) rather than seven always-visible dots: the swatch row would
 * otherwise compete with the logo and the primary CTA for attention in a header
 * that already carries nav, theme toggle and "شروع پروژه".
 */
export function AccentSwitcher({ className }: { className?: string }) {
  const { accent, setAccent } = useAccent();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = ACCENTS.find((a) => a.key === accent) ?? ACCENTS[0];

  // Dismiss on outside click and on Escape — a panel with no escape route is
  // the classic keyboard trap.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`رنگ هویت سایت — ${current.label}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative grid h-11 w-11 place-items-center rounded-full border border-card-border bg-surface/60 text-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Palette className="h-[18px] w-[18px]" />
        <span
          className="absolute bottom-1 left-1 h-2 w-2 rounded-full ring-1 ring-background"
          style={{ background: current.swatch }}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="glass absolute left-0 top-12 z-50 w-56 origin-top-left rounded-2xl border border-card-border p-3 shadow-2xl"
            role="group"
            aria-label="انتخاب رنگ هویت"
          >
            <p className="mb-2 px-1 text-xs font-medium text-foreground-muted">رنگ دلخواه شما</p>
            <div className="grid grid-cols-4 gap-1.5">
              {ACCENTS.map((a) => {
                const active = a.key === accent;
                return (
                  <button
                    key={a.key}
                    onClick={() => setAccent(a.key)}
                    title={a.label}
                    aria-label={a.label}
                    aria-pressed={active}
                    // h-12: keeps the tap target clear of the 44px floor even
                    // when the page renders at a sub-16px root size.
                    className={cn(
                      "group grid h-12 w-12 place-items-center rounded-xl border transition-colors",
                      active ? "border-primary bg-card-hover" : "border-transparent hover:bg-card-hover",
                    )}
                  >
                    <span
                      className="grid h-6 w-6 place-items-center rounded-full"
                      style={{ background: a.swatch }}
                    >
                      {/* Selection is marked with a glyph, not colour alone. */}
                      {active && <Check className="h-3.5 w-3.5 text-[#04060d]" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 text-[11px] leading-relaxed text-foreground-faint">
              انتخاب شما روی این مرورگر ذخیره می‌شود.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
