import type { Metadata } from "next";
import { WorkCinematicHero } from "@/components/work/WorkCinematicHero";
import { WorkFilter } from "@/components/work/WorkFilter";
import { getAllProjects, getCategories } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import type { Locale } from "@/types";
import { getUi } from "@/lib/site-copy";

/** Headline copy lives in WorkCinematicHero, which renders it. This is only
 *  what the page needs for its <meta>. */
const COPY: Record<Locale, { metaDescription: string }> = {
  fa: { metaDescription: "مجموعه‌ای از کیس‌استادی‌ها و پروژه‌های شاخص آرکا؛ از برندفیلم سینمایی تا کمپین‌های دیجیتال." },
  en: { metaDescription: "A collection of ARKA's case studies and flagship projects — from cinematic brand films to digital campaigns." },
  ar: { metaDescription: "مجموعة من دراسات الحالة والمشاريع الرائدة لآركا؛ من أفلام العلامات السينمائية إلى الحملات الرقمية." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  // Interface strings, with anything edited in the panel applied. Cached per
  // request, so every component asking for it costs one query between them.
  const t = await getUi(locale);
  return buildMetadata({ title: t.navWork, path: "/work", description: COPY[locale].metaDescription, locale });
}

export default async function WorkPage() {
  const locale = await getLocale();
  const t = await getUi(locale);
  const [projects, categories] = await Promise.all([getAllProjects(), getCategories("WORK")]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: t.navHome, path: "/" },
            { name: t.navWork, path: "/work" },
          ])),
        }}
      />
      <WorkCinematicHero locale={locale} />
      {/* The film ends on black, so the grid opens with its own breathing room
          rather than starting flush against the frame. */}
      <section className="pb-24 pt-20 md:pt-28">
        <WorkFilter projects={projects} categories={categories} locale={locale} />
      </section>
    </>
  );
}
