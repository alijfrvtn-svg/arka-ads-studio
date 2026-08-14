import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { db } from "@/lib/db";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { Field, Input, Select, Toggle, FormSection } from "@/components/admin/form";
import { LangTabs } from "@/components/admin/LangTabs";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { CategoryDelete } from "@/components/admin/CategoryDelete";
import { Icon, ICON_NAMES } from "@/components/ui/Icon";
import { saveCategory, deleteCategory, seedCategories } from "@/lib/actions";
import { faNumber } from "@/lib/utils";

const KINDS = [
  { key: "POST", label: "دسته‌بندی مقالات", hint: "فیلترهای صفحه ژورنال و انتخاب دسته هنگام نوشتن مقاله" },
  { key: "WORK", label: "دسته‌بندی نمونه‌کارها", hint: "فیلترهای صفحه نمونه‌کارها و انتخاب دسته هنگام ثبت پروژه" },
  { key: "DEPARTMENT", label: "دپارتمان‌های خدمات", hint: "گروه‌بندی خدمات در مگا‌منوی هدر و بخش دپارتمان‌های صفحه اصلی" },
] as const;

/** Counts of the content pointing at each category, so an admin can see what a
 *  rename or delete would affect before doing it. */
async function usageFor(kind: string) {
  if (kind === "POST") {
    const rows = await db.post.groupBy({ by: ["category"], _count: { _all: true } });
    return new Map(rows.map((r) => [r.category, r._count._all]));
  }
  if (kind === "WORK") {
    const rows = await db.project.groupBy({ by: ["category"], _count: { _all: true } });
    return new Map(rows.map((r) => [r.category, r._count._all]));
  }
  const rows = await db.service.groupBy({ by: ["department"], _count: { _all: true } });
  return new Map(rows.map((r) => [r.department, r._count._all]));
}

function CategoryForm({
  kind,
  row,
}: {
  kind: string;
  row?: {
    id: string;
    slug: string;
    title: string;
    titleEn: string | null;
    titleAr: string | null;
    desc: string | null;
    descEn: string | null;
    descAr: string | null;
    icon: string;
    accent: string;
    order: number;
    published: boolean;
  };
}) {
  return (
    <form action={saveCategory} className="space-y-4">
      <input type="hidden" name="kind" value={kind} />
      {row && <input type="hidden" name="id" value={row.id} />}
      {/* DEPARTMENT keys are fixed (FILM/DIGITAL/…) and referenced by Service
          rows, so they are shown read-only rather than edited by hand. */}
      {row && kind === "DEPARTMENT" && <input type="hidden" name="slug" value={row.slug} />}

      <Field label="عنوان" required>
        <LangTabs
          tabs={[
            { locale: "fa", content: <Input name="title" defaultValue={row?.title ?? ""} required /> },
            { locale: "en", content: <Input name="titleEn" defaultValue={row?.titleEn ?? ""} dir="ltr" className="text-left" /> },
            { locale: "ar", content: <Input name="titleAr" defaultValue={row?.titleAr ?? ""} dir="rtl" /> },
          ]}
        />
      </Field>

      <Field label="توضیح کوتاه" hint="در بخش دپارتمان‌های صفحه اصلی زیر عنوان نمایش داده می‌شود">
        <LangTabs
          tabs={[
            { locale: "fa", content: <Input name="desc" defaultValue={row?.desc ?? ""} /> },
            { locale: "en", content: <Input name="descEn" defaultValue={row?.descEn ?? ""} dir="ltr" className="text-left" /> },
            { locale: "ar", content: <Input name="descAr" defaultValue={row?.descAr ?? ""} dir="rtl" /> },
          ]}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="آیکن" hint="فهرست کامل نام‌ها در راهنمای آیکن‌ها">
          <Select name="icon" defaultValue={row?.icon ?? "Sparkles"}>
            {ICON_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="رنگ">
          <input
            type="color"
            name="accent"
            defaultValue={row?.accent ?? "#6699ff"}
            className="h-11 w-full cursor-pointer rounded-xl border border-card-border bg-transparent"
          />
        </Field>
        <Field label="ترتیب">
          <Input name="order" type="number" defaultValue={row?.order ?? 0} dir="ltr" className="text-left" />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Toggle name="published" defaultChecked={row?.published ?? true} label="نمایش در سایت" />
        <SubmitButton>{row ? "ذخیره تغییرات" : "افزودن دسته‌بندی"}</SubmitButton>
      </div>
    </form>
  );
}

export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string }>;
}) {
  const { kind: raw } = await searchParams;
  const kind = KINDS.find((k) => k.key === raw)?.key ?? "POST";
  const active = KINDS.find((k) => k.key === kind)!;

  const [rows, usage, total] = await Promise.all([
    db.category.findMany({ where: { kind }, orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    usageFor(kind),
    db.category.count(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="دسته‌بندی‌ها" description="مدیریت دسته‌بندی مقالات، نمونه‌کارها و دپارتمان‌های خدمات" />

      <div className="mb-5 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <Link
            key={k.key}
            href={`/admin/categories?kind=${k.key}`}
            className={
              k.key === kind
                ? "rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                : "rounded-xl border border-card-border px-4 py-2.5 text-sm text-foreground-muted transition-colors hover:text-foreground"
            }
          >
            {k.label}
          </Link>
        ))}
      </div>

      <p className="mb-5 text-xs leading-relaxed text-foreground-faint">{active.hint}</p>

      {total === 0 && (
        <div className="mb-5 rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="text-sm text-foreground">
            هنوز دسته‌بندی‌ای در دیتابیس ثبت نشده و سایت از فهرست پیش‌فرض استفاده می‌کند. با دکمه‌ی زیر همان
            فهرست فعلی سایت به‌صورت قابل‌ویرایش ساخته می‌شود.
          </p>
          <form action={seedCategories} className="mt-3">
            <SubmitButton>ساخت دسته‌بندی‌های فعلی سایت</SubmitButton>
          </form>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState icon={Tags} title="دسته‌بندی‌ای در این بخش ثبت نشده" />
      ) : (
        <div className="mb-5 space-y-3">
          {rows.map((c) => {
            const used = usage.get(c.slug) ?? 0;
            return (
              <details key={c.id} className="group rounded-2xl border border-card-border bg-surface">
                <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-card-border"
                    style={{ color: c.accent }}
                  >
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-foreground">{c.title}</span>
                    <span className="block text-xs text-foreground-faint">
                      {faNumber(used)} مورد
                      {!c.published && " · مخفی"}
                      <span className="ltr-nums"> · {c.slug}</span>
                    </span>
                  </span>
                  <span className="text-xs text-foreground-faint group-open:hidden">ویرایش</span>
                </summary>
                <div className="border-t border-card-border p-4">
                  <CategoryForm kind={kind} row={c} />
                  <div className="mt-4 flex items-center justify-between border-t border-card-border pt-3">
                    <p className="text-xs text-foreground-faint">
                      {used > 0
                        ? "برای حذف، ابتدا موارد این دسته را به دسته‌ی دیگری منتقل کنید."
                        : "این دسته‌بندی روی هیچ محتوایی استفاده نشده و قابل حذف است."}
                    </p>
                    <CategoryDelete action={deleteCategory.bind(null, c.id)} />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}

      <FormSection title="دسته‌بندی جدید" description={`افزودن به «${active.label}»`}>
        <CategoryForm kind={kind} />
      </FormSection>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-foreground-faint">
        <Plus className="h-3.5 w-3.5" />
        تغییر نام یک دسته‌بندی، همه‌ی محتوای مرتبط را هم به‌روز می‌کند.
      </p>
    </div>
  );
}
