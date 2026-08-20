"use client";

import { useState } from "react";

/**
 * A colour, as a swatch you can open and a hex you can type.
 *
 * Both halves write the same `name`, so the form sees one value — the native
 * picker is bound to the text rather than being a separate input, because a
 * page with two dozen colours on it is edited far more often by pasting a hex
 * than by hunting in a colour wheel.
 *
 * The hex is `dir="ltr"`: this panel is right-to-left and `#FF6B5B` typed into
 * an RTL field puts the hash on the wrong end.
 */
export function ColorField({ name, defaultValue }: { name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  // The native picker refuses anything that is not #rrggbb, and shorthand or a
  // half-typed value would make it snap to black.
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <span className="flex items-center gap-2">
      <span
        className="relative h-7 w-7 flex-none overflow-hidden rounded-[7px] border border-[var(--ios-separator)]"
        style={{ background: valid ? value : "transparent" }}
      >
        <input
          type="color"
          aria-label="انتخاب رنگ"
          value={valid ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </span>
      <input
        name={name}
        dir="ltr"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        className="ios-field ltr-nums font-mono"
        placeholder="#000000"
      />
    </span>
  );
}
