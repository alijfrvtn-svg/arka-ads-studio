import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { labelOn, cn, localeNumber } from "@/lib/utils";
import type { Locale } from "@/types";
import { getAppearance } from "@/lib/appearance";
import { getUi } from "@/lib/site-copy";

/**
 * The four plans, replacing the closing "ready to talk?" block.
 *
 * That block asked for a conversation with no way to say what you wanted; these
 * ask for a decision and carry it through. Each card links to /contact with
 * `?plan=` and `?service=` set, which the contact form already reads and
 * pre-fills — so the visitor arrives with the form half-answered rather than
 * facing an empty message box.
 *
 * Colours are the four supplied. Flat and fully opaque by request: no glass on
 * the card itself, so the colour reads at full strength. Only the button is
 * glass, and it is the ink pill used everywhere else on the site.
 *
 * The lists get longer as the plans get bigger — that difference is the whole
 * argument for the higher tiers, and four bullets each made them look like the
 * same thing at four prices. The cards are still all one height: the grid
 * stretches them and the list takes the slack, so the four buttons line up
 * however uneven the content above them is.
 */
const PLANS = [
  { key: "starter", colour: "#D9DDE2" },
  { key: "plus", colour: "#004E72" },
  { key: "pro", colour: "#677D6A" },
  { key: "ultra", colour: "#710014" },
] as const;

const COPY: Record<Locale, {
  eyebrow: string;
  heading: string;
  sub: string;
  cta: string;
  plans: Record<string, { name: string; blurb: string; points: string[] }>;
}> = {
  fa: {
    eyebrow: "پلن‌ها",
    heading: "پلنی که اندازهٔ کار شماست",
    sub: "هر پلن را می‌توانیم دقیقاً بر اساس نیاز شما تنظیم کنیم. یکی را انتخاب کنید تا با همان گزینه به فرم درخواست بروید.",
    cta: "انتخاب این پلن",
    plans: {
      starter: {
        name: "استارتر",
        blurb: "برای شروع و آزمودن مسیر",
        points: [
          "دامنهٔ کاری مشخص و کوتاه",
          "یک راند بازنگری",
          "تحویل فایل‌های نهایی",
          "پشتیبانی ایمیلی",
        ],
      },
      plus: {
        name: "پلاس",
        blurb: "برای کسب‌وکاری که در حال رشد است",
        points: [
          "هر آنچه در استارتر هست",
          "دامنهٔ گسترده‌تر پروژه",
          "دو راند بازنگری",
          "جلسهٔ هم‌راستاسازی پیش از شروع",
          "اولویت در زمان‌بندی",
          "تحویل فایل‌های باز و آمادهٔ استفاده",
        ],
      },
      pro: {
        name: "پرو",
        blurb: "برای برندهایی با چند نقطهٔ تماس",
        points: [
          "هر آنچه در پلاس هست",
          "پروژهٔ کامل و چندبخشی",
          "بازنگری نامحدود در بازهٔ توافقی",
          "مدیر پروژهٔ اختصاصی",
          "گزارش دوره‌ای پیشرفت کار",
          "راهنمای استفاده و آموزش تیم شما",
          "پشتیبانی تلفنی در ساعات کاری",
          "سه ماه پشتیبانی پس از تحویل",
        ],
      },
      ultra: {
        name: "اولترا",
        blurb: "همکاری بلندمدت و اختصاصی",
        points: [
          "هر آنچه در پرو هست",
          "تیم اختصاصی آرکا",
          "برنامهٔ سالانه و نقشهٔ راه",
          "بازبینی فصلی استراتژی",
          "پاسخ‌گویی در کوتاه‌ترین زمان",
          "تولید محتوای دوره‌ای",
          "داشبورد گزارش‌گیری اختصاصی",
          "اولویت مطلق در صف اجرا",
          "جلسات ماهانهٔ حضوری یا آنلاین",
          "یک سال پشتیبانی کامل",
        ],
      },
    },
  },
  en: {
    eyebrow: "Plans",
    heading: "A plan the size of your project",
    sub: "Every plan can be tailored. Pick one and the request form opens with it already selected.",
    cta: "Choose this plan",
    plans: {
      starter: {
        name: "Starter",
        blurb: "To begin and test the route",
        points: ["Tight, defined scope", "One revision round", "Final files delivered", "Email support"],
      },
      plus: {
        name: "Plus",
        blurb: "For a business that is growing",
        points: [
          "Everything in Starter",
          "Wider project scope",
          "Two revision rounds",
          "Kick-off alignment session",
          "Scheduling priority",
          "Open, ready-to-use source files",
        ],
      },
      pro: {
        name: "Pro",
        blurb: "For brands with many touchpoints",
        points: [
          "Everything in Plus",
          "Full multi-part project",
          "Unlimited revisions within the window",
          "Dedicated project manager",
          "Periodic progress reports",
          "Usage guide and team handover",
          "Phone support in working hours",
          "Three months of post-delivery support",
        ],
      },
      ultra: {
        name: "Ultra",
        blurb: "A long-term, dedicated partnership",
        points: [
          "Everything in Pro",
          "A dedicated ARKA team",
          "Annual plan and roadmap",
          "Quarterly strategy review",
          "Fastest response times",
          "Ongoing content production",
          "Your own reporting dashboard",
          "Absolute priority in the queue",
          "Monthly meetings, in person or online",
          "A full year of support",
        ],
      },
    },
  },
  ar: {
    eyebrow: "الباقات",
    heading: "باقة بحجم مشروعك",
    sub: "يمكن تخصيص كل باقة. اختر واحدة وسيفتح النموذج وقد تم اختيارها.",
    cta: "اختر هذه الباقة",
    plans: {
      starter: {
        name: "المبتدئة",
        blurb: "للبدء واختبار الطريق",
        points: ["نطاق محدد وقصير", "جولة مراجعة واحدة", "تسليم الملفات النهائية", "دعم بالبريد"],
      },
      plus: {
        name: "بلَس",
        blurb: "لعمل في مرحلة نمو",
        points: [
          "كل ما في المبتدئة",
          "نطاق أوسع للمشروع",
          "جولتا مراجعة",
          "جلسة مواءمة قبل البدء",
          "أولوية في الجدولة",
          "ملفات مفتوحة وجاهزة للاستخدام",
        ],
      },
      pro: {
        name: "برو",
        blurb: "لعلامات متعددة نقاط التماس",
        points: [
          "كل ما في بلَس",
          "مشروع متكامل ومتعدد الأجزاء",
          "مراجعات غير محدودة ضمن المدة",
          "مدير مشروع مخصص",
          "تقارير دورية عن سير العمل",
          "دليل استخدام وتسليم للفريق",
          "دعم هاتفي في ساعات العمل",
          "ثلاثة أشهر دعم بعد التسليم",
        ],
      },
      ultra: {
        name: "ألترا",
        blurb: "شراكة طويلة الأمد",
        points: [
          "كل ما في برو",
          "فريق مخصص من آركا",
          "خطة سنوية وخارطة طريق",
          "مراجعة فصلية للاستراتيجية",
          "أسرع استجابة",
          "إنتاج محتوى دوري",
          "لوحة تقارير خاصة بك",
          "أولوية مطلقة في التنفيذ",
          "اجتماعات شهرية حضورياً أو عبر الإنترنت",
          "سنة كاملة من الدعم",
        ],
      },
    },
  },
};

