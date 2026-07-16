import { db } from "./db";
import { parseArr } from "./utils";
import { SAMPLE } from "./media";

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

export async function getHomePage(): Promise<HomeContent> {
  const row = await db.homePage.findUnique({ where: { id: "home" } });
  if (!row) return HOME_DEFAULTS;
  const headline = parseArr<string>(row.heroHeadline);
  const steps = parseArr<{ icon: string; title: string; desc: string }>(row.workflowSteps);
  return {
    heroBadge: row.heroBadge,
    heroHeadline: headline.length ? headline : HOME_DEFAULTS.heroHeadline,
    heroDescription: row.heroDescription,
    heroCtaLabel: row.heroCtaLabel,
    heroReelLabel: row.heroReelLabel,
    trustCaption: row.trustCaption,
    departmentsEyebrow: row.departmentsEyebrow,
    departmentsHeading: row.departmentsHeading,
    departmentsHeadingHighlight: row.departmentsHeadingHighlight,
    departmentsDescription: row.departmentsDescription,
    departmentsCtaLabel: row.departmentsCtaLabel,
    featuredEyebrow: row.featuredEyebrow,
    featuredHeading: row.featuredHeading,
    featuredHeadingHighlight: row.featuredHeadingHighlight,
    featuredDescription: row.featuredDescription,
    featuredCtaLabel: row.featuredCtaLabel,
    workflowEyebrow: row.workflowEyebrow,
    workflowHeading: row.workflowHeading,
    workflowHeadingHighlight: row.workflowHeadingHighlight,
    workflowDescription: row.workflowDescription,
    workflowSteps: steps.length ? steps : HOME_DEFAULTS.workflowSteps,
    testimonialsEyebrow: row.testimonialsEyebrow,
    testimonialsHeading: row.testimonialsHeading,
    testimonialsHeadingHighlight: row.testimonialsHeadingHighlight,
    finalEyebrow: row.finalEyebrow,
    finalHeading: row.finalHeading,
    finalHeadingHighlight: row.finalHeadingHighlight,
    finalDescription: row.finalDescription,
    finalCtaLabel: row.finalCtaLabel,
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

export async function getAboutPage(): Promise<AboutContent> {
  const row = await db.aboutPage.findUnique({ where: { id: "about" } });
  if (!row) return ABOUT_DEFAULTS;
  return {
    heroEyebrow: row.heroEyebrow,
    heroTitle: row.heroTitle,
    heroTitleHighlight: row.heroTitleHighlight,
    heroDescription: row.heroDescription,
    storyEyebrow: row.storyEyebrow,
    storyHeading: row.storyHeading,
    storyParagraphs: parseArr<string>(row.storyParagraphs),
    storyVideo: row.storyVideo || ABOUT_DEFAULTS.storyVideo,
    storyPoster: row.storyPoster || ABOUT_DEFAULTS.storyPoster,
    valuesEyebrow: row.valuesEyebrow,
    valuesHeading: row.valuesHeading,
    values: parseArr(row.values),
    teamEyebrow: row.teamEyebrow,
    teamHeading: row.teamHeading,
    timelineEyebrow: row.timelineEyebrow,
    timelineHeading: row.timelineHeading,
    timeline: parseArr(row.timeline),
    galleryEyebrow: row.galleryEyebrow,
    galleryHeading: row.galleryHeading,
    galleryVideo: row.galleryVideo || ABOUT_DEFAULTS.galleryVideo,
    galleryPoster: row.galleryPoster || ABOUT_DEFAULTS.galleryPoster,
    galleryImages: parseArr<string>(row.galleryImages),
    metaTitle: row.metaTitle || ABOUT_DEFAULTS.metaTitle,
    metaDescription: row.metaDescription || ABOUT_DEFAULTS.metaDescription,
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

export async function getContactPage(): Promise<ContactContent> {
  const row = await db.contactPage.findUnique({ where: { id: "contact" } });
  if (!row) return CONTACT_DEFAULTS;
  return {
    heroEyebrow: row.heroEyebrow,
    heroTitle: row.heroTitle,
    heroTitleHighlight: row.heroTitleHighlight,
    heroDescription: row.heroDescription,
    address: row.address,
    phone: row.phone,
    phoneDisplay: row.phoneDisplay,
    email: row.email,
    officeHours: row.officeHours,
    mapLat: row.mapLat,
    mapLng: row.mapLng,
    socials: parseArr(row.socials),
    serviceOptions: parseArr<string>(row.serviceOptions),
    budgetOptions: parseArr<string>(row.budgetOptions),
    metaTitle: row.metaTitle || CONTACT_DEFAULTS.metaTitle,
    metaDescription: row.metaDescription || CONTACT_DEFAULTS.metaDescription,
  };
}
