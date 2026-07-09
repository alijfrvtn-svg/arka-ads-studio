import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { Field, Input, Toggle, FormSection } from "@/components/admin/form";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { saveClient } from "@/lib/actions";

export default async function ClientForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const c = isNew ? null : await db.client.findUnique({ where: { id } });
  if (!isNew && !c) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/clients" className="grid h-10 w-10 place-items-center rounded-xl border border-card-border text-foreground-muted hover:text-primary">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">{isNew ? "مشتری جدید" : "ویرایش مشتری"}</h1>
      </div>
      <form action={saveClient} className="space-y-5">
        {!isNew && <input type="hidden" name="id" value={c!.id} />}
        <FormSection title="اطلاعات برند">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام" required><Input name="name" defaultValue={c?.name} required /></Field>
            <Field label="نام انگلیسی"><Input name="nameEn" defaultValue={c?.nameEn ?? ""} dir="ltr" className="text-left" /></Field>
          </div>
          <Field label="لوگو (URL)"><Input name="logo" defaultValue={c?.logo ?? ""} dir="ltr" className="text-left" placeholder="https://…" /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="وب‌سایت"><Input name="website" defaultValue={c?.website ?? ""} dir="ltr" className="text-left" /></Field>
            <Field label="صنعت"><Input name="industry" defaultValue={c?.industry ?? ""} /></Field>
          </div>
        </FormSection>
        <div className="flex items-center justify-between rounded-2xl border border-card-border bg-surface p-5">
          <Toggle name="featured" label="نمایش در لیست مشتریان شاخص" defaultChecked={c?.featured ?? false} />
          <SubmitButton>ذخیره مشتری</SubmitButton>
        </div>
      </form>
    </div>
  );
}
