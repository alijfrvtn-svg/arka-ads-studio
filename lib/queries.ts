import { db } from "./db";
import { parseArr } from "./utils";
import { SAMPLE } from "./media";
import { tr, trArr } from "./i18n";
import type { Locale } from "@/types";

// Reusable read queries shared across public pages.

export const getStats = () => db.stat.findMany({ orderBy: { order: "asc" } });

export const getClients = () => db.client.findMany({ orderBy: { order: "asc" } });

export const getFeaturedProjects = (take = 6) =>
  db.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true } } },
    take,
  });

export const getAllProjects = () =>
  db.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true } } },
  });

export const getFeaturedTestimonials = () =>
  db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

export const getServices = () =>
  db.service.findMany({ where: { published: true }, orderBy: { order: "asc" } });

export const getIndustries = () =>
  db.industry.findMany({ where: { published: true }, orderBy: { order: "asc" } });

export const getFeaturedPosts = (take = 3) =>
  db.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: { author: { select: { name: true, avatar: true } } },
    take,
  });

export const getTeam = () =>
  db.teamMember.findMany({ where: { published: true }, orderBy: { order: "asc" } });

// ============================================================
// HOMEPAGE (singleton, id "home") — same in-code-default fallback pattern as
// About/Contact below, seeded from the site's current hardcoded copy.
// ============================================================
export interface HomeContent {
  heroBadge: string;
  heroHeadline: string[];
  heroDescription: string;
  heroCtaLabel: string;
  heroReelLabel: string;
  trustCaption: string;
  departmentsEyebrow: string;
  departmentsHeading: string;
  departmentsHeadingHighlight: string;
  departmentsDescription: string;
  departmentsCtaLabel: string;
  featuredEyebrow: string;
  featuredHeading: string;
  featuredHeadingHighlight: string;
  featuredDescription: string;
  featuredCtaLabel: string;
  workflowEyebrow: string;
  workflowHeading: string;
  workflowHeadingHighlight: string;
  workflowDescription: string;
  workflowSteps: { icon: string; title: string; desc: string }[];
  testimonialsEyebrow: string;
  testimonialsHeading: string;
  testimonialsHeadingHighlight: string;
  finalEyebrow: string;
  finalHeading: string;
  finalHeadingHighlight: string;
  finalDescription: string;
  finalCtaLabel: string;
}

const HOME_DEFAULTS: HomeContent = {
  heroBadge: "استودیوی خلاقیت، پروداکشن و دیجیتال مارکتینگ",
  heroHeadline: ["طراحی کن.", "خلق کن.", "تأثیر بگذار."],
  heroDescription:
    "آرکا یک پروداکشن‌هاوس خلاق است؛ برندها را با هنر بصری سینمایی، راهکارهای دیجیتال و روایت داده‌محور به سطحی تازه می‌رساند.",
  heroCtaLabel: "شروع پروژه",
  heroReelLabel: "تماشای شوریل ۲۰۲۵",
  trustCaption: "اعتماد بیش از ۱۲۰ برند پیشرو",
  departmentsEyebrow: "۴ دپارتمان تخصصی",
  departmentsHeading: "یک تیم، تمام تخصص‌ها",
  departmentsHeadingHighlight: "تمام تخصص‌ها",
  departmentsDescription: "از ایده تا اکران؛ همه‌ی آنچه برای ساختن یک برند متمایز لازم است، زیر یک سقف.",
  departmentsCtaLabel: "کشف خدمات",
  featuredEyebrow: "نمونه‌کارهای منتخب",
  featuredHeading: "کارهایی که حرف می‌زنند",
  featuredHeadingHighlight: "حرف می‌زنند",
  featuredDescription: "هر پروژه، یک داستان است: از چالش تا نتیجه‌ای قابل‌اندازه‌گیری.",
  featuredCtaLabel: "تمام پروژه‌ها",
  workflowEyebrow: "فرایند کار",
  workflowHeading: "مسیری شفاف تا تأثیر واقعی",
  workflowHeadingHighlight: "تأثیر واقعی",
  workflowDescription: "چهار گام روشن که خلاقیت را به نتیجه‌ی تجاری تبدیل می‌کند.",
  workflowSteps: [
    { icon: "Target", title: "کشف و استراتژی", desc: "شناخت عمیق برند، بازار و اهداف؛ ترسیم نقشه‌راه دقیق." },
    { icon: "Sparkles", title: "ایده و کانسپت", desc: "خلق ایده مرکزی و روایتی که برند شما را متمایز می‌کند." },
    { icon: "Clapperboard", title: "تولید و اجرا", desc: "اجرای حرفه‌ای با بالاترین استانداردهای سینمایی و فنی." },
    { icon: "TrendingUp", title: "انتشار و تحلیل", desc: "انتشار چندکاناله و بهینه‌سازی مستمر بر پایه داده." },
  ],
  testimonialsEyebrow: "صدای مشتریان",
  testimonialsHeading: "برندهایی که به ما اعتماد کردند",
  testimonialsHeadingHighlight: "به ما اعتماد کردند",
  finalEyebrow: "آماده‌اید متمایز شوید؟",
  finalHeading: "بیایید برندی بسازیم که فراموش نشود",
  finalHeadingHighlight: "فراموش نشود",
  finalDescription: "یک ایده کافی است. باقی مسیر را با هم می‌سازیم.",
  finalCtaLabel: "شروع پروژه",
};

