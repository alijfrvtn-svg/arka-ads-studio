import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

// All public pages read live data from the database (projects, services,
// posts, etc.) that admins can edit at any time — force dynamic rendering
// so pages are never frozen as stale static HTML from build time.
export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <a href="#main" className="skip-link">
        رفتن به محتوا
      </a>
      <SiteHeader />
      <main id="main" className="min-h-screen">
        {children}
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
