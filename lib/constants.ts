import type { Department, Role, TaskPriority, TaskStatus } from "@/types";

export const SITE = {
  name: "آرکا",
  nameEn: "ARKA",
  // Kept for structured data, where the registered entity name is the
  // correct value. Nothing on the page prints it any more — the visible
  // copyright is just "ARKA", per the brand change.
  legalName: "ARKA Digital Marketing",
  tagline: "دیجیتال مارکتینگ",
  positioning: "استودیو خلاقیت، پروداکشن و دیجیتال مارکتینگ",
  slogan: "طراحی کن. خلق کن. تأثیر بگذار.",
  sloganEn: "Design. Create. Impact.",
  description:
    "آرکا یک پروداکشن‌هاوس خلاق و استودیوی دیجیتال مارکتینگ است؛ جایی که هنرهای بصری سطح‌بالا، راهکارهای دیجیتال و روایت داده‌محور به هم می‌رسند تا برندها را متمایز کنند.",
  descriptionEn:
    "ARKA is a cinematic creative production house & digital marketing studio elevating brands through high-end visual arts, digital solutions and data-driven storytelling.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100",
  email: "hello@arka.studio",
  phone: "+982188000000",
  phoneDisplay: "۰۲۱ ۸۸۰۰ ۰۰۰۰",
  address: "تهران، خیابان ولیعصر، برج آرکا، طبقه ۱۲",
  addressEn: "Arka Tower, Valiasr St, Tehran, Iran",
  founded: 2017,
  mapCoords: { lat: 35.7448, lng: 51.4101 },
  socials: [
    { platform: "instagram", href: "https://instagram.com/arka.studio", label: "اینستاگرام" },
    { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "لینکدین" },
    { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "یوتیوب" },
    { platform: "aparat", href: "https://aparat.com/arka.studio", label: "آپارات" },
    { platform: "telegram", href: "https://t.me/arka_studio", label: "تلگرام" },
  ],
} as const;

export interface NavItem {
  label: string;
  href: string;
  desc?: string;
}

export const NAV: NavItem[] = [
  { label: "خانه", href: "/" },
  { label: "خدمات", href: "/services", desc: "ده سرویس تخصصی خلاقیت و دیجیتال" },
  { label: "نمونه‌کارها", href: "/work", desc: "کیس‌استادی‌ها و پروژه‌های شاخص" },
  { label: "صنایع", href: "/industries", desc: "راهکار اختصاصی برای ۱۲ صنعت" },
  { label: "درباره ما", href: "/about", desc: "ذهن‌های پشت جادو" },
  { label: "ژورنال", href: "/journal", desc: "بینش، ترند و مطالعه موردی" },
  { label: "تماس", href: "/contact", desc: "بریف پروژه‌ات را بفرست" },
];

export interface DepartmentDef {
  key: Department;
  title: string;
  titleEn: string;
  titleAr: string;
  desc: string;
  descEn: string;
  descAr: string;
  icon: string;
  accent: string;
}

/**
 * The four service departments.
 *
 * Order is meaningful: it is the order the homepage hero steps through, and it
 * matches the four blocks of seven services below. The `key` values are the
 * original enum strings (FILM/DIGITAL/DESIGN/STRATEGY) and are deliberately
 * left alone — every Service row stores one, so renaming a key would orphan
 * the lot. Only the labels moved, to describe what each department actually
 * contains: FILM is photography, DIGITAL is web and SEO.
 */
/**
 * Poster artwork behind each department card on the homepage.
 *
 * Keyed by department id rather than stored on the Category row: there are
 * exactly four departments and they are fixed, so a lookup here is simpler than
 * a schema migration plus an upload field. To swap one, drop a replacement at
 * the same path — the files are 4:5, which is the ratio the card is built to.
 *
 * A department with no entry falls back to a plain card, so this can never be
 * the reason a department stops rendering.
 */
/**
 * Paint colours behind the industry rows on the homepage accordion.
 *
 * The coral and the gold are the client's own values. The blue and the violet
 * are read off the artwork they supplied and are the two worth confirming.
 *
 * They are also chosen to be *legible*, which narrowed the options: the row is
 * a solid block of this colour with the label straight on top, so each hex has
 * to win against either black or white. A medium violet at #8B5CF6 reaches only
 * 4.46:1 against ink and 4.23:1 against white — it fails both ways — so the
 * violet here is a step deeper, which clears 5.7:1 in white while still reading
 * as the violet in the artwork.
 *
 * Nothing downstream hardcodes which label colour goes with which row:
 * `labelOn()` picks whichever of ink/white wins for the hex, so correcting a
 * colour here cannot silently produce unreadable text.
 */
export const INDUSTRY_PAINT = ["#FF6B5B", "#2B56D6", "#FFB902", "#7C3AED"] as const;

