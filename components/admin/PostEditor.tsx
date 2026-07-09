"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { marked } from "marked";
import { ArrowRight, Eye, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "./form";
import { TagInput, ImageInput } from "./client-fields";
import { SerpPreview } from "./SerpPreview";
import { savePost, deletePost, type PostInput } from "@/lib/actions";
import { cn, readingTime, slugify } from "@/lib/utils";

const CATEGORIES = ["استراتژی برند", "دیجیتال مارکتینگ", "پروداکشن", "برندینگ", "طراحی", "سوشال مدیا", "سئو"];

export function PostEditor({ initial }: { initial: PostInput }) {
  const router = useRouter();
  const [p, setP] = useState<PostInput>(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const set = (patch: Partial<PostInput>) => setP((s) => ({ ...s, ...patch }));
  const isEdit = !!initial.id;

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await savePost({
        ...p,
        slug: slugify(p.slug || p.title),
        readingMinutes: readingTime(p.content),
      });
      if (res.ok) {
        setMsg("ذخیره شد ✓");
        router.refresh();
        if (!isEdit) router.push(`/admin/journal/${res.id}`);
      }
    } catch {
      setMsg("خطا در ذخیره‌سازی");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/journal" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <h1 className="font-display text-xl font-bold text-foreground">{isEdit ? "ویرایش مطلب" : "مطلب جدید"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          {isEdit && (
            <button onClick={async () => { await deletePost(initial.id!); router.push("/admin/journal"); router.refresh(); }} className="grid h-11 w-11 place-items-center rounded-xl border border-card-border text-foreground-muted hover:border-rose-400/40 hover:text-rose-400">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button onClick={save} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} ذخیره
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <FormSection title="محتوا">
            <Field label="عنوان" required>
              <Input value={p.title} onChange={(e) => set({ title: e.target.value })} className="text-lg font-bold" />
            </Field>
            <Field label="اسلاگ" hint={`/journal/${slugify(p.slug || p.title) || "…"}`}>
              <Input value={p.slug} onChange={(e) => set({ slug: e.target.value })} dir="ltr" className="text-left" />
            </Field>
            <Field label="خلاصه">
              <Textarea value={p.excerpt} onChange={(e) => set({ excerpt: e.target.value })} />
            </Field>
            <div>
              <div className="mb-2 flex items-center gap-1 rounded-xl border border-card-border bg-background/50 p-1 w-fit">
                <button onClick={() => setTab("write")} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium", tab === "write" ? "bg-primary text-primary-foreground" : "text-foreground-muted")}>
                  <Pencil className="h-3.5 w-3.5" /> نوشتن
                </button>
                <button onClick={() => setTab("preview")} className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium", tab === "preview" ? "bg-primary text-primary-foreground" : "text-foreground-muted")}>
                  <Eye className="h-3.5 w-3.5" /> پیش‌نمایش
                </button>
              </div>
              {tab === "write" ? (
                <Textarea value={p.content} onChange={(e) => set({ content: e.target.value })} className="min-h-96 font-mono text-sm" placeholder="محتوا را با Markdown بنویسید…" />
              ) : (
                <div className="prose-arka min-h-96 rounded-xl border border-card-border bg-background/50 p-5" dangerouslySetInnerHTML={{ __html: marked.parse(p.content || "*چیزی برای نمایش نیست*") as string }} />
              )}
              <p className="mt-1.5 text-xs text-foreground-faint">زمان مطالعه تخمینی: {readingTime(p.content)} دقیقه</p>
            </div>
          </FormSection>

          <FormSection title="سئو">
            <Field label="Meta Title"><Input value={p.metaTitle ?? ""} onChange={(e) => set({ metaTitle: e.target.value })} /></Field>
            <Field label="Meta Description"><Textarea value={p.metaDescription ?? ""} onChange={(e) => set({ metaDescription: e.target.value })} /></Field>
            <Field label="کلمات کلیدی"><TagInput value={p.keywords} onChange={(v) => set({ keywords: v })} /></Field>
          </FormSection>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <FormSection title="انتشار">
            <div className="flex items-center justify-between"><span className="text-sm text-foreground-muted">منتشر شده</span><Toggle checked={p.published} onChange={(e) => set({ published: e.target.checked })} /></div>
            <div className="flex items-center justify-between"><span className="text-sm text-foreground-muted">مطلب شاخص</span><Toggle checked={p.featured} onChange={(e) => set({ featured: e.target.checked })} /></div>
            <Field label="دسته‌بندی"><Select value={p.category} onChange={(e) => set({ category: e.target.value })}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</Select></Field>
            <Field label="تصویر کاور"><ImageInput value={p.cover} onChange={(v) => set({ cover: v })} /></Field>
            <Field label="برچسب‌ها"><TagInput value={p.tags} onChange={(v) => set({ tags: v })} /></Field>
          </FormSection>
          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-foreground">پیش‌نمایش جستجو</h3>
            <SerpPreview title={p.metaTitle || p.title} description={p.metaDescription || p.excerpt} path={`/journal/${slugify(p.slug || p.title)}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
