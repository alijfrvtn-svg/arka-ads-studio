/* ARKA — one-time i18n backfill against the LIVE production database.
   Idempotent and additive-only: every update here sets ONLY the new
   `*En`/`*Ar` columns, matched by each row's real slug/id/unique text.
   It never touches a `fa` column and never deletes/creates rows (except
   the Home/About/Contact singleton upsert, which only ever writes to its
   own `*En`/`*Ar` fields — the `fa` fields are supplied unchanged from
   the row already read from production so the upsert is a no-op for them).

   Run once with: npx tsx scripts/backfill-i18n.ts
   Safe to re-run — every write is idempotent (same input -> same output). */
import { db } from "../lib/db";

const J = (x: unknown) => JSON.stringify(x);

async function backfillHomePage() {
  const row = await db.homePage.findUnique({ where: { id: "home" } });
  if (!row) {
    console.log("HomePage: no row found, skipping (nothing to translate against).");
    return;
  }
  await db.homePage.update({
    where: { id: "home" },
    data: {
      heroBadgeEn: "Creative Agency, Content Production & Digital Marketing",
      heroBadgeAr: "وكالة إبداعية لإنتاج المحتوى والتسويق الرقمي",
      heroHeadlineEn: J(["Boundless creativity.", "Flawless execution.", "Sustainable growth."]),
      heroHeadlineAr: J(["إبداع بلا حدود.", "تنفيذ لا تشوبه شائبة.", "نمو مستدام."]),
      heroDescriptionEn:
        "Arka Studio is a powerful blend of visual art and digital strategy. With a team specialized in graphic design, cinematic videography and web development, we turn your ideas into a lasting experience for your audience and tangible growth for your business.",
      heroDescriptionAr:
        "استوديو آركا مزيج قوي من الفن البصري والاستراتيجية الرقمية. بفريق متخصص في التصميم الجرافيكي والتصوير السينمائي وتطوير الويب، نحوّل أفكاركم إلى تجربة خالدة لجمهوركم ونمو ملموس لأعمالكم.",
      heroCtaLabelEn: "Book a Free Consultation",
      heroCtaLabelAr: "احجز استشارة مجانية",
      heroReelLabelEn: "Watch Our Portfolio",
      heroReelLabelAr: "شاهد أعمالنا",
      trustCaptionEn: "Proud to work with leading brands",
      trustCaptionAr: "فخورون بالتعاون مع علامات تجارية رائدة",
      departmentsEyebrowEn: "Arka's Specialized Departments",
      departmentsEyebrowAr: "أقسام آركا المتخصصة",
      departmentsHeadingEn: "Everything you need to grow.",
      departmentsHeadingAr: "كل ما تحتاجه للنمو.",
      departmentsHeadingHighlightEn: "you need to grow.",
      departmentsHeadingHighlightAr: "تحتاجه للنمو.",
      departmentsDescriptionEn:
        "From visual identity design and web platform development to professional videography and cinematic editing — our expert team connects every link in your marketing chain in perfect harmony.",
      departmentsDescriptionAr:
        "من تصميم الهوية البصرية وتطوير منصات الويب إلى التصوير الاحترافي والمونتاج السينمائي؛ يربط فريقنا المتخصص جميع حلقات التسويق لديكم بأعلى مستوى من الانسجام.",
      departmentsCtaLabelEn: "Explore Department",
      departmentsCtaLabelAr: "استكشف القسم",
      featuredEyebrowEn: "Arka Studio's Output",
      featuredEyebrowAr: "أعمال استوديو آركا",
      featuredHeadingEn: "Work that speaks for us.",
      featuredHeadingAr: "أعمال تتحدث نيابة عنا.",
      featuredHeadingHighlightEn: "speaks for us.",
      featuredHeadingHighlightAr: "تتحدث نيابة عنا.",
      featuredDescriptionEn:
        "Quality is no accident. Every project at Arka is a story of solving a business challenge in the language of art and technology. Watch a selection of our most successful projects to feel the level of our standards.",
      featuredDescriptionAr:
        "الجودة ليست صدفة. كل مشروع في آركا هو قصة لحل تحدٍ تجاري بلغة الفن والتكنولوجيا. شاهدوا مجموعة مختارة من أنجح مشاريعنا لتلمسوا مستوى معاييرنا.",
      featuredCtaLabelEn: "View Project Archive",
      featuredCtaLabelAr: "شاهد أرشيف المشاريع",
      workflowEyebrowEn: "Our Collaboration Process",
      workflowEyebrowAr: "مسار التعاون معنا",
      workflowHeadingEn: "From a raw idea to a business masterpiece",
      workflowHeadingAr: "من فكرة خام إلى تحفة تجارية",
      workflowHeadingHighlightEn: "a business masterpiece",
      workflowHeadingHighlightAr: "تحفة تجارية",
      workflowDescriptionEn:
        "At Arka, we've removed the complexity. Our expert team, through a clear and coordinated process, turns your vision into a tangible and profitable achievement in four precise steps.",
      workflowDescriptionAr:
        "في آركا، أزلنا كل التعقيدات. يحوّل فريقنا المتخصص رؤيتكم، عبر عملية واضحة ومنسقة من أربع خطوات دقيقة، إلى إنجاز ملموس ومربح.",
      workflowStepsEn: J([
        { icon: "Target", title: "Discovery & Strategy", desc: "Precise competitor analysis, understanding your audience persona, and drafting a dedicated roadmap before any action begins." },
        { icon: "Sparkles", title: "Ideation & Concept", desc: "Crafting a compelling scenario, designing wireframes, and shaping a distinctive identity that captivates your brand's audience." },
        { icon: "Clapperboard", title: "Production & Technical Execution", desc: "Our expert team steps in — from filming with cinema-grade equipment to coding and developing your digital platform." },
        { icon: "TrendingUp", title: "Launch & Data-Driven Growth", desc: "Final project delivery, running marketing campaigns, and continuous data analysis to maximize returns." },
      ]),
      workflowStepsAr: J([
        { icon: "Target", title: "الاكتشاف والاستراتيجية", desc: "تحليل دقيق للمنافسين، وفهم شخصية الجمهور، وإعداد خارطة طريق مخصصة قبل بدء أي إجراء." },
        { icon: "Sparkles", title: "التفكير الإبداعي والمفهوم", desc: "صياغة سيناريو جذاب، وتصميم المخططات الأولية، وبناء هوية متميزة تأسر جمهور علامتكم التجارية." },
        { icon: "Clapperboard", title: "الإنتاج والتنفيذ التقني", desc: "دخول الفريق المتخصص إلى الميدان؛ من التصوير بمعدات سينمائية إلى البرمجة وتطوير المنصة الرقمية." },
        { icon: "TrendingUp", title: "الإطلاق والنمو القائم على البيانات", desc: "التسليم النهائي للمشروع، تنفيذ الحملات التسويقية، وتحليل البيانات المستمر لتعظيم العائد." },
      ]),
      testimonialsEyebrowEn: "Experience of Working with Arka",
      testimonialsEyebrowAr: "تجربة التعاون مع آركا",
      testimonialsHeadingEn: "Project success stories, in our clients' own words",
      testimonialsHeadingAr: "قصص نجاح المشاريع بلسان عملائنا",
      testimonialsHeadingHighlightEn: "our clients' own words",
      testimonialsHeadingHighlightAr: "بلسان عملائنا",
      finalEyebrowEn: "It's time to be seen",
      finalEyebrowAr: "حان وقت الظهور",
      finalHeadingEn: "Arka Studio's next success story is your business!",
      finalHeadingAr: "قصة النجاح التالية لاستوديو آركا هي عملكم!",
      finalHeadingHighlightEn: "is your business!",
      finalHeadingHighlightAr: "هي عملكم!",
      finalDescriptionEn:
        "You have the expertise and the dream for your business; our 8-person team of designers, photographers and editors has the technical know-how and the art to bring it to life. A raw idea is enough — leave the rest of the journey of creating this masterpiece to us.",
      finalDescriptionAr:
        "لديكم الخبرة وحلم أعمالكم؛ ولدى فريقنا المكوّن من 8 أشخاص من المصممين والمصورين والمحررين المعرفة التقنية وفن تجسيدها. فكرة خام تكفي، واتركوا لنا بقية مسار صنع هذه التحفة.",
      finalCtaLabelEn: "Submit a Collaboration Request",
      finalCtaLabelAr: "أرسل طلب التعاون",
    },
  });
  console.log("HomePage: translated.");
}

async function backfillAboutPage() {
  const row = await db.aboutPage.findUnique({ where: { id: "about" } });
  if (!row) {
    console.log("AboutPage: no row found, skipping.");
    return;
  }
  await db.aboutPage.update({
    where: { id: "about" },
    data: {
      heroEyebrowEn: "Meet Our Team",
      heroEyebrowAr: "تعرف على فريقنا",
      heroTitleEn: "The Story of Arka's Creative Minds",
      heroTitleAr: "قصة العقول الإبداعية في آركا",
      heroTitleHighlightEn: "Creative Minds",
      heroTitleHighlightAr: "العقول الإبداعية",
      heroDescriptionEn:
        "We're here to simplify the complexities of the digital world for you. With a blend of cinematic vision and technical expertise, we turn your raw ideas into business masterpieces.",
      heroDescriptionAr:
        "نحن هنا لتبسيط تعقيدات العالم الرقمي من أجلكم. بمزيج من الرؤية السينمائية والخبرة التقنية، نحوّل أفكاركم الخام إلى تحف تجارية.",
      storyEyebrowEn: "The Story of Arka Studio",
      storyEyebrowAr: "قصة استوديو آركا",
      storyHeadingEn: "One unified team, under one roof",
      storyHeadingAr: "فريق موحّد، تحت سقف واحد",
      storyParagraphsEn: J([
        "It all began with a deep understanding of the multimedia world and the unmatched power of the image. At Arka Studio, we came together believing that today's businesses need more than traditional, clichéd advertising to be seen in competitive markets — they need a cohesive visual identity and an artful narrative.",
        "Unlike many agencies that outsource their projects, Arka is a dedicated in-house family of 8. Having two graphic designers, a web designer, two professional photographers, two video editors and a coordination manager together at our studio in Tabriz gives us the power to execute every project from start to finish with the highest harmony and speed.",
        "From industrial parts photography and e-commerce website design to cinematic ad films and brand management — we've brought diverse expertise together under one roof to act as a powerful arm and a trustworthy business partner, solving your business challenges and building a distinctive identity for you.",
      ]),
      storyParagraphsAr: J([
        "بدأ كل شيء من فهم عميق لعالم الوسائط المتعددة وقوة الصورة التي لا تُضاهى. اجتمعنا في استوديو آركا إيمانًا منا بأن أعمال اليوم تحتاج إلى أكثر من الإعلانات التقليدية والنمطية لتظهر في الأسواق التنافسية؛ فهي بحاجة إلى هوية بصرية موحدة وسرد فني.",
        "على عكس العديد من الوكالات التي تُسند مشاريعها لجهات خارجية، آركا عائلة داخلية متخصصة مكوّنة من 8 أشخاص. وجود مصممَي جرافيك، ومصمم ويب، ومصورَين محترفَين، ومحرري فيديو، ومدير تنسيق معًا في استوديونا بتبريز يمنحنا القدرة على تنفيذ كل مشروع من الألف إلى الياء بأعلى انسجام وسرعة.",
        "من التصوير الصناعي للقطع وتصميم مواقع المتاجر الإلكترونية إلى صناعة الأفلام الإعلانية السينمائية وإدارة العلامة التجارية؛ جمعنا خبرات متنوعة تحت سقف واحد لنكون ذراعًا قويًا وشريكًا تجاريًا موثوقًا يحل تحديات أعمالكم ويبني لكم هوية متميزة.",
      ]),
      valuesEyebrowEn: "Values",
      valuesEyebrowAr: "القيم",
      valuesHeadingEn: "What Sets Us Apart",
      valuesHeadingAr: "ما يميزنا",
      valuesEn: J([
        { icon: "Target", title: "Strategic Creativity", desc: "Our art isn't just beautiful — every visual and technical decision we make is rooted in your data and sales goals." },
        { icon: "Gem", title: "Uncompromising Quality", desc: "From the camera lens to the lines of code, our standards sit at the highest editorial and cinematic level." },
        { icon: "Users", title: "The Power of Teamwork", desc: "Having graphic, web, photography and editing specialists under one roof creates the highest harmony across every project." },
        { icon: "Zap", title: "Agility & Commitment", desc: "Not outsourcing projects and running every process through our in-studio team guarantees speed and quality." },
      ]),
      valuesAr: J([
        { icon: "Target", title: "الإبداع الاستراتيجي", desc: "فننا ليس جميلاً فحسب؛ كل قرار بصري وتقني نتخذه متجذر في بياناتكم وأهداف مبيعاتكم." },
        { icon: "Gem", title: "جودة لا مساومة فيها", desc: "من عدسة الكاميرا إلى أسطر البرمجة، تقف معاييرنا عند أعلى مستوى صحفي وسينمائي." },
        { icon: "Users", title: "قوة العمل الجماعي", desc: "وجود متخصصي الجرافيك والويب والتصوير والمونتاج تحت سقف واحد يخلق أعلى درجة من الانسجام في المشاريع." },
        { icon: "Zap", title: "المرونة والالتزام", desc: "عدم إسناد المشاريع لجهات خارجية وتنفيذ جميع العمليات عبر الفريق المقيم في الاستوديو يضمن السرعة والجودة." },
      ]),
      teamEyebrowEn: "Your Teammates at Arka",
      teamEyebrowAr: "زملاؤكم في آركا",
      teamHeadingEn: "The Team That Builds Your Dreams",
      teamHeadingAr: "الفريق الذي يبني أحلامكم",
      timelineEyebrowEn: "Our Evolution Story",
      timelineEyebrowAr: "قصة تطورنا",
      timelineHeadingEn: "The Path We've Walked So Far",
      timelineHeadingAr: "المسار الذي قطعناه حتى اليوم",
      timelineEn: J([
        { year: "2019", title: "The Starting Point", desc: "The initial core of Arka formed, focused on the power of multimedia arts and content production." },
        { year: "2021", title: "Expanding Visual Services", desc: "The studio was equipped with advanced cameras and lenses to offer industrial and beauty photography at an editorial level." },
        { year: "2023", title: "Growing the Expert Team", desc: "Became a cohesive in-house team with the addition of senior web and graphic designers." },
        { year: "2025", title: "A Unified Agency in Tabriz", desc: "Our 8-person team settled under one roof to deliver end-to-end production and digital marketing services." },
      ]),
      timelineAr: J([
        { year: "2019", title: "نقطة الانطلاق", desc: "تشكّلت النواة الأولى لآركا بالتركيز على قوة فنون الوسائط المتعددة وإنتاج المحتوى." },
        { year: "2021", title: "توسيع الخدمات البصرية", desc: "تم تجهيز الاستوديو بكاميرات وعدسات متطورة لتقديم خدمات التصوير الصناعي وتصوير الجمال بمستوى صحفي." },
        { year: "2023", title: "توسيع فريق الخبراء", desc: "أصبحنا فريقًا داخليًا متماسكًا بانضمام مصممي ويب وجرافيك كبار." },
        { year: "2025", title: "وكالة موحدة في تبريز", desc: "استقر فريقنا المكوّن من 8 أشخاص تحت سقف واحد لتقديم خدمات الإنتاج والتسويق الرقمي الشاملة." },
      ]),
      galleryEyebrowEn: "Bright Lenses, Creative Minds",
      galleryEyebrowAr: "عدسات مضيئة، عقول مبدعة",
      galleryHeadingEn: "The magic is created right here!",
      galleryHeadingAr: "السحر يُصنع هنا بالضبط!",
      metaTitleEn: "About Arka Studio | Creative & Digital Marketing Agency",
      metaTitleAr: "عن استوديو آركا | وكالة إبداعية وتسويق رقمي",
      metaDescriptionEn:
        "Arka Studio — a unified digital marketing and content production agency in Tabriz. A cohesive team of graphic designers, web developers, photographers and editors who transform your brand's visual identity.",
      metaDescriptionAr:
        "استوديو آركا؛ وكالة موحدة للتسويق الرقمي وإنتاج المحتوى في تبريز. فريق متماسك من مصممي الجرافيك ومطوري الويب والمصورين والمحررين يُحوّلون الهوية البصرية لعلامتكم التجارية.",
    },
  });
  console.log("AboutPage: translated.");
}

async function backfillContactPage() {
  const row = await db.contactPage.findUnique({ where: { id: "contact" } });
  if (!row) {
    console.log("ContactPage: no row found, skipping.");
    return;
  }
  await db.contactPage.update({
    where: { id: "contact" },
    data: {
      heroEyebrowEn: "Contact",
      heroEyebrowAr: "تواصل",
      heroTitleEn: "Let's create a new masterpiece",
      heroTitleAr: "لنصنع معًا تحفة جديدة",
      heroTitleHighlightEn: "create a new masterpiece",
      heroTitleHighlightAr: "لنصنع معًا تحفة جديدة",
      heroDescriptionEn:
        "Got an idea in mind, or looking for a way to make your brand stand out? Fill out the form below for a specialized consultation, or reach out directly. We're always ready to hear from you!",
      heroDescriptionAr:
        "هل لديك فكرة في ذهنك أو تبحث عن طريقة لتمييز علامتك التجارية؟ املأ النموذج أدناه للحصول على استشارة متخصصة أو تواصل معنا مباشرة. نحن دائمًا مستعدون للاستماع إليك!",
      addressEn: "Tabriz, Azadi Blvd, next to Tabriz Islamic Art University, Soltan Mohammad Building, No. 8, 2nd Floor",
      addressAr: "تبريز، شارع آزادي، بجانب جامعة تبريز للفنون الإسلامية، مبنى سلطان محمد، رقم 8، الطابق الثاني",
      phoneDisplayEn: row.phoneDisplay,
      phoneDisplayAr: row.phoneDisplay,
      officeHoursEn: "Saturday to Thursday, 9 AM–6 PM",
      officeHoursAr: "السبت إلى الخميس، 9 صباحًا حتى 6 مساءً",
      socialsEn: J([
        { platform: "instagram", href: "https://instagram.com/arka.studio", label: "Instagram" },
        { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "LinkedIn" },
        { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "YouTube" },
        { platform: "aparat", href: "https://aparat.com/arka.studio", label: "Aparat" },
        { platform: "telegram", href: "https://t.me/arka_studio", label: "Telegram" },
      ]),
      socialsAr: J([
        { platform: "instagram", href: "https://instagram.com/arka.studio", label: "انستغرام" },
        { platform: "linkedin", href: "https://linkedin.com/company/arka-studio", label: "لينكد إن" },
        { platform: "youtube", href: "https://youtube.com/@arka.studio", label: "يوتيوب" },
        { platform: "aparat", href: "https://aparat.com/arka.studio", label: "آبارات" },
        { platform: "telegram", href: "https://t.me/arka_studio", label: "تيليجرام" },
      ]),
      serviceOptionsEn: J(["Film & Ad", "Photography", "Branding", "Web Design", "Digital Marketing", "Other"]),
      serviceOptionsAr: J(["فيلم وإعلان", "التصوير", "العلامة التجارية", "تصميم المواقع", "التسويق الرقمي", "أخرى"]),
      budgetOptionsEn: J(["Under 50M Toman", "50M–150M Toman", "150M–300M Toman", "Over 300M Toman"]),
      budgetOptionsAr: J(["أقل من 50 مليون تومان", "50 إلى 150 مليون تومان", "150 إلى 300 مليون تومان", "أكثر من 300 مليون تومان"]),
      metaTitleEn: "Contact Us",
      metaTitleAr: "تواصل معنا",
      metaDescriptionEn: "Contact the Arka team in Tabriz to request a collaboration or book a free consultation.",
      metaDescriptionAr: "تواصل مع فريق آركا في تبريز لطلب التعاون أو حجز استشارة مجانية.",
    },
  });
  console.log("ContactPage: translated.");
}

