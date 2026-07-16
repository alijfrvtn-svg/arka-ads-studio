import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MaintenanceScreen } from "@/components/layout/MaintenanceScreen";
import { getServices, getIndustries, getContactPage } from "@/lib/queries";
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

// All public pages read live data from the database (projects, services,
// posts, etc.) that admins can edit at any time — force dynamic rendering
// so pages are never frozen as stale static HTML from build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Header mega-menu and footer link columns used to read from a hardcoded
  // constants.ts list, so admin edits to Services/Industries never showed up
  // there (and stale slugs could 404) — fetch the live, published rows here
  // once and pass down instead.
  const locale = await getLocale();
  const [services, industries, settingRow, sessionUser, contact] = await Promise.all([
    getServices(),
    getIndustries(),
    db.setting.findUnique({ where: { key: "site" } }),
    getSessionUser(),
    getContactPage(locale),
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
  const { maintenance } = parseObj<{ maintenance?: boolean }>(settingRow?.value, {});
  if (maintenance && (!sessionUser || sessionUser.role === "STAFF")) {
    return <MaintenanceScreen />;
  }

  return (
    <SmoothScroll>
      <CustomCursor />
      <a href="#main" className="skip-link">
        {ui(locale).skipToContent}
      </a>
      <SiteHeader services={serviceLinks} industries={industryLinks} locale={locale} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <SiteFooter services={serviceLinks} industries={industryLinks} locale={locale} footer={footer} contact={contact} />
    </SmoothScroll>
  );
}