/**
 * Which colour each of the twelve rows gets.
 *
 * Three rows per colour, and no colour ever touches itself — the brief. A plain
 * 0,1,2,3 cycle would satisfy both and look like a repeating stripe, so the
 * order is shuffled while keeping the count exactly three each:
 *
 *   0 1 2 3 1 0 3 2 0 3 1 2
 *
 * Index into INDUSTRY_PAINT; rows beyond twelve wrap, so adding a thirteenth
 * industry still gets a colour rather than nothing.
 */
export const INDUSTRY_PAINT_ORDER = [0, 1, 2, 3, 1, 0, 3, 2, 0, 3, 1, 2] as const;

export const DEPARTMENT_POSTER: Record<string, string> = {
  DESIGN: "/departments/design.webp",
  FILM: "/departments/film.webp",
  DIGITAL: "/departments/digital.webp",
  STRATEGY: "/departments/strategy.webp",
};

export const DEPARTMENTS: DepartmentDef[] = [
  {
    key: "DESIGN",
    title: "برندینگ و طراحی گرافیک",
    titleEn: "Branding & Graphic Design",
    titleAr: "العلامة التجارية والتصميم الجرافيكي",
    desc: "لوگو، تایپوگرافی، هویت بصری، کتاب برند و طراحی بسته‌بندی و تبلیغات.",
    descEn: "Logo, typography, visual identity, brand book, packaging and advertising design.",
    descAr: "الشعار، الطباعة، الهوية البصرية، دليل العلامة، التغليف وتصميم الإعلانات.",
    icon: "Palette",
    accent: "#111111",
  },
  {
    key: "FILM",
    title: "عکاسی و تصویربرداری",
    titleEn: "Photography & Imaging",
    titleAr: "التصوير الفوتوغرافي",
    desc: "عکاسی محصول، صنعتی، تبلیغاتی، لایف‌استایل، غذا، معماری و پرتره سازمانی.",
    descEn: "Product, industrial, advertising, lifestyle, food, architecture and corporate portrait photography.",
    descAr: "تصوير المنتجات والصناعي والإعلاني ونمط الحياة والطعام والعمارة والبورتريه المؤسسي.",
    icon: "Camera",
    accent: "#111111",
  },
  {
    key: "DIGITAL",
    title: "طراحی وب و سئو",
    titleEn: "Web Design & SEO",
    titleAr: "تصميم الويب وتحسين محركات البحث",
    desc: "رابط و تجربه کاربری، توسعه وب‌سایت و سئوی تکنیکال، محتوایی و محلی.",
    descEn: "UI and UX design, web development, and technical, content and local SEO.",
    descAr: "تصميم واجهة وتجربة المستخدم، تطوير المواقع، والسيو التقني والمحتوائي والمحلي.",
    icon: "Monitor",
    accent: "#111111",
  },
  {
    key: "STRATEGY",
    title: "مارکتینگ و استراتژی محتوا",
    titleEn: "Marketing & Content Strategy",
    titleAr: "التسويق واستراتيجية المحتوى",
    desc: "استراتژی دیجیتال، مدیریت شبکه‌های اجتماعی، کپی‌رایتینگ، کمپین و پرفورمنس.",
    descEn: "Digital strategy, social media management, copywriting, campaigns and performance marketing.",
    descAr: "الاستراتيجية الرقمية، إدارة وسائل التواصل، كتابة المحتوى، الحملات وتسويق الأداء.",
    icon: "TrendingUp",
    accent: "#111111",
  },
];

/** Top-level portfolio filter categories (Persian is canonical — matches `Project.category`). */
export const WORK_CATEGORIES = [
  "همه",
  "فیلم تبلیغاتی",
  "برندینگ",
  "طراحی وب",
  "دیجیتال مارکتینگ",
  "عکاسی",
  "موشن‌گرافیک",
] as const;

/** en/ar labels for `WORK_CATEGORIES`, keyed by the canonical Persian value. */
export const WORK_CATEGORY_LABELS: Record<string, { en: string; ar: string }> = {
  "همه": { en: "All", ar: "الكل" },
  "فیلم تبلیغاتی": { en: "Ad Film", ar: "فيلم إعلاني" },
  "برندینگ": { en: "Branding", ar: "العلامة التجارية" },
  "طراحی وب": { en: "Web Design", ar: "تصميم المواقع" },
  "دیجیتال مارکتینگ": { en: "Digital Marketing", ar: "التسويق الرقمي" },
  "عکاسی": { en: "Photography", ar: "التصوير" },
  "موشن‌گرافیک": { en: "Motion Graphics", ar: "الموشن غرافيك" },
};

/** Delivery state of a portfolio project (`Project.status`). The dot colour is
 *  never the only signal — every surface pairs it with the label — so the
 *  distinction survives colour blindness and greyscale printing. */
