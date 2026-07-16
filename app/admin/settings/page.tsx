import { Globe, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSettings, saveStats, saveFooterSettings } from "@/lib/actions";
import { parseObj } from "@/lib/utils";
import { SITE } from "@/lib/constants";

interface SiteSettings {
  heroHeadline: string;
  contactEmail: string;
  primaryColor: string;
  maintenance: boolean;
  defaultLocale: string;
  footerCtaHeading: string;
  footerCtaBody: string;
  footerCtaButtonLabel: string;
  footerDescription: string;
  footerCopyright: string;
}

export default async function SettingsPage() {
  const [row, stats] = await Promise.all([
    db.setting.findUnique({ where: { key: "site" } }),
    db.stat.findMany({ orderBy: { order: "asc" } }),
  ]);
  // Merge (not replace) — the stored blob may only have fields from whichever
  // form was saved last (general/stats/footer are three independent forms
  // sharing one JSON row), so a missing key must fall back to its default,
  // not render blank.
  const s: SiteSettings = {
    heroHeadline: "طراحی کن. خلق کن. تأثیر بگذار.",
    contactEmail: "hello@arka.studio",
    primaryColor: "#6699ff",
    maintenance: false,
    defaultLocale: "fa",
    footerCtaHeading: "ایده‌ای در سر دارید؟",
    footerCtaBody: "بیایید با هم چیزی بسازیم که به یاد بماند.",
    footerCtaButtonLabel: "بریف پروژه‌ات را بفرست",
    footerDescription: SITE.description,
    footerCopyright: "تمام حقوق محفوظ است.",
    ...parseObj<Partial<SiteSettings>>(row?.value, {}),
  };
  const statsText = stats.map((st) => `${st.label} | ${st.value} | ${st.suffix}`).join("\n");
  const statsTextEn = stats.map((st) => `${st.labelEn ?? ""} | ${st.value} | ${st.suffix}`).join("\n");
  const statsTextAr = stats.map((st) => `${st.labelAr ?? ""} | ${st.value} | ${st.suffix}`).join("\n");

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="تنظیمات" description="پیکربندی عمومی سایت و برند" />
      <form action={saveSettings} className="space-y-5">
        <FormSection title="عمومی">
          <Field label="شعار اصلی صفحه اول"><Input name="heroHeadline" defaultValue={s.heroHeadline} /></Field>
          <Field label="ایمیل تماس"><Input name="contactEmail" type="email" defaultValue={s.contactEmail} dir="ltr" className="text-left" /></Field>
        </FormSection>

        <FormSection title="ظاهر و زبان">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="رنگ اصلی برند">
              <div className="flex items-center gap-2">
                <input type="color" name="primaryColor" defaultValue={s.primaryColor} className="h-11 w-14 cursor-pointer rounded-lg border border-card-border bg-transparent" />
                <span className="text-sm text-foreground-muted ltr-nums">{s.primaryColor}</span>
              </div>
            </Field>
            <Field label="زبان پیش‌فرض" hint="پشتیبانی چندزبانه: FA / EN / AR">
              <Select name="defaultLocale" defaultValue={s.defaultLocale}>
                <option value="fa">فارسی (FA)</option>
                <option value="en">English (EN)</option>
                <option value="ar">العربية (AR)</option>
              </Select>
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["FA", "فارسی"], ["EN", "English"], ["AR", "العربية"]].map(([c, l]) => (
              <span key={c} className="inline-flex items-center gap-1.5 rounded-lg border border-card-border bg-background/40 px-3 py-1.5 text-xs text-foreground-muted">
                <Globe className="h-3.5 w-3.5 text-primary" /> {l}
              </span>
            ))}
          </div>
        </FormSection>

        <FormSection title="حالت نگهداری">
          <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">حالت تعمیر و نگهداری</p>
              <p className="text-xs text-foreground-muted">با فعال‌سازی، سایت برای بازدیدکنندگان موقتاً بسته می‌شود.</p>
            </div>
            <Toggle name="maintenance" defaultChecked={s.maintenance} />
          </div>
        </FormSection>

        <div className="flex justify-end">
          <SubmitButton>ذخیره تنظیمات</SubmitButton>
        </div>
      </form>

      <form action={saveStats} className="mt-5">
        <FormSection
          title="آمار سایت"
          description="اعداد نمایش داده‌شده در صفحه اول و درباره ما (مثل «۴۸۰+ پروژه موفق»)"
        >
          <Field
            label="آمار"
            hint="هر خط یک آیتم: برچسب | عدد | پسوند — مثال: پروژه موفق | 480 | + — ترتیب خطوط، ترتیب نمایش است (فقط برچسب بین زبان‌ها فرق می‌کند؛ عدد و پسوند از ستون فارسی خوانده می‌شود)"
          >
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="stats" defaultValue={statsText} className="min-h-32" /> },
                { locale: "en", content: <Textarea name="statsEn" defaultValue={statsTextEn} className="min-h-32" dir="ltr" /> },
                { locale: "ar", content: <Textarea name="statsAr" defaultValue={statsTextAr} className="min-h-32" dir="rtl" /> },
              ]}
            />
          </Field>
          <div className="flex justify-end">
            <SubmitButton>ذخیره آمار</SubmitButton>
          </div>
        </FormSection>
      </form>

      <form action={saveFooterSettings} className="mt-5">
        <FormSection title="فوتر" description="محتوای ثابت پایین همه‌ی صفحات سایت">
          <Field label="عنوان نوار دعوت‌به‌اقدام"><Input name="footerCtaHeading" defaultValue={s.footerCtaHeading} /></Field>
          <Field label="توضیح نوار دعوت‌به‌اقدام"><Textarea name="footerCtaBody" defaultValue={s.footerCtaBody} /></Field>
          <Field label="متن دکمه نوار دعوت‌به‌اقدام"><Input name="footerCtaButtonLabel" defaultValue={s.footerCtaButtonLabel} /></Field>
          <Field label="توضیح زیر لوگو"><Textarea name="footerDescription" defaultValue={s.footerDescription} /></Field>
          <Field label="متن حق‌کپی‌رایت" hint="بعد از © سال و نام شرکت می‌آید"><Input name="footerCopyright" defaultValue={s.footerCopyright} /></Field>
          <div className="flex justify-end">
            <SubmitButton>ذخیره فوتر</SubmitButton>
          </div>
        </FormSection>
      </form>
    </div>
  );
}
