import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Toggle, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveIndustry } from "@/lib/actions";

export default async function IndustryForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const ind = isNew ? null : await db.industry.findUnique({ where: { id } });
  if (!isNew && !ind) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/industries" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "صنعت جدید" : "ویرایش صنعت"}</h1>
      </div>

      <form action={saveIndustry} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={ind!.id} />}
        <FormSection title="اطلاعات صنعت">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عنوان" required><Input name="title" defaultValue={ind?.title} required /></Field>
            <Field label="عنوان انگلیسی"><Input name="titleEn" defaultValue={ind?.titleEn ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسلاگ"><Input name="slug" defaultValue={ind?.slug} dir="ltr" className="text-left" /></Field>
            <Field label="آیکن (Lucide)"><Input name="icon" defaultValue={ind?.icon ?? "Building2"} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="خلاصه" required><Textarea name="excerpt" defaultValue={ind?.excerpt} required /></Field>
          <Field label="توضیحات"><Textarea name="description" defaultValue={ind?.description} className="min-h-28" /></Field>
          <Field label="تصویر کاور"><Input name="cover" defaultValue={ind?.cover ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <Field label="ویدیو هیرو (هاور)" hint="با هاور روی نام صنعت پخش می‌شود — لینک مستقیم فایل یا لینک آپارات/یوتیوب"><Input name="heroVideo" defaultValue={ind?.heroVideo ?? ""} dir="ltr" className="text-left" placeholder="https://…/video.mp4 یا https://aparat.com/v/…" /></Field>
        </FormSection>
        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="published" label="منتشر شده" defaultChecked={ind?.published ?? true} />
          <SubmitButton>ذخیره صنعت</SubmitButton>
        </div>
      </form>
    </div>
  );
}
