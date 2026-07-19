"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronRight, ChevronLeft, X } from "lucide-react";
import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS_SHORT,
  buildJalaliMonthGrid,
  gregorianToJalali,
  jalaliToGregorian,
  todayJalali,
  type JalaliDate,
} from "@/lib/jalali";
import { inputCls } from "@/components/admin/form";
import { toFa, cn } from "@/lib/utils";

function toDateOnlyIso(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

/** Jalali (Shamsi) calendar date picker. Outputs the same "YYYY-MM-DD" Gregorian
 * string a native `<input type="date">` would, via a hidden input — so
 * saveTask/lib/actions.ts needs no changes. */
export function JalaliDatePicker({ name, defaultValue }: { name: string; defaultValue?: string }) {
  const initial = defaultValue ? gregorianToJalali(new Date(defaultValue)) : null;
  const [value, setValue] = useState<JalaliDate | null>(initial);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<{ jy: number; jm: number }>(() => initial ?? todayJalali());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const rows = buildJalaliMonthGrid(view.jy, view.jm);
  const today = todayJalali();
  const isoValue = value ? toDateOnlyIso(jalaliToGregorian(value.jy, value.jm, value.jd)) : "";

  return (
    <div className="relative" ref={ref}>
      <input type="hidden" name={name} value={isoValue} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(inputCls, "flex items-center justify-between text-right")}
      >
        <span className={value ? "text-foreground" : "text-foreground-faint"}>
          {value ? `${toFa(value.jd)} ${JALALI_MONTHS[value.jm - 1]} ${toFa(value.jy)}` : "انتخاب تاریخ"}
        </span>
        <span className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setValue(null);
              }}
              className="grid h-5 w-5 place-items-center rounded-full text-foreground-faint hover:bg-card-hover hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <CalendarDays className="h-4 w-4 text-foreground-faint" />
        </span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-72 rounded-xl border border-card-border bg-surface p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setView((v) => (v.jm === 1 ? { jy: v.jy - 1, jm: 12 } : { jy: v.jy, jm: v.jm - 1 }))}
              className="grid h-7 w-7 place-items-center rounded-lg text-foreground-muted hover:bg-card-hover"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-foreground">
              {JALALI_MONTHS[view.jm - 1]} {toFa(view.jy)}
            </span>
            <button
              type="button"
              onClick={() => setView((v) => (v.jm === 12 ? { jy: v.jy + 1, jm: 1 } : { jy: v.jy, jm: v.jm + 1 }))}
              className="grid h-7 w-7 place-items-center rounded-lg text-foreground-muted hover:bg-card-hover"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-foreground-faint">
            {JALALI_WEEKDAYS_SHORT.map((w, i) => (
              <div key={i} className="py-1">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {rows.map((row, ri) =>
              row.map((cell, ci) => {
                const isSelected = value && value.jy === cell.jy && value.jm === cell.jm && value.jd === cell.jd;
                const isToday = today.jy === cell.jy && today.jm === cell.jm && today.jd === cell.jd;
                return (
                  <button
                    key={`${ri}-${ci}`}
                    type="button"
                    onClick={() => {
                      setValue({ jy: cell.jy, jm: cell.jm, jd: cell.jd });
                      setView({ jy: cell.jy, jm: cell.jm });
                      setOpen(false);
                    }}
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-lg text-xs transition-colors",
                      cell.inCurrentMonth ? "text-foreground" : "text-foreground-faint opacity-50",
                      isSelected && "bg-primary text-primary-foreground",
                      !isSelected && isToday && "border border-primary/60 text-primary",
                      !isSelected && "hover:bg-card-hover",
                    )}
                  >
                    {toFa(cell.jd)}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
