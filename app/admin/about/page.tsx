import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { Repeater } from "@/components/admin/Repeater";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveAboutPage } from "@/lib/actions";
import { getAboutPage } from "@/lib/queries";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";

interface ValueItem { icon: string; title: string; desc: string }
interface TimelineItem { year: string; title: string; desc: string }

function lines(v: string | null | undefined) {
  return parseArr<string>(v).join("\n");
}
function valueRows(v: string | null | undefined) {
  return parseArr<{ icon?: string; title?: string; desc?: string }>(v).map((x) => ({
    icon: x.icon ?? "",
    title: x.title ?? "",
    desc: x.desc ?? "",
  }));
}
function timelineRows(v: string | null | undefined) {
  return parseArr<{ year?: string; title?: string; desc?: string }>(v).map((x) => ({
    year: x.year ?? "",
    title: x.title ?? "",
    desc: x.desc ?? "",
  }));
}

const VALUE_FIELDS = [
  { key: "icon", label: "آیکن", placeholder: "Target", hint: "نام آیکن از صفحه‌ی «آیکن‌ها»" },
  { key: "title", label: "عنوان", placeholder: "استراتژی‌محور" },
  { key: "desc", label: "توضیح", type: "area" as const },
];
const TIMELINE_FIELDS = [
  { key: "year", label: "سال", placeholder: "۱۳۹۶" },
  { key: "title", label: "عنوان رویداد", placeholder: "تولد آرکا" },
  { key: "desc", label: "توضیح", type: "area" as const },
];

