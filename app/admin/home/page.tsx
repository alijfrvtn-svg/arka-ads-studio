import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { Repeater } from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHomePage } from "@/lib/actions";
import { getHomePage } from "@/lib/queries";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";
import { DEPARTMENTS } from "@/lib/constants";
import type { ShowcaseSlideCopy } from "@/lib/queries";

function lines(v: string | null | undefined) {
  return parseArr<string>(v).join("\n");
}

/**
 * Homepage workflow steps as repeater rows.
 *
 * Note the shape: the homepage's steps are {icon, title, desc} and are numbered
 * automatically by their position, while a *service* page's WorkflowStep is
 * {step, title, desc} with the number typed by hand. Same word, two structures —
 * this file only ever deals with the homepage one.
 */
function stepRows(v: string | null | undefined) {
  return parseArr<{ icon?: string; title?: string; desc?: string }>(v).map((s) => ({
    icon: s.icon ?? "",
    title: s.title ?? "",
    desc: s.desc ?? "",
  }));
}

/**
 * One repeater row per department, always all four and always in hero order.
 *
 * Saved copy is merged onto the department list rather than replacing it, so
 * the editor always sees four labelled rows even before anything is written —
 * and a department can never go missing because nobody typed a line for it.
 */
function showcaseRows(v: string | null | undefined) {
  const saved = parseArr<ShowcaseSlideCopy>(v);
  return DEPARTMENTS.map((d) => {
    const row = saved.find((x) => x.department === d.key);
    return {
      department: d.key,
      title: row?.title ?? "",
      tagline: row?.tagline ?? "",
      ctaLabel: row?.ctaLabel ?? "",
      ctaHref: row?.ctaHref ?? "",
    };
  });
}

const DEPT_LABEL: Record<string, string> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.key, d.title]),
);

const SHOWCASE_FIELDS = [
  { key: "title", label: "تیتر بالای کارت‌ها", placeholder: "برندینگ و طراحی گرافیک", wide: true },
  { key: "tagline", label: "شعار زیر کارت‌ها", type: "area" as const },
  { key: "ctaLabel", label: "متن دکمه", placeholder: "خدمات برندینگ" },
  { key: "ctaHref", label: "لینک دکمه", type: "url" as const, placeholder: "/services" },
];

const STEP_FIELDS = [
  { key: "icon", label: "آیکن", placeholder: "Target", hint: "نام آیکن از صفحه‌ی «آیکن‌ها»" },
  { key: "title", label: "عنوان گام", placeholder: "کشف و استراتژی" },
  { key: "desc", label: "توضیح", type: "area" as const },
];

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

          {/* Four locked rows — one per department. Locked because each row's
              `department` maps to a real id the public query looks up; an
              eighth row or a deleted one could only ever be a mistake. */}
          <Field label="متن اسلایدها" hint="هر فیلدی را خالی بگذارید، خودکار از خود دسته‌بندی پر می‌شود.">
            <LangTabs
              tabs={[
                {
                  locale: "fa",
                  content: (
                    <Repeater
                      name="heroShowcase"
                      locked
                      initial={showcaseRows(row?.heroShowcase)}
                      rowLabel={(r) => DEPT_LABEL[r.department] ?? r.department}
                      fields={SHOWCASE_FIELDS}
                    />
                  ),
                },
                {
                  locale: "en",
                  content: (
                    <Repeater
                      name="heroShowcaseEn"
                      locked
                      initial={showcaseRows(row?.heroShowcaseEn)}
                      rowLabel={(r) => DEPT_LABEL[r.department] ?? r.department}
                      fields={SHOWCASE_FIELDS}
                    />
                  ),
                },
                {
                  locale: "ar",
                  content: (
                    <Repeater
                      name="heroShowcaseAr"
                      locked
                      initial={showcaseRows(row?.heroShowcaseAr)}
                      rowLabel={(r) => DEPT_LABEL[r.department] ?? r.department}
                      fields={SHOWCASE_FIELDS}
                    />
                  ),
                },
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
          <Field label="گام‌های فرایند" hint="ترتیب ردیف‌ها همان ترتیب نمایش است.">
            <LangTabs
              tabs={[
                {
                  locale: "fa",
                  content: (
                    <Repeater
                      name="workflowSteps"
                      initial={stepRows(row?.workflowSteps)}
                      fields={STEP_FIELDS}
                      addLabel="افزودن گام"
                      rowLabel={(r, i) => r.title || `گام ${i + 1}`}
                    />
                  ),
                },
                {
                  locale: "en",
                  content: (
                    <Repeater
                      name="workflowStepsEn"
                      initial={stepRows(row?.workflowStepsEn)}
                      fields={STEP_FIELDS}
                      addLabel="Add step"
                      rowLabel={(r, i) => r.title || `Step ${i + 1}`}
                    />
                  ),
                },
                {
                  locale: "ar",
                  content: (
                    <Repeater
                      name="workflowStepsAr"
                      initial={stepRows(row?.workflowStepsAr)}
                      fields={STEP_FIELDS}
                      addLabel="إضافة خطوة"
                      rowLabel={(r, i) => r.title || `خطوة ${i + 1}`}
                    />
                  ),
                },
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
