"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions";
import { faTimeAgo, cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: Date;
}

export function NotificationBell({ initial }: { initial: NotificationItem[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openItem = (n: NotificationItem) => {
    if (!n.read) {
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      markNotificationRead(n.id).catch(() => {});
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const markAll = () => {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-10 w-10 place-items-center rounded-full text-foreground-muted hover:bg-card-hover"
        aria-label="اعلان‌ها"
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 w-80 rounded-2xl border border-card-border bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
            <span className="text-sm font-bold text-foreground">اعلان‌ها</span>
            {unread > 0 && (
              <button onClick={markAll} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Check className="h-3 w-3" /> علامت‌گذاری همه
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-foreground-faint">اعلانی موجود نیست</p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={cn(
                    "block w-full border-b border-card-border px-4 py-3 text-right last:border-0 hover:bg-card-hover",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start gap-2">
                    {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                      {n.body && <p className="mt-0.5 line-clamp-2 text-xs text-foreground-muted">{n.body}</p>}
                      <p className="mt-1 text-[11px] text-foreground-faint">{faTimeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
