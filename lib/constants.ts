import type { Department, Role, TaskPriority, TaskStatus } from "@/types";

export const SITE = {
  name: "آرکا",
  nameEn: "ARKA",
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
  desc: string;
  icon: string;
  accent: string;
}

export const DEPARTMENTS: DepartmentDef[] = [
  {
    key: "FILM",
    title: "فیلم و پروداکشن",
    titleEn: "Film & Production",
    desc: "تیزر تبلیغاتی، فیلم صنعتی، موشن‌گرافیک و CGI سینمایی.",
    icon: "Clapperboard",
    accent: "#6699ff",
  },
  {
    key: "DIGITAL",
    title: "دیجیتال مارکتینگ",
    titleEn: "Digital Marketing",
    desc: "پرفورمنس، سئو، کمپین داده‌محور و رشد پایدار برند.",
    icon: "TrendingUp",
    accent: "#a6c9ff",
  },
  {
    key: "DESIGN",
    title: "برندینگ و طراحی",
    titleEn: "Branding & Design",
    desc: "هویت بصری، طراحی وب‌سایت و تجربه کاربری لوکس.",
    icon: "Palette",
    accent: "#7aa6ff",
  },
  {
    key: "STRATEGY",
    title: "استراتژی و محتوا",
    titleEn: "Strategy & Content",
    desc: "پوزیشنینگ، استوری‌تلینگ برند و تولید محتوای هدفمند.",
    icon: "Target",
    accent: "#d3ebfe",
  },
];

/** Static nav mirrors of seeded content (avoids DB calls in header/footer). */
export const SERVICE_LINKS: { slug: string; title: string; department: Department }[] = [
  { slug: "video-production", title: "تولید فیلم و تیزر", department: "FILM" },
  { slug: "photography", title: "عکاسی تبلیغاتی", department: "FILM" },
  { slug: "motion-cgi", title: "موشن‌گرافیک و CGI", department: "FILM" },
  { slug: "web-design", title: "طراحی وب‌سایت", department: "DESIGN" },
  { slug: "branding", title: "برندینگ و هویت", department: "DESIGN" },
  { slug: "ui-ux", title: "طراحی UI/UX", department: "DESIGN" },
  { slug: "digital-marketing", title: "دیجیتال مارکتینگ", department: "DIGITAL" },
  { slug: "seo", title: "سئو و محتوا", department: "DIGITAL" },
  { slug: "social-media", title: "شبکه‌های اجتماعی", department: "DIGITAL" },
  { slug: "brand-strategy", title: "استراتژی برند", department: "STRATEGY" },
];

export const INDUSTRY_LINKS: { slug: string; title: string; icon: string }[] = [
  { slug: "medical", title: "پزشکی و سلامت", icon: "Stethoscope" },
  { slug: "automotive", title: "خودرو", icon: "Car" },
  { slug: "fashion", title: "مد و فشن", icon: "Shirt" },
  { slug: "startups", title: "استارتاپ‌ها", icon: "Rocket" },
  { slug: "real-estate", title: "املاک", icon: "Building2" },
  { slug: "food", title: "رستوران و کافه", icon: "UtensilsCrossed" },
  { slug: "beauty", title: "زیبایی و آرایشی", icon: "Sparkles" },
  { slug: "technology", title: "فناوری و صنعت", icon: "Cpu" },
  { slug: "fintech", title: "مالی و فین‌تک", icon: "Landmark" },
  { slug: "hospitality", title: "گردشگری", icon: "Plane" },
  { slug: "education", title: "آموزش", icon: "GraduationCap" },
  { slug: "retail", title: "خرده‌فروشی", icon: "ShoppingBag" },
];

/** Top-level portfolio filter categories. */
export const WORK_CATEGORIES = [
  "همه",
  "فیلم تبلیغاتی",
  "برندینگ",
  "طراحی وب",
  "دیجیتال مارکتینگ",
  "عکاسی",
  "موشن‌گرافیک",
] as const;

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
