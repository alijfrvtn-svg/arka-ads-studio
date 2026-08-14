import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { Analytics } from "@/components/fx/Analytics";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MaintenanceScreen, MaintenanceBanner } from "@/components/layout/MaintenanceScreen";
import { getServices, getIndustries, getContactPage, getCategories } from "@/lib/queries";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { parseObj } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import { SITE } from "@/lib/constants";
import type { FooterSettings } from "@/components/layout/SiteFooter";
import type { Department } from "@/types";

const FOOTER_DEFAULTS: FooterSettings = {
  footerCtaHeading: "ایده‌ای در سر دارید؟",
  footerCtaBody: "بیایید با هم چیزی بسازیم که به یاد بماند.",
  footerCtaButtonLabel: "بریف پروژه‌ات را بفرست",
  footerDescription: SITE.description,
  footerCopyright: "تمام حقوق محفوظ است.",
};

// Public pages are statically cached and served instantly from Netlify's edge
// (huge win for Core Web Vitals/SEO) instead of rendering from scratch on
// every request. Admin saves call revalidatePath so edits still show up
// immediately (see revalidateSite() in lib/actions.ts) — this `revalidate`
// is just a safety-net backstop: if some future mutation ever forgets to
// invalidate a page, it self-heals within 5 minutes instead of staying
// stale indefinitely.
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Header mega-menu and footer link columns used to read from a hardcoded
  // constants.ts list, so admin edits to Services/Industries never showed up
  // there (and stale slugs could 404) — fetch the live, published rows here
  // once and pass down instead.
  const locale = await getLocale();
  const [services, industries, settingRow, contact, departments] = await Promise.all([
    getServices(),
    getIndustries(),
    db.setting.findUnique({ where: { key: "site" } }),
    getContactPage(locale),
    getCategories("DEPARTMENT"),
  ]);
  const footer: FooterSettings = { ...FOOTER_DEFAULTS, ...parseObj<Partial<FooterSettings>>(settingRow?.value, {}) };
  const serviceLinks = services.map((s) => ({
    slug: s.slug,
    title: tr(locale, s.title, s.titleEn, s.titleAr),
    department: s.department as Department,
  }));
  const industryLinks = industries.map((i) => ({ slug: i.slug, title: tr(locale, i.title, i.titleEn, i.titleAr) }));

  // Maintenance mode (toggled in /admin/settings) takes down the public site
  // for everyone except signed-in CMS staff, who can still preview it to turn
  // the flag back off.
  //
  // getSessionUser() reads cookies(), and calling that anywhere in this layout
  // opted EVERY public page out of static rendering — Netlify was answering
  // each visit with `Cache-Control: no-store` and re-running the function plus
  // ~11 database round-trips to us-east-2. Reading the session only once the
  // flag is actually on keeps the normal path fully cacheable, and the
  // maintenance path is the one case where per-visitor rendering is correct.
  const { maintenance } = parseObj<{ maintenance?: boolean }>(settingRow?.value, {});
  let staffPreview = false;
  if (maintenance) {
    const sessionUser = await getSessionUser();
    if (!sessionUser || sessionUser.role === "STAFF") return <MaintenanceScreen />;
    // Signed-in CMS staff keep browsing so they can fix whatever the site is
    // down for. That bypass is also why maintenance mode kept looking broken:
    // an admin toggles it, checks the site in the same browser, sees it live,
    // and concludes nothing happened. The banner below removes that ambiguity.
    staffPreview = true;
  }

  return (
    <SmoothScroll>
      <CustomCursor />
      <Analytics />
      <a href="#main" className="skip-link">
        {ui(locale).skipToContent}
      </a>
      {staffPreview && <MaintenanceBanner />}
      <SiteHeader services={serviceLinks} industries={industryLinks} departments={departments} locale={locale} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <SiteFooter services={serviceLinks} industries={industryLinks} locale={locale} footer={footer} contact={contact} />
    </SmoothScroll>
  );
}
