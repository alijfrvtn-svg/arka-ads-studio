import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { TaskCalendarGrid, type CalendarTask } from "@/components/tasks/TaskCalendarGrid";
import { buildJalaliMonthGrid, dateKey, todayJalali } from "@/lib/jalali";

export default async function TasksCalendarPage({ searchParams }: { searchParams: Promise<{ jy?: string; jm?: string }> }) {
  const sp = await searchParams;
  const today = todayJalali();
  const jy = Number(sp.jy) || today.jy;
  const jm = Number(sp.jm) || today.jm;

  const rows = buildJalaliMonthGrid(jy, jm);
  const rangeStart = rows[0][0].date;
  const rangeEnd = new Date(rows[rows.length - 1][6].date.getTime() + 24 * 60 * 60 * 1000);

  const tasks = await db.task.findMany({
    where: { dueDate: { gte: rangeStart, lt: rangeEnd } },
    include: { assignee: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" },
  });

  const tasksByDay: Record<string, CalendarTask[]> = {};
  for (const t of tasks) {
    if (!t.dueDate) continue;
    const key = dateKey(t.dueDate);
    (tasksByDay[key] ??= []).push({
      id: t.id,
      title: t.title,
      status: t.status as CalendarTask["status"],
      priority: t.priority as CalendarTask["priority"],
      assigneeName: t.assignee.name,
      assigneeId: t.assignee.id,
    });
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="تقویم تسک‌ها" description="تمام ددلاین‌های تیم روی تقویم شمسی">
        <Link
          href="/admin/tasks"
          className="inline-flex items-center gap-1.5 rounded-xl border border-card-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
        >
          <LayoutGrid className="h-4 w-4" /> نمای برد
        </Link>
      </PageHeader>
      <TaskCalendarGrid rows={rows} jy={jy} jm={jm} tasksByDay={tasksByDay} basePath="/admin/tasks" isAdmin />
    </div>
  );
}
