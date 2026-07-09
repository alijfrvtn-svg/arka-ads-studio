"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Trash2, Building2, Wallet } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/lib/actions";
import { cn, faTimeAgo } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  budget: string | null;
  service: string | null;
  message: string;
  status: string;
  createdAt: Date;
}

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "NEW", label: "جدید", color: "#6699ff" },
  { key: "CONTACTED", label: "تماس گرفته", color: "#f59e0b" },
  { key: "PROPOSAL", label: "پیشنهاد", color: "#a6c9ff" },
  { key: "WON", label: "برنده", color: "#34d399" },
  { key: "LOST", label: "از دست رفته", color: "#fb7185" },
];

export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [, start] = useTransition();
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (id: string, status: string) =>
    start(async () => { await updateLeadStatus(id, status); router.refresh(); });
  const remove = (id: string) =>
    start(async () => { await deleteLead(id); router.refresh(); });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {COLUMNS.map((col) => {
        const items = leads.filter((l) => l.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => { if (dragId) move(dragId, col.key); setDragId(null); }}
            className="flex flex-col rounded-2xl border border-card-border bg-surface/50"
          >
            <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: col.color }} />
                <span className="text-sm font-semibold text-foreground">{col.label}</span>
              </div>
              <span className="rounded-full bg-card-hover px-2 py-0.5 text-xs text-foreground-muted">{items.length}</span>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {items.map((l) => (
                <div
                  key={l.id}
                  draggable
                  onDragStart={() => setDragId(l.id)}
                  className="group cursor-grab rounded-xl border border-card-border bg-background/60 p-3 active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground">{l.name}</p>
                    <button onClick={() => remove(l.id)} className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Trash2 className="h-3.5 w-3.5 text-foreground-faint hover:text-rose-400" />
                    </button>
                  </div>
                  {l.service && <p className="mt-0.5 text-xs text-primary">{l.service}</p>}
                  <p className="mt-1.5 line-clamp-2 text-xs text-foreground-muted">{l.message}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-foreground-faint">
                    {l.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{l.company}</span>}
                    {l.budget && <span className="flex items-center gap-1"><Wallet className="h-3 w-3" />{l.budget}</span>}
                  </div>
                  <div className="mt-2 flex items-center gap-2 border-t border-card-border pt-2 text-[11px] text-foreground-faint">
                    <a href={`mailto:${l.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="h-3 w-3" /></a>
                    {l.phone && <a href={`tel:${l.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="h-3 w-3" /></a>}
                    <span className="mr-auto">{faTimeAgo(l.createdAt)}</span>
                  </div>
                  <select
                    value={l.status}
                    onChange={(e) => move(l.id, e.target.value)}
                    className="mt-2 h-8 w-full rounded-lg border border-card-border bg-surface px-2 text-xs text-foreground outline-none focus:border-primary"
                  >
                    {COLUMNS.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
              ))}
              {items.length === 0 && (
                <div className="rounded-xl border border-dashed border-card-border py-6 text-center text-xs text-foreground-faint">
                  خالی
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
