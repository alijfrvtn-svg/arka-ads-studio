"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "./form";
import { TagInput, MultiSelect, ImageInput } from "./client-fields";
import { SerpPreview } from "./SerpPreview";
import { saveProject, deleteProject, type ProjectInput } from "@/lib/actions";
import { WORK_CATEGORIES } from "@/lib/constants";
import { cn, slugify } from "@/lib/utils";
import type { Credit, Metric } from "@/types";

type Opt = { value: string; label: string };

export function ProjectEditor({
  initial,
  clients,
  services,
  industries,
}: {
  initial: ProjectInput;
  clients: { id: string; name: string }[];
  services: Opt[];
  industries: Opt[];
}) {
  const router = useRouter();
  const [p, setP] = useState<ProjectInput>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const set = (patch: Partial<ProjectInput>) => setP((s) => ({ ...s, ...patch }));
  const isEdit = !!initial.id;

  const clientName = useMemo(
    () => clients.find((c) => c.id === p.clientId)?.name,
    [clients, p.clientId],
  );

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await saveProject({ ...p, slug: slugify(p.slug || p.title) });
      if (res.ok) {
        setMsg("ذخیره شد ✓");
        router.refresh();
        if (!isEdit) router.push(`/admin/portfolio/${res.id}`);
      }
    } catch {
      setMsg("خطا در ذخیره‌سازی");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!initial.id) return;
    setSaving(true);
    await deleteProject(initial.id);
    router.push("/admin/portfolio");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              {isEdit ? "ویرایش پروژه" : "پروژه جدید"}
            </h1>
            <p className="text-xs text-foreground-muted">{p.title || "بدون عنوان"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {msg && <span className="text-sm text-emerald-400">{msg}</span>}
          {isEdit && (
            <button
              onClick={remove}
              className="grid h-11 w-11 place-items-center rounded-xl border border-card-border text-foreground-muted hover:border-rose-400/40 hover:text-rose-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            ذخیره
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* form */}
        <div className="space-y-5">
          <FormSection title="اطلاعات پایه">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="عنوان فارسی" required>
                <Input value={p.title} onChange={(e) => set({ title: e.target.value })} placeholder="مثلاً کمپین سینمایی…" />
              </Field>
              <Field label="عنوان انگلیسی">
                <Input value={p.titleEn ?? ""} onChange={(e) => set({ titleEn: e.target.value })} dir="ltr" className="text-left" />
              </Field>
            </div>
            <Field label="اسلاگ (URL)" hint={`/work/${slugify(p.slug || p.title) || "…"}`}>
              <Input value={p.slug} onChange={(e) => set({ slug: e.target.value })} dir="ltr" className="text-left" placeholder="project-slug" />
            </Field>
            <Field label="زیرعنوان">
              <Input value={p.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="دسته‌بندی">
                <Select value={p.category} onChange={(e) => set({ category: e.target.value })}>
                  {WORK_CATEGORIES.slice(1).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Select>
              </Field>
              <Field label="سال">
                <Input type="number" value={p.year} onChange={(e) => set({ year: Number(e.target.value) })} />
              </Field>
              <Field label="رنگ شاخص">
                <div className="flex items-center gap-2">
                  <input type="color" value={p.accent} onChange={(e) => set({ accent: e.target.value })} className="h-11 w-12 cursor-pointer rounded-lg border border-card-border bg-transparent" />
                  <Input value={p.accent} onChange={(e) => set({ accent: e.target.value })} dir="ltr" className="text-left" />
                </div>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="مشتری">
                <Select value={p.clientId ?? ""} onChange={(e) => set({ clientId: e.target.value })}>
                  <option value="">— بدون مشتری —</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
              <Field label="موقعیت">
                <Input value={p.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
              </Field>
            </div>
          </FormSection>

          <FormSection title="رسانه" description="کاور، ویدیو هیرو، گالری و اسلایدر قبل/بعد">
            <Field label="تصویر کاور" required>
              <ImageInput value={p.cover} onChange={(v) => set({ cover: v })} />
            </Field>
            <Field label="ویدیو هیرو" hint="لینک مستقیم فایل (mp4) یا لینک آپارات/یوتیوب">
              <ImageInput value={p.heroVideo ?? ""} onChange={(v) => set({ heroVideo: v })} video placeholder="https://…/video.mp4 یا https://aparat.com/v/…" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="تصویر «قبل»">
                <ImageInput value={p.beforeImage ?? ""} onChange={(v) => set({ beforeImage: v })} />
              </Field>
              <Field label="تصویر «بعد»">
                <ImageInput value={p.afterImage ?? ""} onChange={(v) => set({ afterImage: v })} />
              </Field>
            </div>
            <Field label="گالری">
              <div className="space-y-2">
                {p.gallery.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ImageInput value={g} onChange={(v) => set({ gallery: p.gallery.map((x, j) => (j === i ? v : x)) })} />
                    <button onClick={() => set({ gallery: p.gallery.filter((_, j) => j !== i) })} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground-muted hover:text-rose-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => set({ gallery: [...p.gallery, ""] })} className="inline-flex items-center gap-1.5 text-sm text-primary">
                  <Plus className="h-4 w-4" /> افزودن تصویر
                </button>
              </div>
            </Field>
          </FormSection>

          <FormSection title="روایت پروژه" description="چارچوب: هدف ← مشکل ← ایده ← تولید ← بازاریابی ← نتیجه">
            {([
              ["goal", "هدف"],
              ["problem", "مشکل / چالش"],
              ["idea", "ایده"],
              ["production", "تولید (پشت صحنه)"],
              ["marketing", "بازاریابی"],
              ["result", "نتیجه"],
            ] as const).map(([k, label]) => (
              <Field key={k} label={label}>
                <Textarea value={(p[k] as string) ?? ""} onChange={(e) => set({ [k]: e.target.value } as any)} />
              </Field>
            ))}
          </FormSection>

          <FormSection title="متریک‌ها و نتایج">
            <div className="space-y-2">
              {p.metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="عنوان" value={m.label} onChange={(e) => set({ metrics: patch(p.metrics, i, { label: e.target.value }) })} />
                  <Input placeholder="مقدار" value={m.value} onChange={(e) => set({ metrics: patch(p.metrics, i, { value: e.target.value }) })} className="w-24" />
                  <Input placeholder="پسوند" value={m.suffix ?? ""} onChange={(e) => set({ metrics: patch(p.metrics, i, { suffix: e.target.value }) })} className="w-24" />
                  <button onClick={() => set({ metrics: p.metrics.filter((_, j) => j !== i) })} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground-muted hover:text-rose-400"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => set({ metrics: [...p.metrics, { label: "", value: "", suffix: "" }] })} className="inline-flex items-center gap-1.5 text-sm text-primary"><Plus className="h-4 w-4" /> افزودن متریک</button>
            </div>
          </FormSection>

          <FormSection title="عوامل تولید">
            <div className="space-y-2">
              {p.credits.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input placeholder="نقش" value={c.role} onChange={(e) => set({ credits: patch(p.credits, i, { role: e.target.value }) })} />
                  <Input placeholder="نام" value={c.name} onChange={(e) => set({ credits: patch(p.credits, i, { name: e.target.value }) })} />
                  <button onClick={() => set({ credits: p.credits.filter((_, j) => j !== i) })} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-foreground-muted hover:text-rose-400"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => set({ credits: [...p.credits, { role: "", name: "" }] })} className="inline-flex items-center gap-1.5 text-sm text-primary"><Plus className="h-4 w-4" /> افزودن عامل</button>
            </div>
          </FormSection>

          <FormSection title="ارتباطات و برچسب‌ها">
            <Field label="خدمات مرتبط">
              <MultiSelect value={p.serviceSlugs} onChange={(v) => set({ serviceSlugs: v })} options={services} />
            </Field>
            <Field label="صنایع مرتبط">
              <MultiSelect value={p.industrySlugs} onChange={(v) => set({ industrySlugs: v })} options={industries} />
            </Field>
            <Field label="برچسب‌ها">
              <TagInput value={p.tags} onChange={(v) => set({ tags: v })} />
            </Field>
          </FormSection>

          <FormSection title="سئو" description="متا و کلمات کلیدی این پروژه">
            <Field label="Meta Title">
              <Input value={p.seo.metaTitle ?? ""} onChange={(e) => set({ seo: { ...p.seo, metaTitle: e.target.value } })} />
            </Field>
            <Field label="Meta Description">
              <Textarea value={p.seo.metaDescription ?? ""} onChange={(e) => set({ seo: { ...p.seo, metaDescription: e.target.value } })} />
            </Field>
            <Field label="کلمات کلیدی">
              <TagInput value={p.seo.keywords} onChange={(v) => set({ seo: { ...p.seo, keywords: v } })} />
            </Field>
          </FormSection>
        </div>

        {/* sidebar: live preview + serp + publish */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-bold text-foreground">انتشار</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">وضعیت انتشار</span>
                <Toggle checked={p.published} onChange={(e) => set({ published: e.target.checked })} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground-muted">پروژه شاخص</span>
                <Toggle checked={p.featured} onChange={(e) => set({ featured: e.target.checked })} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-foreground">پیش‌نمایش زنده</h3>
            <div className="group relative overflow-hidden rounded-xl border border-card-border">
              <div className="relative aspect-[4/5]">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center bg-background text-xs text-foreground-faint">بدون کاور</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-0.5 text-[11px] text-white">{p.category}</span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  {clientName && <p className="text-[11px] text-white/60">{clientName}</p>}
                  <h4 className="font-display text-lg font-bold text-white">{p.title || "عنوان پروژه"}</h4>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/70">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-card-border bg-surface p-5">
            <h3 className="mb-3 font-display text-sm font-bold text-foreground">پیش‌نمایش نتیجه جستجو</h3>
            <SerpPreview
              title={p.seo.metaTitle || p.title}
              description={p.seo.metaDescription || p.subtitle || ""}
              path={`/work/${slugify(p.slug || p.title)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function patch<T>(arr: T[], i: number, part: Partial<T>): T[] {
  return arr.map((x, j) => (j === i ? { ...x, ...part } : x));
}

export function emptyProject(): ProjectInput {
  return {
    slug: "",
    title: "",
    titleEn: "",
    subtitle: "",
    category: "فیلم تبلیغاتی",
    cover: "",
    poster: "",
    heroVideo: "",
    gallery: [],
    year: new Date().getFullYear(),
    location: "تهران، ایران",
    accent: "#6699ff",
    featured: false,
    published: true,
    tags: [],
    goal: "",
    problem: "",
    idea: "",
    production: "",
    marketing: "",
    result: "",
    metrics: [],
    beforeImage: "",
    afterImage: "",
    credits: [],
    clientId: "",
    serviceSlugs: [],
    industrySlugs: [],
    seo: { metaTitle: "", metaDescription: "", ogImage: "", keywords: [] },
  };
}
