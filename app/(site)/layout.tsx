import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getServices, getIndustries } from "@/lib/queries";
import type { Department } from "@/types";

// All public pages read live data from the database (projects, services,
// posts, etc.) that admins can edit at any time — force dynamic rendering
// so pages are never frozen as stale static HTML from build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Header mega-menu and footer link columns used to read from a hardcoded
  // constants.ts list, so admin edits to Services/Industries never showed up
  // there (and stale slugs could 404) — fetch the live, published rows here
  // once and pass down instead.
  const [services, industries] = await Promise.all([getServices(), getIndustries()]);
  const serviceLinks = services.map((s) => ({ slug: s.slug, title: s.title, department: s.department as Department }));
  const industryLinks = industries.map((i) => ({ slug: i.slug, title: i.title }));

  return (
    <SmoothScroll>
      <CustomCursor />
      <a href="#main" className="skip-link">
        رفتن به محتوا
      </a>
      <SiteHeader services={serviceLinks} industries={industryLinks} />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <SiteFooter services={serviceLinks} industries={industryLinks} />
    </SmoothScroll>
  );
}
