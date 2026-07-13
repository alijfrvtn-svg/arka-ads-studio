"use client";

import Link from "next/link";
import { CalendarDays, MessageSquare } from "lucide-react";
import { TASK_PRIORITIES } from "@/lib/constants";
import { faDate } from "@/lib/utils";
import { TaskStatusSelect } from "./TaskStatusSelect";

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  _count: { comments: number };
}

export function MyTaskRow({ task }: { task: TaskItem }) {
  const priority = TASK_PRIORITIES.find((p) => p.value === task.priority);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-card-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <Link href={`/portal/tasks/${task.id}`} className="font-semibold text-foreground hover:text-primary">
          {task.title}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-foreground-faint">
          {priority && (
            <span className="rounded-full px-2 py-0.5 font-medium" style={{ background: `${priority.color}1a`, color: priority.color }}>
              {priority.label}
            </span>
          )}
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {faDate(task.dueDate, { month: "short", day: "numeric" })}
            </span>
          )}
          {task._count.comments > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task._count.comments}
            </span>
          )}
        </div>
      </div>
      <TaskStatusSelect taskId={task.id} status={task.status} className="w-full sm:w-44" />
    </div>
  );
}
