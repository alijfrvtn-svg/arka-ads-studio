import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { Analytics } from "@/components/fx/Analytics";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ServiceMarquee } from "@/components/home/ServiceMarquee";
import { MaintenanceScreen, MaintenanceBanner } from "@/components/layout/MaintenanceScreen";
import { getServices, getIndustries, getContactPage, getCategories, getMarqueeCards } from "@/lib/queries";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { parseObj } from "@/lib/utils";
import { tr, ui } from "@/lib/i18n";
import { getLocale } from "@/lib/get-locale";
import { SITE } from "@/lib/constants";
import { getAppearance } from "@/lib/appearance";
import { getUi } from "@/lib/site-copy";
import { AppearanceProvider } from "@/components/providers/Appearance";
import { SiteCopyProvider } from "@/components/providers/SiteCopy";
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
  // `appearance` and `copy` join the same batch rather than being awaited after
  // it: both are cached for the request, so every server component below gets
  // them for free, and both swallow their own failures and return the shipped
  // constants — a database blip costs freshness, never colour or wording.
  const [services, industries, settingRow, contact, departments, marqueeCards, appearance, copy] = await Promise.all([
    getServices(),
    getIndustries(),
    db.setting.findUnique({ where: { key: "site" } }),
    getContactPage(locale),
    getCategories("DEPARTMENT"),
    getMarqueeCards(locale),
    getAppearance(),
    getUi(locale),
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
    // The palette also has to reach the stylesheet: the phone's painted band
    // is a CSS gradient, and CSS cannot read the database. Emitted as custom
    // properties here so that one surface stays in step with the other five.
    <AppearanceProvider value={appearance}>
      <SiteCopyProvider value={copy}>
        <div
          style={Object.fromEntries(appearance.sitePaint.map((c, i) => [`--paint-${i}`, c])) as React.CSSProperties}
        >
        <SmoothScroll>
      <CustomCursor />
      <Analytics />
      <a href="#main" className="skip-link">
        {copy.skipToContent}
      </a>
      {staffPreview && <MaintenanceBanner />}
      <SiteHeader services={serviceLinks} industries={industryLinks} departments={departments} locale={locale} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      {/* Closing band, above the footer on every page: the whole catalogue
          drifting past with one way to start in the middle of it. It lives in
          the layout rather than in each page so no route can forget it. */}
      <ServiceMarquee
        cards={marqueeCards}
        heading={copy.marqueeHeading}
        body={copy.marqueeBody}
        ctaLabel={copy.marqueeCta}
      />
      <SiteFooter services={serviceLinks} industries={industryLinks} locale={locale} footer={footer} contact={contact} />
        </SmoothScroll>
        </div>
      </SiteCopyProvider>
    </AppearanceProvider>
  );
}
