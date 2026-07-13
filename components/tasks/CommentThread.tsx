"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { Textarea } from "@/components/admin/form";
import { faTimeAgo } from "@/lib/utils";

interface CommentItem {
  id: string;
  body: string;
  createdAt: Date;
  author: { name: string } | null;
}

/** Shared comment thread used by both the admin task detail page and the /portal task detail page. */
export function CommentThread({
  taskId,
  comments,
  addComment,
}: {
  taskId: string;
  comments: CommentItem[];
  addComment: (taskId: string, body: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    start(async () => {
      const res = await addComment(taskId, value);
      if (!res.ok) {
        setError(res.error ?? "خطا در ثبت یادداشت");
        return;
      }
      setValue("");
      setError("");
      router.refresh();
    });
  };

  return (
    <div className="rounded-2xl border border-card-border bg-surface p-5">
      <h3 className="mb-4 font-display text-base font-bold text-foreground">یادداشت‌ها</h3>
      <div className="space-y-3">
        {comments.length === 0 && <p className="text-sm text-foreground-faint">هنوز یادداشتی ثبت نشده.</p>}
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-card-border bg-background/40 p-3">
            <div className="flex items-center justify-between text-xs text-foreground-faint">
              <span className="font-semibold text-foreground">{c.author?.name ?? "کاربر حذف‌شده"}</span>
              <span>{faTimeAgo(c.createdAt)}</span>
            </div>
            <p className="mt-1.5 whitespace-pre-line text-sm text-foreground-muted">{c.body}</p>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 flex items-start gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="یادداشتی بنویس…"
          className="min-h-16 flex-1"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
