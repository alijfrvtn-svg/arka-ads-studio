import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveService } from "@/lib/actions";
import { DEPARTMENTS } from "@/lib/constants";
import { parseArr } from "@/lib/utils";
import type { PricingTier } from "@/types";

function pricingText(json: string | null | undefined, yes = "بله", no = "خیر") {
  return parseArr<PricingTier>(json)
    .map((t) => `${t.name} | ${t.price} | ${t.unit ?? ""} | ${(t.features ?? []).join(";")} | ${t.featured ? yes : no}`)
    .join("\n");
}

export default async function ServiceForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const s = isNew ? null : await db.service.findUnique({ where: { id } });
  if (!isNew && !s) notFound();
  const features = parseArr<string>(s?.features).join("\n");
  const featuresEn = parseArr<string>(s?.featuresEn).join("\n");
  const featuresAr = parseArr<string>(s?.featuresAr).join("\n");
  const pricing = pricingText(s?.pricing);
  const pricingEn = pricingText(s?.pricingEn, "yes", "no");
  const pricingAr = pricingText(s?.pricingAr, "نعم", "لا");
  const pricingHint =
    "هر خط یک پلن: نام | قیمت | واحد | ویژگی۱;ویژگی۲;ویژگی۳ | بله/خیر (پیشنهادی) — مثال: حرفه‌ای | ۲۵,۰۰۰,۰۰۰ | تومان | استراتژی اختصاصی;سه راند بازنگری | بله";
  const pricingHintEn =
    "One plan per line: name | price | unit | feature1;feature2;feature3 | yes/no (recommended) — e.g. Professional | 25,000,000 | Toman | Dedicated strategy;Three revision rounds | yes";
  const pricingHintAr =
    "كل سطر باقة واحدة: الاسم | السعر | الوحدة | ميزة1;ميزة2;ميزة3 | نعم/لا (موصى به) — مثال: الاحترافية | 25,000,000 | تومان | استراتيجية مخصصة;ثلاث جولات مراجعة | نعم";

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
          <Field label="تصویر کاور"><Input name="cover" defaultValue={s?.cover ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
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
                { locale: "fa", content: <Field hint={pricingHint}><Textarea name="pricing" defaultValue={pricing} className="min-h-32" dir="rtl" /></Field> },
                { locale: "en", content: <Field hint={pricingHintEn}><Textarea name="pricingEn" defaultValue={pricingEn} className="min-h-32" dir="ltr" /></Field> },
                { locale: "ar", content: <Field hint={pricingHintAr}><Textarea name="pricingAr" defaultValue={pricingAr} className="min-h-32" dir="rtl" /></Field> },
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
