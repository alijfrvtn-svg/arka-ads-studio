"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, Eye, EyeOff, Loader2, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function RowActions({
  editHref,
  deleteAction,
  published,
  togglePublishAction,
}: {
  editHref?: string;
  deleteAction?: () => Promise<{ ok: boolean }>;
  published?: boolean;
  togglePublishAction?: (value: boolean) => Promise<{ ok: boolean }>;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="flex items-center justify-end gap-1">
      {togglePublishAction && (
        <button
          onClick={() => start(async () => { await togglePublishAction(!published); router.refresh(); })}
          title={published ? "منتشر شده — کلیک برای پیش‌نویس" : "پیش‌نویس — کلیک برای انتشار"}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg transition-colors",
            published ? "text-emerald-400 hover:bg-emerald-400/10" : "text-foreground-faint hover:bg-card-hover",
          )}
        >
          {published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      )}
      {editHref && (
        <Link
          href={editHref}
          className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-card-hover hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}
      {deleteAction &&
        (confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => start(async () => { await deleteAction(); router.refresh(); })}
              className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/15 text-rose-400"
              title="تأیید حذف"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted hover:bg-card-hover"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-foreground-muted transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ))}
    </div>
  );
}
