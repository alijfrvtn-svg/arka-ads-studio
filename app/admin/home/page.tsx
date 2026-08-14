import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveHomePage } from "@/lib/actions";
import { getHomePage } from "@/lib/queries";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";
import type { HeroSlide } from "@/lib/queries";
import type { WorkflowStep } from "@/types";

/** Kept in sync with the switch in components/home/Hero.tsx. */
const HERO_MODES = [
  { value: "cinematic", label: "انیمیشن سینمایی (پیش‌فرض فعلی)", hint: "همان انیمیشن اسکرولی «چشم خلقت». روی موبایل به‌صورت خودکار به نسخه‌ی ساده تبدیل می‌شود." },
  { value: "slider", label: "بنر اسلایدی", hint: "چند بنر که خودکار عوض می‌شوند؛ هر اسلاید عنوان و دکمه‌ی خودش را دارد." },
  { value: "image", label: "تصویر ثابت", hint: "یک تصویر تمام‌عرض پشت متن‌ها — سبک‌ترین و سریع‌ترین حالت." },
  { value: "videoLoop", label: "ویدیو لوپ معمولی", hint: "ویدیو بی‌صدا که مدام تکرار می‌شود." },
  { value: "videoScroll", label: "ویدیو با اسکرول", hint: "ویدیو با چرخاندن اسکرول جلو و عقب می‌رود. روی موبایل و حالت کاهش انیمیشن، خودکار به لوپ ساده تبدیل می‌شود." },
] as const;

