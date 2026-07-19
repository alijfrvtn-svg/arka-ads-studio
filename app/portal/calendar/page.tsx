import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TaskCalendarGrid, type CalendarTask } from "@/components/tasks/TaskCalendarGrid";
import { buildJalaliMonthGrid, dateKey, todayJalali } from "@/lib/jalali";

export default async function PortalCalendarPage({ searchParams }: { searchParams: Promise<{ jy?: string; jm?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const today = todayJalali();
  const jy = Number(sp.jy) || today.jy;
  const jm = Number(sp.jm) || today.jm;

  const rows = buildJalaliMonthGrid(jy, jm);
  const rangeStart = rows[0][0].date;
  const rangeEnd = new Date(rows[rows.length - 1][6].date.getTime() + 24 * 60 * 60 * 1000);

  // Whole-team visibility on purpose — everyone sees whose deadline falls where
  // for planning, even though each task's own detail/comments stay private
  // to its assignee (enforced separately in /portal/tasks/[id]).
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
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">تقویم تیم</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">ددلاین تمام تسک‌های تیم — برای دیدن جزئیات فقط تسک‌های خودت قابل باز شدنن</p>
      </div>
      <TaskCalendarGrid rows={rows} jy={jy} jm={jm} tasksByDay={tasksByDay} basePath="/portal/tasks" currentUserId={user.id} isAdmin={false} />
    </div>
  );
}