const TESTIMONIAL_TR: Record<string, { roleEn: string; roleAr: string; quoteEn: string; quoteAr: string }> = {
  "مریم رستمی": { roleEn: "Marketing Manager", roleAr: "مدير التسويق", quoteEn: "ARKA isn't just an agency; it's a strategic partner. The brand film they created transformed our sales.", quoteAr: "آركا ليست مجرد وكالة؛ إنها شريك استراتيجي. الفيلم الذي صنعوه لعلامتنا التجارية غيّر مبيعاتنا بالكامل." },
  "دکتر آرش نیک‌پور": { roleEn: "Founder", roleAr: "المؤسس", quoteEn: "The new visual identity completely elevated our clinic's positioning. Professional, precise and creative.", quoteAr: "الهوية البصرية الجديدة رفعت مكانة عيادتنا بالكامل. احترافية ودقيقة ومبدعة." },
  "سارا احمدی": { roleEn: "Brand Manager", roleAr: "مدير العلامة التجارية", quoteEn: "The autumn collection film exceeded expectations. Truly cinematic quality.", quoteAr: "فيلم مجموعة الخريف فاق التوقعات. جودة سينمائية حقيقية." },
  "کامران یزدانی": { roleEn: "E-commerce Manager", roleAr: "مدير التجارة الإلكترونية", quoteEn: "A 38% reduction in acquisition cost within three months — the numbers speak for themselves.", quoteAr: "انخفاض بنسبة 38٪ في تكلفة الاكتساب خلال ثلاثة أشهر؛ الأرقام تتحدث عن نفسها." },
  "مهندس بهروز کاویانی": { roleEn: "CEO", roleAr: "الرئيس التنفيذي", quoteEn: "Our industrial documentary was praised at international exhibitions. Flawless work.", quoteAr: "حظي فيلمنا الوثائقي الصناعي بإشادة في المعارض الدولية. عمل لا تشوبه شائبة." },
  "نیلوفر صادقی": { roleEn: "Sales Manager", roleAr: "مدير المبيعات", quoteEn: "A luxurious, fast website — exactly the experience our brand needed.", quoteAr: "موقع فاخر وسريع؛ بالضبط التجربة التي احتاجتها علامتنا التجارية." },
  "امیر توکلی": { roleEn: "Product Manager", roleAr: "مدير المنتج", quoteEn: "A cohesive design system that multiplied our team's speed.", quoteAr: "نظام تصميم متماسك ضاعف سرعة فريقنا عدة مرات." },
  "الهام مرادی": { roleEn: "Owner", roleAr: "المالك", quoteEn: "Our Instagram content came alive — reservations doubled.", quoteAr: "أصبح محتوى انستغرام لدينا حيويًا؛ تضاعفت الحجوزات." },
  "دکتر رضا موحد": { roleEn: "Co-founder", roleAr: "الشريك المؤسس", quoteEn: "The launch campaign turned the growth we'd dreamed of into reality.", quoteAr: "حولت حملة الإطلاق النمو الذي كنا نحلم به إلى واقع." },
  "پریسا کیانی": { roleEn: "Tourism Manager", roleAr: "مدير السياحة", quoteEn: "Our destination ad went viral — tour bookings surged.", quoteAr: "أصبح إعلان وجهتنا فيروسيًا؛ قفزت حجوزات الجولات." },
};

async function backfillTestimonials() {
  const rows = await db.testimonial.findMany({ select: { id: true, author: true, roleEn: true } });
  let count = 0;
  for (const row of rows) {
    const tr = TESTIMONIAL_TR[row.author];
    if (!tr || row.roleEn) continue; // skip unknown authors or already-translated rows
    await db.testimonial.update({
      where: { id: row.id },
      data: { roleEn: tr.roleEn, roleAr: tr.roleAr, quoteEn: tr.quoteEn, quoteAr: tr.quoteAr },
    });
    count++;
  }
  console.log(`Testimonials: translated ${count}/${rows.length} (matched by author name).`);
}

const BIO_FA = "عضوی از تیم خلاق آرکا با سال‌ها تجربه در ساخت کمپین‌های اثرگذار.";
const BIO_EN = "A member of ARKA's creative team with years of experience building impactful campaigns.";
const BIO_AR = "عضو في فريق آركا الإبداعي يمتلك سنوات من الخبرة في صنع حملات مؤثرة.";

const TEAM_ROLE_TR: Record<string, { en: string; ar: string }> = {
  "بنیان‌گذار و مدیر خلاقیت": { en: "Founder & Creative Director", ar: "المؤسس ومدير الإبداع" },
  "مدیر داخلی": { en: "Operations Manager", ar: "مدير العمليات الداخلية" },
  "طراح وبسایت و حسابدار داخلی": { en: "Web Designer & In-house Accountant", ar: "مصمم مواقع ومحاسب داخلي" },
  "سرپرست تصویر برداری": { en: "Head of Videography", ar: "رئيس قسم التصوير" },
  "سرپرست گرافیک": { en: "Head of Graphic Design", ar: "رئيس قسم الجرافيك" },
  "اپراتور هوش مصنوعی": { en: "AI Operator", ar: "مشغّل الذكاء الاصطناعي" },
  "عکاس و تصویر بردار": { en: "Photographer & Videographer", ar: "مصور فوتوغرافي وفيديو" },
  "مدیر عامل و سرپرست هوش مصنوعی": { en: "CEO & Head of AI", ar: "الرئيس التنفيذي ورئيس قسم الذكاء الاصطناعي" },
};

async function backfillTeam() {
  const rows = await db.teamMember.findMany({ select: { id: true, role: true, bio: true, roleEn: true } });
  let count = 0;
  for (const row of rows) {
    if (row.roleEn) continue; // already translated
    const roleTr = TEAM_ROLE_TR[row.role];
    await db.teamMember.update({
      where: { id: row.id },
      data: {
        roleEn: roleTr?.en ?? null,
        roleAr: roleTr?.ar ?? null,
        bioEn: row.bio === BIO_FA ? BIO_EN : null,
        bioAr: row.bio === BIO_FA ? BIO_AR : null,
      },
    });
    count++;
  }
  console.log(`Team: translated ${count}/${rows.length}.`);
}

const STAT_LABEL_TR: Record<string, { en: string; ar: string }> = {
  "پروژه موفق": { en: "Successful Projects", ar: "مشروع ناجح" },
  "برند خوشحال": { en: "Happy Brands", ar: "علامة تجارية سعيدة" },
  "جایزه خلاقیت": { en: "Creative Awards", ar: "جائزة إبداعية" },
  "سال تجربه": { en: "Years of Experience", ar: "سنة خبرة" },
  "بازدید کمپین‌ها": { en: "Campaign Views", ar: "مشاهدات الحملات" },
};

async function backfillStats() {
  const rows = await db.stat.findMany({ select: { id: true, label: true, labelEn: true } });
  let count = 0;
  for (const row of rows) {
    if (row.labelEn) continue;
    const tr = STAT_LABEL_TR[row.label];
    if (!tr) continue;
    await db.stat.update({ where: { id: row.id }, data: { labelEn: tr.en, labelAr: tr.ar } });
    count++;
  }
  console.log(`Stats: translated ${count}/${rows.length}.`);
}

// Shared templates confirmed byte-identical across every real service row
// (workflow/faqs/pricing are not exposed in the admin UI, so they were never
// hand-edited) — reusing the stage-3 generic translations from seed-logic.ts.
const WORKFLOW_EN = J([
  { step: "01", title: "Discovery & Brief", desc: "A deep understanding of your brand, market and business goals." },
  { step: "02", title: "Idea & Strategy", desc: "Designing the creative idea and an executable roadmap." },
  { step: "03", title: "Production & Execution", desc: "Professional execution with the highest quality standards." },
  { step: "04", title: "Delivery & Analysis", desc: "Final delivery with a performance report and optimization." },
]);
const WORKFLOW_AR = J([
  { step: "01", title: "الاكتشاف والملخص", desc: "فهم عميق لعلامتك التجارية والسوق وأهداف عملك." },
  { step: "02", title: "الفكرة والاستراتيجية", desc: "تصميم الفكرة الإبداعية وخارطة طريق قابلة للتنفيذ." },
  { step: "03", title: "الإنتاج والتنفيذ", desc: "تنفيذ احترافي بأعلى معايير الجودة." },
  { step: "04", title: "التسليم والتحليل", desc: "التسليم النهائي مع تقرير أداء وتحسين مستمر." },
]);
const FAQS_EN = J([
  { q: "How long does a project take?", a: "Depending on scope, it usually takes 2 to 8 weeks." },
  { q: "How is the cost calculated?", a: "After a brief session and scoping, we provide a transparent price proposal." },
  { q: "Are revisions available?", a: "Yes, every package includes a set number of revision rounds." },
]);
const FAQS_AR = J([
  { q: "كم تستغرق مدة تنفيذ المشروع؟", a: "حسب نطاق المشروع، عادة ما بين أسبوعين إلى 8 أسابيع." },
  { q: "كيف تُحتسب التكلفة؟", a: "بعد جلسة استماع لملخص المشروع وتحديد النطاق، نقدم عرض سعر شفافًا." },
  { q: "هل يمكن إجراء تعديلات؟", a: "نعم، تتضمن كل باقة عددًا محددًا من جولات المراجعة." },
]);
const GENERIC_FEATURES_EN = ["Dedicated expert team", "A clear, step-by-step process", "Delivery on the agreed deadline", "Results reporting & analysis", "Post-delivery support"];
const GENERIC_FEATURES_AR = ["فريق متخصص ومخصص", "عملية واضحة ومرحلية", "التسليم في الموعد المتفق عليه", "تقرير وتحليل النتائج", "دعم ما بعد التسليم"];
// Persian-numeral price strings (e.g. "۱۸٬۰۰۰٬۰۰۰") need Western digits +
// comma grouping for en/ar output, matching lib/utils.ts's localeNumber()
// convention (Western/comma for en & ar, Persian grouping only for fa).
function faNumStrToWestern(s: string): string {
  const western = s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[^\d]/g, "");
  const n = parseInt(western, 10);
  return Number.isNaN(n) ? s : n.toLocaleString("en-US");
}

// Re-derive a locale's pricing JSON from the live fa pricing (same tier
// names/features/price-multiples in every row — only the base price differs).
function pricingTr(faPricingJson: string, locale: "en" | "ar") {
  const tiers = JSON.parse(faPricingJson) as { name: string; price: string; unit: string; features: string[]; featured?: boolean }[];
  const names = locale === "en" ? ["Basic", "Professional", "Enterprise"] : ["الأساسية", "الاحترافية", "المؤسسات"];
  const contactUs = locale === "en" ? "Contact us" : "تواصل معنا";
  const featureSets =
    locale === "en"
      ? [
          ["Initial consultation", "One revision round", "Standard delivery"],
          ["Dedicated strategy", "Three revision rounds", "Express delivery", "3-month support"],
          ["Dedicated team", "Unlimited revisions", "SLA contract", "Independent project manager"],
        ]
      : [
          ["استشارة أولية", "جولة مراجعة واحدة", "تسليم قياسي"],
          ["استراتيجية مخصصة", "ثلاث جولات مراجعة", "تسليم سريع", "دعم لمدة 3 أشهر"],
          ["فريق مخصص", "مراجعات غير محدودة", "عقد اتفاقية مستوى خدمة (SLA)", "مدير مشروع مستقل"],
        ];
  return J(
    tiers.map((t, i) => ({
      name: names[i] ?? t.name,
      price: t.price === "تماس بگیرید" ? contactUs : faNumStrToWestern(t.price),
      unit: t.unit === "تومان" ? (locale === "en" ? "Toman" : "تومان") : t.unit,
      features: featureSets[i] ?? t.features,
      featured: t.featured,
    })),
  );
}

interface ServiceTr {
  slug: string;
  titleAr: string;
  taglineEn: string; taglineAr: string;
  excerptEn: string; excerptAr: string;
  descriptionEn: string; descriptionAr: string;
  featuresEn: string[]; featuresAr: string[];
  metaTitleEn: string; metaTitleAr: string;
  metaDescriptionEn: string; metaDescriptionAr: string;
  keywordsEn: string[]; keywordsAr: string[];
}

