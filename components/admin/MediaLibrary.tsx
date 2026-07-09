"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Copy, Film, Image as ImageIcon, Loader2, Search, Trash2, UploadCloud } from "lucide-react";
import { createMedia, deleteMedia } from "@/lib/actions";
import { cn, faDate } from "@/lib/utils";
import { isEmbedUrl } from "@/lib/embed";

interface Item {
  id: string;
  url: string;
  type: string;
  name: string;
  folder: string;
  createdAt: Date;
}

export function MediaLibrary({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [filter, setFilter] = useState<"all" | "IMAGE" | "VIDEO">("all");
  const [q, setQ] = useState("");
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(0); // count of in-flight uploads
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const add = (url: string, name: string, type: string) =>
    start(async () => {
      const fd = new FormData();
      fd.set("url", url);
      fd.set("name", name);
      fd.set("type", type);
      fd.set("folder", "uploads");
      await createMedia(fd);
      router.refresh();
    });

  const uploadOne = async (f: File) => {
    setUploading((n) => n + 1);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "آپلود فایل ناموفق بود.");
        return;
      }
      const type = f.type.startsWith("video") ? "VIDEO" : "IMAGE";
      add(data.url, f.name, type);
    } catch {
      setError("آپلود فایل ناموفق بود. اتصال اینترنت را بررسی کنید.");
    } finally {
      setUploading((n) => Math.max(0, n - 1));
    }
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f) => uploadOne(f));
  };

  const copy = (u: string) => {
    navigator.clipboard?.writeText(u);
    setCopied(u);
    setTimeout(() => setCopied(null), 1500);
  };

  const list = items.filter(
    (m) => (filter === "all" || m.type === filter) && m.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      {/* dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-card-border bg-surface hover:border-primary/40",
        )}
      >
        <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
        <div className="mb-3 grid h-14 w-14 place-items-center rounded-2xl border border-card-border bg-background/50 text-primary">
          {uploading > 0 || pending ? <Loader2 className="h-6 w-6 animate-spin" /> : <UploadCloud className="h-6 w-6" />}
        </div>
        <p className="font-semibold text-foreground">
          {uploading > 0 ? `در حال آپلود (${uploading})…` : "فایل‌ها را اینجا رها کنید یا کلیک کنید"}
        </p>
        <p className="mt-1 text-xs text-foreground-muted">تصویر و ویدیو — حداکثر ۲۵ مگابایت</p>
        <div className="mt-4 flex w-full max-w-md items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="یا لینک مستقیم فایل / آپارات / یوتیوب را الصاق کنید…"
            dir="ltr"
            className="h-10 flex-1 rounded-xl border border-card-border bg-background/50 px-3 text-left text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            onClick={() => {
              if (!url.trim()) return;
              const trimmed = url.trim();
              const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(trimmed) || isEmbedUrl(trimmed);
              add(trimmed, trimmed.split("/").pop() || "file", isVideo ? "VIDEO" : "IMAGE");
              setUrl("");
            }}
            className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            افزودن
          </button>
        </div>
        {error && (
          <div
            className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400"
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl border border-card-border bg-surface p-1">
          {([["all", "همه"], ["IMAGE", "تصاویر"], ["VIDEO", "ویدیوها"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium", filter === v ? "bg-primary text-primary-foreground" : "text-foreground-muted")}>
              {l}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو…" className="h-10 rounded-xl border border-card-border bg-surface pr-9 pl-3 text-sm outline-none focus:border-primary" />
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {list.map((m) => (
          <div key={m.id} className="group relative overflow-hidden rounded-xl border border-card-border bg-surface">
            <div className="relative aspect-square overflow-hidden bg-background">
              {m.type === "VIDEO" && isEmbedUrl(m.url) ? (
                <div className="grid h-full w-full place-items-center bg-black/40 text-white">
                  <Film className="h-8 w-8 opacity-70" />
                </div>
              ) : m.type === "VIDEO" ? (
                <video src={m.url} muted className="h-full w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
              )}
              <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md bg-black/50 text-white">
                {m.type === "VIDEO" ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button onClick={() => copy(m.url)} className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 text-white hover:bg-white/25" title="کپی آدرس">
                  {copied === m.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button onClick={() => start(async () => { await deleteMedia(m.id); router.refresh(); })} className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/80 text-white hover:bg-rose-500" title="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium text-foreground">{m.name}</p>
              <p className="text-[10px] text-foreground-faint">{faDate(m.createdAt, { month: "short", day: "numeric" })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
