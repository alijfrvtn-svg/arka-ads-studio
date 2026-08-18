import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { Reveal } from "@/components/fx/Reveal";
import { labelOn, cn } from "@/lib/utils";
import type { Locale } from "@/types";

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
      starter: { name: "استارتر", blurb: "برای شروع و آزمودن مسیر", points: ["دامنهٔ کاری مشخص و کوتاه", "یک راند بازنگری", "تحویل فایل‌های نهایی", "پشتیبانی ایمیلی"] },
      plus: { name: "پلاس", blurb: "برای کسب‌وکاری که در حال رشد است", points: ["دامنهٔ گسترده‌تر", "دو راند بازنگری", "جلسهٔ هم‌راستاسازی", "اولویت در زمان‌بندی"] },
      pro: { name: "پرو", blurb: "برای برندهایی با چند نقطهٔ تماس", points: ["پروژهٔ کامل چندبخشی", "بازنگری نامحدود در بازهٔ توافقی", "مدیر پروژهٔ اختصاصی", "گزارش دوره‌ای"] },
      ultra: { name: "اولترا", blurb: "همکاری بلندمدت و اختصاصی", points: ["تیم اختصاصی آرکا", "برنامهٔ سالانه و نقشهٔ راه", "پاسخ‌گویی در کوتاه‌ترین زمان", "بازبینی فصلی استراتژی"] },
    },
  },
  en: {
    eyebrow: "Plans",
    heading: "A plan the size of your project",
    sub: "Every plan can be tailored. Pick one and the request form opens with it already selected.",
    cta: "Choose this plan",
    plans: {
      starter: { name: "Starter", blurb: "To begin and test the route", points: ["Tight, defined scope", "One revision round", "Final files delivered", "Email support"] },
      plus: { name: "Plus", blurb: "For a business that is growing", points: ["Wider scope", "Two revision rounds", "Alignment session", "Scheduling priority"] },
      pro: { name: "Pro", blurb: "For brands with many touchpoints", points: ["Full multi-part project", "Unlimited revisions in window", "Dedicated project manager", "Periodic reporting"] },
      ultra: { name: "Ultra", blurb: "A long-term, dedicated partnership", points: ["Dedicated ARKA team", "Annual plan and roadmap", "Fastest response times", "Quarterly strategy review"] },
    },
  },
  ar: {
    eyebrow: "الباقات",
    heading: "باقة بحجم مشروعك",
    sub: "يمكن تخصيص كل باقة. اختر واحدة وسيفتح النموذج وقد تم اختيارها.",
    cta: "اختر هذه الباقة",
    plans: {
      starter: { name: "المبتدئة", blurb: "للبدء واختبار الطريق", points: ["نطاق محدد وقصير", "جولة مراجعة واحدة", "تسليم الملفات النهائية", "دعم بالبريد"] },
      plus: { name: "بلَس", blurb: "لعمل في مرحلة نمو", points: ["نطاق أوسع", "جولتا مراجعة", "جلسة مواءمة", "أولوية في الجدولة"] },
      pro: { name: "برو", blurb: "لعلامات متعددة نقاط التماس", points: ["مشروع متكامل", "مراجعات غير محدودة ضمن المدة", "مدير مشروع مخصص", "تقارير دورية"] },
      ultra: { name: "ألترا", blurb: "شراكة طويلة الأمد", points: ["فريق مخصص", "خطة سنوية وخارطة طريق", "أسرع استجابة", "مراجعة فصلية للاستراتيجية"] },
    },
  },
};

export function ServicePlans({ serviceTitle, locale = "fa" }: { serviceTitle: string; locale?: Locale }) {
  const c = COPY[locale] ?? COPY.fa;

  return (
    <div>
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="eyebrow mx-auto w-fit">{c.eyebrow}</span>
        <h2 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-4xl">
          {c.heading}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-foreground-muted md:text-base">{c.sub}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p, i) => {
          const t = c.plans[p.key];
          // Computed per colour, never paired by hand: the four span a very
          // light grey-blue and a near-black red, so one fixed label colour
          // would fail at one end.
          const label = labelOn(p.colour);
          const onDark = label === "#ffffff";
          return (
            <Reveal key={p.key} delay={i * 0.07}>
              <div
                className="flex h-full flex-col rounded-[1.75rem] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_24px_56px_-30px_rgba(0,0,0,0.4)]"
                style={{ background: p.colour, color: label }}
              >
                <h3 className="font-display text-2xl font-extrabold tracking-tight">{t.name}</h3>
                <p className={cn("mt-2 text-sm", onDark ? "text-white/75" : "text-black/65")}>{t.blurb}</p>

                <ul className="mt-7 flex-1 space-y-3 text-sm leading-relaxed">
                  {t.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
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
                  className="liquid liquid-raised group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
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