export async function ServicePlans({
  serviceTitle,
  department,
  priceFrom,
  priceUnit,
  locale = "fa",
}: {
  serviceTitle: string;
  department: string;
  /** The service's own floor, when it has one. */
  priceFrom?: number | null;
  priceUnit: string;
  locale?: Locale;
}) {
  // Interface strings, with anything edited in the panel applied. Cached per
  // request, so every component asking for it costs one query between them.
  const copy = await getUi(locale);
  // The live identity, edited in the panel; falls back to the shipped
  // constants when nothing is saved. Cached per request.
  const { departmentPriceFrom: DEPARTMENT_PRICE_FROM, planMultiplier: PLAN_MULTIPLIER } = await getAppearance();
  const c = COPY[locale] ?? COPY.fa;
  // The service's own figure first, the department floor second — see
  // DEPARTMENT_PRICE_FROM. Rounded back to whole millions so the multipliers
  // never produce a price with loose change on the end.
  const base = priceFrom || DEPARTMENT_PRICE_FROM[department] || 12_000_000;

  return (
    <div>
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <span className="eyebrow mx-auto w-fit">{c.eyebrow}</span>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">
          {c.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground-muted md:text-base">{c.sub}</p>
      </div>

      {/* items-stretch is the grid default, so every card is the height of the
          tallest — the list below carries `flex-1` and absorbs the difference. */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p, i) => {
          const t = c.plans[p.key];
          // Computed per colour, never paired by hand: the four span a very
          // light grey-blue and a near-black red, so one fixed label colour
          // would fail at one end.
          const label = labelOn(p.colour);
          const onDark = label === "#ffffff";
          const price = Math.round((base * (PLAN_MULTIPLIER[p.key] ?? 1)) / 1_000_000) * 1_000_000;
          return (
            <Reveal key={p.key} delay={i * 0.07} className="h-full">
              <div
                className="flex h-full flex-col rounded-[2rem] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_28px_64px_-30px_rgba(0,0,0,0.45)] md:p-10"
                style={{ background: p.colour, color: label }}
              >
                <h3 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">{t.name}</h3>
                <p className={cn("mt-2.5 text-sm md:text-base", onDark ? "text-white/75" : "text-black/65")}>
                  {t.blurb}
                </p>

                {/* The price. A floor rather than a quote — the scope of these
                    is set per project, and a flat number would be a promise the
                    brief cannot keep. */}
                <div className={cn("mt-8 border-t pt-6", onDark ? "border-white/20" : "border-black/15")}>
                  <span className={cn("text-xs", onDark ? "text-white/70" : "text-black/60")}>
                    {copy.priceFromPrefix}
                  </span>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-[1.7rem] font-extrabold leading-none tracking-tight ltr-nums md:text-3xl">
                      {localeNumber(locale, price)}
                    </span>
                    <span className={cn("text-sm", onDark ? "text-white/75" : "text-black/65")}>{priceUnit}</span>
                  </div>
                </div>

                <ul className="mt-7 flex-1 space-y-3.5 text-sm leading-relaxed md:text-[0.95rem]">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full",
                          onDark ? "bg-white/70" : "bg-black/50",
                        )}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* The ink pill, as everywhere else. The card is flat by
                    request, so the button is the only glass here. */}
                <Link
                  href={`/contact?plan=${encodeURIComponent(t.name)}&service=${encodeURIComponent(serviceTitle)}`}
                  className="liquid liquid-raised group mt-9 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold md:text-base"
                  data-track={`plan-${p.key}`}
                >
                  <span className="inline-flex items-center gap-2">
                    {c.cta}
                    <ArrowUpLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
