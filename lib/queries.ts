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
    include: { client: { select: { name: true, nameEn: true } } },
    take,
  });

export const getAllProjects = () =>
  db.project.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { name: true, nameEn: true } } },
  });

export const getFeaturedTestimonials = () =>
  db.testimonial.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { client: { select: { nameEn: true } } },
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

const HOME_DEFAULTS_EN: HomeContent = {
  heroBadge: "Creative, Production & Digital Marketing Studio",
  heroHeadline: ["Design.", "Create.", "Impact."],
  heroDescription:
    "ARKA is a creative production house — elevating brands through cinematic visual art, digital solutions, and data-driven storytelling.",
  heroCtaLabel: "Start a Project",
  heroReelLabel: "Watch the 2025 Reel",
  trustCaption: "Trusted by 120+ leading brands",
  departmentsEyebrow: "4 Specialized Departments",
  departmentsHeading: "One Team, Every Expertise",
  departmentsHeadingHighlight: "Every Expertise",
  departmentsDescription: "From idea to screen — everything needed to build a distinctive brand, under one roof.",
  departmentsCtaLabel: "Explore Services",
  featuredEyebrow: "Selected Work",
  featuredHeading: "Work That Speaks for Itself",
  featuredHeadingHighlight: "Speaks for Itself",
  featuredDescription: "Every project is a story: from challenge to a measurable result.",
  featuredCtaLabel: "All Projects",
  workflowEyebrow: "Our Process",
  workflowHeading: "A Clear Path to Real Impact",
  workflowHeadingHighlight: "Real Impact",
  workflowDescription: "Four clear steps that turn creativity into business results.",
  workflowSteps: [
    { icon: "Target", title: "Discovery & Strategy", desc: "A deep understanding of your brand, market and goals; charting a precise roadmap." },
    { icon: "Sparkles", title: "Idea & Concept", desc: "Creating the central idea and narrative that sets your brand apart." },
    { icon: "Clapperboard", title: "Production & Execution", desc: "Professional execution with the highest cinematic and technical standards." },
    { icon: "TrendingUp", title: "Release & Analysis", desc: "Multi-channel release and continuous data-driven optimization." },
  ],
  testimonialsEyebrow: "Client Voices",
  testimonialsHeading: "Brands That Trusted Us",
  testimonialsHeadingHighlight: "Trusted Us",
  finalEyebrow: "Ready to Stand Out?",
  finalHeading: "Let's Build a Brand That's Unforgettable",
  finalHeadingHighlight: "Unforgettable",
  finalDescription: "One idea is enough. We'll build the rest of the journey together.",
  finalCtaLabel: "Start a Project",
};

const HOME_DEFAULTS_AR: HomeContent = {
  heroBadge: "استوديو الإبداع والإنتاج والتسويق الرقمي",
  heroHeadline: ["صمّم.", "ابتكر.", "أثّر."],
  heroDescription:
    "آركا هي دار إنتاج إبداعية؛ ترتقي بالعلامات التجارية من خلال الفن البصري السينمائي والحلول الرقمية والسرد القائم على البيانات.",
  heroCtaLabel: "ابدأ مشروعك",
  heroReelLabel: "شاهد عرض 2025",
  trustCaption: "تثق بنا أكثر من 120 علامة تجارية رائدة",
  departmentsEyebrow: "4 أقسام متخصصة",
  departmentsHeading: "فريق واحد، كل الخبرات",
  departmentsHeadingHighlight: "كل الخبرات",
  departmentsDescription: "من الفكرة إلى الشاشة؛ كل ما تحتاجه لبناء علامة تجارية متميزة، تحت سقف واحد.",
  departmentsCtaLabel: "استكشف الخدمات",
  featuredEyebrow: "أعمال مختارة",
  featuredHeading: "أعمال تتحدث عن نفسها",
  featuredHeadingHighlight: "تتحدث عن نفسها",
  featuredDescription: "كل مشروع قصة: من التحدي إلى نتيجة قابلة للقياس.",
  featuredCtaLabel: "جميع المشاريع",
  workflowEyebrow: "عملية العمل",
  workflowHeading: "مسار واضح نحو تأثير حقيقي",
  workflowHeadingHighlight: "تأثير حقيقي",
  workflowDescription: "أربع خطوات واضحة تحوّل الإبداع إلى نتائج تجارية.",
  workflowSteps: [
    { icon: "Target", title: "الاكتشاف والاستراتيجية", desc: "فهم عميق لعلامتك التجارية والسوق والأهداف؛ ورسم خارطة طريق دقيقة." },
    { icon: "Sparkles", title: "الفكرة والمفهوم", desc: "ابتكار الفكرة المحورية والسرد الذي يميز علامتك التجارية." },
    { icon: "Clapperboard", title: "الإنتاج والتنفيذ", desc: "تنفيذ احترافي بأعلى المعايير السينمائية والتقنية." },
    { icon: "TrendingUp", title: "الإطلاق والتحليل", desc: "إطلاق متعدد القنوات وتحسين مستمر قائم على البيانات." },
  ],
  testimonialsEyebrow: "أصوات العملاء",
  testimonialsHeading: "علامات تجارية وثقت بنا",
  testimonialsHeadingHighlight: "وثقت بنا",
  finalEyebrow: "هل أنت مستعد للتميز؟",
  finalHeading: "لنبنِ معًا علامة تجارية لا تُنسى",
  finalHeadingHighlight: "لا تُنسى",
  finalDescription: "فكرة واحدة تكفي. سنبني بقية الطريق معًا.",
  finalCtaLabel: "ابدأ مشروعك",
};

