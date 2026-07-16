import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveContactPage } from "@/lib/actions";
import { getContactPage } from "@/lib/queries";
import { db } from "@/lib/db";
import { parseArr } from "@/lib/utils";

interface SocialItem { platform: string; href: string; label: string }

function lines(v: string | null | undefined) {
  return parseArr<string>(v).join("\n");
}
function socialsText(v: string | null | undefined) {
  return parseArr<SocialItem>(v).map((s) => `${s.platform} | ${s.href} | ${s.label}`).join("\n");
}

export default async function ContactPageAdmin() {
  const c = await getContactPage();
  const row = await db.contactPage.findUnique({ where: { id: "contact" } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه تماس" description="مدیریت کامل محتوای صفحه‌ی /contact" />
      <form action={saveContactPage} className="space-y-5">
        <FormSection title="هیرو">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز (eyebrow)">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroEyebrow" defaultValue={c.heroEyebrow} /> },
                  { locale: "en", content: <Input name="heroEyebrowEn" defaultValue={row?.heroEyebrowEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroEyebrowAr" defaultValue={row?.heroEyebrowAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
            <Field label="بخش رنگی عنوان" hint="زیرمجموعه‌ای از عنوان که رنگی نمایش داده می‌شود">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="heroTitleHighlight" defaultValue={c.heroTitleHighlight} /> },
                  { locale: "en", content: <Input name="heroTitleHighlightEn" defaultValue={row?.heroTitleHighlightEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="heroTitleHighlightAr" defaultValue={row?.heroTitleHighlightAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
          <Field label="عنوان اصلی">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="heroTitle" defaultValue={c.heroTitle} required /> },
                { locale: "en", content: <Input name="heroTitleEn" defaultValue={row?.heroTitleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="heroTitleAr" defaultValue={row?.heroTitleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="توضیح هیرو">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="heroDescription" defaultValue={c.heroDescription} /> },
                { locale: "en", content: <Textarea name="heroDescriptionEn" defaultValue={row?.heroDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="heroDescriptionAr" defaultValue={row?.heroDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="اطلاعات تماس">
          <Field label="آدرس">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="address" defaultValue={c.address} /> },
                { locale: "en", content: <Input name="addressEn" defaultValue={row?.addressEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="addressAr" defaultValue={row?.addressAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تلفن (برای لینک tel:)" hint="مثال: +982188000000">
              <Input name="phone" defaultValue={c.phone} dir="ltr" className="text-left" />
            </Field>
            <Field label="تلفن (نمایشی)">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="phoneDisplay" defaultValue={c.phoneDisplay} dir="ltr" className="text-left" /> },
                  { locale: "en", content: <Input name="phoneDisplayEn" defaultValue={row?.phoneDisplayEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="phoneDisplayAr" defaultValue={row?.phoneDisplayAr ?? ""} dir="ltr" className="text-left" /> },
                ]}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ایمیل"><Input name="email" type="email" defaultValue={c.email} dir="ltr" className="text-left" /></Field>
            <Field label="ساعات کاری">
              <LangTabs
                tabs={[
                  { locale: "fa", content: <Input name="officeHours" defaultValue={c.officeHours} /> },
                  { locale: "en", content: <Input name="officeHoursEn" defaultValue={row?.officeHoursEn ?? ""} dir="ltr" className="text-left" /> },
                  { locale: "ar", content: <Input name="officeHoursAr" defaultValue={row?.officeHoursAr ?? ""} dir="rtl" /> },
                ]}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection title="نقشه" description="مختصات جغرافیایی دفتر — روی نقشه‌ی OpenStreetMap صفحه‌ی تماس اعمال می‌شود">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="عرض جغرافیایی (Lat)"><Input name="mapLat" type="number" step="0.0001" defaultValue={c.mapLat} dir="ltr" className="text-left" /></Field>
            <Field label="طول جغرافیایی (Lng)"><Input name="mapLng" type="number" step="0.0001" defaultValue={c.mapLng} dir="ltr" className="text-left" /></Field>
          </div>
        </FormSection>

        <FormSection title="شبکه‌های اجتماعی">
          <Field label="لینک‌ها" hint="هر خط: پلتفرم | لینک | برچسب — مثال: instagram | https://instagram.com/arka.studio | اینستاگرام">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="socials" defaultValue={c.socials.map((s) => `${s.platform} | ${s.href} | ${s.label}`).join("\n")} className="min-h-28" dir="ltr" /> },
                { locale: "en", content: <Textarea name="socialsEn" defaultValue={socialsText(row?.socialsEn)} className="min-h-28" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="socialsAr" defaultValue={socialsText(row?.socialsAr)} className="min-h-28" dir="ltr" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="گزینه‌های فرم تماس">
          <Field label="گزینه‌های نوع خدمت" hint="هر گزینه در یک خط">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="serviceOptions" defaultValue={c.serviceOptions.join("\n")} className="min-h-24" /> },
                { locale: "en", content: <Textarea name="serviceOptionsEn" defaultValue={lines(row?.serviceOptionsEn)} className="min-h-24" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="serviceOptionsAr" defaultValue={lines(row?.serviceOptionsAr)} className="min-h-24" dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="گزینه‌های بودجه" hint="هر گزینه در یک خط">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="budgetOptions" defaultValue={c.budgetOptions.join("\n")} className="min-h-24" /> },
                { locale: "en", content: <Textarea name="budgetOptionsEn" defaultValue={lines(row?.budgetOptionsEn)} className="min-h-24" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="budgetOptionsAr" defaultValue={lines(row?.budgetOptionsAr)} className="min-h-24" dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <FormSection title="سئو">
          <Field label="Meta Title">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="metaTitle" defaultValue={c.metaTitle} /> },
                { locale: "en", content: <Input name="metaTitleEn" defaultValue={row?.metaTitleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="metaTitleAr" defaultValue={row?.metaTitleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="Meta Description">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="metaDescription" defaultValue={c.metaDescription} /> },
                { locale: "en", content: <Textarea name="metaDescriptionEn" defaultValue={row?.metaDescriptionEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="metaDescriptionAr" defaultValue={row?.metaDescriptionAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه تماس</SubmitButton>
        </div>
      </form>
    </div>
  );
}