export async function getHomePage(locale: Locale = "fa"): Promise<HomeContent> {
  const row = await db.homePage.findUnique({ where: { id: "home" } });
  if (!row) return HOME_DEFAULTS;
  const headline = trArr<string>(locale, row.heroHeadline, row.heroHeadlineEn, row.heroHeadlineAr);
  const steps = trArr<{ icon: string; title: string; desc: string }>(
    locale,
    row.workflowSteps,
    row.workflowStepsEn,
    row.workflowStepsAr,
  );
  return {
    heroBadge: tr(locale, row.heroBadge, row.heroBadgeEn, row.heroBadgeAr),
    heroHeadline: headline.length ? headline : HOME_DEFAULTS.heroHeadline,
    heroDescription: tr(locale, row.heroDescription, row.heroDescriptionEn, row.heroDescriptionAr),
    heroCtaLabel: tr(locale, row.heroCtaLabel, row.heroCtaLabelEn, row.heroCtaLabelAr),
    heroReelLabel: tr(locale, row.heroReelLabel, row.heroReelLabelEn, row.heroReelLabelAr),
    trustCaption: tr(locale, row.trustCaption, row.trustCaptionEn, row.trustCaptionAr),
    departmentsEyebrow: tr(locale, row.departmentsEyebrow, row.departmentsEyebrowEn, row.departmentsEyebrowAr),
    departmentsHeading: tr(locale, row.departmentsHeading, row.departmentsHeadingEn, row.departmentsHeadingAr),
    departmentsHeadingHighlight: tr(
      locale,
      row.departmentsHeadingHighlight,
      row.departmentsHeadingHighlightEn,
      row.departmentsHeadingHighlightAr,
    ),
    departmentsDescription: tr(
      locale,
      row.departmentsDescription,
      row.departmentsDescriptionEn,
      row.departmentsDescriptionAr,
    ),
    departmentsCtaLabel: tr(locale, row.departmentsCtaLabel, row.departmentsCtaLabelEn, row.departmentsCtaLabelAr),
    featuredEyebrow: tr(locale, row.featuredEyebrow, row.featuredEyebrowEn, row.featuredEyebrowAr),
    featuredHeading: tr(locale, row.featuredHeading, row.featuredHeadingEn, row.featuredHeadingAr),
    featuredHeadingHighlight: tr(
      locale,
      row.featuredHeadingHighlight,
      row.featuredHeadingHighlightEn,
      row.featuredHeadingHighlightAr,
    ),
    featuredDescription: tr(locale, row.featuredDescription, row.featuredDescriptionEn, row.featuredDescriptionAr),
    featuredCtaLabel: tr(locale, row.featuredCtaLabel, row.featuredCtaLabelEn, row.featuredCtaLabelAr),
    workflowEyebrow: tr(locale, row.workflowEyebrow, row.workflowEyebrowEn, row.workflowEyebrowAr),
    workflowHeading: tr(locale, row.workflowHeading, row.workflowHeadingEn, row.workflowHeadingAr),
    workflowHeadingHighlight: tr(
      locale,
      row.workflowHeadingHighlight,
      row.workflowHeadingHighlightEn,
      row.workflowHeadingHighlightAr,
    ),
    workflowDescription: tr(locale, row.workflowDescription, row.workflowDescriptionEn, row.workflowDescriptionAr),
    workflowSteps: steps.length ? steps : HOME_DEFAULTS.workflowSteps,
    testimonialsEyebrow: tr(locale, row.testimonialsEyebrow, row.testimonialsEyebrowEn, row.testimonialsEyebrowAr),
    testimonialsHeading: tr(locale, row.testimonialsHeading, row.testimonialsHeadingEn, row.testimonialsHeadingAr),
    testimonialsHeadingHighlight: tr(
      locale,
      row.testimonialsHeadingHighlight,
      row.testimonialsHeadingHighlightEn,
      row.testimonialsHeadingHighlightAr,
    ),
    finalEyebrow: tr(locale, row.finalEyebrow, row.finalEyebrowEn, row.finalEyebrowAr),
    finalHeading: tr(locale, row.finalHeading, row.finalHeadingEn, row.finalHeadingAr),
    finalHeadingHighlight: tr(locale, row.finalHeadingHighlight, row.finalHeadingHighlightEn, row.finalHeadingHighlightAr),
    finalDescription: tr(locale, row.finalDescription, row.finalDescriptionEn, row.finalDescriptionAr),
    finalCtaLabel: tr(locale, row.finalCtaLabel, row.finalCtaLabelEn, row.finalCtaLabelAr),
  };
}

