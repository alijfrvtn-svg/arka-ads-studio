"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, MessageSquare, CalendarDays } from "lucide-react";
import { updateTaskStatus, deleteTask } from "@/lib/actions";
import { TASK_STATUSES, TASK_PRIORITIES } from "@/lib/constants";
import { faDate } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  assignee: { name: string; avatar: string | null } | null;
  _count: { comments: number };
}

export function TasksBoard({ tasks }: { tasks: TaskItem[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, status: string) =>
    start(async () => { await updateTaskStatus(id, status); router.refresh(); });
  const remove = (id: string) =>
    start(async () => { await deleteTask(id); router.refresh(); });

  const priority = (p: string) => TASK_PRIORITIES.find((x) => x.value === p);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TASK_STATUSES.map((col) => {
        const items = tasks.filter((t) => t.status === col.value);
        return (
          <div
            key={col.value}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragId) move(dragId, col.value); setDragId(null); }}
            className="flex flex-col rounded-2xl border border-card-border bg-surface/50"
          >
            <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
              </div>
              <span className="rounded-full bg-card-hover px-2 py-0.5 text-xs text-foreground-muted">{items.length}</span>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {items.map((t) => {
                const p = priority(t.priority);
                return (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={() => setDragId(t.id)}
                    className="group cursor-grab rounded-xl border border-card-border bg-background/60 p-3 active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/admin/tasks/${t.id}`} className="font-semibold text-foreground hover:text-primary">
                        {t.title}
                      </Link>
                      <button onClick={() => remove(t.id)} className="opacity-0 transition-opacity group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5 text-foreground-faint hover:text-rose-400" />
                      </button>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                      {p && (
                        <span className="rounded-full px-2 py-0.5 font-medium" style={{ background: `${p.color}1a`, color: p.color }}>
                          {p.label}
                        </span>
                      )}
                      {t.assignee && (
                        <span className="flex items-center gap-1 text-foreground-faint">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={t.assignee.avatar || `https://i.pravatar.cc/80?u=${t.assignee.name}`}
                            alt=""
                            className="h-4 w-4 rounded-full object-cover"
                          />
                          {t.assignee.name}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 border-t border-card-border pt-2 text-[11px] text-foreground-faint">
                      {t.dueDate && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {faDate(t.dueDate, { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {t._count.comments > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {t._count.comments}
                        </span>
                      )}
                    </div>
                    <select
                      value={t.status}
                      onChange={(e) => move(t.id, e.target.value)}
                      className="mt-2 h-8 w-full rounded-lg border border-card-border bg-surface px-2 text-xs text-foreground outline-none focus:border-primary"
                    >
                      {TASK_STATUSES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                );
              })}
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-card-border py-6 text-center text-xs text-foreground-faint">
                  خالی
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
