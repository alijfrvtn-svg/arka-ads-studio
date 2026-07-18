import type { Metadata } from "next";
import { SITE } from "./constants";
import type { Locale } from "@/types";

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
  locale?: Locale;
}

const OG_LOCALE: Record<Locale, string> = { fa: "fa_IR", en: "en_US", ar: "ar_SA" };

/** Build consistent page metadata (canonical + OG + Twitter). */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image,
  keywords = [],
  noindex = false,
  type = "website",
  locale = "fa",
}: SeoInput): Metadata {
  const url = `${SITE.url}${path}`;
  const ogImage = image || `${SITE.url}/opengraph-image`;
  return {
    title,
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      siteName: SITE.nameEn,
      title: title || `${SITE.nameEn} — ${SITE.positioning}`,
      description,
      url,
      locale: OG_LOCALE[locale],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE.nameEn }],
    },
    twitter: {
      card: "summary_large_image",
      title: title || SITE.nameEn,
      description,
      images: [ogImage],
    },
  };
}

/** Social links known to be dead/wrong — excluded from schema regardless of source data. */
const BROKEN_SOCIAL_HREFS = ["youtube.com/@arka.studio", "linkedin.com/company/arka-studio"];

export function organizationJsonLd(contact: {
  address: string;
  phone: string;
  email: string;
  mapLat: number;
  mapLng: number;
  socials: { href: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.nameEn,
    alternateName: SITE.name,
    url: SITE.url,
    description: SITE.descriptionEn,
    email: contact.email,
    telephone: contact.phone,
    foundingDate: String(SITE.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Tabriz",
      addressCountry: "IR",
    },
    geo: { "@type": "GeoCoordinates", latitude: contact.mapLat, longitude: contact.mapLng },
    sameAs: contact.socials.map((s) => s.href).filter((href) => !BROKEN_SOCIAL_HREFS.some((bad) => href.includes(bad))),
  };
}

export function faqPageJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function serviceJsonLd(p: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.name,
    description: p.description,
    url: `${SITE.url}${p.path}`,
    provider: { "@type": "Organization", name: SITE.nameEn, url: SITE.url },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}

export function articleJsonLd(p: {
  title: string;
  description: string;
  image: string;
  path: string;
  datePublished: string | Date;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    image: p.image,
    datePublished: new Date(p.datePublished).toISOString(),
    author: p.author ? { "@type": "Person", name: p.author } : { "@type": "Organization", name: SITE.nameEn },
    publisher: {
      "@type": "Organization",
      name: SITE.nameEn,
      logo: { "@type": "ImageObject", url: `${SITE.url}/icon.svg` },
    },
    mainEntityOfPage: `${SITE.url}${p.path}`,
  };
}

export function creativeWorkJsonLd(p: {
  title: string;
  description: string;
  image: string;
  path: string;
  client?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    description: p.description,
    image: p.image,
    url: `${SITE.url}${p.path}`,
    creator: { "@type": "Organization", name: SITE.nameEn },
    ...(p.client ? { about: p.client } : {}),
  };
}
