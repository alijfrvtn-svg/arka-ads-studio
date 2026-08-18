import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import localFont from "next/font/local";
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

/**
 * Display face — Estedad, self-hosted.
 *
 * Replaces Syne, which was Latin-only: on a Persian site its headings fell back
 * to the body font for every word that mattered, so the "display face" was
 * decorative on the English fragments and invisible everywhere else. Estedad
 * covers both scripts (all 32 core Persian letters, ZWNJ, Latin, and Persian
 * *and* ASCII digits), so a heading is finally set in one voice.
 *
 * Three weights only — 500/700/900 are what the headings actually ask for, and
 * shipping Thin/Light too would be ~63KB nobody renders. Converted to woff2,
 * which is ~40% of the source TTF.
 */
const estedad = localFont({
  src: [
    { path: "./fonts/Estedad-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Estedad-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Estedad-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-estedad",
  display: "swap",
  // The body face already covers this script, so a slow font file should never
  // hold the page hostage — swap in when it lands.
  fallback: ["Vazirmatn", "system-ui", "sans-serif"],
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
    <html lang="fa" dir="rtl" suppressHydrationWarning className={`${vazir.variable} ${estedad.variable}`}>
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
