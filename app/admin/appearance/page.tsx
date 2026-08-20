import { requirePermission } from "@/lib/auth";
import { getAppearance, APPEARANCE_DEFAULTS } from "@/lib/appearance";
import { saveAppearance } from "@/lib/actions";
import { IosTitle, IosGroup, IosFieldRow } from "@/components/admin/ios";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ColorField } from "@/components/admin/ColorField";
import { DEPARTMENTS } from "@/lib/constants";
import { localeNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * The site's visual identity.
 *
 * Every value on this page was a constant in the source until now. It still is
 * — `lib/appearance.ts` reads what is saved here *over* those constants, so a
 * field left blank falls back rather than blanking the site out, and the whole
 * page can fail to load without the public site losing a colour.
 *
 * The four brand colours appear twice on purpose, and the second set is the
 * part people get wrong: `industryPaint` is what fills a shape, `textPaint` is
 * the same hues darkened enough to be *set as type on white*. Two of the four
 * cannot carry text at their filled value — the coral sits at 2.80:1 and the
 * gold at 1.72:1 — so they are edited as separate fields with that said out
 * loud, rather than derived and quietly wrong.
 */
export default async function AppearancePage() {
  await requirePermission("settings.manage");
  const a = await getAppearance();
  const depts = DEPARTMENTS.map((d) => d.key);

  return (
    <form action={saveAppearance}>
      <IosTitle
        title="هویت بصری"
        subtitle="رنگ‌ها، گرادیانت‌ها و قیمت‌های پایه — همان‌هایی که تا امروز داخل کد بودند"
        action={<SubmitButton className="ios-btn ios-btn-filled">ذخیره</SubmitButton>}
      />

      <IosGroup
        header="چهار رنگ اصلی — به‌عنوان پس‌زمینه"
        footer="این چهار رنگ زمینهٔ کارت‌ها، ردیف‌های صنایع و پوسترها را پر می‌کنند."
      >
        {a.industryPaint.map((c, i) => (
          <IosFieldRow key={i} label={`رنگ ${localeNumber("fa", i + 1)}`}>
            <ColorField name="industryPaint" defaultValue={c} />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup
        header="همان چهار رنگ — به‌عنوان متن روی سفید"
        footer="دو تا از رنگ‌های بالا روی سفید اصلاً خوانا نیستند (مرجانی ۲٫۸ و طلایی ۱٫۷ به یک). این‌ها همان رنگ‌ها هستند که تیره شده‌اند تا به‌عنوان متن قابل خواندن باشند. جدا نگه داشته شده‌اند چون حدس زدنشان از روی رنگ پس‌زمینه، نتیجه‌ای می‌دهد که خوانا نیست."
      >
        {a.textPaint.map((c, i) => (
          <IosFieldRow key={i} label={`متن ${localeNumber("fa", i + 1)}`}>
            <ColorField name="textPaint" defaultValue={c} />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup
        header="پالت کامل بوم نقاشی"
        footer="شش رنگی که نوارهای نقاشی‌شده با آن‌ها کشیده می‌شوند — چهار رنگ اصلی به‌علاوهٔ آبی روشن و بادمجانی."
      >
        {a.sitePaint.map((c, i) => (
          <IosFieldRow key={i} label={`رنگ ${localeNumber("fa", i + 1)}`}>
            <ColorField name="sitePaint" defaultValue={c} />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup header="رنگ هر دپارتمان">
        {depts.map((k) => (
          <IosFieldRow key={k} label={k}>
            <ColorField name={`departmentPaint.${k}`} defaultValue={a.departmentPaint[k] ?? "#000000"} />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup
        header="گرادیانت توضیح هر دپارتمان"
        footer="جفت رنگ تیره‌ای که پشت متن بلند صفحهٔ خدمات می‌نشیند. هر دو سر باید پر باشد؛ اگر یکی خالی بماند، همان مقدار قبلی می‌ماند."
      >
        {depts.map((k) => {
          const g = a.departmentGradient[k] ?? ["#000000", "#000000"];
          return (
            <IosFieldRow key={k} label={k}>
              <span className="flex items-center gap-2">
                <ColorField name={`gradient.${k}.0`} defaultValue={g[0]} />
                <ColorField name={`gradient.${k}.1`} defaultValue={g[1]} />
              </span>
            </IosFieldRow>
          );
        })}
      </IosGroup>

      <IosGroup header="پوستر هر دپارتمان" footer="مسیر تصویر — از کتابخانهٔ رسانه کپی کن یا مسیر فایل استاتیک را بنویس.">
        {depts.map((k) => (
          <IosFieldRow key={k} label={k} stacked>
            <input
              className="ios-field ltr-nums"
              dir="ltr"
              name={`departmentPoster.${k}`}
              defaultValue={a.departmentPoster[k] ?? ""}
              placeholder="/departments/design.webp"
            />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup
        header="قیمت پایهٔ هر دپارتمان"
        footer="به ریال. قیمت هر پلن از ضرب این عدد در ضریب پلن به دست می‌آید، پس یک عدد اینجا کل جدول قیمت آن دپارتمان را جابه‌جا می‌کند."
      >
        {depts.map((k) => (
          <IosFieldRow key={k} label={k}>
            <input
              className="ios-field ltr-nums"
              dir="ltr"
              inputMode="numeric"
              name={`departmentPriceFrom.${k}`}
              defaultValue={a.departmentPriceFrom[k] ?? ""}
            />
          </IosFieldRow>
        ))}
      </IosGroup>

      <IosGroup header="ضریب پلن‌ها" footer="پایه ضربدر این عدد. مثلاً ۳٫۵ یعنی پلن حرفه‌ای سه و نیم برابر قیمت پایه است.">
        {Object.keys(APPEARANCE_DEFAULTS.planMultiplier).map((k) => (
          <IosFieldRow key={k} label={k}>
            <input
              className="ios-field ltr-nums"
              dir="ltr"
              inputMode="decimal"
              name={`planMultiplier.${k}`}
              defaultValue={a.planMultiplier[k] ?? ""}
            />
          </IosFieldRow>
        ))}
      </IosGroup>

      <div className="pb-4">
        <SubmitButton className="ios-btn ios-btn-filled w-full">ذخیرهٔ هویت بصری</SubmitButton>
      </div>
    </form>
  );
}
