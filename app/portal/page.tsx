import { ListTodo } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/admin/ui";
import { TASK_STATUSES } from "@/lib/constants";
import { faNumber } from "@/lib/utils";
import { MyTaskRow } from "@/components/portal/MyTaskRow";

export default async function PortalHome() {
  const user = await requireUser();
  const tasks = await db.task.findMany({
    where: { assigneeId: user.id },
    include: { _count: { select: { comments: true } } },
    orderBy: { createdAt: "desc" },
  });
  const open = tasks.filter((t) => t.status !== "DONE" && t.status !== "CANCELLED").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">تسک‌های من</h1>
        <p className="mt-1.5 text-sm text-foreground-muted">
          {faNumber(tasks.length)} تسک · {faNumber(open)} باز
        </p>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="فعلاً تسکی برای شما ثبت نشده"
          description="وقتی مدیر تسکی به شما بده، اینجا نمایش داده می‌شود."
        />
      ) : (
        <div className="space-y-8">
          {TASK_STATUSES.map((col) => {
            const items = tasks.filter((t) => t.status === col.value);
            if (items.length === 0) return null;
            return (
              <div key={col.value}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                  <h2 className="text-sm font-semibold text-foreground">{col.label}</h2>
                  <span className="rounded-full bg-card-hover px-2 py-0.5 text-xs text-foreground-muted">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((t) => (
                    <MyTaskRow key={t.id} task={t} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