function lines(v: string | null | undefined) {
  return parseArr<string>(v).join("\n");
}
function stepsText(v: string | null | undefined) {
  return parseArr<WorkflowStep>(v)
    .map((s) => `${s.step ?? ""} | ${s.title} | ${s.desc}`.replace(/^ \| /, ""))
    .join("\n");
}
/** Round-trips the pipe format the SLIDES parser in lib/actions.ts expects. */
function slidesText(v: string | null | undefined) {
  return parseArr<HeroSlide>(v)
    .map((s) =>
      [s.media, s.title, s.desc, s.ctaLabel, s.ctaHref, s.badge, s.poster]
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
          title="حالت نمایش هیرو"
          description="انتخاب کنید بخش اول صفحه اصلی چطور نمایش داده شود. با تغییر حالت، فقط فیلدهای مربوط به همان حالت اثر می‌گذارند — بقیه دست‌نخورده باقی می‌مانند."
        >
          <Field label="حالت">
            <Select name="heroMode" defaultValue={row?.heroMode ?? "cinematic"}>
              {HERO_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <ul className="space-y-1.5 rounded-xl border border-card-border bg-background/40 p-4 text-xs leading-relaxed text-foreground-muted">
            {HERO_MODES.map((m) => (
              <li key={m.value}>
                <span className="font-semibold text-foreground">{m.label}</span> — {m.hint}
              </li>
            ))}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="فایل رسانه هیرو"
              hint="تصویر (jpg/webp) برای حالت «تصویر ثابت»، ویدیو (mp4/webm) برای حالت‌های ویدیویی. آدرس را از کتابخانه رسانه بردارید."
            >
              <Input name="heroMedia" defaultValue={row?.heroMedia ?? ""} dir="ltr" className="text-left" placeholder="/api/media/…" />
            </Field>
            <Field label="تصویر پوستر ویدیو" hint="فریم ثابتی که تا لود شدن ویدیو نمایش داده می‌شود">
              <Input name="heroPoster" defaultValue={row?.heroPoster ?? ""} dir="ltr" className="text-left" placeholder="/api/media/…" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="ارتفاع هیرو">
              <Select name="heroHeight" defaultValue={row?.heroHeight ?? "full"}>
                <option value="full">تمام‌صفحه</option>
                <option value="tall">بلند (۸۰٪)</option>
                <option value="medium">متوسط (۶۲٪)</option>
              </Select>
            </Field>
            <Field label="چیدمان متن">
              <Select name="heroAlign" defaultValue={row?.heroAlign ?? "start"}>
                <option value="start">راست‌چین (پیش‌فرض)</option>
                <option value="center">وسط‌چین</option>
              </Select>
            </Field>
            <Field label="تیرگی روی رسانه" hint="۰ تا ۹۰ — هرچه بیشتر، متن روی تصویر خواناتر">
              <Input name="heroOverlay" type="number" min={0} max={90} defaultValue={row?.heroOverlay ?? 55} dir="ltr" className="text-left" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="مدت هر اسلاید (ثانیه)" hint="فقط در حالت بنر اسلایدی">
              <Input name="heroSlideDuration" type="number" min={2} max={30} defaultValue={row?.heroSlideDuration ?? 6} dir="ltr" className="text-left" />
            </Field>
            <Field label="طول مسیر اسکرول (vh)" hint="فقط در حالت ویدیو با اسکرول — عدد بزرگ‌تر یعنی اسکرول طولانی‌تر و آهسته‌تر">
              <Input name="heroScrollLength" type="number" min={160} max={1200} step={20} defaultValue={row?.heroScrollLength ?? 640} dir="ltr" className="text-left" />
            </Field>
          </div>

          <Field
            label="اسلایدهای بنر"
            hint="هر خط یک اسلاید: آدرس تصویر یا ویدیو | عنوان | توضیح | متن دکمه | لینک دکمه | نشان | پوستر — فیلدهای انتهایی اختیاری‌اند."
          >
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroSlides" defaultValue={slidesText(row?.heroSlides)} className="min-h-32" dir="ltr" /> },
                { locale: "en", content: <Textarea name="heroSlidesEn" defaultValue={slidesText(row?.heroSlidesEn)} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroSlidesAr" defaultValue={slidesText(row?.heroSlidesAr)} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="متن‌ها و دکمه‌های هیرو" description="در همه‌ی حالت‌ها به‌جز بنر اسلایدی استفاده می‌شوند (اسلایدها متن خودشان را دارند)">
          <Field label="نشان (badge) بالای هیرو">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="heroBadge" defaultValue={h.heroBadge} /> },
                { locale: "en", content: <Input name="heroBadgeEn" defaultValue={row?.heroBadgeEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="heroBadgeAr" defaultValue={row?.heroBadgeAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="خط‌های عنوان اصلی" hint="هر خط در یک سطر — مثال: طراحی کن.">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroHeadline" defaultValue={h.heroHeadline.join("\n")} className="min-h-24" /> },
                { locale: "en", content: <Textarea name="heroHeadlineEn" defaultValue={lines(row?.heroHeadlineEn)} className="min-h-24" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroHeadlineAr" defaultValue={lines(row?.heroHeadlineAr)} className="min-h-24" dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح هیرو">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroDescription" defaultValue={h.heroDescription} /> },
                { locale: "en", content: <Textarea name="heroDescriptionEn" defaultValue={row?.heroDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroDescriptionAr" defaultValue={row?.heroDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="متن دکمه اصلی">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroCtaLabel" defaultValue={h.heroCtaLabel} /> },
                  { locale: "en", content: <Input name="heroCtaLabelEn" defaultValue={row?.heroCtaLabelEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroCtaLabelAr" defaultValue={row?.heroCtaLabelAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="متن دکمه شوریل">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroReelLabel" defaultValue={h.heroReelLabel} /> },
                  { locale: "en", content: <Input name="heroReelLabelEn" defaultValue={row?.heroReelLabelEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroReelLabelAr" defaultValue={row?.heroReelLabelAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="لینک دکمه اصلی">
              <Input name="heroCtaHref" defaultValue={row?.heroCtaHref ?? "/contact"} dir="ltr" className="text-left" />
            </Field>
            <Field
              label="ویدیو شوریل"
              hint="لینک مستقیم mp4 یا صفحه‌ی آپارات/یوتیوب. تا وقتی خالی باشد، دکمه‌ی پخش اصلاً نمایش داده نمی‌شود."
            >
              <Input name="heroReelUrl" defaultValue={row?.heroReelUrl ?? ""} dir="ltr" className="text-left" />
            </Field>
          </div>

          <Field label="تگ‌های زیر دکمه‌ها" hint="هر تگ در یک سطر — مثال: تیزر تبلیغاتی">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroTags" defaultValue={lines(row?.heroTags)} /> },
                { locale: "en", content: <Textarea name="heroTagsEn" defaultValue={lines(row?.heroTagsEn)} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroTagsAr" defaultValue={lines(row?.heroTagsAr)} dir="rtl" /> },
              ]}
            />
          </Field>

          <Toggle name="heroShowStats" defaultChecked={row?.heroShowStats ?? true} label="نمایش آمار زیر هیرو" />
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
