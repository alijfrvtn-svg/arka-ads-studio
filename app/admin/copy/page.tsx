import { requirePermission } from "@/lib/auth";
import { copyDefaults, groupCopyKeys, getCopyOverrides } from "@/lib/site-copy";
import { saveSiteCopy } from "@/lib/actions";
import { IosTitle, IosGroup } from "@/components/admin/ios";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { localeNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Every word of interface the site says, in all three languages.
 *
 * These are the strings that are not backed by a content row — navigation,
 * buttons, form labels, empty states. Until now they were a dictionary in the
 * source and could only be changed by editing code.
 *
 * The shipped wording is shown as the placeholder rather than as the value, so
 * a field that has never been touched is genuinely empty. That is what lets
 * "clear the box" mean "go back to the default": an override equal to the
 * default is never saved, and a later change to the shipped copy still reaches
 * the site instead of being pinned to whatever was in the box.
 */
export default async function CopyPage() {
  await requirePermission("settings.manage");

  const rows = copyDefaults();
  const overrides = await getCopyOverrides();
  const groups = groupCopyKeys(rows);
  const byKey = new Map(rows.map((r) => [r.key, r]));
  const edited = Object.keys(overrides).length;

  return (
    <form action={saveSiteCopy}>
      <IosTitle
        title="متن‌های سایت"
        subtitle={`${localeNumber("fa", rows.length)} عبارت در سه زبان — ${
          edited ? `${localeNumber("fa", edited)} مورد تغییر داده شده` : "همه روی مقدار پیش‌فرض"
        }`}
        action={<SubmitButton className="ios-btn ios-btn-filled">ذخیره</SubmitButton>}
      />

      {groups.map((g) => (
        <IosGroup key={g.label} header={g.label}>
          {g.keys.map((key) => {
            const d = byKey.get(key)!;
            const o = overrides[key] ?? {};
            return (
              <div key={key} className="ios-row flex-col items-stretch gap-2 py-3">
                <span className="ios-footnote font-mono text-[var(--ios-label-3)]" dir="ltr">
                  {key}
                </span>
                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="flex flex-col gap-1">
                    <span className="ios-caption text-[var(--ios-label-2)]">فارسی</span>
                    <input
                      name={`copy.${key}.fa`}
                      defaultValue={o.fa ?? ""}
                      placeholder={d.fa}
                      className="ios-field rounded-[8px] bg-[var(--ios-fill)] px-2.5 py-1.5"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="ios-caption text-[var(--ios-label-2)]">English</span>
                    <input
                      name={`copy.${key}.en`}
                      dir="ltr"
                      defaultValue={o.en ?? ""}
                      placeholder={d.en}
                      className="ios-field rounded-[8px] bg-[var(--ios-fill)] px-2.5 py-1.5"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="ios-caption text-[var(--ios-label-2)]">العربية</span>
                    <input
                      name={`copy.${key}.ar`}
                      defaultValue={o.ar ?? ""}
                      placeholder={d.ar}
                      className="ios-field rounded-[8px] bg-[var(--ios-fill)] px-2.5 py-1.5"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </IosGroup>
      ))}

      <div className="pb-4">
        <SubmitButton className="ios-btn ios-btn-filled w-full">ذخیرهٔ متن‌ها</SubmitButton>
      </div>
    </form>
  );
}
