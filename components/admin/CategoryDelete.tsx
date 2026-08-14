"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";

/**
 * Delete control for a category. Unlike the generic RowActions, this one
 * surfaces the server's refusal text — deleting a category that content still
 * points at is rejected, and the admin needs to be told why rather than watch
 * a button do nothing.
 */
export function CategoryDelete({ action }: { action: () => Promise<{ ok: boolean; error?: string }> }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (error) {
    return (
      <div className="flex items-center gap-2">
        <p role="alert" className="max-w-xs text-xs leading-relaxed text-rose-400">
          {error}
        </p>
        <button
          onClick={() => {
            setError(null);
            setConfirming(false);
          }}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground-muted hover:bg-card-hover"
          aria-label="بستن"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        aria-label="حذف دسته‌بندی"
        className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() =>
          start(async () => {
            const res = await action();
            if (res.ok) router.refresh();
            else setError(res.error ?? "حذف ممکن نشد");
          })
        }
        className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400"
        title="تأیید حذف"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted hover:bg-card-hover"
        aria-label="انصراف"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
