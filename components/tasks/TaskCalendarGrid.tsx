"use client";

import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { JALALI_MONTHS, JALALI_WEEKDAYS_SHORT, dateKey, todayJalali, type JalaliCalendarCell } from "@/lib/jalali";
import { TASK_STATUSES } from "@/lib/constants";
import { toFa, cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/types";

export interface CalendarTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeName: string;
  assigneeId: string;
}

export function TaskCalendarGrid({
  rows,
  jy,
  jm,
  tasksByDay,
  basePath,
  currentUserId,
  isAdmin,
}: {
  rows: JalaliCalendarCell[][];
  jy: number;
  jm: number;
  tasksByDay: Record<string, CalendarTask[]>;
  /** Where a clickable task pill should link, e.g. "/admin/tasks" or "/portal/tasks". */
  basePath: string;
  /** Portal viewers may only open their own task's detail page. */
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const today = todayJalali();
  const prevMonth = jm === 1 ? { jy: jy - 1, jm: 12 } : { jy, jm: jm - 1 };
  const nextMonth = jm === 12 ? { jy: jy + 1, jm: 1 } : { jy, jm: jm + 1 };
  const calendarHref = basePath === "/admin/tasks" ? "/admin/tasks/calendar" : "/portal/calendar";

  return (
    <div className="rounded-2xl border border-card-border bg-surface p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`${calendarHref}?jy=${prevMonth.jy}&jm=${prevMonth.jm}`}
          className="grid h-9 w-9 place-items-center rounded-lg border border-card-border text-foreground-muted hover:text-primary"
          aria-label="ماه قبل"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
        <h2 className="font-display text-lg font-bold text-foreground">
          {JALALI_MONTHS[jm - 1]} {toFa(jy)}
        </h2>
        <Link
          href={`${calendarHref}?jy=${nextMonth.jy}&jm=${nextMonth.jm}`}
          className="grid h-9 w-9 place-items-center rounded-lg border border-card-border text-foreground-muted hover:text-primary"
          aria-label="ماه بعد"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-foreground-faint">
        {JALALI_WEEKDAYS_SHORT.map((w, i) => (
          <div key={i} className="py-1.5">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1.5">
        {rows.map((row, ri) =>
          row.map((cell, ci) => {
            const key = dateKey(cell.date);
            const tasks = tasksByDay[key] ?? [];
            const isToday = cell.jy === today.jy && cell.jm === today.jm && cell.jd === today.jd;
            const visible = tasks.slice(0, 3);
            const extra = tasks.length - visible.length;

            return (
              <div
                key={`${ri}-${ci}`}
                className={cn(
                  "min-h-24 rounded-xl border p-1.5",
                  cell.inCurrentMonth ? "border-card-border bg-background/40" : "border-transparent bg-background/10 opacity-50",
                  isToday && "border-primary/60 bg-primary/5",
                )}
              >
                <div className={cn("mb-1 text-xs font-semibold", isToday ? "text-primary" : "text-foreground-muted")}>
                  {toFa(cell.jd)}
                </div>
                <div className="space-y-1">
                  {visible.map((t) => {
                    const status = TASK_STATUSES.find((s) => s.value === t.status);
                    const clickable = isAdmin || t.assigneeId === currentUserId;
                    const pill = (
                      <div
                        className="truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium"
                        style={{ background: `${status?.color ?? "#6699ff"}1a`, color: status?.color ?? "#6699ff" }}
                        title={`${t.title} — ${t.assigneeName}`}
                      >
                        {t.title}
                      </div>
                    );
                    return clickable ? (
                      <Link key={t.id} href={`${basePath}/${t.id}`} className="block hover:opacity-80">
                        {pill}
                      </Link>
                    ) : (
                      <div key={t.id}>{pill}</div>
                    );
                  })}
                  {extra > 0 && <div className="px-1.5 text-[11px] text-foreground-faint">+{toFa(extra)} مورد دیگر</div>}
                </div>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
