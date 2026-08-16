import type { Metadata, Viewport } from "next";
import { Vazirmatn, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlassFilters } from "@/components/fx/GlassFilters";
import { SITE } from "@/lib/constants";
import { organizationJsonLd } from "@/lib/seo";
import { getContactPage } from "@/lib/queries";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nameEn} | ${SITE.positioning}`,
    template: `%s | ${SITE.nameEn}`,
  },
  description: SITE.description,
  applicationName: SITE.nameEn,
  authors: [{ name: SITE.nameEn }],
  keywords: [
    "آرکا",
    "ARKA",
    "دیجیتال مارکتینگ",
    "پروداکشن",
    "تیزر تبلیغاتی",
    "برندینگ",
    "طراحی وب",
    "آژانس تبلیغاتی",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.nameEn,
    locale: "fa_IR",
    url: SITE.url,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
  verification: { google: "ayWrAgIiSbeyN0W6I9VUoW-pcLxNN-sUSPoxDS_azeg" },
};

// The public site is paper white and has no second theme to announce.
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

// The public site has exactly one appearance — white — so there is no theme to
// restore and no flash to prevent: no class on <html> means the whitespace
// tokens in :root apply, and that is the only look the site has.
//
// The CMS (/admin, /portal) is the one place that still owns a dark/light
// switch, so the pre-paint restore is scoped to those routes. It runs before
// first paint to stop the panel flashing the wrong theme on load.
const themeScript = `
(function(){try{var e=document.documentElement;
if(!/^\\/(admin|portal)(\\/|$)/.test(location.pathname)){e.classList.remove('light','dark');e.style.colorScheme='light';return;}
var t=localStorage.getItem('arka-theme');
if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
e.classList.remove('light','dark');e.classList.add(t);e.style.colorScheme=t;
}catch(e){}})();
`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const contact = await getContactPage("fa");

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className={`${vazir.variable} ${syne.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <GlassFilters />
        <div className="global-grain" aria-hidden />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(contact)) }}
        />
      </body>
    </html>
  );
}