// ============================================================
// ABOUT PAGE (singleton, id "about") — falls back to these in-code defaults
// (the site's current content) until an admin saves the page for the first
// time, so a fresh deploy never shows a blank/empty page.
// ============================================================
export interface AboutContent {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  storyEyebrow: string;
  storyHeading: string;
  storyParagraphs: string[];
  storyVideo: string;
  storyPoster: string;
  valuesEyebrow: string;
  valuesHeading: string;
  values: { icon: string; title: string; desc: string }[];
  teamEyebrow: string;
  teamHeading: string;
  timelineEyebrow: string;
  timelineHeading: string;
  timeline: { year: string; title: string; desc: string }[];
  galleryEyebrow: string;
  galleryHeading: string;
  galleryVideo: string;
  galleryPoster: string;
  galleryImages: string[];
  metaTitle: string;
  metaDescription: string;
}

const ABOUT_DEFAULTS: AboutContent = {
  heroEyebrow: "درباره آرکا",
  heroTitle: "ذهن‌های پشتِ جادو",
  heroTitleHighlight: "جادو",
  heroDescription:
    "ما فقط محتوا نمی‌سازیم؛ برای برندها روایت می‌سازیم، تجربه خلق می‌کنیم و تأثیر می‌گذاریم.",
  storyEyebrow: "داستان ما",
  storyHeading: "یک پروداکشن‌هاوس، نه صرفاً یک آژانس",
  storyParagraphs: [
    "آرکا در سال ۱۳۹۶ با این باور متولد شد که برندهای بزرگ با روایت‌های بزرگ ساخته می‌شوند. ما ترکیبی از هنر سینما، تفکر استراتژیک و داده هستیم.",
    "امروز، تیمی چندتخصصی از کارگردان، طراح، استراتژیست و بازاریاب، زیر یک سقف گرد آمده‌اند تا مشکلات واقعی برندها را حل کنند.",
  ],
  storyVideo: SAMPLE.reels[0],
  storyPoster: SAMPLE.bts[0],
  valuesEyebrow: "ارزش‌ها",
  valuesHeading: "آنچه ما را متمایز می‌کند",
  values: [
    { icon: "Target", title: "استراتژی‌محور", desc: "هر تصمیم خلاقانه ریشه در داده و هدف دارد." },
    { icon: "Gem", title: "کیفیت بی‌سازش", desc: "استانداردهای سینمایی در هر فریم و پیکسل." },
    { icon: "Zap", title: "سرعت و چابکی", desc: "تحویل به‌موقع بدون قربانی‌کردن کیفیت." },
    { icon: "Sparkles", title: "خلاقیت بی‌مرز", desc: "ایده‌هایی که مرزها را جابه‌جا می‌کنند." },
  ],
  teamEyebrow: "تیم",
  teamHeading: "ذهن‌های خلاق آرکا",
  timelineEyebrow: "مسیر رشد",
  timelineHeading: "سفر آرکا در یک نگاه",
  timeline: [
    { year: "۱۳۹۶", title: "تولد آرکا", desc: "با یک دوربین و یک رؤیا، کار را آغاز کردیم." },
    { year: "۱۳۹۸", title: "اولین کمپین ملی", desc: "نخستین برندفیلمی که در تلویزیون ملی پخش شد." },
    { year: "۱۴۰۰", title: "دپارتمان دیجیتال", desc: "افزودن پرفورمنس مارکتینگ و سئو به خدمات." },
    { year: "۱۴۰۲", title: "جوایز خلاقیت", desc: "کسب چند جایزه ملی و بین‌المللی طراحی." },
    { year: "۱۴۰۴", title: "بیش از ۴۸۰ پروژه", desc: "همراهی با ۱۲۰ برند در ۱۲ صنعت مختلف." },
  ],
  galleryEyebrow: "پشت صحنه",
  galleryHeading: "جادو چگونه ساخته می‌شود",
  galleryVideo: SAMPLE.reels[1],
  galleryPoster: SAMPLE.bts[1],
  galleryImages: SAMPLE.bts.slice(2, 4),
  metaTitle: "درباره ما",
  metaDescription: "آرکا؛ تیمی از ذهن‌های خلاق که برندها را با روایت بصری سینمایی متحول می‌کنند.",
};

