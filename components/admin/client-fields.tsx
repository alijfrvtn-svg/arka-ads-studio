"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { inputCls } from "./form";
import { cn } from "@/lib/utils";

export function TagInput({
  value,
  onChange,
  placeholder = "افزودن و Enter…",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-card-border bg-background/50 p-2">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
        >
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={placeholder}
        className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm text-foreground outline-none placeholder:text-foreground-faint"
      />
    </div>
  );
}

export function MultiSelect({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              on
                ? "border-primary bg-primary/10 text-primary"
                : "border-card-border text-foreground-muted hover:border-primary/40",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function ImageInput({
  value,
  onChange,
  placeholder = "https://…",
  video = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  video?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-card-border bg-background/50 text-foreground-faint">
        {value ? (
          video ? (
            <video src={value} className="h-full w-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <span className="text-xs">—</span>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir="ltr"
        className={cn(inputCls, "text-left")}
      />
    </div>
  );
}
