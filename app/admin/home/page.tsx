import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHomePage } from "@/lib/actions";
import { getHomePage } from "@/lib/queries";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";
import type { ShowcaseSlideCopy } from "@/lib/queries";
import type { WorkflowStep } from "@/types";

function lines(v: string | null | undefined) {
  return parseArr<string>(v).join("\n");
}
function stepsText(v: string | null | undefined) {
  return parseArr<WorkflowStep>(v)
    .map((s) => `${s.step ?? ""} | ${s.title} | ${s.desc}`.replace(/^ \| /, ""))
    .join("\n");
}
/** Round-trips the pipe format the SHOWCASE parser in lib/actions.ts expects. */
function showcaseText(v: string | null | undefined) {
  return parseArr<ShowcaseSlideCopy>(v)
    .map((s) =>
      [s.department, s.title, s.tagline, s.ctaLabel, s.ctaHref]
        .map((x) => x ?? "")
        .join(" | ")
        .replace(/(\s*\|\s*)+$/, ""),
    )
    .join("\n");
}

export default async function HomePageAdmin() {
  const h = await getHomePage();
  const row = await db.homePage.findUnique({ where: { id: "home" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه اصلی" description="مدیریت کامل محتوای صفحه‌ی نخست سایت (/)" />
      <form action={saveHomePage} className="space-y-5">
        <FormSection
          title="هیروی خدمات"
          description="بخش اول صفحه اصلی: چهار اسلاید، یکی برای هر دسته‌ی خدمات. هر اسلاید هفت کارت دارد که خودکار از خدمات منتشرشده‌ی همان دسته ساخته می‌شود — پس اینجا فقط متن‌ها را می‌نویسید."
        >
          <div className="rounded-xl border border-card-border bg-background/40 p-4 text-xs leading-relaxed text-foreground-muted">
            <p className="mb-2 font-semibold text-foreground">تصویر کارت‌ها را کجا عوض کنم؟</p>
            <p>
              تصویر هر کارت همان <span className="font-semibold text-foreground">کاور همان خدمت</span> است. برای عوض کردنش به «خدمات» بروید،
              خدمت موردنظر را باز کنید و کاورش را تغییر دهید. تا وقتی کاوری آپلود نشده، کارت با نام خدمت و یک قاب خالی نمایش داده می‌شود
              و جای دقیقش را نگه می‌دارد.
            </p>
            <p className="mt-2">
              ترتیب کارت‌ها از فیلد «ترتیب» همان خدمات می‌آید و فقط هفت خدمت اول هر دسته نمایش داده می‌شود.
            </p>
          </div>

          <Field
            label="متن چهار اسلاید"
            hint="هر خط یک دسته: شناسه | تیتر بالای کارت‌ها | شعار زیر کارت‌ها | متن دکمه | لینک دکمه — شناسه‌های مجاز: DESIGN، FILM، DIGITAL، STRATEGY. هر فیلدی را خالی بگذارید، از خود دسته‌بندی پر می‌شود."
          >
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroShowcase" defaultValue={showcaseText(row?.heroShowcase)} className="min-h-32" /> },
                { locale: "en", content: <Textarea name="heroShowcaseEn" defaultValue={showcaseText(row?.heroShowcaseEn)} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroShowcaseAr" defaultValue={showcaseText(row?.heroShowcaseAr)} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="نوار اعتماد برندها">
          <Field label="متن بالای لوگوهای مشتریان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="trustCaption" defaultValue={h.trustCaption} /> },
                { locale: "en", content: <Input name="trustCaptionEn" defaultValue={row?.trustCaptionEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="trustCaptionAr" defaultValue={row?.trustCaptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="بخش دپارتمان‌ها">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="departmentsEyebrow" defaultValue={h.departmentsEyebrow} /> },
                  { locale: "en", content: <Input name="departmentsEyebrowEn" defaultValue={row?.departmentsEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="departmentsEyebrowAr" defaultValue={row?.departmentsEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="departmentsHeadingHighlight" defaultValue={h.departmentsHeadingHighlight} /> },
                  { locale: "en", content: <Input name="departmentsHeadingHighlightEn" defaultValue={row?.departmentsHeadingHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="departmentsHeadingHighlightAr" defaultValue={row?.departmentsHeadingHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="departmentsHeading" defaultValue={h.departmentsHeading} /> },
                { locale: "en", content: <Input name="departmentsHeadingEn" defaultValue={row?.departmentsHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="departmentsHeadingAr" defaultValue={row?.departmentsHeadingAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="departmentsDescription" defaultValue={h.departmentsDescription} /> },
                { locale: "en", content: <Textarea name="departmentsDescriptionEn" defaultValue={row?.departmentsDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="departmentsDescriptionAr" defaultValue={row?.departmentsDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="متن دکمه هر کارت">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="departmentsCtaLabel" defaultValue={h.departmentsCtaLabel} /> },
                { locale: "en", content: <Input name="departmentsCtaLabelEn" defaultValue={row?.departmentsCtaLabelEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="departmentsCtaLabelAr" defaultValue={row?.departmentsCtaLabelAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="بخش نمونه‌کارهای منتخب" description="پروژه‌های نمایش‌داده‌شده از بخش «نمونه‌کارها» با تیک «شاخص» مدیریت می‌شوند">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="featuredEyebrow" defaultValue={h.featuredEyebrow} /> },
                  { locale: "en", content: <Input name="featuredEyebrowEn" defaultValue={row?.featuredEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="featuredEyebrowAr" defaultValue={row?.featuredEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="featuredHeadingHighlight" defaultValue={h.featuredHeadingHighlight} /> },
                  { locale: "en", content: <Input name="featuredHeadingHighlightEn" defaultValue={row?.featuredHeadingHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="featuredHeadingHighlightAr" defaultValue={row?.featuredHeadingHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="featuredHeading" defaultValue={h.featuredHeading} /> },
                { locale: "en", content: <Input name="featuredHeadingEn" defaultValue={row?.featuredHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="featuredHeadingAr" defaultValue={row?.featuredHeadingAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="featuredDescription" defaultValue={h.featuredDescription} /> },
                { locale: "en", content: <Textarea name="featuredDescriptionEn" defaultValue={row?.featuredDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="featuredDescriptionAr" defaultValue={row?.featuredDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="متن دکمه «تمام پروژه‌ها»">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="featuredCtaLabel" defaultValue={h.featuredCtaLabel} /> },
                { locale: "en", content: <Input name="featuredCtaLabelEn" defaultValue={row?.featuredCtaLabelEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="featuredCtaLabelAr" defaultValue={row?.featuredCtaLabelAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="بخش فرایند کار">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="workflowEyebrow" defaultValue={h.workflowEyebrow} /> },
                  { locale: "en", content: <Input name="workflowEyebrowEn" defaultValue={row?.workflowEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="workflowEyebrowAr" defaultValue={row?.workflowEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="workflowHeadingHighlight" defaultValue={h.workflowHeadingHighlight} /> },
                  { locale: "en", content: <Input name="workflowHeadingHighlightEn" defaultValue={row?.workflowHeadingHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="workflowHeadingHighlightAr" defaultValue={row?.workflowHeadingHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="workflowHeading" defaultValue={h.workflowHeading} /> },
                { locale: "en", content: <Input name="workflowHeadingEn" defaultValue={row?.workflowHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="workflowHeadingAr" defaultValue={row?.workflowHeadingAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="workflowDescription" defaultValue={h.workflowDescription} /> },
                { locale: "en", content: <Textarea name="workflowDescriptionEn" defaultValue={row?.workflowDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="workflowDescriptionAr" defaultValue={row?.workflowDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field
            label="۴ گام فرایند"
            hint="هر خط: نام آیکن Lucide | عنوان | توضیح — مثال: Target | کشف و استراتژی | شناخت عمیق برند، بازار و اهداف."
          >
            <LangTabs
              tabs={[
                {
                  locale: "fa",
                  content: (
                    <Textarea
                      name="workflowSteps"
                      defaultValue={h.workflowSteps.map((s) => `${s.icon} | ${s.title} | ${s.desc}`).join("\n")}
                      className="min-h-32"
                      dir="ltr"
                    />
                  ),
                },
                { locale: "en", content: <Textarea name="workflowStepsEn" defaultValue={stepsText(row?.workflowStepsEn)} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="workflowStepsAr" defaultValue={stepsText(row?.workflowStepsAr)} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="بخش نظرات مشتریان" description="خود نظرات از صفحه‌ی «نظرات» با تیک «شاخص» مدیریت می‌شوند">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="testimonialsEyebrow" defaultValue={h.testimonialsEyebrow} /> },
                  { locale: "en", content: <Input name="testimonialsEyebrowEn" defaultValue={row?.testimonialsEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="testimonialsEyebrowAr" defaultValue={row?.testimonialsEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="testimonialsHeadingHighlight" defaultValue={h.testimonialsHeadingHighlight} /> },
                  { locale: "en", content: <Input name="testimonialsHeadingHighlightEn" defaultValue={row?.testimonialsHeadingHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="testimonialsHeadingHighlightAr" defaultValue={row?.testimonialsHeadingHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="testimonialsHeading" defaultValue={h.testimonialsHeading} /> },
                { locale: "en", content: <Input name="testimonialsHeadingEn" defaultValue={row?.testimonialsHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="testimonialsHeadingAr" defaultValue={row?.testimonialsHeadingAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="بخش پایانی (CTA)">
          <Field label="چشم‌انداز">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="finalEyebrow" defaultValue={h.finalEyebrow} /> },
                { locale: "en", content: <Input name="finalEyebrowEn" defaultValue={row?.finalEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="finalEyebrowAr" defaultValue={row?.finalEyebrowAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="finalHeading" defaultValue={h.finalHeading} /> },
                  { locale: "en", content: <Input name="finalHeadingEn" defaultValue={row?.finalHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="finalHeadingAr" defaultValue={row?.finalHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="finalHeadingHighlight" defaultValue={h.finalHeadingHighlight} /> },
                  { locale: "en", content: <Input name="finalHeadingHighlightEn" defaultValue={row?.finalHeadingHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="finalHeadingHighlightAr" defaultValue={row?.finalHeadingHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="توضیح">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="finalDescription" defaultValue={h.finalDescription} /> },
                { locale: "en", content: <Textarea name="finalDescriptionEn" defaultValue={row?.finalDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="finalDescriptionAr" defaultValue={row?.finalDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="متن دکمه">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="finalCtaLabel" defaultValue={h.finalCtaLabel} /> },
                { locale: "en", content: <Input name="finalCtaLabelEn" defaultValue={row?.finalCtaLabelEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="finalCtaLabelAr" defaultValue={row?.finalCtaLabelAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه اصلی</SubmitButton>
        </div>
      </form>
    </div>
  );
}