export const PROJECT_STATUSES = [
  { value: "DONE", label: "انجام‌شده", labelEn: "Completed", labelAr: "مكتمل", color: "#34d399" },
  { value: "IN_PROGRESS", label: "در حال اجرا", labelEn: "In progress", labelAr: "قيد التنفيذ", color: "#f59e0b" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]["value"];

export const projectStatus = (value: string) =>
  PROJECT_STATUSES.find((s) => s.value === value) ?? PROJECT_STATUSES[0];

// ————— RBAC —————

export const ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "SUPER_ADMIN", label: "مدیر ارشد", desc: "دسترسی کامل به تمام بخش‌ها" },
  { value: "ADMIN", label: "مدیر", desc: "مدیریت محتوا، کاربران و تنظیمات" },
  { value: "EDITOR", label: "ویرایشگر", desc: "مدیریت نمونه‌کار، خدمات و رسانه" },
  { value: "AUTHOR", label: "نویسنده", desc: "نگارش و انتشار مطالب ژورنال" },
  { value: "VIEWER", label: "بازدیدکننده", desc: "فقط مشاهده داشبورد و گزارش‌ها" },
  { value: "STAFF", label: "پرسنل", desc: "دسترسی فقط به پنل کاربران و تسک‌های شخصی" },
];

export interface PermissionDef {
  key: string;
  label: string;
  group: string;
}

export const PERMISSIONS: PermissionDef[] = [
  { key: "dashboard.view", label: "مشاهده داشبورد", group: "عمومی" },
  { key: "portfolio.view", label: "مشاهده نمونه‌کار", group: "نمونه‌کار" },
  { key: "portfolio.manage", label: "مدیریت نمونه‌کار", group: "نمونه‌کار" },
  { key: "services.manage", label: "مدیریت خدمات", group: "خدمات" },
  { key: "industries.manage", label: "مدیریت صنایع", group: "صنایع" },
  { key: "blog.view", label: "مشاهده ژورنال", group: "ژورنال" },
  { key: "blog.manage", label: "مدیریت ژورنال", group: "ژورنال" },
  { key: "media.manage", label: "مدیریت رسانه", group: "رسانه" },
  { key: "clients.manage", label: "مدیریت مشتریان (CRM)", group: "مشتریان" },
  { key: "testimonials.manage", label: "مدیریت نظرات", group: "مشتریان" },
  { key: "leads.view", label: "مشاهده سرنخ‌ها", group: "فروش" },
  { key: "leads.manage", label: "مدیریت سرنخ‌ها", group: "فروش" },
  { key: "seo.manage", label: "مدیریت سئو", group: "سئو" },
  { key: "users.manage", label: "مدیریت کاربران و نقش‌ها", group: "سیستم" },
  { key: "settings.manage", label: "مدیریت تنظیمات", group: "سیستم" },
  { key: "tasks.view", label: "مشاهده تسک‌ها", group: "تسک‌ها" },
  { key: "tasks.manage", label: "مدیریت تسک‌ها", group: "تسک‌ها" },
  { key: "home.manage", label: "مدیریت صفحه اصلی", group: "صفحات" },
  { key: "about.manage", label: "مدیریت صفحه درباره ما", group: "صفحات" },
  { key: "contact.manage", label: "مدیریت صفحه تماس", group: "صفحات" },
  { key: "team.manage", label: "مدیریت تیم", group: "صفحات" },
];

/** Default permission sets per role (SUPER_ADMIN gets everything via wildcard). */
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ["*"],
  ADMIN: [
    "dashboard.view",
    "portfolio.view",
    "portfolio.manage",
    "services.manage",
    "industries.manage",
    "blog.view",
    "blog.manage",
    "media.manage",
    "clients.manage",
    "testimonials.manage",
    "leads.view",
    "leads.manage",
    "seo.manage",
    "settings.manage",
    "tasks.view",
    "tasks.manage",
    "home.manage",
    "about.manage",
    "contact.manage",
    "team.manage",
  ],
  EDITOR: [
    "dashboard.view",
    "portfolio.view",
    "portfolio.manage",
    "services.manage",
    "industries.manage",
    "media.manage",
    "blog.view",
    "seo.manage",
  ],
  AUTHOR: ["dashboard.view", "blog.view", "blog.manage", "media.manage"],
  VIEWER: ["dashboard.view", "portfolio.view", "blog.view", "leads.view"],
  // STAFF only ever uses /portal — zero CMS permissions, even via overrides (defense in depth; middleware is the real gate).
  STAFF: [],
};

// ————— Tasks —————

export const TASK_STATUSES: { value: TaskStatus; label: string; color: string }[] = [
  { value: "TODO", label: "در انتظار", color: "#6699ff" },
  { value: "IN_PROGRESS", label: "در حال انجام", color: "#f59e0b" },
  { value: "DONE", label: "انجام‌شده", color: "#34d399" },
  { value: "CANCELLED", label: "لغوشده", color: "#fb7185" },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string; color: string }[] = [
  { value: "LOW", label: "کم", color: "#94a3b8" },
  { value: "MEDIUM", label: "متوسط", color: "#6699ff" },
  { value: "HIGH", label: "بالا", color: "#f59e0b" },
  { value: "URGENT", label: "فوری", color: "#fb7185" },
];
