"use client";

import { useCallback, useMemo, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RepeaterField {
  key: string;
  label: string;
  placeholder?: string;
  /** `area` renders a textarea, `check` a checkbox ("1"/""); the rest are
   *  single-line inputs. */
  type?: "text" | "area" | "number" | "url" | "check";
  /** Full row rather than sharing the two-column grid. */
  wide?: boolean;
  hint?: string;
}

type Row = Record<string, string>;

/**
 * A labelled, row-based editor for the repeating structures in the CMS.
 *
 * Replaces the pipe-delimited textareas these fields used to be — where a value
 * was typed as `Target | استراتژی‌محور | …` and the editor had to remember the
 * column order, count separators by eye, and never type a `|` inside their own
 * copy. Every value now has its own labelled box.
 *
 * Serialisation
 * -------------
 * State is mirrored into one hidden input as JSON, so the surrounding <form>
 * and its server action still submit exactly one field. Rows that are entirely
 * blank are dropped on the way out: an editor who adds a row and changes their
 * mind should not have to delete it again to save.
 *
 * `locked` is for fixed sets — the four hero departments, where rows map to
 * real ids and adding a eighth or deleting one would only ever be a mistake.
 * Those rows keep their inputs but lose the add/remove controls.
 */
export function Repeater({
  name,
  fields,
  initial,
  addLabel = "افزودن",
  rowLabel,
  locked = false,
  max,
}: {
  name: string;
  fields: RepeaterField[];
  initial: Row[];
  addLabel?: string;
  /** Heading for each row, e.g. (row, i) => row.department ?? `مورد ${i + 1}`. */
  rowLabel?: (row: Row, index: number) => string;
  locked?: boolean;
  max?: number;
}) {
  const blank = useMemo(() => Object.fromEntries(fields.map((f) => [f.key, ""])) as Row, [fields]);
  const [rows, setRows] = useState<Row[]>(() => (initial.length ? initial : locked ? [] : [blank]));

  const set = useCallback((i: number, key: string, value: string) => {
    setRows((prev) => prev.map((r, n) => (n === i ? { ...r, [key]: value } : r)));
  }, []);

  const add = () => setRows((prev) => [...prev, blank]);
  const remove = (i: number) => setRows((prev) => prev.filter((_, n) => n !== i));
  const move = (i: number, delta: number) =>
    setRows((prev) => {
      const to = i + delta;
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[to]] = [next[to], next[i]];
      return next;
    });

  const payload = JSON.stringify(rows.filter((r) => Object.values(r).some((v) => v.trim())));

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={payload} />

      {rows.map((row, i) => (
        <div key={i} className="rounded-xl border border-card-border bg-background/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-foreground">
              {rowLabel ? rowLabel(row, i) : `مورد ${i + 1}`}
            </span>
            {!locked && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="انتقال به بالا"
                  className="grid h-8 w-8 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-card-hover hover:text-foreground disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="حذف این مورد"
                  className="grid h-8 w-8 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => (
              <label
                key={f.key}
                className={cn("flex flex-col gap-1.5", (f.wide || f.type === "area") && "sm:col-span-2")}
              >
                <span className="text-xs font-medium text-foreground-muted">{f.label}</span>
                {f.type === "check" ? (
                  <span className="flex h-10 items-center">
                    <input
                      type="checkbox"
                      checked={row[f.key] === "1"}
                      onChange={(e) => set(i, f.key, e.target.checked ? "1" : "")}
                      className="h-5 w-5 rounded border-card-border accent-[var(--primary)]"
                    />
                  </span>
                ) : f.type === "area" ? (
                  <textarea
                    value={row[f.key] ?? ""}
                    onChange={(e) => set(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    rows={2}
                    className="min-h-16 w-full rounded-lg border border-card-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                ) : (
                  <input
                    value={row[f.key] ?? ""}
                    onChange={(e) => set(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                    inputMode={f.type === "number" ? "numeric" : undefined}
                    dir={f.type === "url" ? "ltr" : undefined}
                    className={cn(
                      "h-10 w-full rounded-lg border border-card-border bg-surface px-3 text-sm text-foreground outline-none transition-colors focus:border-primary",
                      f.type === "url" && "text-left",
                    )}
                  />
                )}
                {f.hint && <span className="text-[11px] leading-snug text-foreground-faint">{f.hint}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!locked && (!max || rows.length < max) && (
        <button
          type="button"
          onClick={add}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-dashed border-card-border text-sm font-medium text-foreground-muted transition-colors hover:border-primary hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}
