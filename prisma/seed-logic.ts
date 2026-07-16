/* ARKA — database seed with rich, realistic placeholder content.
   Media: Picsum (photos), Google sample MP4s (video), Pravatar (avatars).
   Swap all of these from the admin Media Library.

   Shared logic used by both the CLI seed script (prisma/seed.ts) and the
   one-time admin seed API route (app/api/admin/seed/route.ts). */
import { db } from "../lib/db";
import bcrypt from "bcryptjs";

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

export async function seedDatabase() {
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
  const wfEn = (a: string, b: string, c: string, d: string) =>
    J([
      { step: "01", title: "Discovery & Brief", desc: a },
      { step: "02", title: "Idea & Strategy", desc: b },
      { step: "03", title: "Production & Execution", desc: c },
      { step: "04", title: "Delivery & Analysis", desc: d },
    ]);
  const wfAr = (a: string, b: string, c: string, d: string) =>
    J([
      { step: "01", title: "الاكتشاف والملخص", desc: a },
      { step: "02", title: "الفكرة والاستراتيجية", desc: b },
      { step: "03", title: "الإنتاج والتنفيذ", desc: c },
      { step: "04", title: "التسليم والتحليل", desc: d },
    ]);
  const faq = () =>
    J([
      { q: "زمان اجرای پروژه چقدر است؟", a: "بسته به دامنه پروژه، معمولاً بین ۲ تا ۸ هفته زمان می‌برد." },
      { q: "هزینه چگونه محاسبه می‌شود؟", a: "پس از جلسه بریف و تعیین اسکوپ، پیشنهاد قیمت شفاف ارائه می‌شود." },
      { q: "امکان بازنگری وجود دارد؟", a: "بله، در هر پکیج تعداد مشخصی راند بازنگری در نظر گرفته شده است." },
    ]);
  const faqEn = () =>
    J([
      { q: "How long does a project take?", a: "Depending on scope, it usually takes 2 to 8 weeks." },
      { q: "How is the cost calculated?", a: "After a brief session and scoping, we provide a transparent price proposal." },
      { q: "Are revisions available?", a: "Yes, every package includes a set number of revision rounds." },
    ]);
  const faqAr = () =>
    J([
      { q: "كم تستغرق مدة تنفيذ المشروع؟", a: "حسب نطاق المشروع، عادة ما بين أسبوعين إلى 8 أسابيع." },
      { q: "كيف تُحتسب التكلفة؟", a: "بعد جلسة استماع لملخص المشروع وتحديد النطاق، نقدم عرض سعر شفافًا." },
      { q: "هل يمكن إجراء تعديلات؟", a: "نعم، تتضمن كل باقة عددًا محددًا من جولات المراجعة." },
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
  const pricingEn = (base: number) =>
    J([
      {
        name: "Basic",
        price: base.toLocaleString("en-US"),
        unit: "Toman",
        features: ["Initial consultation", "One revision round", "Standard delivery"],
      },
      {
        name: "Professional",
        price: (base * 2.4).toLocaleString("en-US"),
        unit: "Toman",
        features: ["Dedicated strategy", "Three revision rounds", "Express delivery", "3-month support"],
        featured: true,
      },
      {
        name: "Enterprise",
        price: "Contact us",
        unit: "",
        features: ["Dedicated team", "Unlimited revisions", "SLA contract", "Independent project manager"],
      },
    ]);
  const pricingAr = (base: number) =>
    J([
      {
        name: "الأساسية",
        price: base.toLocaleString("en-US"),
        unit: "تومان",
        features: ["استشارة أولية", "جولة مراجعة واحدة", "تسليم قياسي"],
      },
      {
        name: "الاحترافية",
        price: (base * 2.4).toLocaleString("en-US"),
        unit: "تومان",
        features: ["استراتيجية مخصصة", "ثلاث جولات مراجعة", "تسليم سريع", "دعم لمدة 3 أشهر"],
        featured: true,
      },
      {
        name: "المؤسسات",
        price: "تواصل معنا",
        unit: "",
        features: ["فريق مخصص", "مراجعات غير محدودة", "عقد اتفاقية مستوى خدمة (SLA)", "مدير مشروع مستقل"],
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
      taglineEn: "A cinematic narrative for your brand",
      taglineAr: "سرد سينمائي لعلامتك التجارية",
      excerpt: "از کانسپت تا اکران؛ تیزر تبلیغاتی، فیلم صنعتی و برندفیلم با کیفیت سینمایی.",
      excerptEn: "From concept to screen — ad films, industrial documentaries and brand films with cinematic quality.",
      excerptAr: "من الفكرة إلى الشاشة؛ أفلام إعلانية، أفلام صناعية وأفلام للعلامة التجارية بجودة سينمائية.",
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
      taglineEn: "Frames that sell",
      taglineAr: "لقطات تبيع",
      excerpt: "عکاسی محصول، صنعتی، فشن و لایف‌استایل در استودیو و لوکیشن.",
      excerptEn: "Product, industrial, fashion and lifestyle photography — in-studio and on location.",
      excerptAr: "تصوير المنتجات والتصوير الصناعي وتصوير الأزياء ونمط الحياة، في الاستوديو وفي الموقع.",
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
      taglineEn: "Motion, depth, wonder",
      taglineAr: "حركة، عمق، إبهار",
      excerpt: "انیمیشن دوبعدی و سه‌بعدی، ویژوال افکت و CGI فتورئال.",
      excerptEn: "2D and 3D animation, visual effects and photorealistic CGI.",
      excerptAr: "رسوم متحركة ثنائية وثلاثية الأبعاد، مؤثرات بصرية وتقنية CGI واقعية.",
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
      taglineEn: "An experience that converts",
      taglineAr: "تجربة تحقق التحويل",
      excerpt: "وب‌سایت‌های سریع، ریسپانسیو و سئوشده با تجربه کاربری لوکس.",
      excerptEn: "Fast, responsive, SEO-ready websites with a luxury user experience.",
      excerptAr: "مواقع سريعة ومتجاوبة ومهيأة لمحركات البحث بتجربة مستخدم فاخرة.",
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
      taglineEn: "A brand that's remembered",
      taglineAr: "علامة تجارية تُحفَظ في الذاكرة",
      excerpt: "استراتژی برند، لوگو، سیستم بصری و برندبوک کامل.",
      excerptEn: "Brand strategy, logo, visual system and a complete brand book.",
      excerptAr: "استراتيجية العلامة التجارية، الشعار، النظام البصري ودليل العلامة الكامل.",
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
      taglineEn: "Simple, beautiful, functional",
      taglineAr: "بسيطة، جميلة، عملية",
      excerpt: "پژوهش کاربر، پروتوتایپ و طراحی رابط اپلیکیشن و محصولات دیجیتال.",
      excerptEn: "User research, prototyping and interface design for apps and digital products.",
      excerptAr: "بحث المستخدم، النماذج الأولية وتصميم واجهات التطبيقات والمنتجات الرقمية.",
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
      taglineEn: "Measurable growth",
      taglineAr: "نمو قابل للقياس",
      excerpt: "کمپین پرفورمنس، تبلیغات هدفمند و بهینه‌سازی نرخ تبدیل.",
      excerptEn: "Performance campaigns, targeted ads and conversion rate optimization.",
      excerptAr: "حملات أداء، إعلانات مستهدفة وتحسين معدل التحويل.",
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
      taglineEn: "Visibility that lasts",
      taglineAr: "ظهور مستدام",
      excerpt: "سئوی تکنیکال، محتوای برنامه‌محور و لینک‌سازی طبیعی.",
      excerptEn: "Technical SEO, strategic content and natural link building.",
      excerptAr: "سيو تقني، محتوى استراتيجي وبناء روابط طبيعي.",
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
      taglineEn: "Build a loyal community",
      taglineAr: "ابنِ مجتمعًا وفيًا",
      excerpt: "استراتژی محتوا، تقویم انتشار، تولید ریلز و مدیریت کامیونیتی.",
      excerptEn: "Content strategy, publishing calendar, reels production and community management.",
      excerptAr: "استراتيجية المحتوى، تقويم النشر، إنتاج الريلز وإدارة المجتمع.",
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
      taglineEn: "Direction before creation",
      taglineAr: "التوجيه قبل الإبداع",
      excerpt: "پوزیشنینگ، آرکی‌تایپ برند، لحن گفتار و نقشه‌راه محتوا.",
      excerptEn: "Positioning, brand archetype, tone of voice and a content roadmap.",
      excerptAr: "تحديد الموقع التنافسي، النموذج الأصلي للعلامة، نبرة الصوت وخارطة طريق المحتوى.",
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
        taglineEn: s.taglineEn,
        taglineAr: s.taglineAr,
        excerpt: s.excerpt,
        excerptEn: s.excerptEn,
        excerptAr: s.excerptAr,
        description: `${s.excerpt} تیم آرکا با نگاهی سینمایی و داده‌محور، ${s.title} را از مرحله ایده تا اجرا و تحلیل نتایج پیش می‌برد؛ به‌گونه‌ای که خروجی نه‌فقط زیبا، بلکه اثرگذار و قابل‌اندازه‌گیری باشد.`,
        descriptionEn: `${s.excerptEn} With a cinematic, data-driven approach, the ARKA team carries ${s.titleEn} from idea through execution and results analysis — so the outcome isn't just beautiful, but effective and measurable.`,
        descriptionAr: `${s.excerptAr} بنظرة سينمائية قائمة على البيانات، يقود فريق آركا ${s.titleAr} من مرحلة الفكرة إلى التنفيذ وتحليل النتائج؛ بحيث تكون النتيجة ليست جميلة فحسب، بل مؤثرة وقابلة للقياس أيضًا.`,
        department: s.department,
        icon: s.icon,
        cover: IMG(s.seed, 1400, 900),
        heroVideo: i % 2 === 0 ? VID.blazes : VID.joyrides,
        priceFrom: s.priceFrom,
        priceUnit: "تومان",
        priceUnitEn: "Toman",
        priceUnitAr: "تومان",
        features: J([
          "تیم تخصصی و اختصاصی",
          "فرایند شفاف و مرحله‌به‌مرحله",
          "تحویل در ددلاین توافقی",
          "گزارش و تحلیل نتایج",
          "پشتیبانی پس از تحویل",
        ]),
        featuresEn: J([
          "Dedicated expert team",
          "A clear, step-by-step process",
          "Delivery on the agreed deadline",
          "Results reporting & analysis",
          "Post-delivery support",
        ]),
        featuresAr: J([
          "فريق متخصص ومخصص",
          "عملية واضحة ومرحلية",
          "التسليم في الموعد المتفق عليه",
          "تقرير وتحليل النتائج",
          "دعم ما بعد التسليم",
        ]),
        workflow: wf(
          "درک عمیق برند، بازار و اهداف کسب‌وکار شما.",
          "طراحی ایده خلاقانه و نقشه‌راه اجرایی.",
          "اجرای حرفه‌ای با بالاترین استانداردهای کیفی.",
          "تحویل نهایی همراه با گزارش عملکرد و بهینه‌سازی.",
        ),
        workflowEn: wfEn(
          "A deep understanding of your brand, market and business goals.",
          "Designing the creative idea and an executable roadmap.",
          "Professional execution with the highest quality standards.",
          "Final delivery with a performance report and optimization.",
        ),
        workflowAr: wfAr(
          "فهم عميق لعلامتك التجارية والسوق وأهداف عملك.",
          "تصميم الفكرة الإبداعية وخارطة طريق قابلة للتنفيذ.",
          "تنفيذ احترافي بأعلى معايير الجودة.",
          "التسليم النهائي مع تقرير أداء وتحسين مستمر.",
        ),
        faqs: faq(),
        faqsEn: faqEn(),
        faqsAr: faqAr(),
        pricing: pricing(s.priceFrom),
        pricingEn: pricingEn(s.priceFrom),
        pricingAr: pricingAr(s.priceFrom),
        order: i,
        metaTitle: `${s.title} | خدمات آرکا`,
        metaTitleEn: `${s.titleEn} | ARKA Services`,
        metaTitleAr: `${s.titleAr} | خدمات آركا`,
        metaDescription: s.excerpt,
        metaDescriptionEn: s.excerptEn,
        metaDescriptionAr: s.excerptAr,
        keywords: J([s.titleEn, s.title, "آرکا", "دیجیتال مارکتینگ"]),
        keywordsEn: J([s.titleEn, s.title, "ARKA", "Digital Marketing"]),
        keywordsAr: J([s.titleAr, s.titleEn, "آركا", "التسويق الرقمي"]),
      },
    });
  }

  // ——— industries (12) ———
  const industries = [
    { slug: "medical", title: "پزشکی و سلامت", en: "Medical & Health", ar: "الطب والصحة", icon: "Stethoscope", seed: "ind-medical" },
    { slug: "automotive", title: "خودرو", en: "Automotive", ar: "السيارات", icon: "Car", seed: "ind-auto" },
    { slug: "fashion", title: "مد و فشن", en: "Fashion", ar: "الموضة", icon: "Shirt", seed: "ind-fashion" },
    { slug: "startups", title: "استارتاپ‌ها", en: "Startups", ar: "الشركات الناشئة", icon: "Rocket", seed: "ind-startup" },
    { slug: "real-estate", title: "املاک و مستغلات", en: "Real Estate", ar: "العقارات", icon: "Building2", seed: "ind-realestate" },
    { slug: "food", title: "رستوران و کافه", en: "Food & Beverage", ar: "الأغذية والمشروبات", icon: "UtensilsCrossed", seed: "ind-food" },
    { slug: "beauty", title: "زیبایی و آرایشی", en: "Beauty & Cosmetics", ar: "التجميل ومستحضرات التجميل", icon: "Sparkles", seed: "ind-beauty" },
    { slug: "technology", title: "فناوری و صنعت", en: "Technology", ar: "التكنولوجيا", icon: "Cpu", seed: "ind-tech" },
    { slug: "fintech", title: "مالی و فین‌تک", en: "Finance & Fintech", ar: "التمويل والتكنولوجيا المالية", icon: "Landmark", seed: "ind-fintech" },
    { slug: "hospitality", title: "گردشگری و هتلداری", en: "Hospitality", ar: "الضيافة والسياحة", icon: "Plane", seed: "ind-hospitality" },
    { slug: "education", title: "آموزش", en: "Education", ar: "التعليم", icon: "GraduationCap", seed: "ind-education" },
    { slug: "retail", title: "خرده‌فروشی و ای‌کامرس", en: "Retail & E‑commerce", ar: "التجزئة والتجارة الإلكترونية", icon: "ShoppingBag", seed: "ind-retail" },
  ];
  const indVideos = [VID.blazes, VID.joyrides, VID.fun, VID.meltdowns, VID.escapes, VID.elephants];
  for (let i = 0; i < industries.length; i++) {
    const ind = industries[i];
    await db.industry.create({
      data: {
        slug: ind.slug,
        title: ind.title,
        titleEn: ind.en,
        titleAr: ind.ar,
        icon: ind.icon,
        excerpt: `راهکارهای خلاق و دیجیتال اختصاصی برای صنعت ${ind.title}.`,
        excerptEn: `Dedicated creative and digital solutions for the ${ind.en} industry.`,
        excerptAr: `حلول إبداعية ورقمية مخصصة لصناعة ${ind.ar}.`,
        description: `آرکا با درک عمیق از پویایی صنعت ${ind.title}، کمپین‌ها و محتوایی می‌سازد که با مخاطب این حوزه ارتباط برقرار می‌کند و به نتایج تجاری قابل‌اندازه‌گیری می‌رسد.`,
        descriptionEn: `With a deep understanding of the ${ind.en} industry's dynamics, ARKA creates campaigns and content that connect with this field's audience and deliver measurable business results.`,
        descriptionAr: `بفهم عميق لديناميكيات صناعة ${ind.ar}، تصنع آركا حملات ومحتوى يتواصل مع جمهور هذا المجال ويحقق نتائج تجارية قابلة للقياس.`,
        cover: IMG(ind.seed, 1600, 1000),
        heroVideo: indVideos[i % indVideos.length],
        approach: J([
          `شناخت پرسونا و سفر مشتری در صنعت ${ind.title}`,
          "پیام‌سازی متناسب با قواعد و حساسیت‌های حوزه",
          "انتخاب کانال و فرمت بهینه برای بیشترین اثر",
          "سنجش، بهینه‌سازی و مقیاس‌دهی کمپین",
        ]),
        approachEn: J([
          `Understanding the persona and customer journey in the ${ind.en} industry`,
          "Messaging tailored to the field's rules and sensitivities",
          "Choosing the optimal channel and format for maximum impact",
          "Measuring, optimizing and scaling the campaign",
        ]),
        approachAr: J([
          `فهم الشخصية ورحلة العميل في صناعة ${ind.ar}`,
          "صياغة رسائل تناسب قواعد وحساسيات هذا المجال",
          "اختيار القناة والصيغة المثلى لتحقيق أكبر تأثير",
          "قياس الحملة وتحسينها وتوسيع نطاقها",
        ]),
        order: i,
        metaTitle: `راهکار صنعت ${ind.title} | آرکا`,
        metaTitleEn: `${ind.en} Industry Solutions | ARKA`,
        metaTitleAr: `حلول صناعة ${ind.ar} | آركا`,
        metaDescription: `خدمات تخصصی آرکا برای صنعت ${ind.title}.`,
        metaDescriptionEn: `ARKA's specialized services for the ${ind.en} industry.`,
        metaDescriptionAr: `خدمات آركا المتخصصة لصناعة ${ind.ar}.`,
        keywords: J([ind.title, ind.en, "آرکا"]),
        keywordsEn: J([ind.en, "ARKA"]),
        keywordsAr: J([ind.ar, "آركا"]),
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
  const creditsEn = J([
    { role: "Director", name: "Ali Jafari" },
    { role: "Director of Photography", name: "Negar Moradi" },
    { role: "Editor", name: "Saman Karimi" },
    { role: "Sound Designer", name: "Raha Ahmadi" },
  ]);
  const creditsAr = J([
    { role: "المخرج", name: "Ali Jafari" },
    { role: "مدير التصوير", name: "Negar Moradi" },
    { role: "المونتاج", name: "Saman Karimi" },
    { role: "مصمم الصوت", name: "Raha Ahmadi" },
  ]);
  const CATEGORY_EN: Record<string, string> = {
    "فیلم تبلیغاتی": "Ad Film",
    "برندینگ": "Branding",
    "دیجیتال مارکتینگ": "Digital Marketing",
    "طراحی وب": "Web Design",
    "موشن‌گرافیک": "Motion Graphics",
  };
  const CATEGORY_AR: Record<string, string> = {
    "فیلم تبلیغاتی": "فيلم إعلاني",
    "برندینگ": "العلامة التجارية",
    "دیجیتال مارکتینگ": "التسويق الرقمي",
    "طراحی وب": "تصميم المواقع",
    "موشن‌گرافیک": "الموشن غرافيك",
  };

  const projects = [
    {
      slug: "arian-beyond-the-road",
      title: "کمپین سینمایی «فراتر از جاده»",
      titleEn: "Beyond The Road",
      titleAr: "أبعد من الطريق",
      subtitle: "برندفیلم و کمپین ۳۶۰ درجه برای رونمایی خودرو",
      subtitleEn: "A brand film and 360° campaign for a car launch",
      subtitleAr: "فيلم للعلامة التجارية وحملة 360 درجة لإطلاق سيارة",
      client: "auto",
      category: "فیلم تبلیغاتی",
      seed: "prj-auto",
      services: ["video-production", "motion-cgi", "digital-marketing"],
      industries: ["automotive"],
      video: VID.joyrides,
      accent: "#6699ff",
      tags: ["برندفیلم", "خودرو", "CGI", "کمپین ۳۶۰"],
      tagsEn: ["Brand Film", "Automotive", "CGI", "360 Campaign"],
      tagsAr: ["فيلم العلامة التجارية", "السيارات", "CGI", "حملة 360"],
      metrics: metric(["بازدید کمپین", "۸.۴", "میلیون"], ["افزایش سرنخ فروش", "۳۲", "٪"], ["نرخ تعامل", "۶.۱", "٪"]),
      metricsEn: metric(["Campaign Views", "8.4", "M"], ["Sales Lead Growth", "32", "%"], ["Engagement Rate", "6.1", "%"]),
      metricsAr: metric(["مشاهدات الحملة", "8.4", "مليون"], ["نمو العملاء المحتملين", "32", "٪"], ["معدل التفاعل", "6.1", "٪"]),
    },
    {
      slug: "novan-rebrand",
      title: "ری‌برندینگ کلینیک زیبایی نُوان",
      titleEn: "Novan Rebrand",
      titleAr: "إعادة تسمية نُوان",
      subtitle: "از هویت بصری تا تجربه دیجیتال کلینیک لوکس",
      subtitleEn: "From visual identity to the digital experience of a luxury clinic",
      subtitleAr: "من الهوية البصرية إلى التجربة الرقمية لعيادة فاخرة",
      client: "novan",
      category: "برندینگ",
      seed: "prj-novan",
      services: ["branding", "web-design", "photography"],
      industries: ["beauty", "medical"],
      video: VID.fun,
      accent: "#a6c9ff",
      tags: ["ری‌برندینگ", "هویت بصری", "کلینیک"],
      tagsEn: ["Rebranding", "Visual Identity", "Clinic"],
      tagsAr: ["إعادة العلامة التجارية", "الهوية البصرية", "عيادة"],
      metrics: metric(["افزایش رزرو آنلاین", "۲.۷", "برابر"], ["یادآوری برند", "۴۸", "٪"], ["رضایت مشتری", "۹۶", "٪"]),
      metricsEn: metric(["Online Booking Growth", "2.7", "x"], ["Brand Recall", "48", "%"], ["Customer Satisfaction", "96", "%"]),
      metricsAr: metric(["نمو الحجوزات الإلكترونية", "2.7", "×"], ["تذكر العلامة التجارية", "48", "٪"], ["رضا العملاء", "96", "٪"]),
    },
    {
      slug: "mana-fashion-launch",
      title: "لانچ برند فشن مانا",
      titleEn: "Mana Launch",
      titleAr: "إطلاق مانا",
      subtitle: "کمپین راه‌اندازی و کالکشن‌فیلم پاییزه",
      subtitleEn: "Launch campaign and an autumn collection film",
      subtitleAr: "حملة إطلاق وفيلم مجموعة الخريف",
      client: "mana",
      category: "فیلم تبلیغاتی",
      seed: "prj-mana",
      services: ["video-production", "photography", "social-media"],
      industries: ["fashion", "retail"],
      video: VID.blazes,
      accent: "#7aa6ff",
      tags: ["فشن‌فیلم", "لانچ برند", "سوشال"],
      tagsEn: ["Fashion Film", "Brand Launch", "Social"],
      tagsAr: ["فيلم أزياء", "إطلاق العلامة التجارية", "التواصل الاجتماعي"],
      metrics: metric(["فالوئر جدید", "۱۲۰", "هزار"], ["فروش هفته اول", "۱.۹", "میلیارد"], ["ری‌چ اینستاگرام", "۴.۲", "میلیون"]),
      metricsEn: metric(["New Followers", "120", "K"], ["First-week Sales", "1.9", "B Toman"], ["Instagram Reach", "4.2", "M"]),
      metricsAr: metric(["متابعون جدد", "120", "ألف"], ["مبيعات الأسبوع الأول", "1.9", "مليار تومان"], ["وصول انستغرام", "4.2", "مليون"]),
    },
    {
      slug: "digiland-performance",
      title: "کمپین پرفورمنس دیجی‌لند",
      titleEn: "DigiLand Performance",
      titleAr: "أداء ديجي‌لاند",
      subtitle: "بهینه‌سازی قیف فروش و مقیاس‌دهی تبلیغات",
      subtitleEn: "Sales funnel optimization and ad scaling",
      subtitleAr: "تحسين قمع المبيعات وتوسيع نطاق الإعلانات",
      client: "digiland",
      category: "دیجیتال مارکتینگ",
      seed: "prj-digiland",
      services: ["digital-marketing", "seo", "ui-ux"],
      industries: ["retail"],
      video: VID.meltdowns,
      accent: "#6699ff",
      tags: ["پرفورمنس", "CRO", "ای‌کامرس"],
      tagsEn: ["Performance", "CRO", "E-commerce"],
      tagsAr: ["الأداء", "تحسين معدل التحويل", "التجارة الإلكترونية"],
      metrics: metric(["کاهش هزینه جذب", "۳۸", "٪"], ["رشد نرخ تبدیل", "۲.۳", "برابر"], ["بازگشت هزینه (ROAS)", "۴.۸", "x"]),
      metricsEn: metric(["Acquisition Cost Reduction", "38", "%"], ["Conversion Rate Growth", "2.3", "x"], ["Return on Ad Spend (ROAS)", "4.8", "x"]),
      metricsAr: metric(["خفض تكلفة الاكتساب", "38", "٪"], ["نمو معدل التحويل", "2.3", "×"], ["العائد على الإنفاق الإعلاني", "4.8", "×"]),
    },
    {
      slug: "arman-steel-industrial",
      title: "فیلم صنعتی فولاد آرمان",
      titleEn: "Arman Steel",
      titleAr: "آرمان للصلب",
      subtitle: "مستند صنعتی از خط تولید تا صادرات",
      subtitleEn: "An industrial documentary from the production line to export",
      subtitleAr: "فيلم وثائقي صناعي من خط الإنتاج إلى التصدير",
      client: "folad",
      category: "فیلم تبلیغاتی",
      seed: "prj-folad",
      services: ["video-production", "photography"],
      industries: ["technology"],
      video: VID.elephants,
      accent: "#162d73",
      tags: ["فیلم صنعتی", "مستند", "B2B"],
      tagsEn: ["Industrial Film", "Documentary", "B2B"],
      tagsAr: ["فيلم صناعي", "وثائقي", "أعمال بين الشركات"],
      metrics: metric(["نمایش در نمایشگاه", "۱۵", "کشور"], ["افزایش استعلام", "۵۴", "٪"], ["زمان تولید", "۶", "هفته"]),
      metricsEn: metric(["Exhibited Across", "15", "Countries"], ["Inquiry Growth", "54", "%"], ["Production Time", "6", "Weeks"]),
      metricsAr: metric(["عُرض في", "15", "دولة"], ["نمو الاستفسارات", "54", "٪"], ["مدة الإنتاج", "6", "أسابيع"]),
    },
    {
      slug: "almas-residence-web",
      title: "وب‌سایت لوکس الماس رزیدنس",
      titleEn: "Almas Residence",
      titleAr: "الماس ريزيدنس",
      subtitle: "تجربه دیجیتال املاک لوکس با تور مجازی",
      subtitleEn: "A luxury real-estate digital experience with a virtual tour",
      subtitleAr: "تجربة رقمية فاخرة للعقارات مع جولة افتراضية",
      client: "almas",
      category: "طراحی وب",
      seed: "prj-almas",
      services: ["web-design", "ui-ux", "photography"],
      industries: ["real-estate"],
      video: VID.escapes,
      accent: "#a6c9ff",
      tags: ["وب لوکس", "تور مجازی", "املاک"],
      tagsEn: ["Luxury Web", "Virtual Tour", "Real Estate"],
      tagsAr: ["موقع فاخر", "جولة افتراضية", "عقارات"],
      metrics: metric(["مدت حضور در سایت", "۴:۱۲", ""], ["درخواست بازدید", "۳.۱", "برابر"], ["امتیاز لایت‌هاوس", "۹۹", "/۱۰۰"]),
      metricsEn: metric(["Time on Site", "4:12", ""], ["Visit Requests", "3.1", "x"], ["Lighthouse Score", "99", "/100"]),
      metricsAr: metric(["مدة البقاء في الموقع", "4:12", ""], ["طلبات الزيارة", "3.1", "×"], ["نتيجة Lighthouse", "99", "/100"]),
    },
    {
      slug: "paypod-rebrand",
      title: "ری‌برندینگ فین‌تک پی‌پاد",
      titleEn: "PayPod Rebrand",
      titleAr: "إعادة تسمية باي‌بود",
      subtitle: "هویت و محصول دیجیتال یک اپلیکیشن پرداخت",
      subtitleEn: "Identity and digital product for a payment app",
      subtitleAr: "الهوية والمنتج الرقمي لتطبيق دفع",
      client: "paypod",
      category: "برندینگ",
      seed: "prj-paypod",
      services: ["branding", "ui-ux", "motion-cgi"],
      industries: ["fintech", "startups"],
      video: VID.sintel,
      accent: "#6699ff",
      tags: ["فین‌تک", "دیزاین سیستم", "اپلیکیشن"],
      tagsEn: ["Fintech", "Design System", "App"],
      tagsAr: ["تكنولوجيا مالية", "نظام تصميم", "تطبيق"],
      metrics: metric(["نصب اپ", "۵۰۰", "هزار"], ["نرخ نگهداشت", "۴۱", "٪"], ["امتیاز استور", "۴.۸", "/۵"]),
      metricsEn: metric(["App Installs", "500", "K"], ["Retention Rate", "41", "%"], ["Store Rating", "4.8", "/5"]),
      metricsAr: metric(["تثبيتات التطبيق", "500", "ألف"], ["معدل الاحتفاظ", "41", "٪"], ["تقييم المتجر", "4.8", "/5"]),
    },
    {
      slug: "toranj-content",
      title: "کمپین محتوایی رستوران ترنج",
      titleEn: "Toranj Content",
      titleAr: "محتوى ترنج",
      subtitle: "استوری‌تلینگ آشپزی و مدیریت سوشال",
      subtitleEn: "Culinary storytelling and social media management",
      subtitleAr: "سرد قصصي للطهي وإدارة وسائل التواصل",
      client: "toranj",
      category: "دیجیتال مارکتینگ",
      seed: "prj-toranj",
      services: ["social-media", "photography", "brand-strategy"],
      industries: ["food"],
      video: VID.fun,
      accent: "#7aa6ff",
      tags: ["فودفوتوگرافی", "سوشال", "محتوا"],
      tagsEn: ["Food Photography", "Social", "Content"],
      tagsAr: ["تصوير الطعام", "التواصل الاجتماعي", "المحتوى"],
      metrics: metric(["رزرو از اینستاگرام", "۲.۲", "برابر"], ["ویو ریلز", "۹.۵", "میلیون"], ["نرخ تعامل", "۸.۳", "٪"]),
      metricsEn: metric(["Reservations via Instagram", "2.2", "x"], ["Reels Views", "9.5", "M"], ["Engagement Rate", "8.3", "%"]),
      metricsAr: metric(["الحجوزات عبر انستغرام", "2.2", "×"], ["مشاهدات الريلز", "9.5", "مليون"], ["معدل التفاعل", "8.3", "٪"]),
    },
    {
      slug: "doctorly-app",
      title: "لانچ اپلیکیشن سلامت داکترلی",
      titleEn: "Doctorly App",
      titleAr: "تطبيق دكترلي",
      subtitle: "موشن، رابط کاربری و کمپین جذب کاربر",
      subtitleEn: "Motion, UI and a user-acquisition campaign",
      subtitleAr: "الموشن، واجهة المستخدم وحملة اكتساب المستخدمين",
      client: "doctorly",
      category: "موشن‌گرافیک",
      seed: "prj-doctorly",
      services: ["motion-cgi", "ui-ux", "digital-marketing"],
      industries: ["medical", "startups"],
      video: VID.steel,
      accent: "#a6c9ff",
      tags: ["هلث‌تک", "موشن", "لانچ"],
      tagsEn: ["HealthTech", "Motion", "Launch"],
      tagsAr: ["تكنولوجيا صحية", "موشن", "إطلاق"],
      metrics: metric(["ثبت‌نام هفته اول", "۸۰", "هزار"], ["هزینه جذب", "-۴۵", "٪"], ["ویزیت آنلاین", "۳.۶", "برابر"]),
      metricsEn: metric(["First-week Signups", "80", "K"], ["Acquisition Cost", "-45", "%"], ["Online Visits", "3.6", "x"]),
      metricsAr: metric(["تسجيلات الأسبوع الأول", "80", "ألف"], ["تكلفة الاكتساب", "-45", "٪"], ["الزيارات الإلكترونية", "3.6", "×"]),
    },
    {
      slug: "kishland-tourism",
      title: "تیزر گردشگری کیش‌لند",
      titleEn: "KishLand",
      titleAr: "كيش‌لاند",
      subtitle: "برندفیلم مقصد گردشگری و کمپین فصلی",
      subtitleEn: "A destination brand film and seasonal campaign",
      subtitleAr: "فيلم علامة تجارية لوجهة سياحية وحملة موسمية",
      client: "kishland",
      category: "فیلم تبلیغاتی",
      seed: "prj-kish",
      services: ["video-production", "motion-cgi", "social-media"],
      industries: ["hospitality"],
      video: VID.joyrides,
      accent: "#6699ff",
      tags: ["گردشگری", "برندفیلم", "کمپین فصلی"],
      tagsEn: ["Tourism", "Brand Film", "Seasonal Campaign"],
      tagsAr: ["السياحة", "فيلم العلامة التجارية", "حملة موسمية"],
      metrics: metric(["بازدید تیزر", "۶.۷", "میلیون"], ["رشد رزرو تور", "۲.۹", "برابر"], ["اشتراک‌گذاری", "۱۴۰", "هزار"]),
      metricsEn: metric(["Ad Views", "6.7", "M"], ["Tour Booking Growth", "2.9", "x"], ["Shares", "140", "K"]),
      metricsAr: metric(["مشاهدات الإعلان", "6.7", "مليون"], ["نمو حجوزات الجولات", "2.9", "×"], ["المشاركات", "140", "ألف"]),
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await db.project.create({
      data: {
        slug: p.slug,
        title: p.title,
        titleEn: p.titleEn,
        titleAr: p.titleAr,
        subtitle: p.subtitle,
        subtitleEn: p.subtitleEn,
        subtitleAr: p.subtitleAr,
        category: p.category,
        categoryEn: CATEGORY_EN[p.category] ?? p.category,
        categoryAr: CATEGORY_AR[p.category] ?? p.category,
        cover: IMG(p.seed, 1600, 1100),
        poster: IMG(p.seed, 1600, 900),
        heroVideo: p.video,
        gallery: J([IMG(`${p.seed}-a`, 1200, 800), IMG(`${p.seed}-b`, 1200, 1500), IMG(`${p.seed}-c`, 1200, 800), IMG(`${p.seed}-d`, 1200, 900)]),
        year: 2024 - (i % 3),
        location: "تهران، ایران",
        locationEn: "Tehran, Iran",
        locationAr: "طهران، إيران",
        accent: p.accent,
        featured: i < 6,
        order: i,
        views: 1200 + i * 337,
        tags: J(p.tags),
        tagsEn: J(p.tagsEn),
        tagsAr: J(p.tagsAr),
        goal: `هدف اصلی این پروژه، ${p.subtitle} بود؛ به‌طوری‌که برند ${clientDefs[i]?.name ?? ""} بتواند جایگاه متمایزی در ذهن مخاطب هدف خود بسازد و به رشد تجاری ملموس برسد.`,
        goalEn: `The main goal of this project was ${p.subtitleEn}, so that ${clientDefs[i]?.nameEn ?? ""} could build a distinct position in its target audience's mind and achieve tangible business growth.`,
        goalAr: `كان الهدف الرئيسي لهذا المشروع هو ${p.subtitleAr}؛ بحيث تتمكن علامة ${clientDefs[i]?.nameEn ?? ""} من بناء مكانة متميزة في ذهن جمهورها المستهدف وتحقيق نمو تجاري ملموس.`,
        problem: "برند با فضای رقابتی شلوغ، پیام پراکنده و ارتباط ضعیف با نسل جدید مخاطب روبه‌رو بود. کمپین‌های پیشین اثر کوتاه‌مدت داشتند و هویت یکپارچه‌ای شکل نگرفته بود.",
        problemEn: "The brand faced a crowded competitive landscape, scattered messaging, and a weak connection with a new generation of audiences. Previous campaigns had only short-term impact, and no cohesive identity had taken shape.",
        problemAr: "واجهت العلامة التجارية بيئة تنافسية مزدحمة، ورسائل متفرقة، وضعف تواصل مع جيل جديد من الجمهور. كانت الحملات السابقة ذات تأثير قصير الأمد، ولم تتشكل هوية موحدة بعد.",
        idea: "ایده مرکزی ما یک روایت انسانی و سینمایی بود که ارزش واقعی برند را نه با شعار، بلکه با تجربه و احساس منتقل می‌کرد؛ روایتی که در همه کانال‌ها به‌شکل یکپارچه بازتاب پیدا کرد.",
        ideaEn: "Our central idea was a human, cinematic narrative that conveyed the brand's real value not through slogans but through experience and emotion — a story reflected consistently across every channel.",
        ideaAr: "كانت فكرتنا المحورية سردًا إنسانيًا وسينمائيًا ينقل القيمة الحقيقية للعلامة التجارية ليس عبر الشعارات، بل عبر التجربة والمشاعر؛ قصة انعكست بشكل متسق عبر جميع القنوات.",
        production: "تولید در چند فاز انجام شد: پیش‌تولید و استوری‌بورد، فیلم‌برداری با تجهیزات سینمایی، طراحی صحنه و نور، سپس تدوین، اصلاح رنگ و طراحی صدای اختصاصی برای خلق حس نهایی.",
        productionEn: "Production ran across several phases: pre-production and storyboarding, filming with cinema-grade equipment, set and lighting design, followed by editing, color grading and custom sound design to craft the final feel.",
        productionAr: "تم الإنتاج على عدة مراحل: ما قبل الإنتاج ولوحة القصة المصورة، التصوير بمعدات سينمائية، تصميم المشهد والإضاءة، ثم المونتاج وتصحيح الألوان وتصميم الصوت المخصص لخلق الإحساس النهائي.",
        marketing: "خروجی‌ها در قالب یک کمپین ۳۶۰ درجه شامل تلویزیون، دیجیتال، سوشال و اجرای محیطی منتشر شد و با تبلیغات هدفمند و بهینه‌سازی مستمر به بیشترین بازده رسید.",
        marketingEn: "The outputs were released as a 360° campaign across TV, digital, social and out-of-home, reaching peak performance through targeted advertising and continuous optimization.",
        marketingAr: "أُطلقت المخرجات كحملة 360 درجة شملت التلفزيون والرقمي والتواصل الاجتماعي والإعلانات الخارجية، ووصلت إلى أعلى أداء عبر الإعلانات المستهدفة والتحسين المستمر.",
        result: "نتیجه، جهشی در آگاهی از برند و شاخص‌های تجاری بود؛ کمپین نه‌تنها دیده شد، بلکه رفتار مخاطب را تغییر داد و به فروش و وفاداری تبدیل شد.",
        resultEn: "The result was a leap in brand awareness and business metrics — the campaign wasn't just seen, it changed audience behavior and converted into sales and loyalty.",
        resultAr: "كانت النتيجة قفزة في الوعي بالعلامة التجارية والمؤشرات التجارية؛ فالحملة لم تُشاهَد فحسب، بل غيّرت سلوك الجمهور وتحولت إلى مبيعات وولاء.",
        metrics: p.metrics,
        metricsEn: p.metricsEn,
        metricsAr: p.metricsAr,
        beforeImage: IMG(`${p.seed}-before`, 1200, 800),
        afterImage: IMG(`${p.seed}-after`, 1200, 800),
        credits,
        creditsEn,
        creditsAr,
        client: { connect: { id: clientMap[p.client] } },
        services: { connect: p.services.map((slug) => ({ slug })) },
        industries: { connect: p.industries.map((slug) => ({ slug })) },
        seo: {
          create: {
            metaTitle: `${p.title} | نمونه‌کار آرکا`,
            metaTitleEn: `${p.titleEn} | ARKA Portfolio`,
            metaTitleAr: `${p.titleAr} | أعمال آركا`,
            metaDescription: p.subtitle,
            metaDescriptionEn: p.subtitleEn,
            metaDescriptionAr: p.subtitleAr,
            ogImage: IMG(p.seed, 1200, 630),
            keywords: J(p.tags),
            keywordsEn: J(p.tagsEn),
            keywordsAr: J(p.tagsAr),
          },
        },
      },
    });
  }

  // ——— posts (8) ———
  const CAT_EN: Record<string, string> = {
    "استراتژی برند": "Brand Strategy",
    "دیجیتال مارکتینگ": "Digital Marketing",
    "پروداکشن": "Production",
    "برندینگ": "Branding",
    "طراحی": "Design",
    "سوشال مدیا": "Social Media",
    "سئو": "SEO",
  };
  const CAT_AR: Record<string, string> = {
    "استراتژی برند": "استراتيجية العلامة التجارية",
    "دیجیتال مارکتینگ": "التسويق الرقمي",
    "پروداکشن": "الإنتاج",
    "برندینگ": "العلامة التجارية",
    "طراحی": "التصميم",
    "سوشال مدیا": "وسائل التواصل الاجتماعي",
    "سئو": "تحسين محركات البحث",
  };
  const postDefs = [
    { slug: "cinematic-brand-film", title: "چرا برندفیلم سینمایی، آینده تبلیغات است؟", titleEn: "Why Cinematic Brand Films Are the Future of Advertising", titleAr: "لماذا تُعد أفلام العلامات التجارية السينمائية مستقبل الإعلان؟", cat: "استراتژی برند", seed: "post-1" },
    { slug: "performance-marketing-2025", title: "راهنمای کامل پرفورمنس مارکتینگ در ۱۴۰۴", titleEn: "The Complete Guide to Performance Marketing in 2025", titleAr: "الدليل الكامل للتسويق بالأداء في 2025", cat: "دیجیتال مارکتینگ", seed: "post-2" },
    { slug: "color-grading-secrets", title: "رازهای اصلاح رنگ سینمایی در تیزر تبلیغاتی", titleEn: "The Secrets of Cinematic Color Grading in Ad Films", titleAr: "أسرار تصحيح الألوان السينمائي في الأفلام الإعلانية", cat: "پروداکشن", seed: "post-3" },
    { slug: "brand-identity-system", title: "آناتومی یک سیستم هویت بصری ماندگار", titleEn: "The Anatomy of a Lasting Visual Identity System", titleAr: "تشريح نظام هوية بصرية دائمة", cat: "برندینگ", seed: "post-4" },
    { slug: "ux-that-converts", title: "طراحی تجربه‌ای که واقعاً تبدیل می‌کند", titleEn: "Designing an Experience That Actually Converts", titleAr: "تصميم تجربة تحقق التحويل فعليًا", cat: "طراحی", seed: "post-5" },
    { slug: "storytelling-framework", title: "چارچوب استوری‌تلینگ برند در شش گام", titleEn: "A Six-Step Brand Storytelling Framework", titleAr: "إطار عمل سرد قصة العلامة التجارية في ست خطوات", cat: "استراتژی برند", seed: "post-6" },
    { slug: "reels-that-sell", title: "ساخت ریلزی که می‌فروشد؛ از ایده تا انتشار", titleEn: "Making Reels That Sell: From Idea to Publish", titleAr: "صناعة ريلز يبيع: من الفكرة إلى النشر", cat: "سوشال مدیا", seed: "post-7" },
    { slug: "seo-technical-guide", title: "سئوی تکنیکال؛ زیرساخت دیده‌شدن پایدار", titleEn: "Technical SEO: The Infrastructure of Lasting Visibility", titleAr: "السيو التقني؛ البنية التحتية للظهور المستدام", cat: "سئو", seed: "post-8" },
  ];
  const body = (t: string) =>
    `## مقدمه\n\n${t} در این مقاله از ژورنال آرکا، نگاهی عمیق و کاربردی به این موضوع می‌اندازیم و تجربه‌های واقعی تیم را مرور می‌کنیم.\n\n![تصویر شاخص](${IMG("post-inline", 1200, 700)})\n\n## چرا اهمیت دارد؟\n\nبرندهای پیشرو می‌دانند که تمایز، نتیجه‌ی تصمیم‌های آگاهانه است. کیفیت بصری، پیام روشن و اجرای منسجم، سه ستون هر کمپین موفق‌اند.\n\n> خلاقیت بدون استراتژی، هنر است؛ خلاقیت با استراتژی، بازاریابی.\n\n## گام‌های عملی\n\n- شناخت دقیق مخاطب و بازار\n- طراحی ایده مرکزی و روایت\n- انتخاب کانال و فرمت مناسب\n- سنجش، تحلیل و بهینه‌سازی مستمر\n\n## جمع‌بندی\n\nاثرگذاری واقعی زمانی رخ می‌دهد که خلاقیت و داده در کنار هم قرار بگیرند. تیم آرکا آماده است تا این مسیر را کنار برند شما طی کند.`;
  const bodyEn = (t: string) =>
    `## Introduction\n\n${t} In this article from the ARKA Journal, we take a deep, practical look at this topic and review our team's real-world experience.\n\n![Featured image](${IMG("post-inline", 1200, 700)})\n\n## Why It Matters\n\nLeading brands know that differentiation is the result of deliberate decisions. Visual quality, a clear message and consistent execution are the three pillars of every successful campaign.\n\n> Creativity without strategy is art; creativity with strategy is marketing.\n\n## Practical Steps\n\n- A precise understanding of the audience and market\n- Designing the central idea and narrative\n- Choosing the right channel and format\n- Continuous measurement, analysis and optimization\n\n## Conclusion\n\nReal impact happens when creativity and data come together. The ARKA team is ready to walk this path alongside your brand.`;
  const bodyAr = (t: string) =>
    `## المقدمة\n\n${t} في هذا المقال من مدونة آركا، نلقي نظرة عميقة وعملية على هذا الموضوع ونستعرض تجارب فريقنا الحقيقية.\n\n![الصورة البارزة](${IMG("post-inline", 1200, 700)})\n\n## لماذا يهم هذا الموضوع؟\n\nتعلم العلامات التجارية الرائدة أن التميز هو نتيجة قرارات واعية. الجودة البصرية، الرسالة الواضحة، والتنفيذ المتسق هي الركائز الثلاث لأي حملة ناجحة.\n\n> الإبداع بلا استراتيجية فن؛ والإبداع مع الاستراتيجية تسويق.\n\n## خطوات عملية\n\n- فهم دقيق للجمهور والسوق\n- تصميم الفكرة المحورية والسرد القصصي\n- اختيار القناة والصيغة المناسبتين\n- القياس والتحليل والتحسين المستمر\n\n## الخلاصة\n\nيحدث التأثير الحقيقي عندما يجتمع الإبداع مع البيانات. فريق آركا مستعد لخوض هذا المسار إلى جانب علامتك التجارية.`;
  for (let i = 0; i < postDefs.length; i++) {
    const p = postDefs[i];
    const content = body(p.title);
    const catEn = CAT_EN[p.cat] ?? p.cat;
    const catAr = CAT_AR[p.cat] ?? p.cat;
    await db.post.create({
      data: {
        slug: p.slug,
        title: p.title,
        titleEn: p.titleEn,
        titleAr: p.titleAr,
        excerpt: `${p.title} — تحلیلی کاربردی از تیم آرکا برای مدیران برند و بازاریابی.`,
        excerptEn: `${p.titleEn} — A practical analysis from the ARKA team for brand and marketing managers.`,
        excerptAr: `${p.titleAr} — تحليل عملي من فريق آركا لمديري العلامات التجارية والتسويق.`,
        cover: IMG(p.seed, 1600, 900),
        content,
        contentEn: bodyEn(p.titleEn),
        contentAr: bodyAr(p.titleAr),
        category: p.cat,
        categoryEn: catEn,
        categoryAr: catAr,
        tags: J([p.cat, "آرکا", "بازاریابی"]),
        tagsEn: J([catEn, "ARKA", "Marketing"]),
        tagsAr: J([catAr, "آركا", "التسويق"]),
        authorId: admin.id,
        readingMinutes: 4 + (i % 5),
        featured: i < 3,
        views: 800 + i * 211,
        metaTitle: `${p.title} | ژورنال آرکا`,
        metaTitleEn: `${p.titleEn} | ARKA Journal`,
        metaTitleAr: `${p.titleAr} | مدونة آركا`,
        metaDescription: `${p.title} — مطالعه در ژورنال آرکا.`,
        metaDescriptionEn: `${p.titleEn} — Read it on the ARKA Journal.`,
        metaDescriptionAr: `${p.titleAr} — اقرأه في مدونة آركا.`,
        keywords: J([p.cat, "آرکا"]),
        keywordsEn: J([catEn, "ARKA"]),
        keywordsAr: J([catAr, "آركا"]),
        publishedAt: new Date(Date.now() - i * 6 * 86400000),
      },
    });
  }

  // ——— testimonials (10) ———
  const tDefs = [
    { author: "مریم رستمی", role: "مدیر بازاریابی", roleEn: "Marketing Manager", roleAr: "مدير التسويق", ck: "auto", quote: "آرکا فقط یک آژانس نیست؛ یک شریک استراتژیک است. برندفیلمی که ساختند، فروش ما را متحول کرد.", quoteEn: "ARKA isn't just an agency; it's a strategic partner. The brand film they created transformed our sales.", quoteAr: "آركا ليست مجرد وكالة؛ إنها شريك استراتيجي. الفيلم الذي صنعوه لعلامتنا التجارية غيّر مبيعاتنا بالكامل.", ava: 27 },
    { author: "دکتر آرش نیک‌پور", role: "بنیان‌گذار", roleEn: "Founder", roleAr: "المؤسس", ck: "novan", quote: "هویت بصری جدید، جایگاه کلینیک ما را کاملاً ارتقا داد. حرفه‌ای، دقیق و خلاق.", quoteEn: "The new visual identity completely elevated our clinic's positioning. Professional, precise and creative.", quoteAr: "الهوية البصرية الجديدة رفعت مكانة عيادتنا بالكامل. احترافية ودقيقة ومبدعة.", ava: 51 },
    { author: "سارا احمدی", role: "مدیر برند", roleEn: "Brand Manager", roleAr: "مدير العلامة التجارية", ck: "mana", quote: "کالکشن‌فیلم پاییزه فراتر از انتظار بود. کیفیت سینمایی واقعی.", quoteEn: "The autumn collection film exceeded expectations. Truly cinematic quality.", quoteAr: "فيلم مجموعة الخريف فاق التوقعات. جودة سينمائية حقيقية.", ava: 20 },
    { author: "کامران یزدانی", role: "مدیر ای‌کامرس", roleEn: "E-commerce Manager", roleAr: "مدير التجارة الإلكترونية", ck: "digiland", quote: "کاهش ۳۸ درصدی هزینه جذب در سه ماه؛ اعداد خودشان حرف می‌زنند.", quoteEn: "A 38% reduction in acquisition cost within three months — the numbers speak for themselves.", quoteAr: "انخفاض بنسبة 38٪ في تكلفة الاكتساب خلال ثلاثة أشهر؛ الأرقام تتحدث عن نفسها.", ava: 15 },
    { author: "مهندس بهروز کاویانی", role: "مدیرعامل", roleEn: "CEO", roleAr: "الرئيس التنفيذي", ck: "folad", quote: "مستند صنعتی ما در نمایشگاه‌های بین‌المللی تحسین شد. کار بی‌نقص.", quoteEn: "Our industrial documentary was praised at international exhibitions. Flawless work.", quoteAr: "حظي فيلمنا الوثائقي الصناعي بإشادة في المعارض الدولية. عمل لا تشوبه شائبة.", ava: 60 },
    { author: "نیلوفر صادقی", role: "مدیر فروش", roleEn: "Sales Manager", roleAr: "مدير المبيعات", ck: "almas", quote: "وب‌سایت لوکس و سریع؛ دقیقاً همان تجربه‌ای که برند ما نیاز داشت.", quoteEn: "A luxurious, fast website — exactly the experience our brand needed.", quoteAr: "موقع فاخر وسريع؛ بالضبط التجربة التي احتاجتها علامتنا التجارية.", ava: 44 },
    { author: "امیر توکلی", role: "مدیرمحصول", roleEn: "Product Manager", roleAr: "مدير المنتج", ck: "paypod", quote: "دیزاین سیستم منسجمی که سرعت تیم ما را چند برابر کرد.", quoteEn: "A cohesive design system that multiplied our team's speed.", quoteAr: "نظام تصميم متماسك ضاعف سرعة فريقنا عدة مرات.", ava: 68 },
    { author: "الهام مرادی", role: "مالک", roleEn: "Owner", roleAr: "المالك", ck: "toranj", quote: "محتوای اینستاگرام ما زنده شد؛ رزروها دو برابر شد.", quoteEn: "Our Instagram content came alive — reservations doubled.", quoteAr: "أصبح محتوى انستغرام لدينا حيويًا؛ تضاعفت الحجوزات.", ava: 24 },
    { author: "دکتر رضا موحد", role: "هم‌بنیان‌گذار", roleEn: "Co-founder", roleAr: "الشريك المؤسس", ck: "doctorly", quote: "کمپین لانچ، رشدی که رؤیایش را داشتیم به واقعیت تبدیل کرد.", quoteEn: "The launch campaign turned the growth we'd dreamed of into reality.", quoteAr: "حولت حملة الإطلاق النمو الذي كنا نحلم به إلى واقع.", ava: 11 },
    { author: "پریسا کیانی", role: "مدیر گردشگری", roleEn: "Tourism Manager", roleAr: "مدير السياحة", ck: "kishland", quote: "تیزر مقصد ما وایرال شد؛ رزرو تورها جهش کرد.", quoteEn: "Our destination ad went viral — tour bookings surged.", quoteAr: "أصبح إعلان وجهتنا فيروسيًا؛ قفزت حجوزات الجولات.", ava: 47 },
  ];
  for (let i = 0; i < tDefs.length; i++) {
    const t = tDefs[i];
    await db.testimonial.create({
      data: {
        author: t.author,
        role: t.role,
        roleEn: t.roleEn,
        roleAr: t.roleAr,
        company: clientDefs.find((c) => c.key === t.ck)?.name,
        avatar: AVA(t.ava),
        quote: t.quote,
        quoteEn: t.quoteEn,
        quoteAr: t.quoteAr,
        rating: 5,
        clientId: clientMap[t.ck],
        featured: i < 6,
        order: i,
      },
    });
  }

  // ——— team (6) ———
  const team = [
    { name: "علی جعفری", nameEn: "Ali Jafari", role: "بنیان‌گذار و مدیر خلاقیت", roleEn: "Founder & Creative Director", roleAr: "المؤسس ومدير الإبداع", ava: 12 },
    { name: "نگار مرادی", nameEn: "Negar Moradi", role: "مدیر پروداکشن", roleEn: "Production Director", roleAr: "مدير الإنتاج", ava: 45 },
    { name: "سامان کریمی", nameEn: "Saman Karimi", role: "سرپرست تدوین و موشن", roleEn: "Head of Editing & Motion", roleAr: "رئيس قسم المونتاج والموشن", ava: 33 },
    { name: "رها احمدی", nameEn: "Raha Ahmadi", role: "مدیر هنری و برندینگ", roleEn: "Art & Branding Director", roleAr: "مدير الفنون والعلامة التجارية", ava: 26 },
    { name: "پویا شریفی", nameEn: "Pouya Sharifi", role: "سرپرست دیجیتال مارکتینگ", roleEn: "Head of Digital Marketing", roleAr: "رئيس قسم التسويق الرقمي", ava: 55 },
    { name: "مینا حسینی", nameEn: "Mina Hosseini", role: "مدیر تجربه کاربری", roleEn: "UX Director", roleAr: "مدير تجربة المستخدم", ava: 41 },
  ];
  for (let i = 0; i < team.length; i++) {
    const m = team[i];
    await db.teamMember.create({
      data: {
        name: m.name,
        nameEn: m.nameEn,
        role: m.role,
        roleEn: m.roleEn,
        roleAr: m.roleAr,
        avatar: AVA(m.ava),
        bio: "عضوی از تیم خلاق آرکا با سال‌ها تجربه در ساخت کمپین‌های اثرگذار.",
        bioEn: "A member of ARKA's creative team with years of experience building impactful campaigns.",
        bioAr: "عضو في فريق آركا الإبداعي يمتلك سنوات من الخبرة في صنع حملات مؤثرة.",
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
    { label: "پروژه موفق", labelEn: "Successful Projects", labelAr: "مشروع ناجح", value: 480, suffix: "+" },
    { label: "برند خوشحال", labelEn: "Happy Brands", labelAr: "علامة تجارية سعيدة", value: 120, suffix: "+" },
    { label: "جایزه خلاقیت", labelEn: "Creative Awards", labelAr: "جائزة إبداعية", value: 24, suffix: "" },
    { label: "سال تجربه", labelEn: "Years of Experience", labelAr: "سنة خبرة", value: new Date().getFullYear() - 2017, suffix: "" },
    { label: "بازدید کمپین‌ها", labelEn: "Campaign Views", labelAr: "مشاهدات الحملات", value: 210, suffix: "M+" },
  ];
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    await db.stat.create({ data: { label: s.label, labelEn: s.labelEn, labelAr: s.labelAr, value: s.value, suffix: s.suffix, order: i } });
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
    ["استارتاپ ویرا", "hi@vira.io", "طراحی وب", "WON", "طراحی وب‌سایت و UI اپ."],
    ["هتل درسا", "dorsa@hotel.com", "فیلم تبلیغاتی", "LOST", "تیزر معرفی هتل."],
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
