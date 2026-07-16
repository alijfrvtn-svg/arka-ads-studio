"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

const TAB_LABEL: Record<Locale, string> = { fa: "فارسی", en: "English", ar: "العربية" };

/**
 * Groups fa/en/ar variants of the same field behind a tab switcher instead of
 * stacking three inputs. All panes stay mounted at all times (visibility is
 * toggled with a CSS class, never conditional rendering) so uncontrolled
 * `<form action>` inputs on inactive tabs still post their value via native
 * FormData — required for every server-action admin form in this app.
 */
export function LangTabs({
  tabs,
  className,
}: {
  tabs: { locale: Locale; content: React.ReactNode }[];
  className?: string;
}) {
  const [active, setActive] = useState<Locale>(tabs[0].locale);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-1 rounded-xl border border-card-border bg-background/50 p-1">
        {tabs.map((t) => (
          <button
            key={t.locale}
            type="button"
            onClick={() => setActive(t.locale)}
            className={cn(
              "flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              active === t.locale
                ? "bg-primary text-primary-foreground"
                : "text-foreground-muted hover:text-foreground",
            )}
          >
            {TAB_LABEL[t.locale]}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.locale} className={active === t.locale ? "" : "hidden"}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
