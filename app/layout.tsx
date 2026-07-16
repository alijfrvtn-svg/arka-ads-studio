import type { Metadata, Viewport } from "next";
import { Vazirmatn, Syne } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SITE } from "@/lib/constants";
import { organizationJsonLd } from "@/lib/seo";
import { dirOf } from "@/lib/i18n";
import type { Locale } from "@/types";

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
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#04060d" },
    { media: "(prefers-color-scheme: light)", color: "#f5f8fe" },
  ],
};

// Prevent theme flash: set the class before first paint.
const themeScript = `
(function(){try{var t=localStorage.getItem('arka-theme');
if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}
var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(t);e.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');}})();
`;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // middleware.ts sets this only for the public site — /admin and /portal
  // never get it, so they always render fa/rtl regardless of a visitor's
  // site-language cookie.
  const h = await headers();
  const locale = (h.get("x-locale") as Locale) || "fa";

  return (
    <html lang={locale} dir={dirOf(locale)} suppressHydrationWarning className={`${vazir.variable} ${syne.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <div className="global-grain" aria-hidden />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
      </body>
    </html>
  );
}
