"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateMyTaskStatus } from "@/lib/portal-actions";
import { TASK_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TaskStatusSelect({ taskId, status, className }: { taskId: string; status: string; className?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const change = (value: string) =>
    start(async () => { await updateMyTaskStatus(taskId, value); router.refresh(); });

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => change(e.target.value)}
      className={cn(
        "h-10 rounded-lg border border-card-border bg-background/50 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary disabled:opacity-60",
        className,
      )}
    >
      {TASK_STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}
