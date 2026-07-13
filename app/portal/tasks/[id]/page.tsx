import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentThread } from "@/components/tasks/CommentThread";
import { TaskStatusSelect } from "@/components/portal/TaskStatusSelect";
import { addMyTaskComment } from "@/lib/portal-actions";
import { TASK_PRIORITIES } from "@/lib/constants";
import { faDate } from "@/lib/utils";

export default async function MyTaskDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const task = await db.task.findUnique({
    where: { id },
    include: {
      comments: { include: { author: { select: { name: true } } }, orderBy: { createdAt: "asc" } },
      createdBy: { select: { name: true } },
    },
  });
  // A staff member may only ever see their own task — never trust the URL alone.
  if (!task || task.assigneeId !== user.id) notFound();

  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/portal"
          className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary"
        >
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{task.title}</h1>
      </div>

      <div className="mb-6 rounded-2xl border border-card-border bg-surface p-5">
        {task.description && <p className="whitespace-pre-line text-sm text-foreground-muted">{task.description}</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-foreground-faint">
          {priority && (
            <span className="rounded-full px-2 py-0.5 font-medium" style={{ background: `${priority.color}1a`, color: priority.color }}>
              اولویت: {priority.label}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" /> سررسید: {faDate(task.dueDate)}
            </span>
          )}
          {task.createdBy && <span>واگذارشده توسط {task.createdBy.name}</span>}
        </div>
        <div className="mt-4">
          <TaskStatusSelect taskId={task.id} status={task.status} />
        </div>
      </div>

      <CommentThread taskId={task.id} comments={task.comments} addComment={addMyTaskComment} />
    </div>
  );
}
