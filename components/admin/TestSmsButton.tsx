"use client";

import { useState } from "react";
import { Loader2, MessageCircle } from "lucide-react";
import { testSms } from "@/lib/actions";

/** Sends a real test SMS to the logged-in admin's own phone — used to verify the Kavenegar setup. */
export function TestSmsButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await testSms();
      if (res.ok) {
        setMsg("پیامک آزمایشی ارسال شد ✓ — چند لحظه صبر کن و گوشیت رو چک کن");
      } else {
        setMsg(`ارسال نشد — خطا: ${res.error ?? "نامشخص"}${res.hasKey ? "" : " (کلید API تنظیم نشده)"}`);
      }
    } catch {
      setMsg("خطای غیرمنتظره در ارسال");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 rounded-2xl border border-card-border bg-surface p-5">
      <p className="text-sm text-foreground-muted">
        این دکمه یک پیامک آزمایشی واقعی به شماره‌ی خودِ تو (که تو پروفایلت ثبت کردی) می‌فرستد — برای تست تنظیمات کاوه‌نگار.
      </p>
      <button
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-xl border border-card-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />} ارسال پیامک آزمایشی به خودم
      </button>
      {msg && <span className="text-sm text-foreground-muted">{msg}</span>}
    </div>
  );
}
