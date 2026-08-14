import { PageHeader } from "@/components/admin/ui";
import { Icon, ICON_GROUPS, ICON_NAMES } from "@/components/ui/Icon";
import { faNumber } from "@/lib/utils";

export const metadata = { title: "راهنمای آیکن‌ها" };

/**
 * Reference sheet for every icon name accepted by the CMS icon fields. Lives in
 * the panel rather than in a doc file so the list can never drift from the code
 * — it renders straight from ICON_GROUPS.
 */
export default function IconsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="راهنمای آیکن‌ها"
        description={`${faNumber(ICON_NAMES.length)} آیکن قابل استفاده در خدمات، صنایع، دسته‌بندی‌ها، گام‌های فرایند و ارزش‌های صفحه درباره ما`}
      />

      <div className="mb-6 rounded-2xl border border-card-border bg-surface p-5 text-sm leading-relaxed text-foreground-muted">
        <p className="mb-2 font-semibold text-foreground">این نام‌ها کجا استفاده می‌شوند؟</p>
        <ul className="list-disc space-y-1 pe-5">
          <li>
            <span className="text-foreground">خدمات</span> و <span className="text-foreground">صنایع</span> — فیلد
            «آیکن» در فرم ویرایش
          </li>
          <li>
            <span className="text-foreground">دسته‌بندی‌ها</span> — فیلد «آیکن»
          </li>
          <li>
            <span className="text-foreground">صفحه اصلی › ۴ گام فرایند</span> — اولین ستون هر خط، قبل از اولین
            علامت <code className="rounded bg-background/60 px-1 ltr-nums">|</code>
          </li>
          <li>
            <span className="text-foreground">درباره ما › ارزش‌ها</span> — همان الگو
          </li>
        </ul>
        <p className="mt-3 text-xs text-foreground-faint">
          نام‌ها دقیقاً با همین املا و حروف بزرگ/کوچک نوشته می‌شوند. اگر نامی اشتباه یا خارج از این فهرست باشد،
          آیکن پیش‌فرض (یک مکعب) نمایش داده می‌شود.
        </p>
      </div>

      <div className="space-y-6">
        {ICON_GROUPS.map((g) => (
          <section key={g.label}>
            <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-foreground">
              {g.label}
              <span className="text-xs font-normal text-foreground-faint">{faNumber(g.names.length)}</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {g.names.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-xl border border-card-border bg-surface p-3"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-card-border bg-background/50 text-primary">
                    <Icon name={name} className="h-5 w-5" />
                  </span>
                  {/* Selectable so the exact spelling can be copied straight out. */}
                  <code className="min-w-0 flex-1 select-all truncate text-xs text-foreground-muted ltr-nums" dir="ltr">
                    {name}
                  </code>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
