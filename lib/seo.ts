import type { Metadata } from "next";
import { SITE } from "./constants";

interface SeoInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  noindex?: boolean;
  type?: "website" | "article";
}

/** Build consistent page metadata (canonical + OG + Twitter). */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image,
  keywords = [],
  noindex = false,
  type = "website",
}: SeoInput): Metadata {
  const url = `${SITE.url}${path}`;
  const ogImage = image || `${SITE.url}/og.png`;
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
      locale: "fa_IR",
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

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.nameEn,
    alternateName: SITE.name,
    url: SITE.url,
    description: SITE.descriptionEn,
    email: SITE.email,
    foundingDate: String(SITE.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.addressEn,
      addressLocality: "Tehran",
      addressCountry: "IR",
    },
    sameAs: SITE.socials.map((s) => s.href),
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
    author: { "@type": "Organization", name: p.author || SITE.nameEn },
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