const HOME_DEFAULTS_BY_LOCALE: Record<Locale, HomeContent> = { fa: HOME_DEFAULTS, en: HOME_DEFAULTS_EN, ar: HOME_DEFAULTS_AR };

export async function getHomePage(locale: Locale = "fa"): Promise<HomeContent> {
  const row = await db.homePage.findUnique({ where: { id: "home" } });
  if (!row) return HOME_DEFAULTS_BY_LOCALE[locale];
  const headline = trArr<string>(locale, row.heroHeadline, row.heroHeadlineEn, row.heroHeadlineAr);
  const steps = trArr<{ icon: string; title: string; desc: string }>(
    locale,
    row.workflowSteps,
    row.workflowStepsEn,
    row.workflowStepsAr,
  );
  return {
    heroBadge: tr(locale, row.heroBadge, row.heroBadgeEn, row.heroBadgeAr),
    heroHeadline: headline.length ? headline : HOME_DEFAULTS_BY_LOCALE[locale].heroHeadline,
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
    workflowSteps: steps.length ? steps : HOME_DEFAULTS_BY_LOCALE[locale].workflowSteps,
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

const ABOUT_DEFAULTS_EN: AboutContent = {
  heroEyebrow: "About ARKA",
  heroTitle: "The Minds Behind the Magic",
  heroTitleHighlight: "Magic",
  heroDescription: "We don't just make content — we craft narratives for brands, create experiences, and make an impact.",
  storyEyebrow: "Our Story",
  storyHeading: "A Production House, Not Just an Agency",
  storyParagraphs: [
    "ARKA was born in 2017 with the belief that great brands are built through great stories. We're a blend of cinematic art, strategic thinking and data.",
    "Today, a multidisciplinary team of directors, designers, strategists and marketers has come together under one roof to solve brands' real problems.",
  ],
  storyVideo: SAMPLE.reels[0],
  storyPoster: SAMPLE.bts[0],
  valuesEyebrow: "Values",
  valuesHeading: "What Sets Us Apart",
  values: [
    { icon: "Target", title: "Strategy-Driven", desc: "Every creative decision is rooted in data and purpose." },
    { icon: "Gem", title: "Uncompromising Quality", desc: "Cinematic standards in every frame and pixel." },
    { icon: "Zap", title: "Speed & Agility", desc: "On-time delivery without sacrificing quality." },
    { icon: "Sparkles", title: "Boundless Creativity", desc: "Ideas that push boundaries." },
  ],
  teamEyebrow: "Team",
  teamHeading: "ARKA's Creative Minds",
  timelineEyebrow: "Growth Journey",
  timelineHeading: "ARKA's Journey at a Glance",
  timeline: [
    { year: "2017", title: "ARKA is Born", desc: "We started with one camera and one dream." },
    { year: "2019", title: "First National Campaign", desc: "Our first brand film aired on national television." },
    { year: "2021", title: "Digital Department", desc: "Adding performance marketing and SEO to our services." },
    { year: "2023", title: "Creative Awards", desc: "Winning several national and international design awards." },
    { year: "2025", title: "480+ Projects", desc: "Partnering with 120 brands across 12 different industries." },
  ],
  galleryEyebrow: "Behind the Scenes",
  galleryHeading: "How the Magic Is Made",
  galleryVideo: SAMPLE.reels[1],
  galleryPoster: SAMPLE.bts[1],
  galleryImages: SAMPLE.bts.slice(2, 4),
  metaTitle: "About Us",
  metaDescription: "ARKA — a team of creative minds transforming brands through cinematic visual storytelling.",
};

const ABOUT_DEFAULTS_AR: AboutContent = {
  heroEyebrow: "عن آركا",
  heroTitle: "العقول وراء السحر",
  heroTitleHighlight: "السحر",
  heroDescription: "نحن لا نصنع المحتوى فقط؛ نصنع روايات للعلامات التجارية، نبتكر تجارب، ونُحدث تأثيرًا.",
  storyEyebrow: "قصتنا",
  storyHeading: "دار إنتاج، وليست مجرد وكالة",
  storyParagraphs: [
    "وُلدت آركا عام 2017 إيمانًا منا بأن العلامات التجارية العظيمة تُبنى بقصص عظيمة. نحن مزيج من الفن السينمائي والتفكير الاستراتيجي والبيانات.",
    "اليوم، اجتمع فريق متعدد التخصصات من المخرجين والمصممين والاستراتيجيين والمسوقين تحت سقف واحد لحل المشكلات الحقيقية للعلامات التجارية.",
  ],
  storyVideo: SAMPLE.reels[0],
  storyPoster: SAMPLE.bts[0],
  valuesEyebrow: "القيم",
  valuesHeading: "ما يميزنا",
  values: [
    { icon: "Target", title: "قائم على الاستراتيجية", desc: "كل قرار إبداعي متجذر في البيانات والهدف." },
    { icon: "Gem", title: "جودة لا تقبل التنازل", desc: "معايير سينمائية في كل إطار وبكسل." },
    { icon: "Zap", title: "السرعة والمرونة", desc: "تسليم في الوقت المحدد دون التضحية بالجودة." },
    { icon: "Sparkles", title: "إبداع بلا حدود", desc: "أفكار تتجاوز الحدود." },
  ],
  teamEyebrow: "الفريق",
  teamHeading: "العقول الإبداعية في آركا",
  timelineEyebrow: "مسيرة النمو",
  timelineHeading: "رحلة آركا في لمحة",
  timeline: [
    { year: "2017", title: "ميلاد آركا", desc: "بدأنا بكاميرا واحدة وحلم واحد." },
    { year: "2019", title: "أول حملة وطنية", desc: "أول فيلم لعلامة تجارية يُعرض على التلفزيون الوطني." },
    { year: "2021", title: "قسم رقمي", desc: "إضافة التسويق بالأداء وتحسين محركات البحث إلى خدماتنا." },
    { year: "2023", title: "جوائز إبداعية", desc: "الفوز بعدة جوائز تصميم وطنية ودولية." },
    { year: "2025", title: "أكثر من 480 مشروعًا", desc: "شراكة مع 120 علامة تجارية عبر 12 صناعة مختلفة." },
  ],
  galleryEyebrow: "خلف الكواليس",
  galleryHeading: "كيف يُصنع السحر",
  galleryVideo: SAMPLE.reels[1],
  galleryPoster: SAMPLE.bts[1],
  galleryImages: SAMPLE.bts.slice(2, 4),
  metaTitle: "من نحن",
  metaDescription: "آركا؛ فريق من العقول الإبداعية يحوّل العلامات التجارية عبر السرد البصري السينمائي.",
};

const ABOUT_DEFAULTS_BY_LOCALE: Record<Locale, AboutContent> = { fa: ABOUT_DEFAULTS, en: ABOUT_DEFAULTS_EN, ar: ABOUT_DEFAULTS_AR };

export async function getAboutPage(locale: Locale = "fa"): Promise<AboutContent> {
  const row = await db.aboutPage.findUnique({ where: { id: "about" } });
  if (!row) return ABOUT_DEFAULTS_BY_LOCALE[locale];
  return {
    heroEyebrow: tr(locale, row.heroEyebrow, row.heroEyebrowEn, row.heroEyebrowAr),
    heroTitle: tr(locale, row.heroTitle, row.heroTitleEn, row.heroTitleAr),
    heroTitleHighlight: tr(locale, row.heroTitleHighlight, row.heroTitleHighlightEn, row.heroTitleHighlightAr),
    heroDescription: tr(locale, row.heroDescription, row.heroDescriptionEn, row.heroDescriptionAr),
    storyEyebrow: tr(locale, row.storyEyebrow, row.storyEyebrowEn, row.storyEyebrowAr),
    storyHeading: tr(locale, row.storyHeading, row.storyHeadingEn, row.storyHeadingAr),
    storyParagraphs: trArr<string>(locale, row.storyParagraphs, row.storyParagraphsEn, row.storyParagraphsAr),
    storyVideo: row.storyVideo || ABOUT_DEFAULTS_BY_LOCALE[locale].storyVideo,
    storyPoster: row.storyPoster || ABOUT_DEFAULTS_BY_LOCALE[locale].storyPoster,
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
    galleryVideo: row.galleryVideo || ABOUT_DEFAULTS_BY_LOCALE[locale].galleryVideo,
    galleryPoster: row.galleryPoster || ABOUT_DEFAULTS_BY_LOCALE[locale].galleryPoster,
    galleryImages: parseArr<string>(row.galleryImages),
    metaTitle: row.metaTitle ? tr(locale, row.metaTitle, row.metaTitleEn, row.metaTitleAr) : ABOUT_DEFAULTS_BY_LOCALE[locale].metaTitle,
    metaDescription: row.metaDescription
      ? tr(locale, row.metaDescription, row.metaDescriptionEn, row.metaDescriptionAr)
      : ABOUT_DEFAULTS_BY_LOCALE[locale].metaDescription,
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

const CONTACT_DEFAULTS_EN: ContactContent = {
  heroEyebrow: "Contact",
  heroTitle: "Let's Get Started",
  heroTitleHighlight: "Get Started",
  heroDescription: "Got an idea in mind? Fill out the form or reach out to us directly.",
  address: "Arka Tower, Valiasr St, Tehran, Iran, 12th floor",
  phone: "+982188000000",
  phoneDisplay: "021 8800 0000",
  email: "hello@arka.studio",
  officeHours: "Saturday to Wednesday, 9 AM–6 PM",
  mapLat: 35.7448,
  mapLng: 51.4101,
  socials: [
    { platform: "instagram", href: "https://instagram.com/arka.studio", label: "Instagram" },
    { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "LinkedIn" },
    { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "YouTube" },
    { platform: "aparat", href: "https://aparat.com/arka.studio", label: "Aparat" },
    { platform: "telegram", href: "https://t.me/arka_studio", label: "Telegram" },
  ],
  serviceOptions: ["Film & Ad", "Photography", "Branding", "Web Design", "Digital Marketing", "Other"],
  budgetOptions: ["Under 50M Toman", "50M–150M Toman", "150M–300M Toman", "Over 300M Toman"],
  metaTitle: "Contact Us",
  metaDescription: "Send us your project brief or contact the ARKA team in Tehran.",
};

const CONTACT_DEFAULTS_AR: ContactContent = {
  heroEyebrow: "تواصل",
  heroTitle: "لنبدأ",
  heroTitleHighlight: "نبدأ",
  heroDescription: "لديك فكرة في ذهنك؟ املأ النموذج أو تواصل معنا مباشرة.",
  address: "برج آركا، شارع وليعصر، طهران، إيران، الطابق 12",
  phone: "+982188000000",
  phoneDisplay: "021 8800 0000",
  email: "hello@arka.studio",
  officeHours: "السبت إلى الأربعاء، 9 صباحًا حتى 6 مساءً",
  mapLat: 35.7448,
  mapLng: 51.4101,
  socials: [
    { platform: "instagram", href: "https://instagram.com/arka.studio", label: "انستغرام" },
    { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "لينكد إن" },
    { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "يوتيوب" },
    { platform: "aparat", href: "https://aparat.com/arka.studio", label: "آبارات" },
    { platform: "telegram", href: "https://t.me/arka_studio", label: "تيليجرام" },
  ],
  serviceOptions: ["فيلم وإعلان", "التصوير", "العلامة التجارية", "تصميم المواقع", "التسويق الرقمي", "أخرى"],
  budgetOptions: ["أقل من 50 مليون تومان", "50 إلى 150 مليون تومان", "150 إلى 300 مليون تومان", "أكثر من 300 مليون تومان"],
  metaTitle: "تواصل معنا",
  metaDescription: "أرسل لنا ملخص مشروعك أو تواصل مع فريق آركا في طهران.",
};

const CONTACT_DEFAULTS_BY_LOCALE: Record<Locale, ContactContent> = { fa: CONTACT_DEFAULTS, en: CONTACT_DEFAULTS_EN, ar: CONTACT_DEFAULTS_AR };

export async function getContactPage(locale: Locale = "fa"): Promise<ContactContent> {
  const row = await db.contactPage.findUnique({ where: { id: "contact" } });
  if (!row) return CONTACT_DEFAULTS_BY_LOCALE[locale];
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
    metaTitle: row.metaTitle ? tr(locale, row.metaTitle, row.metaTitleEn, row.metaTitleAr) : CONTACT_DEFAULTS_BY_LOCALE[locale].metaTitle,
    metaDescription: row.metaDescription
      ? tr(locale, row.metaDescription, row.metaDescriptionEn, row.metaDescriptionAr)
      : CONTACT_DEFAULTS_BY_LOCALE[locale].metaDescription,
  };
}
