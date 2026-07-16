"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

const field = "peer h-14 w-full rounded-xl border border-card-border bg-surface px-4 pt-4 text-foreground outline-none transition-colors focus:border-primary placeholder-transparent";
const lbl = "pointer-events-none absolute right-4 top-4 text-foreground-faint transition-all peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs";

export function ContactForm({
  serviceOptions,
  budgetOptions,
  locale,
}: {
  serviceOptions: string[];
  budgetOptions: string[];
  locale: Locale;
}) {
  const t = ui(locale);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const planFromUrl = searchParams.get("plan") ?? "";

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t.contactErrorGeneric);
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError(t.contactErrorNetwork);
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-card-border bg-surface p-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-400" />
        <h3 className="mt-5 font-display text-2xl font-bold text-foreground">{t.contactSuccessTitle}</h3>
        <p className="mt-2 text-foreground-muted">{t.contactSuccessBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input name="name" required placeholder={t.contactNamePlaceholder} className={field} />
          <label className={lbl}>{t.contactNameLabel}</label>
        </div>
        <div className="relative">
          <input name="email" type="email" required placeholder={t.contactEmailPlaceholder} dir="ltr" className={`${field} text-left`} />
          <label className={lbl}>{t.contactEmailLabel}</label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input name="phone" placeholder={t.contactPhonePlaceholder} dir="ltr" className={`${field} text-left`} />
          <label className={lbl}>{t.contactPhoneLabel}</label>
        </div>
        <div className="relative">
          <input name="company" placeholder={t.contactCompanyPlaceholder} className={field} />
          <label className={lbl}>{t.contactCompanyLabel}</label>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <select name="service" className="h-14 w-full rounded-xl border border-card-border bg-surface px-4 text-foreground outline-none focus:border-primary" defaultValue="">
          <option value="" disabled>{t.contactServicePlaceholder}</option>
          {serviceOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="budget" className="h-14 w-full rounded-xl border border-card-border bg-surface px-4 text-foreground outline-none focus:border-primary" defaultValue="">
          <option value="" disabled>{t.contactBudgetPlaceholder}</option>
          {budgetOptions.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="relative">
        <input name="plan" defaultValue={planFromUrl} placeholder={t.contactPlanPlaceholder} className={field} />
        <label className={lbl}>{t.contactPlanLabel}</label>
      </div>
      <div className="relative">
        <textarea name="message" required placeholder={t.contactMessagePlaceholder} rows={5} className={`${field} pt-5 resize-none`} />
        <label className={lbl}>{t.contactMessageLabel}</label>
      </div>

      {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>}

      <button type="submit" disabled={loading} className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60">
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> {t.contactSubmit}</>}
      </button>
    </form>
  );
}