export async function getAboutPage(locale: Locale = "fa"): Promise<AboutContent> {
  const row = await db.aboutPage.findUnique({ where: { id: "about" } });
  if (!row) return ABOUT_DEFAULTS;
  return {
    heroEyebrow: tr(locale, row.heroEyebrow, row.heroEyebrowEn, row.heroEyebrowAr),
    heroTitle: tr(locale, row.heroTitle, row.heroTitleEn, row.heroTitleAr),
    heroTitleHighlight: tr(locale, row.heroTitleHighlight, row.heroTitleHighlightEn, row.heroTitleHighlightAr),
    heroDescription: tr(locale, row.heroDescription, row.heroDescriptionEn, row.heroDescriptionAr),
    storyEyebrow: tr(locale, row.storyEyebrow, row.storyEyebrowEn, row.storyEyebrowAr),
    storyHeading: tr(locale, row.storyHeading, row.storyHeadingEn, row.storyHeadingAr),
    storyParagraphs: trArr<string>(locale, row.storyParagraphs, row.storyParagraphsEn, row.storyParagraphsAr),
    storyVideo: row.storyVideo || ABOUT_DEFAULTS.storyVideo,
    storyPoster: row.storyPoster || ABOUT_DEFAULTS.storyPoster,
    valuesEyebrow: tr(locale, row.valuesEyebrow, row.valuesEyebrowEn, row.valuesEyebrowAr),
    valuesHeading: tr(locale, row.valuesHeading, row.valuesHeadingEn, row.valuesHeadingAr),
    values: trArr(locale, row.values, row.valuesEn, row.valuesAr),
    teamEyebrow: tr(locale, row.teamEyebrow, row.teamEyebrowEn, row.teamEyebrowAr),
    teamHeading: tr(locale, row.teamHeading, row.teamHeadingEn, row.teamHeadingAr),
    timelineEyebrow: tr(locale, row.timelineEyebrow, row.timelineEyebrowEn, row.timelineEyebrowAr),
    timelineHeading: tr(locale, row.timelineHeading, row.timelineHeadingEn, row.timelineHeadingAr),
    timeline: trArr(locale, row.timeline, row.timelineEn, row.timelineAr),
    galleryEyebrow: tr(locale, row.galleryEyebrow, row.galleryEyebrowEn, row.galleryEyebrowAr),
    galleryHeading: tr(locale, row.galleryHeading, row.galleryHeadingEn, row.galleryHeadingAr),
    galleryVideo: row.galleryVideo || ABOUT_DEFAULTS.galleryVideo,
    galleryPoster: row.galleryPoster || ABOUT_DEFAULTS.galleryPoster,
    galleryImages: parseArr<string>(row.galleryImages),
    metaTitle: tr(locale, row.metaTitle || ABOUT_DEFAULTS.metaTitle, row.metaTitleEn, row.metaTitleAr),
    metaDescription: tr(
      locale,
      row.metaDescription || ABOUT_DEFAULTS.metaDescription,
      row.metaDescriptionEn,
      row.metaDescriptionAr,
    ),
  };
}

