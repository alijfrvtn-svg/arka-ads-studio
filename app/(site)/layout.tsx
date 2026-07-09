import SmoothScroll from "@/components/fx/SmoothScroll";
import CustomCursor from "@/components/fx/CustomCursor";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

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
