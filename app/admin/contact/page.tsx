import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveContactPage } from "@/lib/actions";
import { getContactPage } from "@/lib/queries";

export default async function ContactPageAdmin() {
  const c = await getContactPage();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="صفحه تماس" description="مدیریت کامل محتوای صفحه‌ی /contact" />
      <form action={saveContactPage} className="space-y-5">
        <FormSection title="هیرو">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="چشم‌انداز (eyebrow)"><Input name="heroEyebrow" defaultValue={c.heroEyebrow} /></Field>
            <Field label="بخش رنگی عنوان" hint="زیرمجموعه‌ای از عنوان که رنگی نمایش داده می‌شود">
              <Input name="heroTitleHighlight" defaultValue={c.heroTitleHighlight} />
            </Field>
          </div>
          <Field label="عنوان اصلی"><Input name="heroTitle" defaultValue={c.heroTitle} required /></Field>
          <Field label="توضیح هیرو"><Textarea name="heroDescription" defaultValue={c.heroDescription} /></Field>
        </FormSection>

        <FormSection title="اطلاعات تماس">
          <Field label="آدرس"><Input name="address" defaultValue={c.address} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="تلفن (برای لینک tel:)" hint="مثال: +982188000000">
              <Input name="phone" defaultValue={c.phone} dir="ltr" className="text-left" />
            </Field>
            <Field label="تلفن (نمایشی)"><Input name="phoneDisplay" defaultValue={c.phoneDisplay} dir="ltr" className="text-left" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ایمیل"><Input name="email" type="email" defaultValue={c.email} dir="ltr" className="text-left" /></Field>
            <Field label="ساعات کاری"><Input name="officeHours" defaultValue={c.officeHours} /></Field>
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
            <Textarea
              name="socials"
              defaultValue={c.socials.map((s) => `${s.platform} | ${s.href} | ${s.label}`).join("\n")}
              className="min-h-28"
              dir="ltr"
            />
          </Field>
        </FormSection>

        <FormSection title="گزینه‌های فرم تماس">
          <Field label="گزینه‌های نوع خدمت" hint="هر گزینه در یک خط">
            <Textarea name="serviceOptions" defaultValue={c.serviceOptions.join("\n")} className="min-h-24" />
          </Field>
          <Field label="گزینه‌های بودجه" hint="هر گزینه در یک خط">
            <Textarea name="budgetOptions" defaultValue={c.budgetOptions.join("\n")} className="min-h-24" />
          </Field>
        </FormSection>

        <FormSection title="سئو">
          <Field label="Meta Title"><Input name="metaTitle" defaultValue={c.metaTitle} /></Field>
          <Field label="Meta Description"><Textarea name="metaDescription" defaultValue={c.metaDescription} /></Field>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره صفحه تماس</SubmitButton>
        </div>
      </form>
    </div>
  );
}