// ============================================================
// CONTACT PAGE (singleton, id "contact") — same fallback pattern as About.
// ============================================================
export interface ContactContent {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleHighlight: string;
  heroDescription: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  officeHours: string;
  mapLat: number;
  mapLng: number;
  socials: { platform: string; href: string; label: string }[];
  serviceOptions: string[];
  budgetOptions: string[];
  metaTitle: string;
  metaDescription: string;
}

const CONTACT_DEFAULTS: ContactContent = {
  heroEyebrow: "تماس",
  heroTitle: "بیایید شروع کنیم",
  heroTitleHighlight: "شروع کنیم",
  heroDescription: "ایده‌ای در سر دارید؟ فرم را پر کنید یا مستقیم با ما در ارتباط باشید.",
  address: "تهران، خیابان ولیعصر، برج آرکا، طبقه ۱۲",
  phone: "+982188000000",
  phoneDisplay: "۰۲۱ ۸۸۰۰ ۰۰۰۰",
  email: "hello@arka.studio",
  officeHours: "شنبه تا چهارشنبه، ۹ تا ۱۸",
  mapLat: 35.7448,
  mapLng: 51.4101,
  socials: [
    { platform: "instagram", href: "https://instagram.com/arka.studio", label: "اینستاگرام" },
    { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "لینکدین" },
    { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "یوتیوب" },
    { platform: "aparat", href: "https://aparat.com/arka.studio", label: "آپارات" },
    { platform: "telegram", href: "https://t.me/arka_studio", label: "تلگرام" },
  ],
  serviceOptions: ["فیلم و تیزر", "عکاسی", "برندینگ", "طراحی وب", "دیجیتال مارکتینگ", "سایر"],
  budgetOptions: ["زیر ۵۰ میلیون", "۵۰ تا ۱۵۰ میلیون", "۱۵۰ تا ۳۰۰ میلیون", "بالای ۳۰۰ میلیون"],
  metaTitle: "تماس با ما",
  metaDescription: "بریف پروژه‌تان را بفرستید یا با تیم آرکا در تهران تماس بگیرید.",
};

export async function getContactPage(locale: Locale = "fa"): Promise<ContactContent> {
  const row = await db.contactPage.findUnique({ where: { id: "contact" } });
  if (!row) return CONTACT_DEFAULTS;
  return {
    heroEyebrow: tr(locale, row.heroEyebrow, row.heroEyebrowEn, row.heroEyebrowAr),
    heroTitle: tr(locale, row.heroTitle, row.heroTitleEn, row.heroTitleAr),
    heroTitleHighlight: tr(locale, row.heroTitleHighlight, row.heroTitleHighlightEn, row.heroTitleHighlightAr),
    heroDescription: tr(locale, row.heroDescription, row.heroDescriptionEn, row.heroDescriptionAr),
    address: tr(locale, row.address, row.addressEn, row.addressAr),
    phone: row.phone,
    phoneDisplay: tr(locale, row.phoneDisplay, row.phoneDisplayEn, row.phoneDisplayAr),
    email: row.email,
    officeHours: tr(locale, row.officeHours, row.officeHoursEn, row.officeHoursAr),
    mapLat: row.mapLat,
    mapLng: row.mapLng,
    socials: trArr(locale, row.socials, row.socialsEn, row.socialsAr),
    serviceOptions: trArr<string>(locale, row.serviceOptions, row.serviceOptionsEn, row.serviceOptionsAr),
    budgetOptions: trArr<string>(locale, row.budgetOptions, row.budgetOptionsEn, row.budgetOptionsAr),
    metaTitle: tr(locale, row.metaTitle || CONTACT_DEFAULTS.metaTitle, row.metaTitleEn, row.metaTitleAr),
    metaDescription: tr(
      locale,
      row.metaDescription || CONTACT_DEFAULTS.metaDescription,
      row.metaDescriptionEn,
      row.metaDescriptionAr,
    ),
  };
}
