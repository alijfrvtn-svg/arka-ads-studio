import { Globe, Palette, ShieldAlert } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveSettings } from "@/lib/actions";
import { parseObj } from "@/lib/utils";

interface SiteSettings {
  heroHeadline: string;
  contactEmail: string;
  primaryColor: string;
  maintenance: boolean;
  defaultLocale: string;
}

export default async function SettingsPage() {
  const row = await db.setting.findUnique({ where: { key: "site" } });
  const s = parseObj<SiteSettings>(row?.value, {
    heroHeadline: "طراحی کن. خلق کن. تأثیر بگذار.",
    contactEmail: "hello@arka.studio",
    primaryColor: "#6699ff",
    maintenance: false,
    defaultLocale: "fa",
  });

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
    </div>
  );
}