const SERVICE_TR: ServiceTr[] = [
  {
    slug: "commercial-product-photography",
    titleAr: "التصوير التجاري والمنتجات",
    taglineEn: "Frames that sell; professional imagery of your brand's identity.",
    taglineAr: "لقطات تبيع؛ تصوير احترافي لهوية علامتك التجارية.",
    excerptEn: "Professional commercial, industrial and product photography services. High-quality, color-calibrated imagery for online stores, digital catalogs and social media.",
    excerptAr: "خدمات تصوير تجاري وصناعي ومنتجات احترافية. صور عالية الجودة ومعايرة الألوان للمتاجر الإلكترونية والكتالوجات الرقمية ووسائل التواصل الاجتماعي.",
    descriptionEn:
      "In the world of e-commerce and modern advertising, the first thing that engages your audience is the visual quality of your products. Arka Studio's commercial and industrial photography services are designed to create stunning, sales-driving images. We believe every product has a story to tell, and our job is to capture the most accurate and compelling frame of that story.\n\nOur team uses standard studio lighting setups (such as 500W ZSYB light kits) and sharp portrait and product lenses (such as 50mm lenses with a wide aperture for capturing the finest detail) to portray the texture, material and refinement of your goods in the best possible way. Whether for digital catalogs, online stores or social media campaigns, our output guarantees your customers' trust.\n\nOne of the most important concerns for clients in product photography is color accuracy. We use calibrated, professional-grade graphics monitors such as the ASUS ProArt series to perform color and light correction with the highest precision. This precision ensures your corporate colors and product details reach your audience completely true-to-life and appealing, without the slightest color deviation. From idea to execution, in our studio or at your location, we're with you every step of the way.",
    descriptionAr:
      "في عالم التجارة الإلكترونية والإعلان الحديث، أول ما يجذب الجمهور هو الجودة البصرية لمنتجاتكم. صُممت خدمات التصوير التجاري والصناعي في استوديو آركا لخلق صور مذهلة تصنع المبيعات. نؤمن بأن لكل منتج قصة يرويها، ومهمتنا هي التقاط أدق وأجمل لقطة من هذه القصة.\n\nيستخدم فريقنا إضاءة استوديو معيارية (مثل مجموعات إضاءة ZSYB بقوة 500 واط) وعدسات حادة للبورتريه والمنتجات (مثل عدسات 50 ملم بفتحة عدسة واسعة لالتقاط أدق التفاصيل)، لتصوير نسيج ومادة ورقي منتجاتكم بأفضل شكل ممكن. سواء للكتالوجات الرقمية أو المتاجر الإلكترونية أو حملات التواصل الاجتماعي، تضمن مخرجاتنا كسب ثقة عملائكم.\n\nمن أهم اهتمامات العملاء في تصوير المنتجات هو تطابق لون الصورة مع الواقع. نستخدم شاشات معايرة ومتخصصة في الجرافيك مثل سلسلة ASUS ProArt لإجراء عملية تصحيح اللون والإضاءة بأعلى دقة. هذه الدقة تضمن وصول ألوان علامتكم التجارية وتفاصيل منتجاتكم إلى الجمهور بشكل واقعي وجذاب تمامًا دون أدنى انحراف لوني. من الفكرة إلى التنفيذ، في الاستوديو أو في موقعكم، نحن معكم في كل خطوة.",
    featuresEn: [
      "Precise photography with sharp lenses and standard lighting equipment",
      "Specialized color correction with calibrated monitors for true-to-life colors",
      "Lifestyle photography, white background shots, and decorative styling",
      "Image size and quality optimization for websites, catalogs and Instagram",
      "Project execution available in-studio or at your dedicated location in Tabriz and beyond",
    ],
    featuresAr: [
      "تصوير دقيق بعدسات حادة ومعدات إضاءة معيارية",
      "تصحيح ألوان متخصص بشاشات معايرة لعرض الألوان بشكل واقعي",
      "تصوير نمط الحياة، خلفية بيضاء، وتنسيق ديكوري",
      "تحسين حجم وجودة الصور للموقع والكتالوج وإنستغرام",
      "إمكانية تنفيذ المشروع في الاستوديو أو في موقعكم الخاص في تبريز ومناطق أخرى",
    ],
    metaTitleEn: "Commercial, Industrial & Product Photography | Arka Studio",
    metaTitleAr: "التصوير التجاري والصناعي والمنتجات | استوديو آركا",
    metaDescriptionEn: "Professional commercial, industrial and product photography services at Arka Studio. High-quality imagery, precise color correction and standard lighting to boost sales on your site and page.",
    metaDescriptionAr: "خدمات تصوير تجاري وصناعي ومنتجات احترافية في استوديو آركا. صور عالية الجودة وتصحيح ألوان دقيق وإضاءة معيارية لزيادة مبيعات موقعك وصفحتك.",
    keywordsEn: ["Commercial Photography", "Product Photography", "Arka", "Digital Marketing"],
    keywordsAr: ["التصوير التجاري", "تصوير المنتجات", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "ui-ux-design-services",
    titleAr: "تصميم UI/UX للويب والجوال",
    taglineEn: "Simple, beautiful, functional; creating an experience that makes users fall in love with your product.",
    taglineAr: "بسيطة، جميلة، عملية؛ خلق تجربة تجعل المستخدم يعشق منتجكم.",
    excerptEn: "Specialized UI/UX design services for websites and apps. From user research and wireframes to modern UI design and interactive prototypes.",
    excerptAr: "خدمات تصميم UI/UX متخصصة للمواقع والتطبيقات. من بحث المستخدم والمخططات الأولية إلى تصميم واجهة مستخدم حديثة وتقديم نماذج أولية تفاعلية.",
    descriptionEn:
      "A digital product's success doesn't depend on its code alone; it requires a deep understanding of user needs and behavior. Arka Studio's UI/UX design services aren't just about creating beautiful pages — they're about precisely engineering the user's journey toward the highest engagement, retention and sales.\n\nWe begin the design process with user research and a precise understanding of the audience persona. Next, through standard information architecture and wireframing, we shape the product's initial structure. Then, using powerful tools like Figma, we turn validated ideas into interactive prototypes and eye-catching interfaces so you can touch and test the final product before development begins.\n\nOur design team, fully versed in color psychology, modern typography and the latest design trends, creates a product that is not only beautiful and luxurious but effortlessly simple and enjoyable for the user. Our final output in this department is a comprehensive design system and standard developer-handoff files that make programmers' work dramatically faster and more precise.",
    descriptionAr:
      "لا يعتمد نجاح المنتج الرقمي على برمجته فقط؛ بل يتطلب فهمًا عميقًا لاحتياجات وسلوك المستخدمين. خدمات تصميم UI/UX في استوديو آركا ليست مجرد إنشاء صفحات جميلة؛ بل هي هندسة دقيقة لرحلة المستخدم لتحقيق أعلى معدلات التفاعل والاحتفاظ والمبيعات.\n\nنبدأ عملية التصميم ببحث المستخدم وفهم دقيق لشخصية الجمهور. بعد ذلك، من خلال معمارية معلومات معيارية وتصميم المخططات الأولية، نشكّل البنية الأولية للمنتج. ثم، باستخدام أدوات قوية مثل Figma، نحوّل الأفكار المعتمدة إلى نماذج أولية تفاعلية وواجهات جذابة حتى تتمكنوا من لمس واختبار المنتج النهائي قبل بدء البرمجة.\n\nيخلق فريق التصميم لدينا، المتمكن تمامًا من علم نفس الألوان والطباعة الحديثة وأحدث اتجاهات التصميم، منتجًا ليس جميلاً وفاخرًا فحسب، بل بسيطًا وممتعًا للغاية للمستخدم. مخرجاتنا النهائية في هذا القسم هي نظام تصميم شامل وملفات تسليم معيارية للمطورين تجعل عمل المبرمجين أسرع وأدق بكثير.",
    featuresEn: [
      "Conducting UX research and mapping the customer journey",
      "Designing a custom, modern UI for websites and apps",
      "Wireframe design and interactive prototype delivery",
      "Applying user-centered design principles to boost conversion rates",
      "Delivering a standard design system for development teams",
    ],
    featuresAr: [
      "إجراء بحث تجربة المستخدم (UX Research) ورسم خريطة رحلة العميل",
      "تصميم واجهة مستخدم (UI) مخصصة وحديثة للموقع والتطبيق",
      "تصميم المخططات الأولية وتقديم نماذج أولية تفاعلية",
      "تطبيق مبادئ التصميم المتمحور حول المستخدم لزيادة معدل التحويل",
      "تقديم نظام تصميم معياري لفرق البرمجة",
    ],
    metaTitleEn: "Order UI/UX Design Services | Arka Studio",
    metaTitleAr: "طلب تصميم UI/UX | استوديو آركا",
    metaDescriptionEn: "Looking for a user-friendly website or app design? Arka Studio's specialized UI/UX design services turn your idea into a beautiful, standard, revenue-generating product.",
    metaDescriptionAr: "هل تبحث عن تصميم موقع أو تطبيق سهل الاستخدام؟ خدمات تصميم UI/UX المتخصصة في استوديو آركا تحوّل فكرتكم إلى منتج جميل ومعياري ومربح.",
    keywordsEn: ["UI/UX Design", "User Experience Design", "Arka", "Digital Marketing"],
    keywordsAr: ["تصميم UI/UX", "تصميم تجربة المستخدم", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "brand-and-content-strategy",
    titleAr: "تطوير استراتيجية العلامة التجارية والمحتوى",
    taglineEn: "Your business compass; engineer the path before you create.",
    taglineAr: "بوصلة أعمالكم؛ صمّموا المسار قبل الإبداع.",
    excerptEn: "Developing a dedicated growth roadmap for your business. From positioning and brand archetype to content calendar design and brand voice, for a deep connection with your target market.",
    excerptAr: "إعداد خارطة طريق مخصصة لنمو أعمالكم. من تحديد الموقع التنافسي والنموذج الأصلي للعلامة إلى تصميم تقويم المحتوى ونبرة الصوت لخلق تواصل عميق مع السوق المستهدف.",
    descriptionEn:
      "Content without strategy is like shooting in the dark! Before spending your budget on content production, website design or advertising, you need a precise roadmap to know exactly who to talk to, in what tone, and on what platform. Arka Studio's brand and content strategy services build exactly that compass for your business, so you avoid wasting resources.\n\nWe begin with market research and meticulous competitor analysis. Then, by defining brand positioning, crafting your business story and identifying a distinctive archetype, we create a personality that is unique, powerful and lasting. On the content side, by carefully designing the audience persona and building a content roadmap and calendar, we formulate the path from a raw idea to publication and final analysis.\n\nThis department's output is a comprehensive, practical document that serves as your playbook. It ensures every member of your team — from the graphic designer and social media admin to the sales specialist — is fully aligned and speaking with one voice. With a sound strategy in place, your brand message reaches your audience with complete clarity, and conversion and customer loyalty rates increase dramatically.",
    descriptionAr:
      "المحتوى بلا استراتيجية أشبه بإطلاق النار في الظلام! قبل إنفاق ميزانيتكم على إنتاج المحتوى أو تصميم الموقع أو الإعلانات، تحتاجون إلى خارطة طريق دقيقة لمعرفة بالضبط مع من تتحدثون، وبأي نبرة، وعلى أي منصة. تبني خدمات استراتيجية العلامة التجارية والمحتوى في استوديو آركا هذه البوصلة بالضبط لأعمالكم، لتجنب هدر الموارد.\n\nنبدأ بأبحاث السوق وتحليل دقيق للمنافسين. ثم، من خلال تحديد موقع العلامة التجارية، وصياغة قصة عملكم، وتحديد نموذج أصلي متميز، نخلق شخصية فريدة وقوية ودائمة. أما في جانب المحتوى، فمن خلال التصميم الدقيق لشخصية الجمهور وبناء خارطة طريق وتقويم للمحتوى، نصوغ المسار من الفكرة الخام إلى النشر والتحليل النهائي.\n\nمخرجات هذا القسم هي وثيقة شاملة وعملية تكون بمثابة دليلكم التنفيذي. تضمن هذه الوثيقة أن يكون كل عضو في فريقكم -من مصمم الجرافيك ومسؤول التواصل الاجتماعي إلى أخصائي المبيعات- متوافقين تمامًا ويتحدثون بصوت واحد. بوجود استراتيجية سليمة، تصل رسالة علامتكم التجارية بوضوح تام إلى الجمهور، ويزداد معدل التحويل وولاء العملاء بشكل ملحوظ.",
    featuresEn: [
      "Market research, competitor analysis and precise buyer persona design",
      "Verbal identity design, brand voice, and key taglines",
      "Positioning and discovering your business's unique competitive advantage",
      "Content distribution strategy and an operational content calendar",
      "A comprehensive strategy document to align all marketing and sales activities",
    ],
    featuresAr: [
      "أبحاث السوق وتحليل المنافسين وتصميم دقيق لشخصية المشتري",
      "تصميم الهوية اللفظية ونبرة العلامة التجارية والشعارات الرئيسية",
      "تحديد الموقع التنافسي واكتشاف الميزة التنافسية الفريدة لأعمالكم",
      "إعداد استراتيجية توزيع المحتوى وتقويم محتوى تشغيلي",
      "إعداد وثيقة استراتيجية شاملة لمواءمة جميع أنشطة التسويق والمبيعات",
    ],
    metaTitleEn: "Brand & Content Strategy Consulting | Arka Studio",
    metaTitleAr: "استشارات استراتيجية العلامة التجارية والمحتوى | استوديو آركا",
    metaDescriptionEn: "Content without strategy is fruitless! Content roadmap development, positioning, archetype definition and brand voice at Arka Studio to create a distinctive personality and targeted sales.",
    metaDescriptionAr: "المحتوى بلا استراتيجية بلا نتيجة! إعداد خارطة طريق المحتوى وتحديد الموقع التنافسي والنموذج الأصلي ونبرة العلامة في استوديو آركا لخلق شخصية متميزة ومبيعات مستهدفة.",
    keywordsEn: ["Brand & Content Strategy", "Content Strategy", "Arka", "Digital Marketing"],
    keywordsAr: ["استراتيجية العلامة والمحتوى", "استراتيجية المحتوى", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "digital-performance-marketing",
    titleAr: "التسويق الرقمي وتسويق الأداء",
    taglineEn: "Measurable growth; turning clicks into loyal customers.",
    taglineAr: "نمو قابل للقياس؛ تحويل النقرات إلى عملاء أوفياء.",
    excerptEn: "Running data-driven digital marketing campaigns. With targeted ads, user behavior analysis and conversion rate optimization (CRO), we maximize your return on investment (ROI).",
    excerptAr: "تنفيذ حملات تسويق رقمي قائمة على البيانات. من خلال الإعلانات المستهدفة وتحليل سلوك المستخدم وتحسين معدل التحويل، نعظّم عائد استثماركم.",
    descriptionEn:
      "An online presence alone isn't enough; being seen and converting your audience into customers requires strategy and precise data analysis. Arka Studio's digital and performance marketing services focus on exactly that: ROI and tangible growth for your business.\n\nIn performance marketing, we don't spend your budget on guesswork. Every toman of your ad budget is tracked with precise analytics tools. Our services include digital strategy development, pay-per-click campaigns (Google Ads), social media marketing, and conversion rate optimization (CRO). Our goal is to attract the most and highest-quality sales leads for you at the lowest possible cost.\n\nOur expert team continuously monitors key performance indicators (KPIs) and runs A/B tests to optimize campaigns in real time so no budget goes to waste. We're by your side to expand your market share and grow your sales sustainably and in a fully measurable way, through a data-driven, transparent marketing plan.",
    descriptionAr:
      "الحضور عبر الإنترنت وحده لا يكفي؛ فالظهور وتحويل جمهوركم إلى عملاء يتطلب استراتيجية وتحليلًا دقيقًا للبيانات. تركز خدمات التسويق الرقمي وتسويق الأداء في استوديو آركا بالضبط على هذا: العائد على الاستثمار والنمو الملموس لأعمالكم.\n\nفي تسويق الأداء، لا ننفق ميزانيتكم على التخمين. تتم متابعة كل ريال من ميزانيتكم الإعلانية بأدوات تحليلية دقيقة. تشمل خدماتنا إعداد الاستراتيجية الرقمية، وتنفيذ حملات الدفع بالنقرة (إعلانات جوجل)، والتسويق عبر وسائل التواصل الاجتماعي، وتحسين معدل التحويل. هدفنا هو جذب أكبر عدد وأعلى جودة من العملاء المحتملين لكم بأقل تكلفة ممكنة.\n\nيراقب فريقنا المتخصص باستمرار مؤشرات الأداء الرئيسية ويجري اختبارات A/B لتحسين الحملات لحظيًا حتى لا تُهدر أي ميزانية. نحن بجانبكم لتوسيع حصتكم السوقية وزيادة مبيعاتكم بشكل مستدام وقابل للقياس بالكامل، من خلال خطة تسويقية شفافة وقائمة على البيانات.",
    featuresEn: [
      "Designing and running fully data-driven performance marketing campaigns",
      "Managing pay-per-click ads (Google Ads, banner and native ads) for maximum return",
      "User behavior analysis and conversion rate optimization (CRO) to boost site sales",
      "Providing transparent, periodic reports on key performance indicators (KPIs)",
      "Designing a dedicated social media strategy for organic brand growth",
    ],
    featuresAr: [
      "تصميم وتنفيذ حملات تسويق أداء قائمة بالكامل على البيانات",
      "إدارة إعلانات الدفع بالنقرة (إعلانات جوجل واللافتات والمدمجة) بأعلى عائد",
      "تحليل سلوك المستخدم وتحسين معدل التحويل لزيادة مبيعات الموقع",
      "تقديم تقارير شفافة ودورية عن مؤشرات الأداء الرئيسية",
      "تصميم استراتيجية مخصصة لوسائل التواصل الاجتماعي للنمو العضوي للعلامة",
    ],
    metaTitleEn: "Digital & Performance Marketing Services | Arka Studio",
    metaTitleAr: "خدمات التسويق الرقمي وتسويق الأداء | استوديو آركا",
    metaDescriptionEn: "Looking to increase sales and grow your business? Arka Studio's digital and performance marketing services turn your budget into profit with data-driven, targeted advertising.",
    metaDescriptionAr: "هل تبحثون عن زيادة المبيعات ونمو أعمالكم؟ خدمات التسويق الرقمي وتسويق الأداء في استوديو آركا تحوّل ميزانيتكم إلى ربح من خلال إعلانات مستهدفة وقائمة على البيانات.",
    keywordsEn: ["Digital & Performance Marketing", "Performance Marketing", "Arka", "Digital Marketing"],
    keywordsAr: ["التسويق الرقمي وتسويق الأداء", "تسويق الأداء", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "brand-visual-identity-design",
    titleAr: "تصميم الشعار والهوية البصرية",
    taglineEn: "Creating a distinctive, lasting personality; a brand that inspires trust.",
    taglineAr: "خلق شخصية متميزة ودائمة؛ علامة تجارية تُلهم الثقة.",
    excerptEn: "Brand strategy design, custom logo creation, a comprehensive brand book, and corporate color palette selection to build a cohesive, professional image for your business.",
    excerptAr: "تصميم استراتيجية العلامة التجارية، وابتكار شعار مخصص، وإعداد دليل علامة تجارية شامل، واختيار لوحة ألوان مؤسسية لبناء صورة موحدة واحترافية لأعمالكم.",
    descriptionEn:
      "The audience's first encounter with your business is your visual image. Branding and visual identity design go far beyond a simple logo; your visual identity is the very soul, personality and voice of your brand, etched into your audience's mind. At Arka Studio, with a deep understanding of your strategy and goals, we create an identity that's cohesive, modern and fully distinctive.\n\nOur branding department's services include custom logo design (typographic, pictorial or combination), letterhead set design, corporate font selection, and brand color palette development. We believe that using principled colors with precisely defined color codes (Hex, RGB and CMYK) not only creates unmatched harmony but has a profound psychological effect on the customer and maintains brand consistency across every print and digital output.\n\nOur final output in this department is a comprehensive, standard brand book. This guidebook ensures that everything from your website design to your social media posts and interior decor follows a single visual language. With Arka, build a brand that isn't just seen, but takes powerful hold in your target market's mind.",
    descriptionAr:
      "أول لقاء للجمهور مع أعمالكم هو صورتكم البصرية. تتجاوز العلامة التجارية وتصميم الهوية البصرية مجرد الشعار البسيط؛ فهويتكم البصرية هي روح وشخصية وصوت علامتكم التجارية المحفورة في ذهن الجمهور. في استوديو آركا، وبفهم عميق لاستراتيجيتكم وأهدافكم، نخلق هوية موحدة وحديثة ومتميزة تمامًا.\n\nتشمل خدمات قسم العلامة التجارية لدينا تصميم شعار مخصص (خطي أو تصويري أو مركب)، وتصميم طقم الأوراق المكتبية، واختيار خط مؤسسي، وإعداد لوحة ألوان العلامة التجارية. نؤمن بأن استخدام ألوان مدروسة مع تحديد دقيق لأكواد الألوان (Hex وRGB وCMYK) لا يخلق انسجامًا لا مثيل له فحسب، بل يترك تأثيرًا نفسيًا عميقًا لدى العميل ويحافظ على تناسق العلامة التجارية في جميع مخرجات الطباعة والرقمية.\n\nمخرجاتنا النهائية في هذا القسم هي دليل علامة تجارية شامل ومعياري. يضمن هذا الدليل أن كل شيء بدءًا من تصميم موقعكم وحتى منشورات التواصل الاجتماعي والديكور الداخلي يتبع لغة بصرية واحدة. مع آركا، ابنوا علامة تجارية لا تُرى فحسب، بل تستقر بقوة في ذهن سوقكم المستهدف.",
    featuresEn: [
      "Custom, minimal and purposeful logo design based on business strategy",
      "A comprehensive brand book and visual-system usage guide",
      "A complete stationery set design (letterhead, business card, envelope, folder, etc.)",
      "Color engineering and a corporate color palette with standard codes for print and web",
      "Custom graphic templates designed for social media",
    ],
    featuresAr: [
      "تصميم شعار مخصص وبسيط وهادف بناءً على استراتيجية العمل",
      "إعداد دليل علامة تجارية شامل ودليل استخدام النظام البصري",
      "تصميم طقم كامل من الأوراق المكتبية (ترويسة، بطاقة عمل، ظرف، مجلد، وغيرها)",
      "هندسة الألوان وتقديم لوحة ألوان مؤسسية بأكواد معيارية للطباعة والويب",
      "تصميم قوالب جرافيك مخصصة لوسائل التواصل الاجتماعي",
    ],
    metaTitleEn: "Logo & Brand Visual Identity Design | Arka Studio",
    metaTitleAr: "تصميم الشعار والهوية البصرية للعلامة | استوديو آركا",
    metaDescriptionEn: "Professional branding, custom logo design and brand book development at Arka Studio. Build a cohesive visual identity and standard color palette to stay memorable in your customers' minds.",
    metaDescriptionAr: "خدمات علامة تجارية احترافية، تصميم شعار مخصص وإعداد دليل علامة تجارية في استوديو آركا. ابنوا هوية بصرية موحدة ولوحة ألوان معيارية لتبقوا خالدين في أذهان عملائكم.",
    keywordsEn: ["Branding & Identity", "Logo Design", "Arka", "Digital Marketing"],
    keywordsAr: ["العلامة التجارية والهوية", "تصميم الشعار", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "seo-and-content-marketing",
    titleAr: "تحسين محركات البحث والتسويق بالمحتوى",
    taglineEn: "Conquering Google's first page; lasting visibility and organic sales growth.",
    taglineAr: "الوصول إلى الصفحة الأولى في جوجل؛ ظهور دائم ونمو عضوي للمبيعات.",
    excerptEn: "Specialized SEO services to increase targeted site traffic. From technical SEO and on-page optimization to sound off-page link building and content strategy.",
    excerptAr: "خدمات سيو متخصصة لزيادة الزيارات المستهدفة للموقع. من السيو التقني وتحسين الصفحة الداخلي إلى بناء الروابط الخارجي السليم وإعداد استراتيجية المحتوى.",
    descriptionEn:
      "Having a beautiful website with no visitors is exactly like opening a luxury store in a dead-end alley! Arka Studio's SEO and content marketing services are your golden key to escaping that dead end and getting in front of the thousands of potential customers searching for your services on Google every day.\n\nWe see SEO as a scientific, continuous, data-driven process. Our path begins with comprehensive keyword research and a precise analysis of your competitors. Then, by fixing technical infrastructure issues, optimizing on-page structure, and running powerful white-hat off-page link-building and guest-posting campaigns, we raise your domain authority to the highest possible level in search engines' eyes.\n\nBut SEO without valuable content is fruitless. Our content department, by building a dedicated content calendar and writing specialized, SEO-optimized articles, doesn't just please Google's crawlers — it keeps real readers on your site too. Our ultimate goal isn't just increasing visitor numbers; it's attracting targeted traffic that ultimately converts into loyal customers and real sales.",
    descriptionAr:
      "امتلاك موقع جميل بلا زوار أشبه تمامًا بافتتاح متجر فاخر في زقاق مسدود! خدمات السيو والتسويق بالمحتوى في استوديو آركا هي مفتاحكم الذهبي للخروج من هذا المأزق والظهور أمام آلاف العملاء المحتملين الذين يبحثون عن خدماتكم يوميًا في جوجل.\n\nنرى السيو عملية علمية ومستمرة وقائمة على البيانات. يبدأ مسارنا ببحث شامل للكلمات المفتاحية وتحليل دقيق لمنافسيكم. ثم، من خلال إصلاح الأخطاء البنيوية في السيو التقني، وتحسين هيكل الصفحات الداخلي، وتنفيذ حملات بناء روابط خارجية قوية وآمنة، نرفع مصداقية نطاقكم إلى أعلى مستوى ممكن في نظر محركات البحث.\n\nلكن السيو بلا محتوى قيّم بلا جدوى. يقوم قسم إنتاج المحتوى لدينا، من خلال إعداد تقويم محتوى مخصص وكتابة مقالات متخصصة ومحسّنة لمحركات البحث، ليس فقط بإرضاء روبوتات جوجل، بل يشجع القارئ الحقيقي أيضًا على البقاء في الموقع. هدفنا النهائي ليس مجرد زيادة عدد الزوار؛ بل جذب حركة مرور مستهدفة تتحول في النهاية إلى عملاء أوفياء ومبيعات حقيقية.",
    featuresEn: [
      "Developing a comprehensive SEO strategy and extracting revenue-driving keywords",
      "Precise technical SEO execution and site load-speed optimization",
      "Producing dedicated text, visual and video content based on SEO principles",
      "Running safe, white-hat off-page link-building campaigns",
      "Providing transparent, periodic reports on ranking growth, organic traffic and user behavior",
    ],
    featuresAr: [
      "إعداد استراتيجية سيو شاملة واستخراج كلمات مفتاحية مربحة",
      "تنفيذ دقيق للسيو التقني وتحسين سرعة تحميل الموقع",
      "إنتاج محتوى نصي وبصري ومرئي مخصص وفق مبادئ السيو",
      "تنفيذ حملات بناء روابط خارجية آمنة وموثوقة",
      "تقديم تقارير شفافة ودورية عن نمو الترتيب والزيارات العضوية وسلوك المستخدم",
    ],
    metaTitleEn: "SEO & Content Marketing Services | Arka Studio",
    metaTitleAr: "خدمات تحسين محركات البحث والتسويق بالمحتوى | استوديو آركا",
    metaDescriptionEn: "Get your website to Google's first page! Specialized SEO services, content writing, technical SEO and white-hat link building at Arka Studio to boost organic sales.",
    metaDescriptionAr: "أوصلوا موقعكم إلى الصفحة الأولى في جوجل! خدمات سيو متخصصة وكتابة محتوى وسيو تقني وبناء روابط موثوق في استوديو آركا لزيادة المبيعات العضوية.",
    keywordsEn: ["SEO & Content Marketing", "SEO", "Arka", "Digital Marketing"],
    keywordsAr: ["تحسين محركات البحث والتسويق بالمحتوى", "السيو", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "promotional-video-production",
    titleAr: "إنتاج الأفلام الإعلانية",
    taglineEn: "Creating a cinematic, lasting narrative of your brand's identity",
    taglineAr: "خلق سرد سينمائي ودائم لهوية علامتكم التجارية",
    excerptEn: "From concept to screen; professional production of ad films, industrial documentaries and social media content. With cinematic quality and creative ideation, we bring your brand's story to life.",
    excerptAr: "من الفكرة إلى الشاشة؛ إنتاج احترافي للأفلام الإعلانية والأفلام الصناعية ومحتوى وسائل التواصل الاجتماعي. بجودة سينمائية وأفكار إبداعية، نصوّر قصة علامتكم التجارية.",
    descriptionEn:
      "Today's world is a world of visual competition. A professional ad film isn't just a simple video; it's the most powerful tool for introducing your business's identity. At Arka Studio, from the first spark of an idea to the final edited frame, we're with you to create content that isn't just eye-catching, but directly impacts your sales and brand awareness.\n\nOur film production department's services include creating ad films for marketing campaigns, producing industrial and documentary films to showcase your equipment and production lines, and dedicated video marketing for social media. Using precise motion equipment, standard lighting and clear sound recording, we guarantee the highest visual and audio quality for your projects.\n\nWhat sets Arka Studio's output apart is an obsessive attention to detail — from custom scriptwriting to color grading with precise cinematic standards that make your corporate colors and products appear with the utmost precision and appeal. Our team, with an artistic yet data-driven approach, creates videos that are results-oriented, purposeful and measurable.",
    descriptionAr:
      "عالم اليوم هو عالم التنافس البصري. الفيلم الإعلاني الاحترافي ليس مجرد فيديو بسيط؛ بل هو أقوى أداة لتقديم هوية أعمالكم. في استوديو آركا، من أول شرارة فكرة وحتى آخر لقطة في المونتاج، نحن معكم لخلق محتوى ليس جذابًا فحسب، بل يؤثر مباشرة على مبيعاتكم والوعي بعلامتكم التجارية.\n\nتشمل خدمات قسم إنتاج الأفلام لدينا صناعة أفلام إعلانية للحملات التسويقية، وإنتاج أفلام صناعية ووثائقية لعرض معداتكم وخطوط إنتاجكم، وتسويق فيديو مخصص لوسائل التواصل الاجتماعي. باستخدام معدات حركة دقيقة وإضاءة معيارية وتسجيل صوت واضح، نضمن أعلى جودة بصرية وسمعية لمشاريعكم.\n\nما يميز مخرجات استوديو آركا هو الاهتمام الشديد بالتفاصيل؛ من كتابة السيناريو المخصص إلى تصحيح الألوان بمعايير سينمائية دقيقة تجعل ألوان علامتكم التجارية ومنتجاتكم تظهر بأقصى درجات الدقة والجاذبية. يخلق فريقنا، بنهج فني وقائم على البيانات في آن واحد، فيديوهات هادفة وقابلة للقياس وتحقق نتائج.",
    featuresEn: [
      "Up-to-date filming equipment and standard lighting",
      "Professional, cinematic color grading",
      "Custom scriptwriting based on your brand identity",
      "Support for social media and TV broadcast",
      ...GENERIC_FEATURES_EN,
    ],
    featuresAr: [
      "معدات تصوير حديثة وإضاءة معيارية",
      "تصحيح ألوان احترافي وسينمائي",
      "كتابة سيناريو مخصص بناءً على هوية العلامة التجارية",
      "دعم لوسائل التواصل الاجتماعي والبث التلفزيوني",
      ...GENERIC_FEATURES_AR,
    ],
    metaTitleEn: "Ad Film Production & Industrial Video | Arka Studio",
    metaTitleAr: "إنتاج الأفلام الإعلانية والفيديو الصناعي | استوديو آركا",
    metaDescriptionEn: "Looking to produce an ad film or industrial video? Arka Studio distinguishes your brand's story with professional videography, cinematic color grading and custom scriptwriting.",
    metaDescriptionAr: "هل تبحثون عن إنتاج فيلم إعلاني أو فيديو صناعي؟ استوديو آركا يميّز قصة علامتكم التجارية بتصوير احترافي وتصحيح ألوان سينمائي وكتابة سيناريو مخصصة.",
    keywordsEn: ["Video Production", "Ad Film Production", "Arka", "Digital Marketing"],
    keywordsAr: ["إنتاج الفيديو", "إنتاج الأفلام الإعلانية", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "social-media-management",
    titleAr: "إدارة وسائل التواصل الاجتماعي",
    taglineEn: "Build a loyal community; turn followers into permanent customers.",
    taglineAr: "ابنِ مجتمعًا وفيًا؛ حوّل المتابعين إلى عملاء دائمين.",
    excerptEn: "Professional social media and Instagram management services. Content calendar planning, custom graphic design, creative reels production, and interaction management for your page's explosive growth.",
    excerptAr: "خدمات احترافية لإدارة وسائل التواصل الاجتماعي وإنستغرام. إعداد تقويم المحتوى، وتصميم جرافيك مخصص، وإنتاج ريلز إبداعي، وإدارة التفاعلات لنمو انفجاري لصفحتكم.",
    descriptionEn:
      "A powerful social media presence is no longer a choice; it's the lifeblood of your business. Today's audience notices the difference between an ordinary page and a professional one at first glance. Arka Studio's social media and Instagram admin management services are designed to turn your page into a branding and direct-sales machine.\n\nOur team's strength lies in combining strategic marketing skills with stunning visual content production. We don't just settle for publishing stock, downloaded photos; relying on the studio's professional filming and sound equipment, we take on producing viral, trending reels, dedicated product photography and cohesive graphic design to maintain your visual identity at the highest possible level.\n\nInstagram page management at Arka includes building a dedicated content calendar, principled caption writing, targeted hashtagging, and interaction and community management. By precisely analyzing algorithms and audience behavior (insights), we continuously optimize the content strategy so you experience organic follower growth and a dramatic increase in engagement rate in a fully tangible way.",
    descriptionAr:
      "الحضور القوي في وسائل التواصل الاجتماعي لم يعد خيارًا؛ بل هو شريان الحياة لأعمالكم. يلاحظ الجمهور اليوم الفرق بين صفحة عادية وصفحة احترافية من النظرة الأولى. صُممت خدمات إدارة وسائل التواصل الاجتماعي وإنستغرام في استوديو آركا لتحويل صفحتكم إلى آلة لبناء العلامة التجارية والمبيعات المباشرة.\n\nتكمن قوة فريقنا في الجمع بين المهارات التسويقية الاستراتيجية وإنتاج محتوى بصري مذهل. نحن لا نكتفي بنشر صور جاهزة ومُحمّلة؛ بل نعتمد على معدات التصوير والصوت الاحترافية في الاستوديو لإنتاج ريلز رائجة وفيروسية، وتصوير منتجات مخصص، وتصميم جرافيك موحد للحفاظ على هويتكم البصرية في أعلى مستوى ممكن.\n\nتشمل إدارة صفحة إنستغرام في آركا إعداد تقويم محتوى مخصص، وكتابة تعليقات مدروسة، ووضع هاشتاجات مستهدفة، وإدارة التفاعلات والمجتمع. من خلال تحليل دقيق للخوارزميات وسلوك الجمهور، نحسّن استراتيجية المحتوى باستمرار لتختبروا نموًا عضويًا في المتابعين وزيادة ملحوظة في معدل التفاعل بشكل ملموس تمامًا.",
    featuresEn: [
      "Developing a growth strategy and a regular, targeted content calendar",
      "Producing video content (reels and stories) with professional lighting and sound equipment",
      "Designing custom graphic templates based on your corporate colors and identity",
      "Engaging caption writing, principled hashtagging and interaction management (comments and DMs)",
      "Precise algorithm analysis and monthly growth (insights) reporting",
    ],
    featuresAr: [
      "إعداد استراتيجية نمو وتقويم محتوى منتظم وهادف",
      "إنتاج محتوى فيديو (ريلز وستوري) بمعدات إضاءة وصوت احترافية",
      "تصميم قوالب جرافيك مخصصة بناءً على ألوان وهوية المؤسسة",
      "كتابة تعليقات جذابة، ووضع هاشتاجات مدروسة، وإدارة التفاعلات (التعليقات والرسائل المباشرة)",
      "تحليل دقيق للخوارزميات وتقديم تقرير نمو شهري",
    ],
    metaTitleEn: "Social Media & Instagram Management | Arka Studio",
    metaTitleAr: "إدارة وسائل التواصل الاجتماعي وإنستغرام | استوديو آركا",
    metaDescriptionEn: "Professional social media and Instagram management. From content strategy and calendar to custom reels production, graphic design and organic follower growth at Arka Studio.",
    metaDescriptionAr: "إدارة احترافية لوسائل التواصل الاجتماعي وإنستغرام. من استراتيجية المحتوى والتقويم إلى إنتاج ريلز مخصص وتصميم جرافيك ونمو عضوي للمتابعين في استوديو آركا.",
    keywordsEn: ["Social Media Management", "Instagram Management", "Arka", "Digital Marketing"],
    keywordsAr: ["إدارة وسائل التواصل الاجتماعي", "إدارة إنستغرام", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "motion-graphics-and-cgi",
    titleAr: "الموشن غرافيك وCGI",
    taglineEn: "Crossing the boundaries of reality; bringing ideas to life with the magic of motion and imagery.",
    taglineAr: "تجاوز حدود الواقع؛ إحياء الأفكار بسحر الحركة والصورة.",
    excerptEn: "Professional 2D and 3D motion graphics design, visual effects (VFX) production and photorealistic (CGI) animation for an engaging, creative introduction to your services and products.",
    excerptAr: "تصميم موشن غرافيك احترافي ثنائي وثلاثي الأبعاد، وإنتاج مؤثرات بصرية (VFX) ورسوم متحركة واقعية (CGI) لتقديم جذاب وإبداعي لخدماتكم ومنتجاتكم.",
    descriptionEn:
      "When reality isn't enough to show the greatness of your idea, motion graphics and CGI (computer-generated imagery) step onto the field. At Arka Studio, we set aside the physical limitations of filming and create whatever's in your mind with the highest visual quality and the most precise multimedia standards.\n\nThis department's services include creating 2D and 3D promotional motion graphics for social media, as well as designing photorealistic (CGI) animations to show the internal structure and function of complex industrial products. Using this technique, you can showcase products that are still at the idea stage, or ones whose internal angles can't be filmed, in the most realistic way possible.\n\nOur team blends art and technology to turn raw ideas into stunning videos. Precision in 3D rendering, accurate material simulation, virtual lighting and principled color correction make the final output erase the line between reality and animation. We create videos that aren't just visually stunning, but convey your brand's message to the audience in the fastest and most lasting way possible.",
    descriptionAr:
      "عندما لا يكون الواقع كافيًا لإظهار عظمة فكرتكم، يدخل الموشن غرافيك وCGI (الصور المولدة بالحاسوب) إلى الميدان. في استوديو آركا، نتجاوز القيود الفيزيائية للتصوير ونخلق كل ما يدور في ذهنكم بأعلى جودة بصرية وأدق معايير الوسائط المتعددة.\n\nتشمل خدمات هذا القسم إنشاء موشن غرافيك إعلاني ثنائي وثلاثي الأبعاد لوسائل التواصل الاجتماعي، وكذلك تصميم رسوم متحركة واقعية (CGI) لعرض البنية الداخلية وأداء المنتجات الصناعية المعقدة. باستخدام هذه التقنية، يمكنكم عرض منتجات لا تزال في مرحلة الفكرة، أو تلك التي لا يمكن تصوير زواياها الداخلية، بأكثر شكل واقعي ممكن.\n\nيمزج فريقنا الفن بالتكنولوجيا لتحويل الأفكار الخام إلى فيديوهات مذهلة. الدقة في التصيير ثلاثي الأبعاد، والمحاكاة الدقيقة للمواد، والإضاءة الافتراضية، وتصحيح الألوان المدروس تجعل المخرجات النهائية تمحو الحدود بين الواقع والرسوم المتحركة. نصنع فيديوهات ليست مذهلة بصريًا فحسب، بل تنقل رسالة علامتكم التجارية للجمهور بأسرع وأدوم طريقة ممكنة.",
    featuresEn: [
      "Custom scenario and storyboard design before production begins",
      "Creating engaging 2D and 3D motion graphics",
      "Simulating and rendering industrial products (CGI) with photorealistic precision and real materials",
      "Professionally compositing visual effects (VFX) with live-action video",
      "Standard output with precise, calibrated colors for playback on every platform",
    ],
    featuresAr: [
      "تصميم سيناريو ولوحة قصة مخصصة قبل بدء الإنتاج",
      "إنشاء موشن غرافيك ثنائي وثلاثي الأبعاد جذاب",
      "محاكاة وتصيير منتجات صناعية (CGI) بدقة واقعية ومواد حقيقية",
      "دمج احترافي للمؤثرات البصرية مع فيديوهات اللقطات الحية",
      "مخرجات معيارية بألوان دقيقة ومعايرة للعرض على جميع المنصات",
    ],
    metaTitleEn: "Motion Graphics & Ad Animation Production | Arka Studio",
    metaTitleAr: "إنتاج الموشن غرافيك والرسوم المتحركة الإعلانية | استوديو آركا",
    metaDescriptionEn: "Order professional motion graphics production, 3D animation and visual effects (CGI). Arka Studio — creating stunning ad and industrial videos to showcase your products.",
    metaDescriptionAr: "اطلبوا إنتاج موشن غرافيك احترافي ورسوم متحركة ثلاثية الأبعاد ومؤثرات بصرية (CGI). استوديو آركا؛ صناعة فيديوهات إعلانية وصناعية مذهلة لعرض منتجاتكم.",
    keywordsEn: ["Motion & CGI", "Motion Graphics", "Arka", "Digital Marketing"],
    keywordsAr: ["الموشن غرافيك وCGI", "الموشن غرافيك", "آركا", "التسويق الرقمي"],
  },
  {
    slug: "custom-web-design-development",
    titleAr: "تصميم وتطوير المواقع",
    taglineEn: "Your business's 24-hour digital branch; a website that sells!",
    taglineAr: "فرعكم الرقمي على مدار الساعة؛ موقع يبيع!",
    excerptEn: "Professional, fast and responsive website design and development. Focusing on user experience (UX) and SEO principles, we prepare your digital storefront for sales and customer acquisition.",
    excerptAr: "تصميم وتطوير مواقع احترافية وسريعة ومتجاوبة. بالتركيز على تجربة المستخدم ومبادئ السيو، نجهّز واجهتكم الرقمية للبيع وجذب العملاء.",
    descriptionEn:
      "Your website is the most important storefront and 24-hour digital branch of your business, presenting your services and products to customers around the clock. In today's competitive world, an ordinary site with ready-made templates isn't enough; you need a platform that captures the user's trust and attention from the very first second. At Arka Studio, we see website design as going beyond coding, weaving it together with visual art and user experience (UI/UX).\n\nOur web department's services include corporate site design and e-commerce/portfolio site development to the highest world-class standards. With special attention to information architecture, high load speed and a fully responsive design, we create a site that displays flawlessly on every device (mobile, tablet and desktop). Also, thanks to our team's expertise in multimedia content production, your site's graphic appearance will be completely distinctive, luxurious and custom.\n\nEvery project at Arka is implemented following the most precise technical SEO principles, so your site's infrastructure is fully ready to reach Google's first page. From creating an engaging user interface to implementing a simple, functional admin panel, we're with you step by step to build a powerful digital base for your brand.",
    descriptionAr:
      "موقعكم هو أهم واجهة وفرع رقمي على مدار الساعة لأعمالكم، يعرض خدماتكم ومنتجاتكم للعملاء طوال اليوم. في عالم اليوم التنافسي، لا يكفي موقع عادي بقوالب جاهزة؛ تحتاجون إلى منصة تكسب ثقة واهتمام المستخدم من الثانية الأولى. في استوديو آركا، ننظر إلى تصميم المواقع كشيء يتجاوز البرمجة، ونمزجه بالفن البصري وتجربة المستخدم.\n\nتشمل خدمات قسم الويب لدينا تصميم المواقع المؤسسية وتطوير مواقع التجارة الإلكترونية والمحافظ بأعلى المعايير العالمية. مع اهتمام خاص بمعمارية المعلومات وسرعة التحميل العالية والتصميم المتجاوب بالكامل، نصنع موقعًا يظهر بشكل مثالي على أي جهاز (جوال وتابلت وحاسوب). كما أنه بفضل خبرة فريقنا في إنتاج محتوى الوسائط المتعددة، سيكون المظهر الجرافيكي لموقعكم متميزًا وفاخرًا ومخصصًا تمامًا.\n\nيُنفَّذ كل مشروع في آركا وفق أدق مبادئ السيو التقني، لتكون بنية موقعكم جاهزة تمامًا للوصول إلى الصفحة الأولى في جوجل. من خلق واجهة مستخدم جذابة إلى تطبيق لوحة تحكم بسيطة وعملية، نحن معكم خطوة بخطوة لبناء قاعدة رقمية قوية لعلامتكم التجارية.",
    featuresEn: [
      "Custom UI design and standard UX",
      "Optimized coding, high load speed and technical SEO infrastructure",
      "Fully responsive design compatible with mobile and tablet",
      "High security and a fully user-friendly admin panel",
      "Site management training and technical support after delivery",
    ],
    featuresAr: [
      "تصميم واجهة مستخدم مخصصة وتجربة مستخدم معيارية",
      "برمجة محسّنة وسرعة تحميل عالية ومراعاة بنية السيو التقني",
      "تصميم متجاوب بالكامل متوافق مع الجوال والتابلت",
      "توفير أمان عالٍ ولوحة تحكم سهلة الاستخدام تمامًا",
      "تدريب على إدارة الموقع ودعم فني بعد التسليم",
    ],
    metaTitleEn: "Professional, Corporate & E-commerce Web Design | Arka Studio",
    metaTitleAr: "تصميم مواقع احترافية ومؤسسية وتجارية | استوديو آركا",
    metaDescriptionEn: "Looking for a professional, fast and SEO-driven website design? Arka Studio, with custom UI/UX design, turns your corporate or e-commerce website into a sales machine.",
    metaDescriptionAr: "هل تبحثون عن تصميم موقع احترافي وسريع وموجه للسيو؟ استوديو آركا، بتصميم UI/UX مخصص، يحوّل موقعكم المؤسسي أو التجاري إلى آلة مبيعات.",
    keywordsEn: ["Web Design & Development", "Website Development", "Arka", "Digital Marketing"],
    keywordsAr: ["تصميم وتطوير المواقع", "تطوير المواقع", "آركا", "التسويق الرقمي"],
  },
];

async function backfillServices() {
  const rows = await db.service.findMany({ select: { id: true, slug: true, titleAr: true, pricing: true } });
  let count = 0;
  for (const row of rows) {
    const tr = SERVICE_TR.find((s) => s.slug === row.slug);
    if (!tr || row.titleAr) continue; // skip unknown slugs or already-translated rows
    await db.service.update({
      where: { id: row.id },
      data: {
        titleAr: tr.titleAr,
        taglineEn: tr.taglineEn,
        taglineAr: tr.taglineAr,
        excerptEn: tr.excerptEn,
        excerptAr: tr.excerptAr,
        descriptionEn: tr.descriptionEn,
        descriptionAr: tr.descriptionAr,
        featuresEn: J(tr.featuresEn),
        featuresAr: J(tr.featuresAr),
        workflowEn: WORKFLOW_EN,
        workflowAr: WORKFLOW_AR,
        faqsEn: FAQS_EN,
        faqsAr: FAQS_AR,
        pricingEn: pricingTr(row.pricing, "en"),
        pricingAr: pricingTr(row.pricing, "ar"),
        priceUnitEn: "Toman",
        priceUnitAr: "تومان",
        metaTitleEn: tr.metaTitleEn,
        metaTitleAr: tr.metaTitleAr,
        metaDescriptionEn: tr.metaDescriptionEn,
        metaDescriptionAr: tr.metaDescriptionAr,
        keywordsEn: J(tr.keywordsEn),
        keywordsAr: J(tr.keywordsAr),
      },
    });
    count++;
  }
  console.log(`Services: translated ${count}/${rows.length} (matched by slug).`);
}

interface IndustryTr {
  slug: string;
  shortEn: string; // short display name, e.g. "Medical & Health" — also used as the fixed titleAr replacement's English mirror
  titleAr: string;
  excerptEn: string; excerptAr: string;
  descriptionEn: string; descriptionAr: string;
}

const INDUSTRY_TR: IndustryTr[] = [
  {
    slug: "medical-healthcare-marketing",
    shortEn: "Medical & Health",
    titleAr: "الطب والصحة",
    excerptEn: "Specialized digital marketing, medical content production, page management and ad film production for physicians, specialty clinics and treatment centers — built to earn trust and attract patients.",
    excerptAr: "خدمات تسويق رقمي متخصصة، وإنتاج محتوى طبي، وإدارة صفحات، وإنتاج أفلام إعلانية للأطباء والعيادات المتخصصة والمراكز العلاجية بهدف كسب الثقة وجذب المرضى.",
    descriptionEn:
      "In the healthcare industry, everything is built on trust. Today, patients search a doctor's or clinic's name on Google and scan their social media presence before ever booking an appointment. Not having a professional visual identity and principled content means losing a wide range of potential patients. At Arka Studio, understanding the sensitivities and professional ethics of this field, we help you present your expertise in the most credible way possible.\n\nOur services for the medical community include appointment-booking and medical website design, SEO for specialized keywords, Instagram content production for physicians (including educational videos, reels and interviews), and high-quality ad films of your clinic space and equipment. From private practices and beauty clinics in Tabriz to major healthcare brands, we design your content strategy to achieve the highest possible patient-acquisition rate.\n\nThe Arka team knows that content production in treatment fields (especially dentistry, dermatology, hair, and cosmetic surgery) requires visual finesse, precise lighting, and flawless before-and-after presentation. With a data-driven yet artistic eye, we create campaigns that not only highlight your knowledge and expertise, but directly impact your brand credibility and revenue growth.",
    descriptionAr:
      "في صناعة الرعاية الصحية، يُبنى كل شيء على الثقة. يبحث المرضى اليوم عن اسم الطبيب أو العيادة في جوجل ويتفحصون حضورهم في وسائل التواصل الاجتماعي قبل حجز أي موعد. عدم امتلاك هوية بصرية احترافية ومحتوى مدروس يعني فقدان شريحة واسعة من المرضى المحتملين. في استوديو آركا، وبفهمنا لحساسيات وأخلاقيات هذا المجال المهنية، نساعدكم على عرض خبرتكم بأكثر الطرق مصداقية.\n\nتشمل خدماتنا للمجتمع الطبي تصميم مواقع الحجز والمواقع الطبية، وتحسين محركات البحث للكلمات المفتاحية المتخصصة، وإنتاج محتوى إنستغرام للأطباء (شامل الفيديوهات التعليمية والريلز والمقابلات)، وإنتاج أفلام إعلانية عالية الجودة لعيادتكم ومعداتكم. من العيادات الخاصة وعيادات التجميل في تبريز إلى العلامات الصحية الكبرى، نصمم استراتيجية المحتوى لتحقيق أعلى معدل ممكن لجذب المرضى.\n\nيعرف فريق آركا أن إنتاج المحتوى في المجالات العلاجية (خاصة طب الأسنان والجلدية والشعر والجراحات التجميلية) يتطلب دقة بصرية وإضاءة محكمة وعرضًا مثاليًا لنتائج قبل وبعد. بنظرة قائمة على البيانات وفنية في آن واحد، نصنع حملات لا تبرز معرفتكم وخبرتكم فحسب، بل تؤثر مباشرة على مصداقية علامتكم ونمو إيراداتكم.",
  },
  {
    slug: "automotive-digital-marketing",
    shortEn: "Automotive",
    titleAr: "السيارات",
    excerptEn: "Specialized industrial photography of auto parts, interactive digital catalog design, ad film production and social media advertising campaigns for spare parts manufacturers and automotive brands.",
    excerptAr: "تصوير صناعي متخصص لقطع غيار السيارات، وتصميم كتالوجات رقمية تفاعلية، وإنتاج أفلام إعلانية، وتنفيذ حملات إعلانية على وسائل التواصل الاجتماعي لمصنعي قطع الغيار والعلامات التجارية للسيارات.",
    descriptionEn:
      "The automotive and spare parts industry is a highly competitive market where visual quality and precise information presentation come first. Correctly showcasing a part's technical detail or a vehicle's design beauty requires deep expertise in industrial lighting, graphic design and targeted advertising. At Arka Studio, with a full command of this field's needs and complexities, we deliver automotive marketing and digital marketing solutions at the highest visual standards.\n\nOur team's special expertise lies in executing large industrial and retail projects — from precise industrial photography of hundreds of spare parts items (such as hydraulic components, steering systems, engines and body parts) to designing several-hundred-page interactive digital catalogs that present your products to wholesale and retail buyers in the most modern, organized way possible. We also help you maximize sales of key products by designing social media ad campaigns and producing dedicated graphic content for specific items.\n\nCorrectly showing material textures (such as metal, compressed plastics or leather) in auto parts requires advanced studio lighting equipment and standard color grading, so the final output appears in catalogs and web pages with zero color or texture deviation. We're with you from the initial ideation stage through building comprehensive catalogs and developing social media strategies, so your industrial brand shines powerfully in the market.",
    descriptionAr:
      "تُعد صناعة السيارات وقطع الغيار سوقًا شديدة التنافسية تتصدر فيها الجودة البصرية ودقة عرض المعلومات الأولوية. يتطلب العرض الصحيح للتفاصيل الفنية لقطعة ما أو لجمال تصميم السيارة خبرة عميقة في الإضاءة الصناعية والتصميم الجرافيكي والإعلان المستهدف. في استوديو آركا، وبإتقان كامل لاحتياجات وتعقيدات هذا المجال، نقدم حلول التسويق الرقمي لصناعة السيارات بأعلى المعايير البصرية.\n\nتكمن خبرة فريقنا الخاصة في تنفيذ المشاريع الصناعية والتجارية الكبرى؛ من التصوير الصناعي الدقيق لمئات قطع الغيار (مثل المكونات الهيدروليكية وأنظمة التوجيه والمحركات وأجزاء الهيكل) إلى تصميم كتالوجات رقمية تفاعلية تمتد لمئات الصفحات تعرض منتجاتكم للمشترين بالجملة والتجزئة بأكثر الطرق حداثة وتنظيمًا. كما نساعدكم على تعظيم مبيعات المنتجات الرئيسية من خلال تصميم حملات إعلانية على وسائل التواصل الاجتماعي وإنتاج محتوى جرافيكي مخصص لمنتجات معينة.\n\nيتطلب العرض الصحيح لملمس المواد (مثل المعدن أو البلاستيك المضغوط أو الجلد) في قطع غيار السيارات معدات إضاءة استوديو متقدمة وتصحيح ألوان معياري، ليظهر الناتج النهائي في الكتالوجات وصفحات الويب دون أي انحراف في اللون أو الملمس. نحن معكم من مرحلة التفكير الأولي وحتى بناء كتالوجات شاملة وتطوير استراتيجيات التواصل الاجتماعي، لتتألق علامتكم الصناعية بقوة في السوق.",
  },
  {
    slug: "fashion-apparel-marketing",
    shortEn: "Fashion",
    titleAr: "الموضة والأزياء",
    excerptEn: "Specialized apparel photography (catalog and lifestyle), fashion ad film production, engaging reels creation and social media management for clothing brands, fashion houses and the fashion industry.",
    excerptAr: "تصوير أزياء متخصص (كتالوجي ونمط حياة)، وإنتاج أفلام إعلانية للأزياء، وإنتاج ريلز جذابة، وإدارة وسائل التواصل الاجتماعي لعلامات الملابس ودور الأزياء وصناعة الموضة.",
    descriptionEn:
      "The fashion and apparel industry is the most competitive space in e-commerce. In this market, before an audience can feel the quality of a stitch or fabric, they fall for your product's visual impression and styling. Arka Studio's fashion and apparel digital marketing services turn your brand's storefront from an ordinary page into a luxurious, persuasive journal.\n\nPrecisely capturing fabric texture and accurately showing clothing color is the most critical factor in reducing return rates for online stores. Our team, using powerful studio lighting setups (such as 500W light kits) and sharp portrait lenses (such as 50mm lenses with a wide aperture), captures stitching finesse and material quality with the utmost clarity. In post-production, all color correction is done using calibrated, specialized graphics monitors (ASUS ProArt series) so the product's color in the photo matches reality exactly.\n\nOur services include white-background apparel photography for your site, lifestyle photography with models, and creating fashion ad films and reels using motion equipment and advanced, compact stabilizers to capture dynamic movement. Whether you're a local fashion house in Tabriz or a nationwide apparel manufacturer, we dress your clothing in the best possible digital storefront through a targeted content strategy that increases your conversion rate.",
    descriptionAr:
      "تُعد صناعة الموضة والأزياء أكثر المجالات تنافسية في التجارة الإلكترونية. في هذا السوق، وقبل أن يشعر الجمهور بجودة الخياطة أو القماش، يقع في حب الانطباع البصري وتنسيق منتجكم. تحوّل خدمات التسويق الرقمي للأزياء في استوديو آركا واجهة علامتكم من صفحة عادية إلى مجلة فاخرة ومقنعة.\n\nيُعد التقاط نسيج القماش بدقة وإظهار لون الملابس بشكل حقيقي أهم عامل في تقليل معدل الإرجاع في المتاجر الإلكترونية. يستخدم فريقنا إعدادات إضاءة استوديو قوية (مثل مجموعات إضاءة 500 واط) وعدسات حادة للبورتريه (مثل عدسات 50 ملم بفتحة عدسة واسعة)، لالتقاط دقة الخياطة وجودة المواد بأقصى وضوح. وفي مرحلة ما بعد الإنتاج، يتم تصحيح الألوان بالكامل باستخدام شاشات جرافيك معايرة ومتخصصة (سلسلة ASUS ProArt) ليتطابق لون المنتج في الصورة تمامًا مع الواقع.\n\nتشمل خدماتنا تصوير الأزياء بخلفية بيضاء لموقعكم، وتصوير نمط الحياة مع عارضين، وصناعة أفلام إعلانية وريلز للأزياء باستخدام معدات حركة ومثبتات متقدمة ومدمجة لالتقاط الحركة الديناميكية. سواء كنتم دار أزياء محلية في تبريز أو مصنّع ملابس على مستوى البلاد، نلبس ملابسكم بأفضل واجهة رقمية ممكنة من خلال استراتيجية محتوى مستهدفة تزيد معدل التحويل لديكم.",
  },
  {
    slug: "startup-branding-marketing",
    shortEn: "Startups",
    titleAr: "الشركات الناشئة",
    excerptEn: "Creative, specialized solutions for early-stage businesses. From visual identity and custom UI/UX design to product-launch ad films and growth-hacking campaigns to attract users and investors.",
    excerptAr: "حلول إبداعية ومتخصصة للشركات الناشئة. من الهوية البصرية وتصميم UI/UX مخصص إلى إنتاج أفلام تعريفية بالمنتج وتنفيذ حملات نمو (Growth Hacking) لجذب المستخدمين والمستثمرين.",
    descriptionEn:
      "Startups operate in a fast, dynamic and fiercely competitive world, where product survival and growth depend on quickly delivering value to an audience — and, of course, convincing investors. Along the journey of launching a new business, having an innovative idea is only half the path; the other half is the art of creatively presenting that idea to the target market. At Arka Studio, understanding startup challenges and growth models, we implement startup branding and digital marketing services using the world's latest methods.\n\nWe know that in early phases (such as launching an MVP), startups have an urgent need for exceptionally clean and optimized UI/UX design to maximize initial click-through and sign-up rates. Also, when pitching an idea to accelerators and investors, or aiming to go viral on social media, nothing works as well as a creative promotional motion graphic or CGI animation to simplify complex concepts.\n\nOur services in this department include modern logo and visual identity design, content strategy development, SEO for organic growth, and performance marketing campaign execution, so you gain the most engagement and leads for your product at the most optimal cost. We believe your startup's identity deserves a modern, distinctive narrative so that from the first phase through the scale-up stage, you can powerfully disrupt the market and capture your market share.",
    descriptionAr:
      "تعمل الشركات الناشئة في عالم سريع وديناميكي وشديد التنافسية، حيث يعتمد بقاء المنتج ونموه على إيصال القيمة بسرعة للجمهور، وبالطبع، إقناع المستثمرين. في رحلة إطلاق عمل ناشئ، تمثل الفكرة المبتكرة نصف المسار فقط؛ والنصف الآخر هو فن تقديم تلك الفكرة بإبداع للسوق المستهدف. في استوديو آركا، وبفهمنا لتحديات ونماذج نمو الشركات الناشئة، ننفذ خدمات العلامة التجارية والتسويق الرقمي بأحدث الأساليب العالمية.\n\nنعلم أن الشركات الناشئة في مراحلها الأولى (مثل إطلاق المنتج الأولي MVP) بحاجة ماسة لتصميم UI/UX نظيف ومحسّن للغاية لتعظيم معدلات النقر والتسجيل الأولية. كما أنه عند عرض الفكرة على المسرّعات والمستثمرين، أو الرغبة في الانتشار الفيروسي على وسائل التواصل الاجتماعي، لا شيء يضاهي فعالية موشن غرافيك ترويجي إبداعي أو رسوم متحركة CGI لتبسيط المفاهيم المعقدة.\n\nتشمل خدماتنا في هذا القسم تصميم شعار وهوية بصرية حديثة، وإعداد استراتيجية المحتوى، وتحسين محركات البحث للنمو العضوي، وتنفيذ حملات تسويق الأداء، لتحصلوا على أكبر قدر من التفاعل والعملاء المحتملين لمنتجكم بأمثل تكلفة. نؤمن بأن هوية شركتكم الناشئة تستحق سردًا حديثًا ومتميزًا حتى تتمكنوا من إحداث تأثير قوي في السوق والاستحواذ على حصتكم منه، من المرحلة الأولى وحتى مرحلة التوسع.",
  },
  {
    slug: "real-estate-architecture-marketing",
    shortEn: "Real Estate",
    titleAr: "العقارات",
    excerptEn: "Specialized content production, architectural photography, real-estate ad film production and website design for housing agencies, construction companies and architects — to speed up sales and build luxury branding.",
    excerptAr: "حلول متخصصة لإنتاج المحتوى، والتصوير المعماري، وإنتاج أفلام إعلانية عقارية، وتصميم المواقع لوكالات الإسكان وشركات البناء والمعماريين لتسريع المبيعات وبناء علامة فاخرة.",
    descriptionEn:
      "The real estate industry is a market of major investments and big decisions. In this highly competitive market, buyers evaluate your property or project through digital images and videos long before any in-person viewing. So, the quality of a property's presentation can be the line between a fast, profitable sale or capital sitting idle. At Arka Studio, through specialized real estate digital marketing and architectural photography services, we present the real value of your projects to buyers in the most compelling way possible.\n\nCapturing a space's true dimensions and showcasing the luxury of the materials used in a building requires professional equipment. Our team, using ultra-wide lenses and advanced studio lighting techniques, portrays the interiors and exteriors of residential, commercial and villa projects at their most brilliant. Our services include producing real estate ad films for Instagram, industrial photography of under-construction projects, and managing real estate agents' pages — building a credible, professional identity for you.\n\nBeyond producing stunning visual content, by designing real estate websites (equipped with advanced search systems) and running SEO campaigns, we drive targeted potential buyers and investors straight to your sales office. Whether you're a large construction company or a leading real estate agency in Tabriz and beyond, our team is your powerful arm for luxury presentation, earning customer trust and dramatically increasing your sales velocity.",
    descriptionAr:
      "تُعد صناعة العقارات سوقًا للاستثمارات الكبرى والقرارات المهمة. في هذا السوق شديد التنافسية، يُقيّم المشترون عقاركم أو مشروعكم من خلال الصور والفيديوهات الرقمية قبل أي معاينة حضورية. لذا، يمكن أن تكون جودة عرض العقار الفاصل بين بيع سريع ومربح أو ركود رأس المال. في استوديو آركا، من خلال خدمات التسويق الرقمي العقاري والتصوير المعماري المتخصصة، نعرض القيمة الحقيقية لمشاريعكم على المشترين بأكثر الطرق جاذبية.\n\nيتطلب التقاط الأبعاد الحقيقية للمساحة وإظهار فخامة المواد المستخدمة في المبنى معدات احترافية. يصوّر فريقنا، باستخدام عدسات فائقة الاتساع وتقنيات إضاءة استوديو متقدمة، المساحات الداخلية والواجهات الخارجية للمشاريع السكنية والتجارية والفيلات بأبهى صورة. تشمل خدماتنا إنتاج أفلام إعلانية عقارية لإنستغرام، والتصوير الصناعي للمشاريع قيد الإنشاء، وإدارة صفحات وسطاء العقارات، لبناء هوية موثوقة واحترافية لكم.\n\nبالإضافة إلى إنتاج محتوى بصري مذهل، من خلال تصميم مواقع عقارية (مزودة بأنظمة بحث متقدمة) وتنفيذ حملات السيو، نوجّه المشترين والمستثمرين المستهدفين مباشرة إلى مكتب مبيعاتكم. سواء كنتم شركة بناء كبرى أو وكالة عقارية رائدة في تبريز وغيرها، فريقنا هو ذراعكم القوي للعرض الفاخر وكسب ثقة العملاء وزيادة سرعة مبيعاتكم بشكل ملحوظ.",
  },
  {
    slug: "restaurant-cafe-food-marketing",
    shortEn: "Food & Beverage",
    titleAr: "المطاعم والمقاهي",
    excerptEn: "Specialized menu photography, appetizing ad film production, reels creation and social media management for cafés, fast-food chains and restaurants to increase sales and attract customers.",
    excerptAr: "تصوير قوائم طعام متخصص، وإنتاج أفلام إعلانية شهية، وإنتاج ريلز، وإدارة وسائل التواصل الاجتماعي للمقاهي وسلاسل الوجبات السريعة والمطاعم لزيادة المبيعات وجذب العملاء.",
    descriptionEn:
      "The food industry is about stirring emotion through the frame. Today's audience tastes your food with their eyes on social media before ever tasting it with their tongue. At Arka Studio, with a deep understanding of this sector's dynamics, we know that the marketing strategy for a fast-paced, exciting takeout business is completely different from presenting the authenticity and beauty of traditional Persian dishes like kebabs. We create exactly the content that matches your business's identity and your target market's taste.\n\nOur expertise in food photography lies in capturing the finest details of texture and color, so the freshness of ingredients is fully felt. Beyond menu photography, using precise studio motion equipment to capture dynamic kitchen videos and professional microphones for clear, ASMR-style food-prep sound, we create Instagram ad films and reels that are impossible for the audience to resist!\n\nOur food department's services go beyond simple videography. From digital menu graphic design and professional café/restaurant Instagram management to running local ad campaigns to attract customers in your area (local SEO), we're by your side. By localizing your ad assets and focusing on your competitive advantages, we awaken the market's appetite for your brand so your foot traffic and online orders increase tangibly.",
    descriptionAr:
      "تدور صناعة الطعام حول إثارة المشاعر من خلال الصورة. يتذوق الجمهور اليوم طعامكم بعينيه على وسائل التواصل الاجتماعي قبل أن يتذوقه بلسانه. في استوديو آركا، وبفهمنا العميق لديناميكيات هذا القطاع، نعلم أن استراتيجية تسويق مطعم وجبات سريعة (Takeout) بإيقاعه السريع والمثير تختلف تمامًا عن عرض أصالة وجمال الأطباق الإيرانية التقليدية مثل الكباب. نصنع بالضبط المحتوى الذي يتناسب مع هوية عملكم وذائقة سوقكم المستهدف.\n\nتكمن خبرتنا في تصوير الطعام في التقاط أدق تفاصيل النسيج واللون، بحيث يُشعَر بنضارة المكونات تمامًا. بالإضافة إلى تصوير قوائم الطعام، وباستخدام معدات حركة استوديو دقيقة لالتقاط فيديوهات ديناميكية من المطبخ وميكروفونات احترافية لتسجيل صوت واضح بأسلوب ASMR أثناء تحضير الطعام، نصنع أفلامًا إعلانية وريلز لإنستغرام يستحيل على الجمهور مقاومتها!\n\nتتجاوز خدمات قسم الطعام لدينا التصوير البسيط. من تصميم جرافيك قوائم الطعام الرقمية والإدارة الاحترافية لصفحة إنستغرام المقهى أو المطعم، إلى تنفيذ حملات إعلانية محلية لجذب عملاء منطقتكم (سيو محلي)، نحن بجانبكم. من خلال محلّية أصولكم الإعلانية والتركيز على مزاياكم التنافسية، نوقظ شهية السوق لعلامتكم لتزداد مبيعاتكم الحضورية وطلباتكم الإلكترونية بشكل ملموس.",
  },
  {
    slug: "beauty-salon-cosmetics-marketing",
    shortEn: "Beauty & Cosmetics",
    titleAr: "التجميل ومستحضرات التجميل",
    excerptEn: "Specialized beauty photography, editorial-style retouching, engaging ad films and reels, and Instagram page management for beauty salons, makeup artists and skin/hair clinics.",
    excerptAr: "تصوير تجميل متخصص، ورتوش بأسلوب المجلات، وأفلام إعلانية وريلز جذابة، وإدارة صفحة إنستغرام لصالونات التجميل وفناني المكياج وعيادات البشرة والشعر.",
    descriptionEn:
      "The beauty and cosmetics industry is built on finesse, detail and visual trust. Your customers judge your skill through photos and videos on social media long before booking an appointment or buying a product. In this highly competitive market, an ordinary page with amateur lighting means losing luxury, targeted customers. Arka Studio's specialized beauty digital marketing and content production services elevate your craft to editorial standards.\n\nWe know how critical accurate color and skin-texture rendering is in makeup, hairstyling and hair-color photography. Our team, using sharp portrait lenses (such as 50mm focal lengths with a wide aperture for beautiful depth of field) and professional lighting, performs beauty photography at the highest clarity. All color correction is also done with specialized, calibrated monitors, so hair color or the exact shade of makeup products appears completely true and unexaggerated, with skin retouching done as naturally as possible.\n\nOur services include producing viral ad films and reels of before-and-after transformations using advanced stabilizers for smooth, cinematic video, visual identity design, and Instagram management for beauty salons. Whether you're a beauty and bridal salon in Tabriz or a cosmetics manufacturer brand, we're by your side to keep your booking calendar full forever with a luxury content strategy.",
    descriptionAr:
      "تُبنى صناعة التجميل ومستحضرات التجميل على الدقة والتفاصيل والثقة البصرية. يحكم عملاؤكم على مهارتكم من خلال الصور والفيديوهات على وسائل التواصل الاجتماعي قبل حجز موعد أو شراء منتج. في هذا السوق شديد التنافسية، تعني الصفحة العادية بإضاءة هاوية خسارة عملاء فاخرين ومستهدفين. ترفع خدمات التسويق الرقمي وإنتاج المحتوى المتخصصة في استوديو آركا حرفتكم إلى معايير المجلات.\n\nنعرف مدى أهمية دقة الألوان وإظهار نسيج البشرة في تصوير المكياج وتصفيف الشعر وصبغه. يستخدم فريقنا عدسات حادة للبورتريه (مثل عدسات 50 ملم بفتحة عدسة واسعة لعمق ميدان جميل) وإضاءة احترافية، لتنفيذ تصوير التجميل بأعلى وضوح. كما يتم تصحيح جميع الألوان بشاشات معايرة ومتخصصة، ليظهر لون الشعر أو درجة منتجات المكياج بشكل واقعي تمامًا دون مبالغة، مع رتوش بشرة بأطبع شكل ممكن.\n\nتشمل خدماتنا إنتاج أفلام إعلانية وريلز فيروسية لتحولات قبل وبعد باستخدام مثبتات متقدمة لفيديو ناعم وسينمائي، وتصميم الهوية البصرية، وإدارة إنستغرام لصالونات التجميل. سواء كنتم صالون تجميل وعرائس في تبريز أو علامة تصنيع مستحضرات تجميل، نحن بجانبكم للحفاظ على تقويم حجوزاتكم ممتلئًا للأبد باستراتيجية محتوى فاخرة.",
  },
  {
    slug: "b2b-industrial-tech-marketing",
    shortEn: "Technology",
    titleAr: "التقنية والصناعة",
    excerptEn: "B2B marketing solutions for factories and knowledge-based companies. Specialized industrial photography, corporate documentary production from production lines, and technical presentation design.",
    excerptAr: "حلول تسويق B2B للمصانع والشركات القائمة على المعرفة. تصوير صناعي متخصص، وإنتاج أفلام وثائقية مؤسسية من خطوط الإنتاج، وتصميم عروض تقديمية فنية.",
    descriptionEn:
      "Technology and industry need a language that simplifies engineering complexity while portraying the grandeur of production at its best. In B2B (industrial) marketing, your audience is executives, investors and specialists whose decisions are based on data, efficiency and their business partner's credibility. I, Ali Jafari, together with my expert team at Arka Studio, with a deep understanding of technical literature and the challenges of this field, design industrial digital marketing solutions so your production and technological capacities are presented most powerfully to domestic and export markets.\n\nCapturing the scale of a factory or delicate hardware components requires advanced, agile equipment. For filming high-speed production lines and workshop spaces, we use precise motion equipment and stabilizers such as the DJI RS 4 Mini to create smooth, fully cinematic industrial ad films and documentaries. In industrial photography of equipment and machinery, using standard lighting, we capture material textures and technical details with the highest clarity.\n\nOur services include producing product-introduction videos, designing multilingual technical catalogs, and SEO for industrial websites. To ensure corporate color accuracy and precise technical schematic display, every editing and color-correction step is done using calibrated, specialized graphics monitors (ASUS ProArt series). We're by your side so your industrial brand earns the credibility it deserves in your target market's mind.",
    descriptionAr:
      "تحتاج صناعة التقنية إلى لغة تُبسّط تعقيدات الهندسة وتُصوّر عظمة الإنتاج بأفضل شكل. في تسويق B2B (الصناعي)، جمهوركم هم المدراء والمستثمرون والمتخصصون الذين تُبنى قراراتهم على البيانات والكفاءة ومصداقية شريكهم التجاري. أنا، علي جعفري، إلى جانب فريقي المتخصص في استوديو آركا، وبفهم عميق للأدبيات الفنية وتحديات هذا المجال، أصمم حلول التسويق الرقمي الصناعي لعرض قدراتكم الإنتاجية والتكنولوجية بأقوى شكل في الأسواق المحلية والتصديرية.\n\nيتطلب التقاط أبعاد مصنع أو مكونات الأجهزة الدقيقة معدات متقدمة وخفيفة الحركة. لتصوير خطوط الإنتاج عالية السرعة ومساحات الورش، نستخدم معدات حركة ومثبتات دقيقة مثل DJI RS 4 Mini لصناعة أفلام إعلانية ووثائقية صناعية سلسة وسينمائية بالكامل. وفي التصوير الصناعي للمعدات والآلات، باستخدام إضاءة معيارية، نلتقط نسيج المواد والتفاصيل الفنية بأعلى وضوح.\n\nتشمل خدماتنا إنتاج فيديوهات تعريفية بالمنتجات، وتصميم كتالوجات فنية متعددة اللغات، وتحسين محركات البحث للمواقع الصناعية. لضمان دقة الألوان المؤسسية والعرض الدقيق للمخططات الفنية، يتم تنفيذ كل خطوة من التحرير وتصحيح الألوان باستخدام شاشات جرافيك معايرة ومتخصصة (سلسلة ASUS ProArt). نحن بجانبكم لتحظى علامتكم الصناعية بالمصداقية التي تستحقها في ذهن سوقكم المستهدف.",
  },
  {
    slug: "fintech-finance-digital-marketing",
    shortEn: "Finance & Fintech",
    titleAr: "التمويل والتقنية المالية",
    excerptEn: "Specialized trust-building solutions for financial institutions, exchanges and fintech startups. From secure, modern UI/UX design to motion graphics that simplify complex economic concepts.",
    excerptAr: "حلول متخصصة لبناء الثقة للمؤسسات المالية ومنصات الصرافة والشركات الناشئة في التقنية المالية. من تصميم UI/UX آمن وحديث إلى موشن غرافيك يبسّط المفاهيم الاقتصادية المعقدة.",
    descriptionEn:
      "In the finance and fintech industry, everything revolves around one word: trust. Users only entrust their capital to an app, a crypto exchange or an investment platform when your brand screams security and professionalism at first glance. I, Ali Jafari, together with my expert team at Arka Studio, understanding this field's sensitivities, create a secure, modern and fully trustworthy identity for your financial business.\n\nOne of fintech companies' biggest challenges is explaining complex financial services to the general public in simple terms. By designing educational motion graphics and explainer videos, we portray difficult economic concepts in the most engaging, understandable way possible. Also, in platform development, by focusing on custom UI/UX design for financial websites and apps, we build a secure, fast and enjoyable path for your users' transactions.\n\nOur services include developing branding strategy for brokerages, digital marketing for crypto exchanges, producing specialized social media content to build trust, and SEO for financial sites. Your brand's corporate colors are unified across all visual outputs with the highest precision using specialized calibrated monitors, so your brand is recognized as a credible, innovative leader in financial markets.",
    descriptionAr:
      "في صناعة المال والتقنية المالية، يدور كل شيء حول كلمة واحدة: الثقة. لا يأتمن المستخدمون رأس مالهم لتطبيق أو منصة صرافة عملات رقمية أو منصة استثمار إلا عندما تصرخ علامتكم التجارية بالأمان والاحترافية من النظرة الأولى. أنا، علي جعفري، إلى جانب فريقي المتخصص في استوديو آركا، وبفهم حساسيات هذا المجال، أخلق هوية آمنة وحديثة وموثوقة تمامًا لعملكم المالي.\n\nمن أكبر تحديات شركات التقنية المالية شرح الخدمات المالية المعقدة بلغة بسيطة للجمهور العام. من خلال تصميم موشن غرافيك تعليمي وفيديوهات توضيحية، نُصوّر المفاهيم الاقتصادية الصعبة بأكثر الطرق جاذبية ووضوحًا. كما في تطوير المنصات، وبالتركيز على تصميم UI/UX مخصص للمواقع والتطبيقات المالية، نبني مسارًا آمنًا وسريعًا وممتعًا لمعاملات مستخدميكم.\n\nتشمل خدماتنا إعداد استراتيجية العلامة التجارية لشركات الوساطة، والتسويق الرقمي لمنصات صرافة العملات الرقمية، وإنتاج محتوى متخصص لوسائل التواصل الاجتماعي لبناء الثقة، وتحسين محركات البحث للمواقع المالية. تتوحد ألوان علامتكم المؤسسية بأعلى دقة في جميع المخرجات البصرية باستخدام شاشات معايرة متخصصة، لتُعرف علامتكم كرائد موثوق ومبتكر في الأسواق المالية.",
  },
  {
    slug: "tourism-hospitality-marketing",
    shortEn: "Hospitality",
    titleAr: "السياحة والضيافة",
    excerptEn: "Specialized solutions for content production, video tour creation, architectural photography of hotels and eco-lodges, and marketing for travel agencies to increase bookings and attract tourists.",
    excerptAr: "حلول متخصصة لإنتاج المحتوى، وإنشاء جولات فيديو، والتصوير المعماري للفنادق والمنتجعات البيئية، والتسويق لوكالات السفر لزيادة الحجوزات وجذب السياح.",
    descriptionEn:
      "The tourism and hospitality industry is a business where you pre-sell a 'memory' and an 'experience.' Before starting their trip, travelers live their destination through images and videos in the digital space. If your hotel space, tours or lodging services can't convey a sense of wonder, safety and calm at first glance, the traveler will simply turn to a competitor. I, Ali Jafari, together with my creative team at Arka, turn your brand's story into an irresistible invitation through stunning, targeted visual content.\n\nIn photographing hotels, eco-lodges and tourist spaces, correctly showing the scale of a space, ambient lighting and a sense of welcome matters greatly. Using precise motion equipment and advanced stabilizers (such as the DJI RS 4 Mini), we create smooth, cinematic video tours of your lobby, rooms and amenities. For travel agencies and tour leaders, using clear wireless audio equipment, we produce travel vlogs and destination-introduction films to the highest standard, so the audience feels immersed in that journey.\n\nWhether you're a luxury hotel in Tabriz seeking international tourists, or a travel agency running seasonal tour sales campaigns, our tourism digital marketing services include professional Instagram management, SEO for booking sites, and cohesive graphic design — keeping your booking calendar full through every season of the year.",
    descriptionAr:
      "تُعد صناعة السياحة والضيافة عملاً تبيعون فيه مسبقًا 'ذكرى' و'تجربة'. قبل بدء رحلتهم، يعيش المسافرون وجهتهم من خلال الصور والفيديوهات في الفضاء الرقمي. إذا لم تستطع مساحة فندقكم أو جولاتكم أو خدمات إقامتكم نقل شعور الدهشة والأمان والهدوء من النظرة الأولى، سيتوجه المسافر ببساطة إلى منافس. أنا، علي جعفري، إلى جانب فريقي الإبداعي في آركا، من خلال إنتاج محتوى بصري مذهل وهادف، نحوّل قصة علامتكم التجارية إلى دعوة لا تُقاوم.\n\nفي تصوير الفنادق والمنتجعات البيئية والمساحات السياحية، يُعد العرض الصحيح لاتساع المساحة والإضاءة المحيطة وشعور الترحيب أمرًا بالغ الأهمية. باستخدام معدات حركة دقيقة ومثبتات متقدمة (مثل DJI RS 4 Mini)، نصنع جولات فيديو سلسة وسينمائية من بهوكم وغرفكم ومرافقكم. أما لوكالات السفر وقادة الجولات، فباستخدام معدات صوت لاسلكية واضحة، ننتج مدونات فيديو سفر وأفلام تعريفية بالوجهات بأعلى المعايير، ليشعر الجمهور وكأنه في قلب تلك الرحلة.\n\nسواء كنتم فندقًا فاخرًا في تبريز يسعى لجذب سياح دوليين، أو وكالة سفر تنفذ حملات بيع جولات موسمية، تشمل خدماتنا للتسويق الرقمي السياحي إدارة احترافية لإنستغرام، وتحسين محركات البحث لمواقع الحجز، وتصميمًا جرافيكيًا موحدًا، للحفاظ على تقويم حجوزاتكم ممتلئًا في كل فصول السنة.",
  },
  {
    slug: "education-elearning-marketing",
    shortEn: "Education",
    titleAr: "التعليم",
    excerptEn: "Specialized professional recording of online courses, educational video editing, learning platform (LMS) design, and personal branding for instructors, academies and schools.",
    excerptAr: "تسجيل احترافي متخصص للدورات عبر الإنترنت، ومونتاج فيديوهات تعليمية، وتصميم منصات تعلم (LMS)، وبناء علامة شخصية للمدرّسين والمعاهد والمدارس.",
    descriptionEn:
      "In the modern education world, the physical boundaries of the classroom have disappeared. Today, an instructor's or educational institution's credibility is measured by the quality of their digital content. An educational video with unprofessional visuals or echoing audio destroys the learner's focus and reduces the course's academic value. I, Ali Jafari, together with Arka Studio's content production team, with full command of multimedia standards, create a flawless digital learning experience for your audience.\n\nOur strength in producing educational content is an obsessive attention to image and sound quality. For recording online courses, we use ultra-professional wireless microphones with noise cancellation (such as the latest DJI technologies) and standard lighting equipment (calibrated 500W setups), so the instructor can focus purely on teaching without technical worries. The result is videos with true colors, clear sound, and no distracting shadows on the whiteboard or presentation.\n\nBeyond content production, our education digital marketing services include personal branding for instructors, course-selling website (LMS) design, and professional social media management. Whether you're a large educational institution in Tabriz or an instructor planning nationwide webinars, we're with you from idea and recording through editing, educational graphics and package sales — start to finish.",
    descriptionAr:
      "في عالم التعليم الحديث، اختفت الحدود الفيزيائية لقاعة الدراسة. تُقاس مصداقية المدرّس أو المؤسسة التعليمية اليوم بجودة محتواها الرقمي. الفيديو التعليمي بصورة غير احترافية أو صوت به صدى يُفقد المتعلم تركيزه ويقلل من القيمة العلمية للدورة. أنا، علي جعفري، إلى جانب فريق إنتاج المحتوى في استوديو آركا، وبإتقان كامل لمعايير الوسائط المتعددة، أخلق تجربة تعلم رقمية مثالية لجمهوركم.\n\nتكمن قوتنا في إنتاج المحتوى التعليمي في الاهتمام الشديد بجودة الصورة والصوت. لتسجيل الدورات عبر الإنترنت، نستخدم ميكروفونات لاسلكية فائقة الاحترافية بخاصية إلغاء الضوضاء (مثل أحدث تقنيات DJI) ومعدات إضاءة معيارية (إعدادات 500 واط معايرة)، ليتمكن المدرّس من التركيز فقط على التدريس دون قلق تقني. النتيجة فيديوهات بألوان حقيقية وصوت واضح ودون ظلال مزعجة على السبورة أو العرض التقديمي.\n\nبالإضافة إلى إنتاج المحتوى، تشمل خدماتنا للتسويق الرقمي التعليمي بناء العلامة الشخصية للمدرّسين، وتصميم مواقع بيع الدورات (LMS)، وإدارة احترافية لوسائل التواصل الاجتماعي. سواء كنتم مؤسسة تعليمية كبرى في تبريز أو مدرّسًا يخطط لندوات عبر الإنترنت على مستوى البلاد، نحن معكم من الفكرة والتسجيل وحتى المونتاج والجرافيك التعليمي وبيع الحزم، من الألف إلى الياء.",
  },
  {
    slug: "ecommerce-retail-product-marketing",
    shortEn: "Retail & E‑commerce",
    titleAr: "التجزئة والتجارة الإلكترونية",
    excerptEn: "Integrated solutions to boost online sales. From professional product photography and interactive digital catalog design to e-commerce site development and social media management for stores.",
    excerptAr: "حلول متكاملة لزيادة المبيعات عبر الإنترنت. من التصوير الاحترافي للمنتجات وتصميم الكتالوجات الرقمية التفاعلية إلى تطوير مواقع التجارة الإلكترونية وإدارة وسائل التواصل الاجتماعي للمتاجر.",
    descriptionEn:
      "In e-commerce and retail, competition is just one click away. Your customer can't physically touch the product; so the quality of your images, videos and site's user experience is what convinces them to pay. I, Ali Jafari, together with the Arka Studio team, turn your digital storefront into a powerful, trustworthy sales machine that directly converts incoming traffic into final buyers.\n\nOur expertise is handling large, integrated projects — whether you need an interactive digital catalog with over 600 product items, or you're seeking luxury content production for a newly launched online shop. Using sharp lenses (such as 50mm focal lengths) and precise lighting, we perform product photography in a way that captures all the finesse, texture and material of the goods with clarity. Also, to minimize return rates (due to color mismatch), every color-correction step is done with specialized, calibrated standard monitors, so the product's color in the photo is exactly what reaches the customer's hands.\n\nOur services include lifestyle and white-background photography, producing product-introduction reels, designing and developing sales-focused UI/UX e-commerce websites, and running SEO campaigns. Whether you're a local retailer in Tabriz or a nationwide distribution brand, we design the user journey — from the moment a product is viewed to completing the checkout — flawlessly and enjoyably, with data-driven strategies.",
    descriptionAr:
      "في التجارة الإلكترونية والتجزئة، لا تبعد المنافسة سوى نقرة واحدة. لا يستطيع عميلكم لمس المنتج فعليًا؛ لذا فإن جودة صوركم وفيديوهاتكم وتجربة المستخدم في موقعكم هي ما يقنعه بالدفع. أنا، علي جعفري، إلى جانب فريق استوديو آركا، نحوّل واجهتكم الرقمية إلى آلة مبيعات قوية وموثوقة تحوّل الزيارات الواردة مباشرة إلى مشترين نهائيين.\n\nتكمن خبرتنا في التعامل مع المشاريع الكبيرة والمتكاملة؛ سواء احتجتم إلى كتالوج رقمي تفاعلي يضم أكثر من 600 منتج، أو كنتم تبحثون عن إنتاج محتوى فاخر لمتجر إلكتروني حديث الإطلاق. باستخدام عدسات حادة (مثل عدسات 50 ملم) وإضاءة دقيقة، ننفذ تصوير المنتجات بطريقة تلتقط كل دقة ونسيج ومادة البضاعة بوضوح. كما لتقليل معدل الإرجاع (بسبب عدم تطابق اللون)، يتم تنفيذ كل خطوة تصحيح ألوان بشاشات معيارية معايرة ومتخصصة، ليكون لون المنتج في الصورة تمامًا كما يصل إلى يد العميل.\n\nتشمل خدماتنا تصوير نمط الحياة والخلفية البيضاء، وإنتاج ريلز تعريفية بالمنتجات، وتصميم وتطوير مواقع تجارة إلكترونية بواجهة UI/UX موجهة للبيع، وتنفيذ حملات السيو. سواء كنتم تاجر تجزئة محلي في تبريز أو علامة توزيع على مستوى البلاد، نصمم رحلة العميل -من لحظة مشاهدة المنتج وحتى إتمام السلة- بشكل مثالي وممتع، باستراتيجيات قائمة على البيانات.",
  },
];

function approachTr(shortEn: string, titleAr: string) {
  return {
    en: J([
      `Understanding the persona and customer journey in the ${shortEn} industry`,
      `Crafting messaging that fits the industry's rules and sensitivities`,
      `Choosing the optimal channel and format for maximum impact`,
      `Measuring, optimizing and scaling the campaign`,
    ]),
    ar: J([
      `فهم الشخصية ورحلة العميل في صناعة ${titleAr}`,
      `صياغة رسائل تناسب قواعد وحساسيات هذا القطاع`,
      `اختيار القناة والتنسيق الأمثل لتحقيق أكبر تأثير`,
      `قياس الحملة وتحسينها وتوسيع نطاقها`,
    ]),
  };
}

async function backfillIndustries() {
  const rows = await db.industry.findMany({ select: { id: true, slug: true, titleAr: true } });
  let count = 0;
  for (const row of rows) {
    const tr = INDUSTRY_TR.find((i) => i.slug === row.slug);
    // titleAr is currently populated with a (buggy) English placeholder for every
    // real row, so re-run detection is based on slug match, not null-check.
    if (!tr) continue;
    const approach = approachTr(tr.shortEn, tr.titleAr);
    await db.industry.update({
      where: { id: row.id },
      data: {
        titleAr: tr.titleAr,
        excerptEn: tr.excerptEn,
        excerptAr: tr.excerptAr,
        descriptionEn: tr.descriptionEn,
        descriptionAr: tr.descriptionAr,
        approachEn: approach.en,
        approachAr: approach.ar,
        metaTitleEn: `${tr.shortEn} Industry Solutions | Arka`,
        metaTitleAr: `حلول صناعة ${tr.titleAr} | آركا`,
        metaDescriptionEn: `Specialized Arka services for the ${tr.shortEn} industry.`,
        metaDescriptionAr: `خدمات آركا المتخصصة لصناعة ${tr.titleAr}.`,
        keywordsEn: J([tr.shortEn, "Arka"]),
        keywordsAr: J([tr.titleAr, "آركا"]),
      },
    });
    count++;
  }
  console.log(`Industries: translated ${count}/${rows.length} (matched by slug).`);
}

interface PostTr {
  slug: string;
  titleEn: string; titleAr: string;
  excerptEn: string; excerptAr: string;
  contentEn: string; contentAr: string;
  categoryEn: string; categoryAr: string;
  tagsEn: string[]; tagsAr: string[];
  metaTitleEn: string; metaTitleAr: string;
  metaDescriptionEn: string; metaDescriptionAr: string;
  keywordsEn: string[]; keywordsAr: string[];
}

const POST_TR: PostTr[] = [
  {
    slug: "content-repurposing-strategy-30-reels",
    titleEn: "Content Repurposing Strategy: How to Turn One Long Video Into 30 Engaging Reels",
    titleAr: "استراتيجية إعادة توظيف المحتوى: كيف تحوّل فيديو واحد طويل إلى 30 ريلز جذاب؟",
    excerptEn:
      "Lack of time is the biggest barrier to content production. In this Arka Journal article, learn how to use a content repurposing strategy to turn one long video into a month's worth of video and text content for social media.",
    excerptAr:
      "قلة الوقت هي أكبر عائق أمام إنتاج المحتوى. في هذا المقال من مجلة آركا، تعرّف على كيفية استخدام استراتيجية إعادة توظيف المحتوى (Content Repurposing) لتحويل فيديو طويل واحد إلى شهر كامل من المحتوى المرئي والنصي لوسائل التواصل الاجتماعي.",
    contentEn: `Has constantly producing new video for social media worn you out? You're not alone! [cite_start]Studies show 26% of marketers cite lack of time as the main barrier to video production[cite: 376]. [cite_start]Meanwhile, 89% of consumers want more videos from brands, and 87% of marketers confirm video's direct impact on increasing sales[cite: 374].

The solution to this challenge is the **Content Repurposing Strategy**; [cite_start]a smart technique that 94% of professional marketers use to save time and cost[cite: 377]. In this article from Arka Studio's journal, we'll teach you how to turn one reference video into 30 separate posts and reels for a month.

## What Is Content Repurposing and What Results Does It Get?

[cite_start]Content repurposing (or recycling) means reusing a comprehensive piece of content (such as a webinar, interview, or long educational video) and turning it into smaller formats for publishing over time[cite: 377].

[cite_start]As a successful global example, Jeannie Riley was able to gain 10,000 new Instagram followers in a year using this exact repurposing system alone, and one of her reels received more than 3 million views[cite: 440].

## Step-by-Step Guide: Extracting 30 Pieces of Content From One Video

To turn one long video into a month's worth of content, follow these steps:

1. [cite_start]**Choose the Anchor Video:** First, choose a high-quality, evergreen video with long-term value[cite: 393]. (The best approach is recording a flawless video in fully equipped studios such as Arka's Black Box or White Box in Tabriz.)
2. **Build a Clip Map:** Transcribe the main video. [cite_start]Build a table specifying key timestamps, content type, narrative angle, and target platform to avoid random cuts[cite: 396].
3. **Create 6 to 12 Short Clips:** Extract several 30-to-60-second clips from the main video. [cite_start]Each clip should carry a single, self-contained message with no long intros[cite: 397].
4. **Produce Non-Video Content:** Don't limit yourself to video. [cite_start]Turn the video's concepts into text posts, 8-slide educational carousels, and quote cards[cite: 401, 402].

## Golden Techniques for Editing Instagram Reels

For your repurposed clips to achieve the highest engagement rate, follow these standards:

- [cite_start]**The 3-Second Hook:** Nail the audience in the first 3 seconds with a curiosity-provoking question or an engaging scene[cite: 409].
- [cite_start]**Aspect Ratio and Cover:** Set the video to vertical format (9:16)[cite: 405]. [cite_start]The reel's cover should be designed at 1080×1920 pixels, with key elements placed at the center[cite: 407].
- [cite_start]**Mandatory Subtitles:** Since many users watch videos without sound, always use readable subtitles burned onto the video[cite: 399].
- [cite_start]**High-Energy Editing:** Edit videos with fast, tight cuts (jump cuts) and completely remove dead space and long pauses[cite: 432].

## Sample Content Calendar for Reels

[cite_start]Consistency is the key to success (at least 3 to 5 reels per week)[cite: 414]. [cite_start]Here is a sample layout for arranging repurposed content in a calendar[cite: 437]:

| Reel # | Video Range (seconds) | General Topic | Hook | Suggested Publish Time |
|---|---|---|---|---|
| **1** | 0:05 to 0:35 | Quick tip | "You're getting this wrong!" | Saturday (morning) |
| **2** | 1:10 to 1:45 | Short story | "Learn one of the most effective methods" | Monday (evening) |
| **3** | 3:00 to 3:30 | Success story | "This method changed my business!" | Wednesday (night) |

## Common Content Repurposing Mistakes to Avoid

If your content repurposing strategy isn't paying off, you've probably made one of the following mistakes:
- **Publishing identically everywhere:** Every social network has its own language; [cite_start]copying the exact same content and caption everywhere is a mistake[cite: 455].
- [cite_start]**Poor visual quality:** Blurry or poorly cropped videos quickly drive users away[cite: 459].
- [cite_start]**Forgetting the call to action (CTA):** If you don't ask users to comment or check the bio link, your engagement will drop sharply[cite: 467].

> **Arka's Expert Tip:** The success of a repurposing strategy depends entirely on the quality of the "source video." By renting acoustically treated spaces equipped with professional lighting at **Arka Studio Tabriz**, record one flawless hour-long video and guarantee a full month's worth of content for your page at the highest visual and audio standards.`,
    contentAr: `هل أنهككم إنتاج فيديو جديد باستمرار لوسائل التواصل الاجتماعي؟ لستم وحدكم! [cite_start]تشير الدراسات إلى أن 26% من المسوّقين يعتبرون قلة الوقت العائق الرئيسي أمام إنتاج الفيديو[cite: 376]. [cite_start]في حين أن 89% من المستهلكين يرغبون في المزيد من الفيديوهات من العلامات التجارية، ويؤكد 87% من المسوّقين تأثير الفيديو المباشر على زيادة المبيعات[cite: 374].

الحل لهذا التحدي هو **استراتيجية إعادة توظيف المحتوى (Content Repurposing)**؛ [cite_start]تقنية ذكية يستخدمها 94% من المسوّقين المحترفين لتوفير الوقت والتكلفة[cite: 377]. في هذا المقال من مجلة استوديو آركا، نعلّمكم كيفية تحويل فيديو مرجعي واحد إلى 30 منشورًا وريلز منفصلًا لشهر كامل.

## ما هي إعادة توظيف المحتوى وما نتائجها؟

[cite_start]تعني إعادة توظيف أو تدوير المحتوى إعادة استخدام محتوى شامل (مثل ندوة عبر الإنترنت أو مقابلة أو فيديو تعليمي طويل) وتحويله إلى صيغ أصغر للنشر على مدار الوقت[cite: 377].

[cite_start]كمثال عالمي ناجح، تمكنت جيني رايلي (Jeannie Riley) من جذب 10 آلاف متابع جديد على إنستغرام في عام واحد باستخدام نظام إعادة النشر هذا فقط، وحصل أحد ريلزاتها على أكثر من 3 ملايين مشاهدة[cite: 440].

## دليل خطوة بخطوة: استخراج 30 محتوى من فيديو واحد

لتحويل فيديو طويل إلى شهر من المحتوى، اتبعوا الخطوات التالية:

1. [cite_start]**اختيار الفيديو المرجعي (Anchor Video):** اختاروا أولاً فيديو عالي الجودة ودائم القيمة (Evergreen) ذا قيمة طويلة الأمد[cite: 393]. (أفضل حل هو تسجيل فيديو مثالي في استوديوهات مجهزة مثل بلاك بوكس أو وايت بوكس في آركا بتبريز).
2. **إعداد خريطة المقاطع (Clip Map):** فرّغوا الفيديو الرئيسي نصيًا (Transcript). [cite_start]أنشئوا جدولاً وحدّدوا فيه الأوقات المهمة، ونوع المحتوى، وزاوية السرد، والمنصة المستهدفة لتجنب القص العشوائي[cite: 396].
3. **إنشاء 6 إلى 12 مقطعًا قصيرًا:** استخرجوا عدة مقاطع من 30 إلى 60 ثانية من الفيديو الرئيسي. [cite_start]يجب أن يحمل كل مقطع رسالة مستقلة دون مقدمات طويلة[cite: 397].
4. **إنتاج محتوى غير مرئي:** لا تقتصروا على الفيديو. [cite_start]حوّلوا مفاهيم الفيديو إلى منشورات نصية، وكاروسيل تعليمي من 8 شرائح، وبطاقات اقتباس[cite: 401, 402].

## تقنيات ذهبية لمونتاج ريلز إنستغرام

لتحقيق أعلى معدل تفاعل لمقاطعكم المُعاد توظيفها، اتبعوا المعايير التالية:

- [cite_start]**قلاب (خطاف) الثلاث ثوانٍ:** اجذبوا الجمهور في أول 3 ثوانٍ بسؤال مثير للفضول أو مشهد جذاب[cite: 409].
- [cite_start]**نسبة الصورة والغلاف:** اضبطوا الفيديو بصيغة عمودية (9:16)[cite: 405]. [cite_start]يجب تصميم غلاف الريلز بأبعاد 1080×1920 بكسل، مع وضع العناصر المهمة في المركز[cite: 407].
- [cite_start]**إلزامية الترجمة النصية:** بما أن الكثير من المستخدمين يشاهدون الفيديوهات دون صوت، احرصوا دائمًا على استخدام ترجمة نصية واضحة على الفيديو[cite: 399].
- [cite_start]**مونتاج نشيط:** قوموا بمونتاج الفيديوهات بقطع سريعة ومتلاصقة (Jump Cut) واحذفوا تمامًا المساحات الراكدة والوقفات الطويلة[cite: 432].

## نموذج تقويم محتوى للريلز

[cite_start]الاستمرارية هي مفتاح النجاح (3 إلى 5 ريلز على الأقل أسبوعيًا)[cite: 414]. [cite_start]إليكم نموذجًا لكيفية ترتيب المحتوى المُعاد توظيفه في التقويم[cite: 437]:

| رقم الريلز | نطاق الفيديو (ثانية) | الموضوع العام | القلاب (Hook) | وقت النشر المقترح |
|---|---|---|---|---|
| **1** | 0:05 إلى 0:35 | نصيحة سريعة | «أنتم مخطئون بشأن هذا الموضوع!» | السبت (صباحًا) |
| **2** | 1:10 إلى 1:45 | قصة قصيرة | «تعرّفوا على إحدى أكثر الطرق فعالية» | الاثنين (مساءً) |
| **3** | 3:00 إلى 3:30 | قصة نجاح | «هذه الطريقة غيّرت أعمالي!» | الأربعاء (ليلاً) |

## الأخطاء الشائعة في إعادة توظيف المحتوى التي يجب تجنبها

إذا لم تُجدِ استراتيجية إعادة توظيف المحتوى لديكم نفعًا، فمن المحتمل أنكم ارتكبتم أحد الأخطاء التالية:
- **النشر بشكل مطابق على جميع المنصات:** لكل شبكة اجتماعية لغتها الخاصة؛ [cite_start]نسخ نفس المحتوى والتعليق حرفيًا في كل مكان خطأ شائع[cite: 455].
- [cite_start]**تدني الجودة البصرية:** الفيديوهات الضبابية أو المقصوصة بشكل غير مناسب تُنفّر المستخدم بسرعة[cite: 459].
- [cite_start]**نسيان دعوة اتخاذ إجراء (CTA):** إذا لم تطلبوا من المستخدم ترك تعليق أو التحقق من رابط البايو، سينخفض تفاعلكم بشكل حاد[cite: 467].

> **نصيحة آركا المتخصصة:** يعتمد نجاح استراتيجية إعادة التوظيف كليًا على جودة "الفيديو المصدر". باستئجار مساحات معزولة صوتيًا ومجهزة بإضاءة احترافية في **استوديو آركا تبريز**، سجّلوا فيديو مدته ساعة واحدة خاليًا من العيوب واضمنوا مخزون محتوى شهر كامل لصفحتكم بأعلى المعايير البصرية والصوتية.`,
    categoryEn: "Social Media",
    categoryAr: "وسائل التواصل الاجتماعي",
    tagsEn: ["Content Repurposing", "Content Strategy", "Instagram Reels Production", "Video Recycling", "Content Calendar", "Content Production Tabriz", "Arka Studio"],
    tagsAr: ["إعادة توظيف المحتوى", "استراتيجية المحتوى", "إنتاج ريلز إنستغرام", "إعادة تدوير الفيديو", "تقويم المحتوى", "إنتاج المحتوى في تبريز", "استوديو آركا"],
    metaTitleEn: "What Is Content Repurposing? Turn 1 Video Into 30 Reels | Arka",
    metaTitleAr: "ما هي استراتيجية إعادة توظيف المحتوى؟ حوّل فيديو واحد إلى 30 ريلز | آركا",
    metaDescriptionEn: "Learn how to use a content repurposing strategy to turn a single long video into 30 high-performing Instagram reels.",
    metaDescriptionAr: "تعرّف في هذا المقال على كيفية تحويل فيديو طويل واحد إلى 30 ريلز عالي الأداء على إنستغرام باستخدام استراتيجية إعادة توظيف المحتوى.",
    keywordsEn: ["Content Repurposing", "Content Strategy", "Instagram Reels Production", "Video Recycling", "Content Calendar", "Content Production Tabriz", "Arka Studio"],
    keywordsAr: ["إعادة توظيف المحتوى", "استراتيجية المحتوى", "إنتاج ريلز إنستغرام", "إعادة تدوير الفيديو", "تقويم المحتوى", "إنتاج المحتوى في تبريز", "استوديو آركا"],
  },
  {
    slug: "teleprompter-autocue-comprehensive-guide",
    titleEn: "What Is a Teleprompter (Autocue)? Buying Guide, Setup and Professional Delivery",
    titleAr: "ما هو التله برومبتر (الأوتوكيو)؟ دليل الشراء والإعداد والأداء الاحترافي",
    excerptEn:
      "Do you know how news anchors read long scripts without stumbling? In this article from Arka Studio, learn about the teleprompter, its types, how to set it up, and the golden techniques for a natural, professional on-camera delivery.",
    excerptAr:
      "هل تعرفون كيف يقرأ مذيعو الأخبار نصوصًا طويلة دون تعثر؟ في هذا المقال من استوديو آركا، تعرّفوا على التله برومبتر، وأنواعه، وكيفية إعداده، والتقنيات الذهبية لأداء طبيعي واحترافي أمام الكاميرا.",
    contentEn: `Have you ever wondered how news anchors or professional speakers deliver long, complex scripts without the slightest stumble, all while maintaining perfect eye contact? The secret behind this stunning command of delivery is a powerful tool called the **teleprompter** or **autocue**. In this article from Arka Studio's journal (the best-equipped content production studio in Tabriz), we cover everything about this device — from how it works to a buying guide and golden techniques for a natural delivery.

## What Is a Teleprompter or Autocue and How Does It Work?

A teleprompter is a tool that displays a speech's text on a transparent glass screen in front of the camera lens. This technology, which became common on TV networks starting in the 1950s, lets a speaker read the text while looking directly into the audience's eyes (the camera lens) at the same time. The word "autocue" was actually the name of a pioneering British brand in this field, and today it's used as a synonym for "teleprompter."

### Main Components of a Teleprompter System

- **Display Screen:** A monitor, tablet, or smartphone that shows the text.
- **Beam Splitter Glass:** A semi-transparent glass placed at a 45-degree angle in front of the lens, which reflects the text for the speaker without being captured by the camera.
- **Scrolling Software:** A program that moves the text from bottom to top at an adjustable speed.

## Types of Teleprompters: Which Model Is Right for You?

As technology has advanced, these devices have come to market in various form factors:

| Teleprompter Type | Key Features | Main Use |
|---|---|---|
| **Studio (Broadcast)** | Large display, ultra-professional anti-glare glass | Professional content production studios (like Arka) and television |
| **Portable (Camera-Mounted)** | Lightweight, affordable, mountable on DSLR cameras and phones | YouTubers, social media content creators |
| **App-Based** | Software on a tablet/phone with voice-recognition features | Quick recordings, speech practice, and light educational content |
| **Presidential (Speech)** | Two large glass panels on either side of the podium, invisible to the audience | Large conferences, formal speeches, and conventions |

## How to Set Up and Configure a Teleprompter

1. **Prepare the Script:** Format your text with a readable (sans-serif) font, a large size, and proper line spacing. The text should be written in a fully conversational tone.
2. **Physical Installation:** Place the device in front of the lens and set the glass at a 45-degree angle.
3. **Adjust the Speed:** Using a remote control or an AI voice-recognition feature (Voice Sync), sync the scroll speed to your speech.
4. **Practice and Test:** Before the final recording, read the text aloud several times and practice your head movements.

## Golden Techniques for Maintaining Eye Contact and a Natural Delivery

The biggest challenge in using an autocue is the delivery coming across as robotic and artificial. To avoid this:

> Don't read the text word-for-word; try to understand the structure of the sentences and deliver them fluently. Don't forget short pauses and natural breaths.

- Focus your gaze on the camera lens (behind the text), not on the moving lines.
- Don't forget your body language; smile, and use your hands to convey ideas.

## Teleprompter Buying Guide + App Recommendations

| Product / Software Name | Price Range | Main Advantage |
|---|---|---|
| **LENSGO TC7** | Budget | Extremely lightweight, ideal for beginners and phone mounting |
| **Padcaster / Elgato** | Mid-range to professional | High build quality, excellent semi-transparent glass, comes with a remote |
| **PromptSmart Pro** | Paid software | Features AI voice recognition for scroll syncing |
| **Teleprompter Premium** | Free software | Quick access via web or mobile with no physical equipment |

## Why Renting an Equipped Studio Is More Cost-Effective Than Buying Equipment

Buying equipment such as studio teleprompters, RGB lights, cinema lenses, and acoustic room treatment requires an investment of tens of millions of tomans. **Arka Studio in Tabriz**, as the best-equipped content production space in the northwest of the country, provides all of these facilities in affordable hourly packages, so you can focus purely on the quality of your delivery without any technical worries.

## Frequently Asked Questions (FAQ)

**What's the difference between a teleprompter and an autocue?**
There's no difference. Autocue was the name of the first commercial brand to manufacture this device in the UK, and today it's also used as this product's generic name.

**Does using a teleprompter make a video look artificial?**
No — as long as you write your text conversationally and follow eye-contact and body-language techniques, your delivery will be completely natural and flawless.`,
    contentAr: `هل تساءلتم يومًا كيف يقرأ مذيعو الأخبار أو المتحدثون المحترفون نصوصًا طويلة ومعقدة دون أدنى تعثر، مع الحفاظ التام على التواصل البصري؟ سر هذا التمكن المذهل هو أداة قوية تُدعى **التله برومبتر (Teleprompter)** أو **الأوتوكيو (Autocue)**. في هذا المقال من مجلة استوديو آركا (أفضل استوديو تجهيزًا لإنتاج المحتوى في تبريز)، نستعرض كل شيء عن هذا الجهاز، من طريقة عمله إلى دليل الشراء والتقنيات الذهبية للأداء الطبيعي.

## ما هو التله برومبتر أو الأوتوكيو وكيف يعمل؟

التله برومبتر أداة تعرض نص الخطاب على شاشة زجاجية شفافة أمام عدسة الكاميرا. هذه التقنية، التي انتشرت في شبكات التلفزيون منذ خمسينيات القرن الماضي، تتيح للمتحدث قراءة النص مع النظر مباشرة في عين الجمهور (عدسة الكاميرا) في آن واحد. كانت كلمة "أوتوكيو" في الأصل اسم علامة تجارية بريطانية رائدة في هذا المجال، وتُستخدم اليوم كمرادف لكلمة "تله برومبتر".

### المكونات الأساسية لنظام التله برومبتر

- **شاشة العرض:** مانيتور أو تابلت أو هاتف ذكي يعرض النص.
- **الزجاج العاكس (Beam Splitter Glass):** زجاج شبه شفاف يوضع بزاوية 45 درجة أمام العدسة، يعكس النص للمتحدث دون أن تلتقطه الكاميرا.
- **برنامج التمرير:** برنامج يحرك النص من الأسفل إلى الأعلى بسرعة قابلة للتعديل.

## أنواع التله برومبتر: أي طراز يناسبكم؟

مع تطور التكنولوجيا، ظهرت هذه الأجهزة في السوق بأشكال مختلفة:

| نوع التله برومبتر | الميزات الرئيسية | الاستخدام الأساسي |
|---|---|---|
| **الاستوديو (Broadcast)** | شاشة عرض كبيرة، زجاج فائق الاحترافية مضاد للانعكاس | استوديوهات إنتاج المحتوى الاحترافية (مثل آركا) والتلفزيون |
| **المحمول (Camera-Mounted)** | خفيف، اقتصادي، قابل للتركيب على كاميرات DSLR والهواتف | يوتيوبرز، منتجو محتوى وسائل التواصل الاجتماعي |
| **القائم على التطبيق (App-Based)** | برنامج على تابلت/هاتف بميزة التعرف على الصوت | التسجيلات السريعة، التدرب على الخطابة، والمحتوى التعليمي الخفيف |
| **خطابي (Presidential)** | زجاجان كبيران على جانبي المنصة، غير مرئيين للحضور | المؤتمرات الكبرى، الخطابات الرسمية، والمؤتمرات |

## دليل إعداد وضبط التله برومبتر

1. **تجهيز السكريبت:** نسّقوا نصكم بخط واضح (بلا زوائد Sans-serif)، بحجم كبير ومسافات أسطر مناسبة. يجب كتابة النص بأسلوب محادثي تمامًا.
2. **التركيب الفيزيائي:** ضعوا الجهاز أمام العدسة واضبطوا الزجاج بزاوية 45 درجة.
3. **ضبط السرعة:** باستخدام جهاز تحكم عن بُعد أو ميزة الذكاء الاصطناعي للتعرف على الصوت (Voice Sync)، زامنوا سرعة التمرير مع حديثكم.
4. **التدرب والاختبار:** قبل التسجيل النهائي، اقرأوا النص بصوت عالٍ عدة مرات وتدربوا على حركات الرأس.

## تقنيات ذهبية للحفاظ على التواصل البصري والأداء الطبيعي

أكبر تحدٍّ في استخدام الأوتوكيو هو أن يصبح الأداء آليًا ومصطنعًا. لتجنب هذه المشكلة:

> لا تقرأوا النص كلمة بكلمة؛ حاولوا فهم بنية الجمل وأداءها بسلاسة. لا تنسوا الوقفات القصيرة والتنفس الطبيعي.

- ركّزوا نظركم على عدسة الكاميرا (خلف النص)، وليس على الأسطر المتحركة.
- لا تنسوا لغة الجسد؛ ابتسموا واستخدموا أيديكم لنقل المعاني.

## دليل شراء التله برومبتر + أفضل التطبيقات

| اسم المنتج / البرنامج | نطاق السعر | الميزة الرئيسية |
|---|---|---|
| **LENSGO TC7** | اقتصادي | خفيف جدًا، مثالي للمبتدئين وللتركيب على الهاتف |
| **Padcaster / Elgato** | متوسط إلى احترافي | جودة تصنيع عالية، زجاج شبه شفاف ممتاز، مزود بجهاز تحكم عن بُعد |
| **PromptSmart Pro** | برنامج مدفوع | يحتوي على ذكاء اصطناعي للتعرف على الصوت لمزامنة التمرير |
| **Teleprompter Premium** | برنامج مجاني | وصول سريع عبر الويب أو الهاتف دون معدات فيزيائية |

## لماذا يُعد استئجار استوديو مجهز أكثر جدوى من شراء المعدات؟

يتطلب شراء معدات مثل التله برومبتر الاستوديوي وأضواء RGB وعدسات سينمائية وعزل صوتي للمكان استثمارًا بعشرات الملايين من التومان. **استوديو آركا في تبريز**، بصفته أفضل مساحة إنتاج محتوى تجهيزًا في شمال غرب البلاد، يوفر لكم جميع هذه الإمكانيات ضمن باقات ساعية اقتصادية، لتتمكنوا من التركيز فقط على جودة أدائكم دون أي قلق تقني.

## الأسئلة الشائعة (FAQ)

**ما الفرق بين التله برومبتر والأوتوكيو؟**
لا يوجد فرق. كان "أوتوكيو" اسم أول علامة تجارية مصنّعة لهذا الجهاز في بريطانيا، ويُستخدم اليوم أيضًا كاسم عام لهذا المنتج.

**هل يجعل استخدام التله برومبتر الفيديو يبدو مصطنعًا؟**
لا، فطالما كتبتم نصكم بأسلوب محادثي والتزمتم بتقنيات التواصل البصري ولغة الجسد، سيكون أداؤكم طبيعيًا تمامًا وخاليًا من العيوب.`,
    categoryEn: "Production",
    categoryAr: "الإنتاج",
    tagsEn: ["Arka", "Content Production Tabriz", "Teleprompter", "Brand Strategy", "Autocue", "Buy a Teleprompter", "Teleprompter App", "Teleprompter Tutorial", "Arka Studio", "Studio Equipment"],
    tagsAr: ["آركا", "إنتاج المحتوى في تبريز", "تله برومبتر", "استراتيجية العلامة التجارية", "أوتوكيو", "شراء تله برومبتر", "تطبيق تله برومبتر", "تعلم استخدام تله برومبتر", "استوديو آركا", "معدات الاستوديو"],
    metaTitleEn: "What Is a Teleprompter? Buying & Using an Autocue Guide | Arka Studio",
    metaTitleAr: "ما هو التله برومبتر؟ دليل شراء واستخدام الأوتوكيو | استوديو آركا",
    metaDescriptionEn: "What is a teleprompter or autocue? In this comprehensive guide, we cover its types, setup, the best apps, and techniques for a natural on-camera delivery.",
    metaDescriptionAr: "ما هو التله برومبتر أو الأوتوكيو؟ في هذا الدليل الشامل، نستعرض أنواعه وكيفية إعداده وأفضل التطبيقات وتقنيات الأداء الطبيعي أمام الكاميرا.",
    keywordsEn: ["Arka", "Content Production Tabriz", "Teleprompter", "Brand Strategy", "Autocue", "Buy a Teleprompter", "Teleprompter App", "Teleprompter Tutorial", "Arka Studio", "Studio Equipment"],
    keywordsAr: ["آركا", "إنتاج المحتوى في تبريز", "تله برومبتر", "استراتيجية العلامة التجارية", "أوتوكيو", "شراء تله برومبتر", "تطبيق تله برومبتر", "تعلم استخدام تله برومبتر", "استوديو آركا", "معدات الاستوديو"],
  },
];

async function backfillPosts() {
  const rows = await db.post.findMany({ select: { id: true, slug: true, titleEn: true } });
  let count = 0;
  for (const row of rows) {
    const tr = POST_TR.find((p) => p.slug === row.slug);
    if (!tr || row.titleEn) continue;
    await db.post.update({
      where: { id: row.id },
      data: {
        titleEn: tr.titleEn,
        titleAr: tr.titleAr,
        excerptEn: tr.excerptEn,
        excerptAr: tr.excerptAr,
        contentEn: tr.contentEn,
        contentAr: tr.contentAr,
        categoryEn: tr.categoryEn,
        categoryAr: tr.categoryAr,
        tagsEn: J(tr.tagsEn),
        tagsAr: J(tr.tagsAr),
        metaTitleEn: tr.metaTitleEn,
        metaTitleAr: tr.metaTitleAr,
        metaDescriptionEn: tr.metaDescriptionEn,
        metaDescriptionAr: tr.metaDescriptionAr,
        keywordsEn: J(tr.keywordsEn),
        keywordsAr: J(tr.keywordsAr),
      },
    });
    count++;
  }
  console.log(`Posts: translated ${count}/${rows.length} (matched by slug).`);
}

async function main() {
  await backfillHomePage();
  await backfillAboutPage();
  await backfillContactPage();
  await backfillTestimonials();
  await backfillTeam();
  await backfillStats();
  await backfillServices();
  await backfillIndustries();
  await backfillPosts();
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
