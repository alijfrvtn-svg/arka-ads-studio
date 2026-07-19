"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { sendNotification } from "@/lib/actions";

interface UserLite {
  id: string;
  name: string;
  role: string;
}

export function SendNotificationForm({ users }: { users: UserLite[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const allSelected = selected.length === users.length && users.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : users.map((u) => u.id));
  const toggleOne = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const send = async () => {
    if (!title.trim() || selected.length === 0) {
      setMsg("عنوان و حداقل یک گیرنده لازم است");
      return;
    }
    setSending(true);
    setMsg(null);
    const fd = new FormData();
    fd.set("title", title);
    fd.set("body", body);
    selected.forEach((id) => fd.append("recipientIds", id));
    try {
      const res = await sendNotification(fd);
      if (res.ok) {
        setMsg(`پیام برای ${res.count} نفر ارسال شد ✓`);
        setTitle("");
        setBody("");
        setSelected([]);
      } else {
        setMsg(res.error || "خطا در ارسال");
      }
    } catch {
      setMsg("خطا در ارسال");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-5">
      <FormSection title="پیام جدید" description="این پیام تو زنگوله‌ی اعلان‌های گیرنده‌ها نمایش داده می‌شود">
        <Field label="عنوان" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً: یادآوری جلسه" />
        </Field>
        <Field label="متن پیام">
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
        </Field>
      </FormSection>

      <FormSection title="گیرنده‌ها">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-primary">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-card-border accent-[var(--primary)]" />
          انتخاب همه ({users.length} کاربر)
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {users.map((u) => (
            <label key={u.id} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-card-border bg-background/40 px-3 py-2.5 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggleOne(u.id)}
                className="h-4 w-4 rounded border-card-border accent-[var(--primary)]"
              />
              <span className="text-foreground">{u.name}</span>
            </label>
          ))}
        </div>
      </FormSection>

      <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
        {msg && <span className="text-sm text-foreground-muted">{msg}</span>}
        <button
          onClick={send}
          disabled={sending}
          className="mr-auto inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60"
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} ارسال پیام
        </button>
      </div>
    </div>
  );
}
