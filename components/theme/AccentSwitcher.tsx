"use client";

import { Palette } from "lucide-react";
import { ACCENTS, useAccent } from "./AccentProvider";
import { cn } from "@/lib/utils";

/**
 * On/off switch for the living colour cycle.
 *
 * Deliberately a single toggle rather than a swatch picker: the colour is the
 * site's own behaviour, not a preference the visitor is asked to configure. The
 * only real choice is "do you want this to move or not", so that is the only
 * control — and the current colour shows through the switch itself, which
 * doubles as the preview.
 */
export function AccentSwitcher({ className }: { className?: string }) {
  const { accent, cycling, setCycling } = useAccent();
  const current = ACCENTS.find((a) => a.key === accent) ?? ACCENTS[0];

  return (
    <div className={cn("inline-flex", className)}>
      <button
        onClick={() => setCycling(!cycling)}
        role="switch"
        aria-checked={cycling}
        aria-label={cycling ? "خاموش کردن تغییر خودکار رنگ سایت" : "روشن کردن تغییر خودکار رنگ سایت"}
        title={cycling ? "تغییر خودکار رنگ: روشن" : "تغییر خودکار رنگ: خاموش"}
        className={cn(
          "relative grid h-11 w-11 place-items-center rounded-full border transition-colors",
          cycling
            ? "border-primary/60 bg-primary/10 text-primary"
            : "border-card-border bg-surface/60 text-foreground-muted hover:border-primary/50",
        )}
      >
        <Palette className="h-[18px] w-[18px]" />
        {/* The dot previews the colour currently painted, and only pulses while
            the cycle is actually running. */}
        <span
          className={cn(
            "absolute bottom-1 left-1 h-2.5 w-2.5 rounded-full ring-2 ring-background transition-colors duration-700",
            cycling && "animate-ping-slow",
          )}
          style={{ background: cycling ? current.swatch : ACCENTS[0].swatch }}
          aria-hidden
        />
        {!cycling && (
          // A crossed-out state has to be visible without relying on colour.
          <span className="absolute inset-0 grid place-items-center" aria-hidden>
            <span className="h-6 w-px rotate-45 bg-foreground-faint" />
          </span>
        )}
      </button>
    </div>
  );
}
