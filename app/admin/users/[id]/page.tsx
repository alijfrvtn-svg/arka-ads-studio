import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Textarea, Select, Toggle, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveUser } from "@/lib/actions";
import { PERMISSIONS, ROLES, ROLE_PERMISSIONS } from "@/lib/constants";
import { parseArr } from "@/lib/utils";
import type { Role } from "@/types";

export default async function UserForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const u = isNew ? null : await db.user.findUnique({ where: { id } });
  if (!isNew && !u) notFound();

  const overrides = parseArr<string>(u?.permissions);
  const groups = Array.from(new Set(PERMISSIONS.map((p) => p.group)));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/users" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "کاربر جدید" : "ویرایش کاربر"}</h1>
      </div>

      <form action={saveUser} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={u!.id} />}
        <FormSection title="اطلاعات کاربر">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام" required><Input name="name" defaultValue={u?.name} required /></Field>
            <Field label="ایمیل" required><Input name="email" type="email" defaultValue={u?.email} dir="ltr" className="text-left" required /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={isNew ? "رمز عبور" : "رمز عبور جدید"} hint={isNew ? "خالی = Arka@2026!" : "برای عدم تغییر خالی بگذارید"}>
              <Input name="password" type="text" dir="ltr" className="text-left" placeholder="••••••••" />
            </Field>
            <Field label="نقش">
              <Select name="role" defaultValue={u?.role ?? "EDITOR"}>
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="آواتار (URL)"><Input name="avatar" defaultValue={u?.avatar ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <Field label="بیو"><Textarea name="bio" defaultValue={u?.bio ?? ""} /></Field>
        </FormSection>

        <FormSection title="دسترسی‌های اختصاصی">
          <p className="-mt-2 text-xs text-foreground-muted">
            این دسترسی‌ها <span className="text-primary">علاوه بر</span> دسترسی‌های پیش‌فرض نقش اعمال می‌شوند. مدیر ارشد به همه‌چیز دسترسی دارد.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {groups.map((g) => (
              <div key={g} className="rounded-xl border border-card-border bg-background/40 p-4">
                <p className="mb-2 text-xs font-bold text-foreground-faint">{g}</p>
                <div className="space-y-2">
                  {PERMISSIONS.filter((p) => p.group === g).map((p) => (
                    <label key={p.key} className="flex cursor-pointer items-center gap-2.5 text-sm">
                      <input type="checkbox" name="permissions" value={p.key} defaultChecked={overrides.includes(p.key)} className="h-4 w-4 rounded border-card-border accent-[var(--primary)]" />
                      <span className="text-foreground-muted">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="active" label="حساب فعال" defaultChecked={u?.active ?? true} />
          <SubmitButton>ذخیره کاربر</SubmitButton>
        </div>
      </form>
    </div>
  );
}
