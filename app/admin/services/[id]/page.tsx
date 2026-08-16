import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { Repeater } from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveService } from "@/lib/actions";
import { DEPARTMENTS } from "@/lib/constants";
import { parseArr } from "@/lib/utils";
import type { PricingTier } from "@/types";

function pricingRows(json: string | null | undefined) {
  return parseArr<PricingTier>(json).map((t) => ({
    name: t.name ?? "",
    price: t.price ?? "",
    unit: t.unit ?? "",
    // One bullet per line inside this plan's own box: a feature list is a list
    // of sentences, and one input per bullet would make a five-bullet plan a
    // five-click affair.
    features: (t.features ?? []).join("\n"),
    featured: t.featured ? "1" : "",
  }));
}

const PRICING_FIELDS = [
  { key: "name", label: "نام پلن", placeholder: "حرفه‌ای" },
  { key: "price", label: "قیمت", placeholder: "۲۵,۰۰۰,۰۰۰" },
  { key: "unit", label: "واحد", placeholder: "تومان" },
  { key: "featured", label: "پلن پیشنهادی", type: "check" as const },
  { key: "features", label: "ویژگی‌ها", type: "area" as const, hint: "هر ویژگی در یک سطر" },
];

export default async function ServiceForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const s = isNew ? null : await db.service.findUnique({ where: { id } });
  if (!isNew && !s) notFound();
  const features = parseArr<string>(s?.features).join("\n");
  const featuresEn = parseArr<string>(s?.featuresEn).join("\n");
  const featuresAr = parseArr<string>(s?.featuresAr).join("\n");
  const pricingRowsFa = pricingRows(s?.pricing);
  const pricingRowsEn = pricingRows(s?.pricingEn);
  const pricingRowsAr = pricingRows(s?.pricingAr);
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
          <Field label="عنوان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="title" defaultValue={s?.title} required /> },
                { locale: "en", content: <Input name="titleEn" defaultValue={s?.titleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="titleAr" defaultValue={s?.titleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="اسلاگ" hint="خالی بگذارید تا خودکار ساخته شود"><Input name="slug" defaultValue={s?.slug} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="شعار">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="tagline" defaultValue={s?.tagline ?? ""} /> },
                { locale: "en", content: <Input name="taglineEn" defaultValue={s?.taglineEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="taglineAr" defaultValue={s?.taglineAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="خلاصه">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="excerpt" defaultValue={s?.excerpt} required /> },
                { locale: "en", content: <Textarea name="excerptEn" defaultValue={s?.excerptEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Textarea name="excerptAr" defaultValue={s?.excerptAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیحات کامل">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="description" defaultValue={s?.description} className="min-h-32" /> },
                { locale: "en", content: <Textarea name="descriptionEn" defaultValue={s?.descriptionEn ?? ""} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="descriptionAr" defaultValue={s?.descriptionAr ?? ""} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="دپارتمان">
              <Select name="department" defaultValue={s?.department ?? "FILM"}>
                {DEPARTMENTS.map((d) => <option key={d.key} value={d.key}>{d.title}</option>)}
              </Select>
            </Field>
            <Field label="آیکن (Lucide)"><Input name="icon" defaultValue={s?.icon ?? "Sparkles"} dir="ltr" className="text-left" /></Field>
            <Field label="قیمت پایه (تومان)"><Input name="priceFrom" type="number" defaultValue={s?.priceFrom ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تصویر کاور"><Input name="cover" defaultValue={s?.cover ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
            <Field label="ویدیو معرفی" hint="لینک مستقیم mp4 یا صفحه‌ی آپارات/یوتیوب — زیر معرفی خدمت پخش می‌شود"><Input name="heroVideo" defaultValue={s?.heroVideo ?? ""} dir="ltr" className="text-left" placeholder="https://aparat.com/v/… یا https://…/clip.mp4" /></Field>
          </div>
          <Field label="ویژگی‌ها" hint="هر ویژگی در یک خط">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="features" defaultValue={features} className="min-h-28" /> },
                { locale: "en", content: <Textarea name="featuresEn" defaultValue={featuresEn} className="min-h-28" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="featuresAr" defaultValue={featuresAr} className="min-h-28" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="پلن‌های قیمت‌گذاری" description="همان پلن‌هایی که در صفحه‌ی این سرویس با دکمه‌ی «انتخاب پلن» نمایش داده می‌شوند">
          <Field label="پلن‌ها">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Repeater name="pricing" initial={pricingRowsFa} fields={PRICING_FIELDS} addLabel="افزودن پلن" rowLabel={(r, i) => r.name || `پلن ${i + 1}`} /> },
                { locale: "en", content: <Repeater name="pricingEn" initial={pricingRowsEn} fields={PRICING_FIELDS} addLabel="Add plan" rowLabel={(r, i) => r.name || `Plan ${i + 1}`} /> },
                { locale: "ar", content: <Repeater name="pricingAr" initial={pricingRowsAr} fields={PRICING_FIELDS} addLabel="إضافة باقة" rowLabel={(r, i) => r.name || `باقة ${i + 1}`} /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="سئو">
          <Field label="Meta Title">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="metaTitle" defaultValue={s?.metaTitle ?? ""} /> },
                { locale: "en", content: <Input name="metaTitleEn" defaultValue={s?.metaTitleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="metaTitleAr" defaultValue={s?.metaTitleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="Meta Description">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="metaDescription" defaultValue={s?.metaDescription ?? ""} /> },
                { locale: "en", content: <Textarea name="metaDescriptionEn" defaultValue={s?.metaDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="metaDescriptionAr" defaultValue={s?.metaDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="published" label="منتشر شده" defaultChecked={s?.published ?? true} />
          <SubmitButton>ذخیره سرویس</SubmitButton>
        </div>
      </form>
    </div>
  );
}
