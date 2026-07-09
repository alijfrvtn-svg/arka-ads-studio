/* ARKA — database seed with rich, realistic placeholder content.
   Media: Picsum (photos), Google sample MP4s (video), Pravatar (avatars).
   Swap all of these from the admin Media Library. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const J = (x: unknown) => JSON.stringify(x);
const IMG = (seed: string, w = 1600, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const AVA = (n: number) => `https://i.pravatar.cc/400?img=${n}`;

const VID = {
  showreel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  elephants: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  blazes: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  joyrides: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  fun: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  meltdowns:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  sintel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  steel: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  escapes: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
};

async function main() {
  console.log("🌱  Seeding ARKA…");

  // ——— reset (idempotent, FK-safe order) ———
  await db.seo.deleteMany();
  await db.project.deleteMany();
  await db.post.deleteMany();
  await db.testimonial.deleteMany();
  await db.media.deleteMany();
  await db.teamMember.deleteMany();
  await db.stat.deleteMany();
  await db.lead.deleteMany();
  await db.service.deleteMany();
  await db.industry.deleteMany();
  await db.client.deleteMany();
  await db.user.deleteMany();
  await db.setting.deleteMany();

  // ——— users (RBAC demo) ———
  const pass = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Arka@2026!", 10);
  const admin = await db.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || "ali.jafari@arka.studio",
      password: pass,
      name: "علی جعفری",
      role: "SUPER_ADMIN",
      avatar: AVA(12),
      bio: "بنیان‌گذار و مدیر خلاقیت آرکا",
      permissions: J(["*"]),
    },
  });
  await db.user.create({
    data: {
      email: "editor@arka.studio",
      password: pass,
      name: "نگار مرادی",
      role: "EDITOR",
      avatar: AVA(45),
      bio: "سرپرست تولید محتوا و نمونه‌کارها",
      permissions: J([]),
    },
  });
  await db.user.create({
    data: {
      email: "author@arka.studio",
      password: pass,
      name: "سامان کریمی",
      role: "AUTHOR",
      avatar: AVA(33),
      bio: "نویسنده ارشد ژورنال آرکا",
      permissions: J(["seo.manage"]),
    },
  });

  // ——— clients ———
  const clientDefs = [
    { key: "auto", name: "خودروسازی آریان", nameEn: "Arian Motors", industry: "automotive" },
    { key: "novan", name: "کلینیک زیبایی نُوان", nameEn: "Novan Clinic", industry: "beauty" },
    { key: "mana", name: "برند فشن مانا", nameEn: "Mana Fashion", industry: "fashion" },
    { key: "digiland", name: "فروشگاه دیجی‌لند", nameEn: "DigiLand", industry: "retail" },
    { key: "folad", name: "فولاد آرمان", nameEn: "Arman Steel", industry: "technology" },
    { key: "almas", name: "املاک الماس رزیدنس", nameEn: "Almas Residence", industry: "real-estate" },
    { key: "paypod", name: "فین‌تک پی‌پاد", nameEn: "PayPod", industry: "fintech" },
    { key: "toranj", name: "رستوران ترنج", nameEn: "Toranj", industry: "food" },
    { key: "doctorly", name: "اپلیکیشن داکترلی", nameEn: "Doctorly", industry: "medical" },
    { key: "kishland", name: "تفریحات کیش‌لند", nameEn: "KishLand", industry: "hospitality" },
  ];
  const clientMap: Record<string, string> = {};
  for (let i = 0; i < clientDefs.length; i++) {
    const c = clientDefs[i];
    const r = await db.client.create({
      data: {
        name: c.name,
        nameEn: c.nameEn,
        industry: c.industry,
        logo: IMG(`logo-${c.key}`, 200, 200),
        website: `https://${c.key}.example.com`,
        featured: i < 6,
        order: i,
      },
    });
    clientMap[c.key] = r.id;
  }

  // ——— services (10) ———
  const wf = (a: string, b: string, c: string, d: string) =>
    J([
      { step: "۰۱", title: "کشف و بریف", desc: a },
      { step: "۰۲", title: "ایده و استراتژی", desc: b },
      { step: "۰۳", title: "تولید و اجرا", desc: c },
      { step: "۰۴", title: "تحویل و تحلیل", desc: d },
    ]);
  const faq = () =>
    J([
      { q: "زمان اجرای پروژه چقدر است؟", a: "بسته به دامنه پروژه، معمولاً بین ۲ تا ۸ هفته زمان می‌برد." },
      { q: "هزینه چگونه محاسبه می‌شود؟", a: "پس از جلسه بریف و تعیین اسکوپ، پیشنهاد قیمت شفاف ارائه می‌شود." },
      { q: "امکان بازنگری وجود دارد؟", a: "بله، در هر پکیج تعداد مشخصی راند بازنگری در نظر گرفته شده است." },
    ]);
  const pricing = (base: number) =>
    J([
      {
        name: "پایه",
        price: base.toLocaleString("fa-IR"),
        unit: "تومان",
        features: ["مشاوره اولیه", "یک راند بازنگری", "تحویل استاندارد"],
      },
      {
        name: "حرفه‌ای",
        price: (base * 2.4).toLocaleString("fa-IR"),
        unit: "تومان",
        features: ["استراتژی اختصاصی", "سه راند بازنگری", "تحویل اکسپرس", "پشتیبانی ۳ ماهه"],
        featured: true,
      },
      {
        name: "سازمانی",
        price: "تماس بگیرید",
        unit: "",
        features: ["تیم اختصاصی", "بازنگری نامحدود", "قرارداد SLA", "مدیر پروژه مستقل"],
      },
    ]);

  const services = [
    {
      slug: "video-production",
      title: "تولید فیلم و تیزر تبلیغاتی",
      titleEn: "Video Production",
      titleAr: "إنتاج الفيديو",
      department: "FILM",
      icon: "Clapperboard",
      tagline: "روایتی سینمایی برای برند شما",
      excerpt: "از کانسپت تا اکران؛ تیزر تبلیغاتی، فیلم صنعتی و برندفیلم با کیفیت سینمایی.",
      priceFrom: 45000000,
      seed: "svc-video",
    },
    {
      slug: "photography",
      title: "عکاسی صنعتی و تبلیغاتی",
      titleEn: "Commercial Photography",
      titleAr: "التصوير التجاري",
      department: "FILM",
      icon: "Camera",
      tagline: "قاب‌هایی که می‌فروشند",
      excerpt: "عکاسی محصول، صنعتی، فشن و لایف‌استایل در استودیو و لوکیشن.",
      priceFrom: 18000000,
      seed: "svc-photo",
    },
    {
      slug: "motion-cgi",
      title: "موشن‌گرافیک و CGI",
      titleEn: "Motion & CGI",
      titleAr: "الموشن غرافيك",
      department: "FILM",
      icon: "Box",
      tagline: "حرکت، عمق، شگفتی",
      excerpt: "انیمیشن دوبعدی و سه‌بعدی، ویژوال افکت و CGI فتورئال.",
      priceFrom: 30000000,
      seed: "svc-motion",
    },
    {
      slug: "web-design",
      title: "طراحی و توسعه وب‌سایت",
      titleEn: "Web Design & Development",
      titleAr: "تصميم المواقع",
      department: "DESIGN",
      icon: "Monitor",
      tagline: "تجربه‌ای که تبدیل می‌کند",
      excerpt: "وب‌سایت‌های سریع، ریسپانسیو و سئوشده با تجربه کاربری لوکس.",
      priceFrom: 40000000,
      seed: "svc-web",
    },
    {
      slug: "branding",
      title: "برندینگ و هویت بصری",
      titleEn: "Branding & Identity",
      titleAr: "الهوية البصرية",
      department: "DESIGN",
      icon: "Palette",
      tagline: "برندی که به یاد می‌ماند",
      excerpt: "استراتژی برند، لوگو، سیستم بصری و برندبوک کامل.",
      priceFrom: 55000000,
      seed: "svc-brand",
    },
    {
      slug: "ui-ux",
      title: "طراحی تجربه و رابط کاربری",
      titleEn: "UI/UX Design",
      titleAr: "تصميم تجربة المستخدم",
      department: "DESIGN",
      icon: "Figma",
      tagline: "ساده، زیبا، کاربردی",
      excerpt: "پژوهش کاربر، پروتوتایپ و طراحی رابط اپلیکیشن و محصولات دیجیتال.",
      priceFrom: 35000000,
      seed: "svc-uiux",
    },
    {
      slug: "digital-marketing",
      title: "دیجیتال مارکتینگ و پرفورمنس",
      titleEn: "Digital & Performance Marketing",
      titleAr: "التسويق الرقمي",
      department: "DIGITAL",
      icon: "TrendingUp",
      tagline: "رشد قابل اندازه‌گیری",
      excerpt: "کمپین پرفورمنس، تبلیغات هدفمند و بهینه‌سازی نرخ تبدیل.",
      priceFrom: 25000000,
      seed: "svc-digital",
    },
    {
      slug: "seo",
      title: "سئو و بازاریابی محتوایی",
      titleEn: "SEO & Content Marketing",
      titleAr: "تحسين محركات البحث",
      department: "DIGITAL",
      icon: "Search",
      tagline: "دیده شدن، پایدار",
      excerpt: "سئوی تکنیکال، محتوای برنامه‌محور و لینک‌سازی طبیعی.",
      priceFrom: 20000000,
      seed: "svc-seo",
    },
    {
      slug: "social-media",
      title: "مدیریت شبکه‌های اجتماعی",
      titleEn: "Social Media Management",
      titleAr: "إدارة وسائل التواصل",
      department: "DIGITAL",
      icon: "Instagram",
      tagline: "جامعه‌ای وفادار بساز",
      excerpt: "استراتژی محتوا، تقویم انتشار، تولید ریلز و مدیریت کامیونیتی.",
      priceFrom: 15000000,
      seed: "svc-social",
    },
    {
      slug: "brand-strategy",
      title: "استراتژی برند و محتوا",
      titleEn: "Brand & Content Strategy",
      titleAr: "استراتيجية العلامة",
      department: "STRATEGY",
      icon: "Target",
      tagline: "قبل از خلق، جهت بده",
      excerpt: "پوزیشنینگ، آرکی‌تایپ برند، لحن گفتار و نقشه‌راه محتوا.",
      priceFrom: 28000000,
      seed: "svc-strategy",
    },
  ];
  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await db.service.create({
      data: {
        slug: s.slug,
        title: s.title,
        titleEn: s.titleEn,
        titleAr: s.titleAr,
        tagline: s.tagline,
        excerpt: s.excerpt,
        description: `${s.excerpt} تیم آرکا با نگاهی سینمایی و داده‌محور، ${s.title} را از مرحله ایده تا اجرا و تحلیل نتایج پیش می‌برد؛ به‌گونه‌ای که خروجی نه‌فقط زیبا، بلکه اثرگذار و قابل‌اندازه‌گیری باشد.`,
        department: s.department,
        icon: s.icon,
        cover: IMG(s.seed, 1400, 900),
        heroVideo: i % 2 === 0 ? VID.blazes : VID.joyrides,
        priceFrom: s.priceFrom,
        priceUnit: "تومان",
        features: J([
          "تیم تخصصی و اختصاصی",
          "فرایند شفاف و مرحله‌به‌مرحله",
          "تحویل در ددلاین توافقی",
          "گزارش و تحلیل نتایج",
          "پشتیبانی پس از تحویل",
        ]),
        workflow: wf(
          "درک عمیق برند، بازار و اهداف کسب‌وکار شما.",
          "طراحی ایده خلاقانه و نقشه‌راه اجرایی.",
          "اجرای حرفه‌ای با بالاترین استانداردهای کیفی.",
          "تحویل نهایی همراه با گزارش عملکرد و بهینه‌سازی.",
        ),
        faqs: faq(),
        pricing: pricing(s.priceFrom),
        order: i,
        metaTitle: `${s.title} | خدمات آرکا`,
        metaDescription: s.excerpt,
        keywords: J([s.titleEn, s.title, "آرکا", "دیجیتال مارکتینگ"]),
      },
    });
  }

  // ——— industries (12) ———
  const industries = [
    { slug: "medical", title: "پزشکی و سلامت", en: "Medical & Health", icon: "Stethoscope", seed: "ind-medical" },
    { slug: "automotive", title: "خودرو", en: "Automotive", icon: "Car", seed: "ind-auto" },
    { slug: "fashion", title: "مد و فشن", en: "Fashion", icon: "Shirt", seed: "ind-fashion" },
    { slug: "startups", title: "استارتاپ‌ها", en: "Startups", icon: "Rocket", seed: "ind-startup" },
    { slug: "real-estate", title: "املاک و مستغلات", en: "Real Estate", icon: "Building2", seed: "ind-realestate" },
    { slug: "food", title: "رستوران و کافه", en: "Food & Beverage", icon: "UtensilsCrossed", seed: "ind-food" },
    { slug: "beauty", title: "زیبایی و آرایشی", en: "Beauty & Cosmetics", icon: "Sparkles", seed: "ind-beauty" },
    { slug: "technology", title: "فناوری و صنعت", en: "Technology", icon: "Cpu", seed: "ind-tech" },
    { slug: "fintech", title: "مالی و فین‌تک", en: "Finance & Fintech", icon: "Landmark", seed: "ind-fintech" },
    { slug: "hospitality", title: "گردشگری و هتلداری", en: "Hospitality", icon: "Plane", seed: "ind-hospitality" },
    { slug: "education", title: "آموزش", en: "Education", icon: "GraduationCap", seed: "ind-education" },
    { slug: "retail", title: "خرده‌فروشی و ای‌کامرس", en: "Retail & E‑commerce", icon: "ShoppingBag", seed: "ind-retail" },
  ];
  const indVideos = [VID.blazes, VID.joyrides, VID.fun, VID.meltdowns, VID.escapes, VID.elephants];
  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    await db.industry.create({
      data: {
        slug: ind.slug,
        title: ind.title,
        titleEn: ind.en,
        titleAr: ind.en,
        icon: ind.icon,
        excerpt: `راهکارهای خلاق و دیجیتال اختصاصی برای صنعت ${ind.title}.`,
        description: `آرکا با درک عمیق از پویایی صنعت ${ind.title}، کمپین‌ها و محتوایی می‌سازد که با مخاطب این حوزه ارتباط برقرار می‌کند و به نتایج تجاری قابل‌اندازه‌گیری می‌رسد.`,
        cover: IMG(ind.seed, 1600, 1000),
        heroVideo: indVideos[i % indVideos.length],
        approach: J([
          `شناخت پرسونا و سفر مشتری در صنعت ${ind.title}`,
          "پیام‌سازی متناسب با قواعد و حساسیت‌های حوزه",
          "انتخاب کانال و فرمت بهینه برای بیشترین اثر",
          "سنجش، بهینه‌سازی و مقیاس‌دهی کمپین",
        ]),
        order: i,
        metaTitle: `راهکار صنعت ${ind.title} | آرکا`,
        metaDescription: `خدمات تخصصی آرکا برای صنعت ${ind.title}.`,
        keywords: J([ind.title, ind.en, "آرکا"]),
      },
    });
  }

  // ——— projects / case studies (10) ———
  const metric = (a: [string, string, string?], b: [string, string, string?], c: [string, string, string?]) =>
    J([
      { label: a[0], value: a[1], suffix: a[2] || "" },
      { label: b[0], value: b[1], suffix: b[2] || "" },
      { label: c[0], value: c[1], suffix: c[2] || "" },
    ]);
  const credits = J([
    { role: "کارگردان", name: "علی جعفری" },
    { role: "مدیر فیلم‌برداری", name: "نگار مرادی" },
    { role: "تدوین", name: "سامان کریمی" },
    { role: "طراح صدا", name: "رها احمدی" },
  ]);

  const projects = [
    {
      slug: "arian-beyond-the-road",
      title: "کمپین سینمایی «فراتر از جاده»",
      titleEn: "Beyond The Road",
      subtitle: "برندفیلم و کمپین ۳۶۰ درجه برای رونمایی خودرو",
      client: "auto",
      category: "فیلم تبلیغاتی",
      seed: "prj-auto",
      services: ["video-production", "motion-cgi", "digital-marketing"],
      industries: ["automotive"],
      video: VID.joyrides,
      accent: "#6699ff",
      tags: ["برندفیلم", "خودرو", "CGI", "کمپین ۳۶۰"],
      metrics: metric(["بازدید کمپین", "۸.۴", "میلیون"], ["افزایش سرنخ فروش", "۳۲", "٪"], ["نرخ تعامل", "۶.۱", "٪"]),
    },
    {
      slug: "novan-rebrand",
      title: "ری‌برندینگ کلینیک زیبایی نُوان",
      titleEn: "Novan Rebrand",
      subtitle: "از هویت بصری تا تجربه دیجیتال کلینیک لوکس",
      client: "novan",
      category: "برندینگ",
      seed: "prj-novan",
      services: ["branding", "web-design", "photography"],
      industries: ["beauty", "medical"],
      video: VID.fun,
      accent: "#a6c9ff",
      tags: ["ری‌برندینگ", "هویت بصری", "کلینیک"],
      metrics: metric(["افزایش رزرو آنلاین", "۲.۷", "برابر"], ["یادآوری برند", "۴۸", "٪"], ["رضایت مشتری", "۹۶", "٪"]),
    },
    {
      slug: "mana-fashion-launch",
      title: "لانچ برند فشن مانا",
      titleEn: "Mana Launch",
      subtitle: "کمپین راه‌اندازی و کالکشن‌فیلم پاییزه",
      client: "mana",
      category: "فیلم تبلیغاتی",
      seed: "prj-mana",
      services: ["video-production", "photography", "social-media"],
      industries: ["fashion", "retail"],
      video: VID.blazes,
      accent: "#7aa6ff",
      tags: ["فشن‌فیلم", "لانچ برند", "سوشال"],
      metrics: metric(["فالوئر جدید", "۱۲۰", "هزار"], ["فروش هفته اول", "۱.۹", "میلیارد"], ["ری‌چ اینستاگرام", "۴.۲", "میلیون"]),
    },
    {
      slug: "digiland-performance",
      title: "کمپین پرفورمنس دیجی‌لند",
      titleEn: "DigiLand Performance",
      subtitle: "بهینه‌سازی قیف فروش و مقیاس‌دهی تبلیغات",
      client: "digiland",
      category: "دیجیتال مارکتینگ",
      seed: "prj-digiland",
      services: ["digital-marketing", "seo", "ui-ux"],
      industries: ["retail"],
      video: VID.meltdowns,
      accent: "#6699ff",
      tags: ["پرفورمنس", "CRO", "ای‌کامرس"],
      metrics: metric(["کاهش هزینه جذب", "۳۸", "٪"], ["رشد نرخ تبدیل", "۲.۳", "برابر"], ["بازگشت هزینه (ROAS)", "۴.۸", "x"]),
    },
    {
      slug: "arman-steel-industrial",
      title: "فیلم صنعتی فولاد آرمان",
      titleEn: "Arman Steel",
      subtitle: "مستند صنعتی از خط تولید تا صادرات",
      client: "folad",
      category: "فیلم تبلیغاتی",
      seed: "prj-folad",
      services: ["video-production", "photography"],
      industries: ["technology"],
      video: VID.elephants,
      accent: "#162d73",
      tags: ["فیلم صنعتی", "مستند", "B2B"],
      metrics: metric(["نمایش در نمایشگاه", "۱۵", "کشور"], ["افزایش استعلام", "۵۴", "٪"], ["زمان تولید", "۶", "هفته"]),
    },
    {
      slug: "almas-residence-web",
      title: "وب‌سایت لوکس الماس رزیدنس",
      titleEn: "Almas Residence",
      subtitle: "تجربه دیجیتال املاک لوکس با تور مجازی",
      client: "almas",
      category: "طراحی وب",
      seed: "prj-almas",
      services: ["web-design", "ui-ux", "photography"],
      industries: ["real-estate"],
      video: VID.escapes,
      accent: "#a6c9ff",
      tags: ["وب لوکس", "تور مجازی", "املاک"],
      metrics: metric(["مدت حضور در سایت", "۴:۱۲", ""], ["درخواست بازدید", "۳.۱", "برابر"], ["امتیاز لایت‌هاوس", "۹۹", "/۱۰۰"]),
    },
    {
      slug: "paypod-rebrand",
      title: "ری‌برندینگ فین‌تک پی‌پاد",
      titleEn: "PayPod Rebrand",
      subtitle: "هویت و محصول دیجیتال یک اپلیکیشن پرداخت",
      client: "paypod",
      category: "برندینگ",
      seed: "prj-paypod",
      services: ["branding", "ui-ux", "motion-cgi"],
      industries: ["fintech", "startups"],
      video: VID.sintel,
      accent: "#6699ff",
      tags: ["فین‌تک", "دیزاین سیستم", "اپلیکیشن"],
      metrics: metric(["نصب اپ", "۵۰۰", "هزار"], ["نرخ نگهداشت", "۴۱", "٪"], ["امتیاز استور", "۴.۸", "/۵"]),
    },
    {
      slug: "toranj-content",
      title: "کمپین محتوایی رستوران ترنج",
      titleEn: "Toranj Content",
      subtitle: "استوری‌تلینگ آشپزی و مدیریت سوشال",
      client: "toranj",
      category: "دیجیتال مارکتینگ",
      seed: "prj-toranj",
      services: ["social-media", "photography", "brand-strategy"],
      industries: ["food"],
      video: VID.fun,
      accent: "#7aa6ff",
      tags: ["فودفوتوگرافی", "سوشال", "محتوا"],
      metrics: metric(["رزرو از اینستاگرام", "۲.۲", "برابر"], ["ویو ریلز", "۹.۵", "میلیون"], ["نرخ تعامل", "۸.۳", "٪"]),
    },
    {
      slug: "doctorly-app",
      title: "لانچ اپلیکیشن سلامت داکترلی",
      titleEn: "Doctorly App",
      subtitle: "موشن، رابط کاربری و کمپین جذب کاربر",
      client: "doctorly",
      category: "موشن‌گرافیک",
      seed: "prj-doctorly",
      services: ["motion-cgi", "ui-ux", "digital-marketing"],
      industries: ["medical", "startups"],
      video: VID.steel,
      accent: "#a6c9ff",
      tags: ["هلث‌تک", "موشن", "لانچ"],
      metrics: metric(["ثبت‌نام هفته اول", "۸۰", "هزار"], ["هزینه جذب", "-۴۵", "٪"], ["ویزیت آنلاین", "۳.۶", "برابر"]),
    },
    {
      slug: "kishland-tourism",
      title: "تیزر گردشگری کیش‌لند",
      titleEn: "KishLand",
      subtitle: "برندفیلم مقصد گردشگری و کمپین فصلی",
      client: "kishland",
      category: "فیلم تبلیغاتی",
      seed: "prj-kish",
      services: ["video-production", "motion-cgi", "social-media"],
      industries: ["hospitality"],
      video: VID.joyrides,
      accent: "#6699ff",
      tags: ["گردشگری", "برندفیلم", "کمپین فصلی"],
      metrics: metric(["بازدید تیزر", "۶.۷", "میلیون"], ["رشد رزرو تور", "۲.۹", "برابر"], ["اشتراک‌گذاری", "۱۴۰", "هزار"]),
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await db.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        titleEn: p.titleEn,
        subtitle: p.subtitle,
        category: p.category,
        cover: IMG(p.seed, 1600, 1100),
        poster: IMG(p.seed, 1600, 900),
        heroVideo: p.video,
        gallery: J([IMG(`${p.seed}-a`, 1200, 800), IMG(`${p.seed}-b`, 1200, 1500), IMG(`${p.seed}-c`, 1200, 800), IMG(`${p.seed}-d`, 1200, 900)]),
        year: 2024 - (i % 3),
        location: "تهران، ایران",
        accent: p.accent,
        featured: i < 6,
        order: i,
        views: 1200 + i * 337,
        tags: J(p.tags),
        goal: `هدف اصلی این پروژه، ${p.subtitle} بود؛ به‌طوری‌که برند ${clientDefs[i]?.name ?? ""} بتواند جایگاه متمایزی در ذهن مخاطب هدف خود بسازد و به رشد تجاری ملموس برسد.`,
        problem: "برند با فضای رقابتی شلوغ، پیام پراکنده و ارتباط ضعیف با نسل جدید مخاطب روبه‌رو بود. کمپین‌های پیشین اثر کوتاه‌مدت داشتند و هویت یکپارچه‌ای شکل نگرفته بود.",
        idea: "ایده مرکزی ما یک روایت انسانی و سینمایی بود که ارزش واقعی برند را نه با شعار، بلکه با تجربه و احساس منتقل می‌کرد؛ روایتی که در همه کانال‌ها به‌شکل یکپارچه بازتاب پیدا کرد.",
        production: "تولید در چند فاز انجام شد: پیش‌تولید و استوری‌بورد، فیلم‌برداری با تجهیزات سینمایی، طراحی صحنه و نور، سپس تدوین، اصلاح رنگ و طراحی صدای اختصاصی برای خلق حس نهایی.",
        marketing: "خروجی‌ها در قالب یک کمپین ۳۶۰ درجه شامل تلویزیون، دیجیتال، سوشال و اجرای محیطی منتشر شد و با تبلیغات هدفمند و بهینه‌سازی مستمر به بیشترین بازده رسید.",
        result: "نتیجه، جهشی در آگاهی از برند و شاخص‌های تجاری بود؛ کمپین نه‌تنها دیده شد، بلکه رفتار مخاطب را تغییر داد و به فروش و وفاداری تبدیل شد.",
        metrics: p.metrics,
        beforeImage: IMG(`${p.seed}-before`, 1200, 800),
        afterImage: IMG(`${p.seed}-after`, 1200, 800),
        credits,
        client: { connect: { id: clientMap[p.client] } },
        services: { connect: p.services.map((slug) => ({ slug })) },
        industries: { connect: p.industries.map((slug) => ({ slug })) },
        seo: {
          create: {
            metaTitle: `${p.title} | نمونه‌کار آرکا`,
            metaDescription: p.subtitle,
            ogImage: IMG(p.seed, 1200, 630),
            keywords: J(p.tags),
          },
        },
      },
    });
  }

  // ——— posts (8) ———
  const postDefs = [
    { slug: "cinematic-brand-film", title: "چرا برندفیلم سینمایی، آینده تبلیغات است؟", cat: "استراتژی برند", seed: "post-1" },
    { slug: "performance-marketing-2025", title: "راهنمای کامل پرفورمنس مارکتینگ در ۱۴۰۴", cat: "دیجیتال مارکتینگ", seed: "post-2" },
    { slug: "color-grading-secrets", title: "رازهای اصلاح رنگ سینمایی در تیزر تبلیغاتی", cat: "پروداکشن", seed: "post-3" },
    { slug: "brand-identity-system", title: "آناتومی یک سیستم هویت بصری ماندگار", cat: "برندینگ", seed: "post-4" },
    { slug: "ux-that-converts", title: "طراحی تجربه‌ای که واقعاً تبدیل می‌کند", cat: "طراحی", seed: "post-5" },
    { slug: "storytelling-framework", title: "چارچوب استوری‌تلینگ برند در شش گام", cat: "استراتژی برند", seed: "post-6" },
    { slug: "reels-that-sell", title: "ساخت ریلزی که می‌فروشد؛ از ایده تا انتشار", cat: "سوشال مدیا", seed: "post-7" },
    { slug: "seo-technical-guide", title: "سئوی تکنیکال؛ زیرساخت دیده‌شدن پایدار", cat: "سئو", seed: "post-8" },
  ];
  const body = (t: string) =>
    `## مقدمه\n\n${t} در این مقاله از ژورنال آرکا، نگاهی عمیق و کاربردی به این موضوع می‌اندازیم و تجربه‌های واقعی تیم را مرور می‌کنیم.\n\n![تصویر شاخص](${IMG("post-inline", 1200, 700)})\n\n## چرا اهمیت دارد؟\n\nبرندهای پیشرو می‌دانند که تمایز، نتیجه‌ی تصمیم‌های آگاهانه است. کیفیت بصری، پیام روشن و اجرای منسجم، سه ستون هر کمپین موفق‌اند.\n\n> خلاقیت بدون استراتژی، هنر است؛ خلاقیت با استراتژی، بازاریابی.\n\n## گام‌های عملی\n\n- شناخت دقیق مخاطب و بازار\n- طراحی ایده مرکزی و روایت\n- انتخاب کانال و فرمت مناسب\n- سنجش، تحلیل و بهینه‌سازی مستمر\n\n## جمع‌بندی\n\nاثرگذاری واقعی زمانی رخ می‌دهد که خلاقیت و داده در کنار هم قرار بگیرند. تیم آرکا آماده است تا این مسیر را کنار برند شما طی کند.`;
  for (let i = 0; i < postDefs.length; i++) {
    const p = postDefs[i];
    const content = body(p.title);
    await db.post.create({
      data: {
        slug: p.slug,
        title: p.title,
        excerpt: `${p.title} — تحلیلی کاربردی از تیم آرکا برای مدیران برند و بازاریابی.`,
        cover: IMG(p.seed, 1600, 900),
        content,
        category: p.cat,
        tags: J([p.cat, "آرکا", "بازاریابی"]),
        authorId: admin.id,
        readingMinutes: 4 + (i % 5),
        featured: i < 3,
        views: 800 + i * 211,
        metaTitle: `${p.title} | ژورنال آرکا`,
        metaDescription: `${p.title} — مطالعه در ژورنال آرکا.`,
        keywords: J([p.cat, "آرکا"]),
        publishedAt: new Date(Date.now() - i * 6 * 86400000),
      },
    });
  }

  // ——— testimonials (10) ———
  const tDefs = [
    ["مریم رستمی", "مدیر بازاریابی", "auto", "آرکا فقط یک آژانس نیست؛ یک شریک استراتژیک است. برندفیلمی که ساختند، فروش ما را متحول کرد.", 27],
    ["دکتر آرش نیک‌پور", "بنیان‌گذار", "novan", "هویت بصری جدید، جایگاه کلینیک ما را کاملاً ارتقا داد. حرفه‌ای، دقیق و خلاق.", 51],
    ["سارا احمدی", "مدیر برند", "mana", "کالکشن‌فیلم پاییزه فراتر از انتظار بود. کیفیت سینمایی واقعی.", 20],
    ["کامران یزدانی", "مدیر ای‌کامرس", "digiland", "کاهش ۳۸ درصدی هزینه جذب در سه ماه؛ اعداد خودشان حرف می‌زنند.", 15],
    ["مهندس بهروز کاویانی", "مدیرعامل", "folad", "مستند صنعتی ما در نمایشگاه‌های بین‌المللی تحسین شد. کار بی‌نقص.", 60],
    ["نیلوفر صادقی", "مدیر فروش", "almas", "وب‌سایت لوکس و سریع؛ دقیقاً همان تجربه‌ای که برند ما نیاز داشت.", 44],
    ["امیر توکلی", "مدیرمحصول", "paypod", "دیزاین سیستم منسجمی که سرعت تیم ما را چند برابر کرد.", 68],
    ["الهام مرادی", "مالک", "toranj", "محتوای اینستاگرام ما زنده شد؛ رزروها دو برابر شد.", 24],
    ["دکتر رضا موحد", "هم‌بنیان‌گذار", "doctorly", "کمپین لانچ، رشدی که رؤیایش را داشتیم به واقعیت تبدیل کرد.", 11],
    ["پریسا کیانی", "مدیر گردشگری", "kishland", "تیزر مقصد ما وایرال شد؛ رزرو تورها جهش کرد.", 47],
  ];
  for (let i = 0; i < tDefs.length; i++) {
    const [author, role, ck, quote, ava] = tDefs[i] as [string, string, string, string, number];
    await db.testimonial.create({
      data: {
        author,
        role,
        company: clientDefs.find((c) => c.key === ck)?.name,
        avatar: AVA(ava),
        quote,
        rating: 5,
        clientId: clientMap[ck],
        featured: i < 6,
        order: i,
      },
    });
  }

  // ——— team (6) ———
  const team = [
    ["علی جعفری", "بنیان‌گذار و مدیر خلاقیت", 12],
    ["نگار مرادی", "مدیر پروداکشن", 45],
    ["سامان کریمی", "سرپرست تدوین و موشن", 33],
    ["رها احمدی", "مدیر هنری و برندینگ", 26],
    ["پویا شریفی", "سرپرست دیجیتال مارکتینگ", 55],
    ["مینا حسینی", "مدیر تجربه کاربری", 41],
  ];
  for (let i = 0; i < team.length; i++) {
    const [name, role, ava] = team[i] as [string, string, number];
    await db.teamMember.create({
      data: {
        name,
        role,
        avatar: AVA(ava),
        bio: "عضوی از تیم خلاق آرکا با سال‌ها تجربه در ساخت کمپین‌های اثرگذار.",
        socials: J([
          { platform: "linkedin", href: "#" },
          { platform: "instagram", href: "#" },
        ]),
        order: i,
      },
    });
  }

  // ——— stats (5) ———
  const stats = [
    ["پروژه موفق", 480, "+"],
    ["برند خوشحال", 120, "+"],
    ["جایزه خلاقیت", 24, ""],
    ["سال تجربه", new Date().getFullYear() - 2017, ""],
    ["بازدید کمپین‌ها", 210, "M+"],
  ];
  for (let i = 0; i < stats.length; i++) {
    const [label, value, suffix] = stats[i] as [string, number, string];
    await db.stat.create({ data: { label, value, suffix, order: i } });
  }

  // ——— media library (16) ———
  const mediaItems = [
    ...Array.from({ length: 10 }).map((_, i) => ({
      url: IMG(`media-${i}`, 1200, 800),
      type: "IMAGE",
      name: `تصویر نمونه ${i + 1}.jpg`,
      alt: `تصویر رسانه ${i + 1}`,
      folder: i < 5 ? "portfolio" : "journal",
      width: 1200,
      height: 800,
      size: 240000 + i * 15000,
    })),
    ...Object.entries(VID)
      .slice(0, 6)
      .map(([k, url]) => ({
        url,
        type: "VIDEO",
        name: `${k}.mp4`,
        alt: `ویدیو ${k}`,
        folder: "video",
        width: 1920,
        height: 1080,
        size: 5_200_000,
      })),
  ];
  for (const m of mediaItems) await db.media.create({ data: m });

  // ——— leads / CRM (5) ———
  const leads = [
    ["شرکت نیکان", "info@nikan.com", "برندفیلم", "PROPOSAL", "می‌خواهیم یک تیزر سینمایی برای محصول جدیدمان بسازیم."],
    ["فروشگاه رها", "raha@shop.com", "دیجیتال مارکتینگ", "NEW", "به کمپین پرفورمنس برای فصل فروش نیاز داریم."],
    ["کلینیک آریا", "aria@clinic.com", "برندینگ", "CONTACTED", "قصد ری‌برندینگ کامل کلینیک را داریم."],
    ["استارتاپ ویرا", "hi@vira.io", "طراحی وب", "WON", "طراحی وب‌سایت و UI اپ.", ],
    ["هتل درسا", "dorsa@hotel.com", "فیلم تبلیغاتی", "LOST", "تیزر معرفی هتل.",],
  ];
  for (let i = 0; i < leads.length; i++) {
    const [name, email, service, status, message] = leads[i] as string[];
    await db.lead.create({
      data: {
        name,
        email,
        company: name,
        service,
        status,
        message,
        budget: ["زیر ۵۰م", "۵۰ تا ۱۵۰م", "۱۵۰ تا ۳۰۰م", "بالای ۳۰۰م"][i % 4],
        createdAt: new Date(Date.now() - i * 2 * 86400000),
      },
    });
  }

  // ——— settings ———
  await db.setting.create({
    data: {
      key: "site",
      value: J({
        maintenance: false,
        primaryColor: "#6699ff",
        heroHeadline: "طراحی کن. خلق کن. تأثیر بگذار.",
        contactEmail: "hello@arka.studio",
        defaultLocale: "fa",
        locales: ["fa", "en", "ar"],
      }),
    },
  });

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
