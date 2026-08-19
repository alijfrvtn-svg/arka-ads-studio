import type { Metadata } from "next";
import { WorkCinematicHero } from "@/components/work/WorkCinematicHero";
import { WorkFilter } from "@/components/work/WorkFilter";
import { getAllProjects, getCategories } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/seo";
import { getLocale } from "@/lib/get-locale";
import { ui } from "@/lib/i18n";
import type { Locale } from "@/types";

/** Headline copy lives in WorkCinematicHero, which renders it. This is only
 *  what the page needs for its <meta>. */
const COPY: Record<Locale, { metaDescription: string }> = {
  fa: { metaDescription: "مجموعه‌ای از کیس‌استادی‌ها و پروژه‌های شاخص آرکا؛ از برندفیلم سینمایی تا کمپین‌های دیجیتال." },
  en: { metaDescription: "A collection of ARKA's case studies and flagship projects — from cinematic brand films to digital campaigns." },
  ar: { metaDescription: "مجموعة من دراسات الحالة والمشاريع الرائدة لآركا؛ من أفلام العلامات السينمائية إلى الحملات الرقمية." },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return buildMetadata({ title: ui(locale).navWork, path: "/work", description: COPY[locale].metaDescription, locale });
}

export default async function WorkPage() {
  const locale = await getLocale();
  const [projects, categories] = await Promise.all([getAllProjects(), getCategories("WORK")]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: ui(locale).navHome, path: "/" },
            { name: ui(locale).navWork, path: "/work" },
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
