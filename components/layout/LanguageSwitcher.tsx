"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setLocale } from "@/lib/locale-actions";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export function LanguageSwitcher({ locale, className }: { locale: Locale; className?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    start(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div className={cn("relative", className)}>
      <select
        value={locale}
        disabled={pending}
        onChange={(e) => change(e.target.value as Locale)}
        aria-label="Language / زبان / اللغة"
        className="h-10 cursor-pointer appearance-none rounded-full border border-card-border bg-surface/60 pl-3 pr-7 text-xs font-medium text-foreground-muted outline-none transition-colors hover:border-primary/50 focus:border-primary"
      >
        <option value="fa">فارسی</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      {pending && <Loader2 className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-primary" />}
    </div>
  );
}
