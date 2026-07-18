"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { cleanCitationArtifacts } from "@/lib/actions";

/** One-off admin action: strips leftover AI-drafting citation tokens ("[cite_start]", "[cite: N]") from published content. */
export function CleanCitationsButton() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await cleanCitationArtifacts();
      setMsg(`پاک‌سازی شد: ${res.postsChanged} مقاله، ${res.servicesChanged} خدمت، ${res.industriesChanged} صنعت`);
    } catch {
      setMsg("خطا در پاک‌سازی");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {msg && <span className="text-xs text-foreground-muted">{msg}</span>}
      <button
        onClick={run}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-xl border border-card-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} پاک‌سازی متن‌های خام AI
      </button>
    </div>
  );
}
