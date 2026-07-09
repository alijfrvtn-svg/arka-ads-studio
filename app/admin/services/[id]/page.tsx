import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveService } from "@/lib/actions";
import { DEPARTMENTS } from "@/lib/constants";
import { parseArr } from "@/lib/utils";

export default async function ServiceForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const s = isNew ? null : await db.service.findUnique({ where: { id } });
  if (!isNew && !s) notFound();
  const features = parseArr<string>(s?.features).join("\n");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/services" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "سرویس جدید" : "ویرایش سرویس"}</h1>
      </div>

      <form action={saveService} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={s!.id} />}
        <FormSection title="اطلاعات سرویس">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عنوان" required><Input name="title" defaultValue={s?.title} required /></Field>
            <Field label="عنوان انگلیسی"><Input name="titleEn" defaultValue={s?.titleEn ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسلاگ" hint="خالی بگذارید تا خودکار ساخته شود"><Input name="slug" defaultValue={s?.slug} dir="ltr" className="text-left" /></Field>
            <Field label="شعار"><Input name="tagline" defaultValue={s?.tagline ?? ""} /></Field>
          </div>
          <Field label="خلاصه" required><Textarea name="excerpt" defaultValue={s?.excerpt} required /></Field>
          <Field label="توضیحات کامل"><Textarea name="description" defaultValue={s?.description} className="min-h-32" /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="دپارتمان">
              <Select name="department" defaultValue={s?.department ?? "FILM"}>
                {DEPARTMENTS.map((d) => <option key={d.key} value={d.key}>{d.title}</option>)}
              </Select>
            </Field>
            <Field label="آیکن (Lucide)"><Input name="icon" defaultValue={s?.icon ?? "Sparkles"} dir="ltr" className="text-left" /></Field>
            <Field label="قیمت پایه (تومان)"><Input name="priceFrom" type="number" defaultValue={s?.priceFrom ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="تصویر کاور"><Input name="cover" defaultValue={s?.cover ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <Field label="ویژگی‌ها" hint="هر ویژگی در یک خط">
            <Textarea name="features" defaultValue={features} className="min-h-28" />
          </Field>
        </FormSection>

        <FormSection title="سئو">
          <Field label="Meta Title"><Input name="metaTitle" defaultValue={s?.metaTitle ?? ""} /></Field>
          <Field label="Meta Description"><Textarea name="metaDescription" defaultValue={s?.metaDescription ?? ""} /></Field>
        </FormSection>

        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="published" label="منتشر شده" defaultChecked={s?.published ?? true} />
          <SubmitButton>ذخیره سرویس</SubmitButton>
        </div>
      </form>
    </div>
  );
}
