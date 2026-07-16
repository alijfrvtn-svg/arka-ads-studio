import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveTeamMember } from "@/lib/actions";
import { parseArr } from "@/lib/utils";
import type { Social } from "@/types";

export default async function TeamMemberForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const m = isNew ? null : await db.teamMember.findUnique({ where: { id } });
  if (!isNew && !m) notFound();
  const socials = parseArr<Social>(m?.socials)
    .map((s) => `${s.platform} | ${s.href}`)
    .join("\n");

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/team" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "عضو جدید" : "ویرایش عضو تیم"}</h1>
      </div>

      <form action={saveTeamMember} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={m!.id} />}
        <FormSection title="اطلاعات عضو">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام" required><Input name="name" defaultValue={m?.name} required /></Field>
            <Field label="نام انگلیسی"><Input name="nameEn" defaultValue={m?.nameEn ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="سمت">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Input name="role" defaultValue={m?.role} required /> },
                { locale: "en", content: <Input name="roleEn" defaultValue={m?.roleEn ?? ""} dir="ltr" className="text-left" /> },
                { locale: "ar", content: <Input name="roleAr" defaultValue={m?.roleAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="بیوگرافی">
            <LangTabs
              tabs={[
                { locale: "fa", content: <Textarea name="bio" defaultValue={m?.bio ?? ""} /> },
                { locale: "en", content: <Textarea name="bioEn" defaultValue={m?.bioEn ?? ""} dir="ltr" /> },
                { locale: "ar", content: <Textarea name="bioAr" defaultValue={m?.bioAr ?? ""} dir="rtl" /> },
              ]}
            />
          </Field>
          <Field label="آواتار (URL)"><Input name="avatar" defaultValue={m?.avatar ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <Field label="شبکه‌های اجتماعی" hint="هر خط: پلتفرم | لینک — مثال: instagram | https://instagram.com/...">
            <Textarea name="socials" defaultValue={socials} dir="ltr" className="text-left" />
          </Field>
          <Field label="ترتیب نمایش"><Input name="order" type="number" defaultValue={m?.order ?? 0} dir="ltr" className="text-left" /></Field>
        </FormSection>

        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="published" label="نمایش در صفحه‌ی درباره ما" defaultChecked={m?.published ?? true} />
          <SubmitButton>ذخیره عضو</SubmitButton>
        </div>
      </form>
    </div>
  );
}