export default async function AboutPageAdmin() {
  const a = await getAboutPage();
  const row = await db.aboutPage.findUnique({ where: { id: "about" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه درباره ما" description="مدیریت کامل محتوای صفحه‌ی /about" />
      <form action={saveAboutPage} className="space-y-5">
        <FormSection title="هیرو">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز (eyebrow)">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroEyebrow" defaultValue={a.heroEyebrow} /> },
                  { locale: "en", content: <Input name="heroEyebrowEn" defaultValue={row?.heroEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroEyebrowAr" defaultValue={row?.heroEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان" hint="زیرمجموعه‌ای از عنوان که رنگی نمایش داده می‌شود">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroTitleHighlight" defaultValue={a.heroTitleHighlight} /> },
                  { locale: "en", content: <Input name="heroTitleHighlightEn" defaultValue={row?.heroTitleHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroTitleHighlightAr" defaultValue={row?.heroTitleHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان اصلی">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="heroTitle" defaultValue={a.heroTitle} required /> },
                { locale: "en", content: <Input name="heroTitleEn" defaultValue={row?.heroTitleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="heroTitleAr" defaultValue={row?.heroTitleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح هیرو">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroDescription" defaultValue={a.heroDescription} /> },
                { locale: "en", content: <Textarea name="heroDescriptionEn" defaultValue={row?.heroDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroDescriptionAr" defaultValue={row?.heroDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="داستان ما">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="storyEyebrow" defaultValue={a.storyEyebrow} /> },
                  { locale: "en", content: <Input name="storyEyebrowEn" defaultValue={row?.storyEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="storyEyebrowAr" defaultValue={row?.storyEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="storyHeading" defaultValue={a.storyHeading} /> },
                  { locale: "en", content: <Input name="storyHeadingEn" defaultValue={row?.storyHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="storyHeadingAr" defaultValue={row?.storyHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="پاراگراف‌ها" hint="هر پاراگراف در یک خط">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="storyParagraphs" defaultValue={a.storyParagraphs.join("\n")} className="min-h-32" /> },
                { locale: "en", content: <Textarea name="storyParagraphsEn" defaultValue={lines(row?.storyParagraphsEn)} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="storyParagraphsAr" defaultValue={lines(row?.storyParagraphsAr)} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ویدیو (URL)"><Input name="storyVideo" defaultValue={a.storyVideo} dir="ltr" className="text-left" /></Field>
            <Field label="پوستر ویدیو (URL)"><Input name="storyPoster" defaultValue={a.storyPoster} dir="ltr" className="text-left" /></Field>
          </div>
        </FormSection>

        <FormSection title="ارزش‌ها">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="valuesEyebrow" defaultValue={a.valuesEyebrow} /> },
                  { locale: "en", content: <Input name="valuesEyebrowEn" defaultValue={row?.valuesEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="valuesEyebrowAr" defaultValue={row?.valuesEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="valuesHeading" defaultValue={a.valuesHeading} /> },
                  { locale: "en", content: <Input name="valuesHeadingEn" defaultValue={row?.valuesHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="valuesHeadingAr" defaultValue={row?.valuesHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="کارت‌های ارزش" hint="ترتیب ردیف‌ها همان ترتیب نمایش است.">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Repeater name="values" initial={valueRows(row?.values)} fields={VALUE_FIELDS} addLabel="افزودن ارزش" rowLabel={(r, i) => r.title || `ارزش ${i + 1}`} /> },
                { locale: "en", content: <Repeater name="valuesEn" initial={valueRows(row?.valuesEn)} fields={VALUE_FIELDS} addLabel="Add value" rowLabel={(r, i) => r.title || `Value ${i + 1}`} /> },
                { locale: "ar", content: <Repeater name="valuesAr" initial={valueRows(row?.valuesAr)} fields={VALUE_FIELDS} addLabel="إضافة قيمة" rowLabel={(r, i) => r.title || `قيمة ${i + 1}`} /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="تیم" description="اعضای تیم از صفحه‌ی «تیم» در ناوبری مدیریت می‌شوند؛ این‌جا فقط عنوان بخش است.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="teamEyebrow" defaultValue={a.teamEyebrow} /> },
                  { locale: "en", content: <Input name="teamEyebrowEn" defaultValue={row?.teamEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="teamEyebrowAr" defaultValue={row?.teamEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="teamHeading" defaultValue={a.teamHeading} /> },
                  { locale: "en", content: <Input name="teamHeadingEn" defaultValue={row?.teamHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="teamHeadingAr" defaultValue={row?.teamHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="مسیر رشد (تایم‌لاین)">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="timelineEyebrow" defaultValue={a.timelineEyebrow} /> },
                  { locale: "en", content: <Input name="timelineEyebrowEn" defaultValue={row?.timelineEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="timelineEyebrowAr" defaultValue={row?.timelineEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="timelineHeading" defaultValue={a.timelineHeading} /> },
                  { locale: "en", content: <Input name="timelineHeadingEn" defaultValue={row?.timelineHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="timelineHeadingAr" defaultValue={row?.timelineHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="رویدادها" hint="ترتیب ردیف‌ها همان ترتیب نمایش است.">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Repeater name="timeline" initial={timelineRows(row?.timeline)} fields={TIMELINE_FIELDS} addLabel="افزودن رویداد" rowLabel={(r, i) => r.title || `رویداد ${i + 1}`} /> },
                { locale: "en", content: <Repeater name="timelineEn" initial={timelineRows(row?.timelineEn)} fields={TIMELINE_FIELDS} addLabel="Add milestone" rowLabel={(r, i) => r.title || `Milestone ${i + 1}`} /> },
                { locale: "ar", content: <Repeater name="timelineAr" initial={timelineRows(row?.timelineAr)} fields={TIMELINE_FIELDS} addLabel="إضافة حدث" rowLabel={(r, i) => r.title || `حدث ${i + 1}`} /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="گالری پشت صحنه">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="galleryEyebrow" defaultValue={a.galleryEyebrow} /> },
                  { locale: "en", content: <Input name="galleryEyebrowEn" defaultValue={row?.galleryEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="galleryEyebrowAr" defaultValue={row?.galleryEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="عنوان">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="galleryHeading" defaultValue={a.galleryHeading} /> },
                  { locale: "en", content: <Input name="galleryHeadingEn" defaultValue={row?.galleryHeadingEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="galleryHeadingAr" defaultValue={row?.galleryHeadingAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
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
          <Field label="Meta Title">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="metaTitle" defaultValue={a.metaTitle} /> },
                { locale: "en", content: <Input name="metaTitleEn" defaultValue={row?.metaTitleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="metaTitleAr" defaultValue={row?.metaTitleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="Meta Description">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="metaDescription" defaultValue={a.metaDescription} /> },
                { locale: "en", content: <Textarea name="metaDescriptionEn" defaultValue={row?.metaDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="metaDescriptionAr" defaultValue={row?.metaDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه درباره ما</SubmitButton>
        </div>
      </form>
    </div>
  );
}
