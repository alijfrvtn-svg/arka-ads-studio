import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveTestimonial } from "@/lib/actions";
import { toFa } from "@/lib/utils";

export default async function TestimonialForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const t = isNew ? null : await db.testimonial.findUnique({ where: { id } });
  if (!isNew && !t) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/testimonials" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "نظر جدید" : "ویرایش نظر"}</h1>
      </div>
      <form action={saveTestimonial} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={t!.id} />}
        <FormSection title="اطلاعات نظر">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام" required><Input name="author" defaultValue={t?.author} required /></Field>
            <Field label="سمت">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="role" defaultValue={t?.role ?? ""} /> },
                  { locale: "en", content: <Input name="roleEn" defaultValue={t?.roleEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="roleAr" defaultValue={t?.roleAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="شرکت"><Input name="company" defaultValue={t?.company ?? ""} /></Field>
            <Field label="امتیاز">
              <Select name="rating" defaultValue={String(t?.rating ?? 5)}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{toFa(r)} ستاره</option>)}
              </Select>
            </Field>
          </div>
          <Field label="آواتار (URL)"><Input name="avatar" defaultValue={t?.avatar ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <Field label="متن نظر">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="quote" defaultValue={t?.quote} required className="min-h-28" /> },
                { locale: "en", content: <Textarea name="quoteEn" defaultValue={t?.quoteEn ?? ""} className="min-h-28" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="quoteAr" defaultValue={t?.quoteAr ?? ""} className="min-h-28" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>
        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <div className="flex gap-6">
            <Toggle name="published" label="منتشر شده" defaultChecked={t?.published ?? true} />
            <Toggle name="featured" label="شاخص" defaultChecked={t?.featured ?? true} />
          </div>
          <SubmitButton>ذخیره</SubmitButton>
        </div>
      </form>
    </div>
  );
}
