import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHomePage } from "@/lib/actions";
import { getHomePage } from "@/lib/queries";

export default async function HomePageAdmin() {
  const h = await getHomePage();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه اصلی" description="مدیریت کامل محتوای صفحه‌ی نخست سایت (/)" />
      <form action={saveHomePage} className="space-y-5">
        <FormSection title="هیرو" description="بک‌گراند انیمیشنی هیرو ثابته؛ فقط متن‌های زیر قابل ویرایشن">
          <Field label="نشان (badge) بالای هیرو"><Input name="heroBadge" defaultValue={h.heroBadge} /></Field>
          <Field label="خط‌های عنوان اصلی" hint="هر خط در یک سطر — مثال: طراحی کن.">
            <Textarea name="heroHeadline" defaultValue={h.heroHeadline.join("\n")} className="min-h-24" />
          </Field>
          <Field label="توضیح هیرو"><Textarea name="heroDescription" defaultValue={h.heroDescription} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="متن دکمه اصلی"><Input name="heroCtaLabel" defaultValue={h.heroCtaLabel} /></Field>
            <Field label="متن دکمه شوریل"><Input name="heroReelLabel" defaultValue={h.heroReelLabel} /></Field>
          </div>
        </FormSection>

        <FormSection title="نوار اعتماد برندها">
          <Field label="متن بالای لوگوهای مشتریان"><Input name="trustCaption" defaultValue={h.trustCaption} /></Field>
        </FormSection>

        <FormSection title="بخش دپارتمان‌ها">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="departmentsEyebrow" defaultValue={h.departmentsEyebrow} /></Field>
            <Field label="بخش رنگی عنوان"><Input name="departmentsHeadingHighlight" defaultValue={h.departmentsHeadingHighlight} /></Field>
          </div>
          <Field label="عنوان"><Input name="departmentsHeading" defaultValue={h.departmentsHeading} /></Field>
          <Field label="توضیح"><Textarea name="departmentsDescription" defaultValue={h.departmentsDescription} /></Field>
          <Field label="متن دکمه هر کارت"><Input name="departmentsCtaLabel" defaultValue={h.departmentsCtaLabel} /></Field>
        </FormSection>

        <FormSection title="بخش نمونه‌کارهای منتخب" description="پروژه‌های نمایش‌داده‌شده از بخش «نمونه‌کارها» با تیک «شاخص» مدیریت می‌شوند">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="featuredEyebrow" defaultValue={h.featuredEyebrow} /></Field>
            <Field label="بخش رنگی عنوان"><Input name="featuredHeadingHighlight" defaultValue={h.featuredHeadingHighlight} /></Field>
          </div>
          <Field label="عنوان"><Input name="featuredHeading" defaultValue={h.featuredHeading} /></Field>
          <Field label="توضیح"><Textarea name="featuredDescription" defaultValue={h.featuredDescription} /></Field>
          <Field label="متن دکمه «تمام پروژه‌ها»"><Input name="featuredCtaLabel" defaultValue={h.featuredCtaLabel} /></Field>
        </FormSection>

        <FormSection title="بخش فرایند کار">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="workflowEyebrow" defaultValue={h.workflowEyebrow} /></Field>
            <Field label="بخش رنگی عنوان"><Input name="workflowHeadingHighlight" defaultValue={h.workflowHeadingHighlight} /></Field>
          </div>
          <Field label="عنوان"><Input name="workflowHeading" defaultValue={h.workflowHeading} /></Field>
          <Field label="توضیح"><Textarea name="workflowDescription" defaultValue={h.workflowDescription} /></Field>
          <Field
            label="۴ گام فرایند"
            hint="هر خط: نام آیکن Lucide | عنوان | توضیح — مثال: Target | کشف و استراتژی | شناخت عمیق برند، بازار و اهداف."
          >
            <Textarea
              name="workflowSteps"
              defaultValue={h.workflowSteps.map((s) => `${s.icon} | ${s.title} | ${s.desc}`).join("\n")}
              className="min-h-32"
              dir="ltr"
            />
          </Field>
        </FormSection>

        <FormSection title="بخش نظرات مشتریان" description="خود نظرات از صفحه‌ی «نظرات» با تیک «شاخص» مدیریت می‌شوند">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="testimonialsEyebrow" defaultValue={h.testimonialsEyebrow} /></Field>
            <Field label="بخش رنگی عنوان"><Input name="testimonialsHeadingHighlight" defaultValue={h.testimonialsHeadingHighlight} /></Field>
          </div>
          <Field label="عنوان"><Input name="testimonialsHeading" defaultValue={h.testimonialsHeading} /></Field>
        </FormSection>

        <FormSection title="بخش پایانی (CTA)">
          <Field label="چشم‌انداز"><Input name="finalEyebrow" defaultValue={h.finalEyebrow} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عنوان"><Input name="finalHeading" defaultValue={h.finalHeading} /></Field>
            <Field label="بخش رنگی عنوان"><Input name="finalHeadingHighlight" defaultValue={h.finalHeadingHighlight} /></Field>
          </div>
          <Field label="توضیح"><Textarea name="finalDescription" defaultValue={h.finalDescription} /></Field>
          <Field label="متن دکمه"><Input name="finalCtaLabel" defaultValue={h.finalCtaLabel} /></Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه اصلی</SubmitButton>
        </div>
      </form>
    </div>
  );
}
