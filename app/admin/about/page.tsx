import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveAboutPage } from "@/lib/actions";
import { getAboutPage } from "@/lib/queries";

export default async function AboutPageAdmin() {
  const a = await getAboutPage();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه درباره ما" description="مدیریت کامل محتوای صفحه‌ی /about" />
      <form action={saveAboutPage} className="space-y-5">
        <FormSection title="هیرو">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز (eyebrow)"><Input name="heroEyebrow" defaultValue={a.heroEyebrow} /></Field>
            <Field label="بخش رنگی عنوان" hint="زیرمجموعه‌ای از عنوان که رنگی نمایش داده می‌شود">
              <Input name="heroTitleHighlight" defaultValue={a.heroTitleHighlight} />
            </Field>
          </div>
          <Field label="عنوان اصلی"><Input name="heroTitle" defaultValue={a.heroTitle} required /></Field>
          <Field label="توضیح هیرو"><Textarea name="heroDescription" defaultValue={a.heroDescription} /></Field>
        </FormSection>

        <FormSection title="داستان ما">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="storyEyebrow" defaultValue={a.storyEyebrow} /></Field>
            <Field label="عنوان"><Input name="storyHeading" defaultValue={a.storyHeading} /></Field>
          </div>
          <Field label="پاراگراف‌ها" hint="هر پاراگراف در یک خط">
            <Textarea name="storyParagraphs" defaultValue={a.storyParagraphs.join("\n")} className="min-h-32" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ویدیو (URL)"><Input name="storyVideo" defaultValue={a.storyVideo} dir="ltr" className="text-left" /></Field>
            <Field label="پوستر ویدیو (URL)"><Input name="storyPoster" defaultValue={a.storyPoster} dir="ltr" className="text-left" /></Field>
          </div>
        </FormSection>

        <FormSection title="ارزش‌ها">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="valuesEyebrow" defaultValue={a.valuesEyebrow} /></Field>
            <Field label="عنوان"><Input name="valuesHeading" defaultValue={a.valuesHeading} /></Field>
          </div>
          <Field label="کارت‌های ارزش" hint="هر خط: نام آیکن Lucide | عنوان | توضیح — مثال: Target | استراتژی‌محور | هر تصمیم خلاقانه ریشه در داده دارد.">
            <Textarea
              name="values"
              defaultValue={a.values.map((v) => `${v.icon} | ${v.title} | ${v.desc}`).join("\n")}
              className="min-h-32"
              dir="ltr"
            />
          </Field>
        </FormSection>

        <FormSection title="تیم" description="اعضای تیم از صفحه‌ی «تیم» در ناوبری مدیریت می‌شوند؛ این‌جا فقط عنوان بخش است.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="teamEyebrow" defaultValue={a.teamEyebrow} /></Field>
            <Field label="عنوان"><Input name="teamHeading" defaultValue={a.teamHeading} /></Field>
          </div>
        </FormSection>

        <FormSection title="مسیر رشد (تایم‌لاین)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="timelineEyebrow" defaultValue={a.timelineEyebrow} /></Field>
            <Field label="عنوان"><Input name="timelineHeading" defaultValue={a.timelineHeading} /></Field>
          </div>
          <Field label="رویدادها" hint="هر خط: سال | عنوان | توضیح — مثال: ۱۳۹۶ | تولد آرکا | با یک دوربین و یک رؤیا کار را آغاز کردیم.">
            <Textarea
              name="timeline"
              defaultValue={a.timeline.map((t) => `${t.year} | ${t.title} | ${t.desc}`).join("\n")}
              className="min-h-32"
              dir="ltr"
            />
          </Field>
        </FormSection>

        <FormSection title="گالری پشت صحنه">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز"><Input name="galleryEyebrow" defaultValue={a.galleryEyebrow} /></Field>
            <Field label="عنوان"><Input name="galleryHeading" defaultValue={a.galleryHeading} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ویدیو (URL)"><Input name="galleryVideo" defaultValue={a.galleryVideo} dir="ltr" className="text-left" /></Field>
            <Field label="پوستر ویدیو (URL)"><Input name="galleryPoster" defaultValue={a.galleryPoster} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="تصاویر گالری" hint="هر آدرس تصویر در یک خط">
            <Textarea name="galleryImages" defaultValue={a.galleryImages.join("\n")} dir="ltr" className="text-left" />
          </Field>
        </FormSection>

        <FormSection title="سئو">
          <Field label="Meta Title"><Input name="metaTitle" defaultValue={a.metaTitle} /></Field>
          <Field label="Meta Description"><Textarea name="metaDescription" defaultValue={a.metaDescription} /></Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه درباره ما</SubmitButton>
        </div>
      </form>
    </div>
  );
}
