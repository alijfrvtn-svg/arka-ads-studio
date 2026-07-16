import { cookies, headers } from "next/headers";
import type { Locale } from "@/types";

export const LOCALE_COOKIE = "arka_locale";
export const LOCALES: readonly Locale[] = ["fa", "en", "ar"];

/** Resolve the visitor's locale — set by middleware.ts (header for this request,
 * cookie for the next one). /admin and /portal never get the header, so
 * `getLocale()` there falls through to the cookie (usually absent) → "fa". */
export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (fromHeader && (LOCALES as readonly string[]).includes(fromHeader)) return fromHeader as Locale;
  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) return fromCookie as Locale;
  return "fa";
}

/** Pick the field for the given locale, falling back to the Persian value if
 * the translation is missing/empty — so partially-translated content never
 * shows a blank field. */
export function tr(locale: Locale, fa: string, en?: string | null, ar?: string | null): string {
  if (locale === "en" && en?.trim()) return en;
  if (locale === "ar" && ar?.trim()) return ar;
  return fa;
}

export function dirOf(locale: Locale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export const LOCALE_LABEL: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
  ar: "العربية",
};

/** Shared UI chrome strings (nav, footer, forms, empty states) — content
 * fields (services/industries/projects/posts/...) use `tr()` against their
 * own *En/*Ar columns instead; this dictionary is only for hardcoded copy
 * that isn't backed by a database row. */
export const UI = {
  fa: {
    navHome: "خانه",
    navServices: "خدمات",
    navWork: "نمونه‌کارها",
    navIndustries: "صنایع",
    navAbout: "درباره ما",
    navJournal: "ژورنال",
    navContact: "تماس",
    ctaStartProject: "شروع پروژه",
    ctaRequestConsult: "درخواست مشاوره",
    ctaWatchReel: "تماشای شوریل ۲۰۲۵",
    footerFollowUs: "ما را دنبال کنید",
    footerRights: "تمام حقوق محفوظ است.",
    footerAdminLogin: "ورود مدیریت",
    footerCtaHeading: "ایده‌ای در سر دارید؟",
    footerCtaBody: "بیایید با هم چیزی بسازیم که به یاد بماند.",
    footerCtaButton: "بریف پروژه‌ات را بفرست",
    footerServices: "خدمات",
    footerIndustries: "صنایع",
    footerContact: "تماس",
    filterAll: "همه",
    workEmpty: "پروژه‌ای در این دسته یافت نشد.",
    contactNameLabel: "نام و نام خانوادگی *",
    contactNamePlaceholder: "نام",
    contactEmailLabel: "ایمیل *",
    contactEmailPlaceholder: "ایمیل",
    contactPhoneLabel: "شماره تماس",
    contactPhonePlaceholder: "تلفن",
    contactCompanyLabel: "نام برند / شرکت",
    contactCompanyPlaceholder: "شرکت",
    contactServicePlaceholder: "نوع خدمت",
    contactBudgetPlaceholder: "بودجه تقریبی",
    contactPlanLabel: "پلن انتخابی (اختیاری)",
    contactPlanPlaceholder: "پلن انتخابی",
    contactMessageLabel: "درباره پروژه‌تان بگویید *",
    contactMessagePlaceholder: "پیام",
    contactSubmit: "ارسال بریف پروژه",
    contactErrorGeneric: "خطا در ارسال",
    contactErrorNetwork: "خطای شبکه. دوباره تلاش کنید.",
    contactSuccessTitle: "پیام شما رسید! 🎉",
    contactSuccessBody: "تیم آرکا به‌زودی با شما تماس می‌گیرد.",
  },
  en: {
    navHome: "Home",
    navServices: "Services",
    navWork: "Work",
    navIndustries: "Industries",
    navAbout: "About",
    navJournal: "Journal",
    navContact: "Contact",
    ctaStartProject: "Start a Project",
    ctaRequestConsult: "Request a Consultation",
    ctaWatchReel: "Watch 2025 Reel",
    footerFollowUs: "Follow us",
    footerRights: "All rights reserved.",
    footerAdminLogin: "Admin Login",
    footerCtaHeading: "Got an idea?",
    footerCtaBody: "Let's build something worth remembering, together.",
    footerCtaButton: "Send your project brief",
    footerServices: "Services",
    footerIndustries: "Industries",
    footerContact: "Contact",
    filterAll: "All",
    workEmpty: "No projects found in this category.",
    contactNameLabel: "Full name *",
    contactNamePlaceholder: "Name",
    contactEmailLabel: "Email *",
    contactEmailPlaceholder: "Email",
    contactPhoneLabel: "Phone number",
    contactPhonePlaceholder: "Phone",
    contactCompanyLabel: "Brand / company name",
    contactCompanyPlaceholder: "Company",
    contactServicePlaceholder: "Service type",
    contactBudgetPlaceholder: "Estimated budget",
    contactPlanLabel: "Selected plan (optional)",
    contactPlanPlaceholder: "Selected plan",
    contactMessageLabel: "Tell us about your project *",
    contactMessagePlaceholder: "Message",
    contactSubmit: "Send project brief",
    contactErrorGeneric: "Something went wrong",
    contactErrorNetwork: "Network error. Please try again.",
    contactSuccessTitle: "Message received! 🎉",
    contactSuccessBody: "The ARKA team will contact you soon.",
  },
  ar: {
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navWork: "الأعمال",
    navIndustries: "الصناعات",
    navAbout: "من نحن",
    navJournal: "المدونة",
    navContact: "تواصل معنا",
    ctaStartProject: "ابدأ مشروعك",
    ctaRequestConsult: "اطلب استشارة",
    ctaWatchReel: "شاهد عرض ٢٠٢٥",
    footerFollowUs: "تابعنا",
    footerRights: "جميع الحقوق محفوظة.",
    footerAdminLogin: "دخول الإدارة",
    footerCtaHeading: "لديك فكرة؟",
    footerCtaBody: "لنصنع معًا شيئًا يستحق التذكر.",
    footerCtaButton: "أرسل ملخص مشروعك",
    footerServices: "الخدمات",
    footerIndustries: "الصناعات",
    footerContact: "تواصل معنا",
    filterAll: "الكل",
    workEmpty: "لا توجد مشاريع في هذا التصنيف.",
    contactNameLabel: "الاسم الكامل *",
    contactNamePlaceholder: "الاسم",
    contactEmailLabel: "البريد الإلكتروني *",
    contactEmailPlaceholder: "البريد الإلكتروني",
    contactPhoneLabel: "رقم الهاتف",
    contactPhonePlaceholder: "الهاتف",
    contactCompanyLabel: "اسم العلامة / الشركة",
    contactCompanyPlaceholder: "الشركة",
    contactServicePlaceholder: "نوع الخدمة",
    contactBudgetPlaceholder: "الميزانية التقريبية",
    contactPlanLabel: "الخطة المختارة (اختياري)",
    contactPlanPlaceholder: "الخطة المختارة",
    contactMessageLabel: "أخبرنا عن مشروعك *",
    contactMessagePlaceholder: "الرسالة",
    contactSubmit: "إرسال ملخص المشروع",
    contactErrorGeneric: "حدث خطأ أثناء الإرسال",
    contactErrorNetwork: "خطأ في الشبكة. يرجى المحاولة مرة أخرى.",
    contactSuccessTitle: "تم استلام رسالتك! 🎉",
    contactSuccessBody: "سيتواصل معك فريق آركا قريبًا.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export function ui(locale: Locale) {
  return UI[locale];
}
