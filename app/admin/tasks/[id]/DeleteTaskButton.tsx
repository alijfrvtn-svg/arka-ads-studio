"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteTask } from "@/lib/actions";

export function DeleteTaskButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-foreground-muted">حذف این تسک؟</span>
        <button
          type="button"
          onClick={() => start(async () => { await deleteTask(id); router.push("/admin/tasks"); })}
          className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-rose-400"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "تأیید"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg px-3 py-1.5 text-foreground-muted hover:bg-card-hover"
        >
          انصراف
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400"
    >
      <Trash2 className="h-4 w-4" /> حذف تسک
    </button>
  );
}
