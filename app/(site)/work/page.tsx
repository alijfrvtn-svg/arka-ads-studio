import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { WorkFilter } from "@/components/work/WorkFilter";
import { getAllProjects } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "نمونه‌کارها",
  path: "/work",
  description: "مجموعه‌ای از کیس‌استادی‌ها و پروژه‌های شاخص آرکا؛ از برندفیلم سینمایی تا کمپین‌های دیجیتال.",
});

export default async function WorkPage() {
  const projects = await getAllProjects();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            { name: "نمونه‌کارها", path: "/work" },
          ])),
        }}
      />
      <PageHero
        eyebrow="پورتفولیو"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "نمونه‌کارها" }]}
        title={<>کارهایی که <span className="text-gradient">تأثیر گذاشتند</span></>}
        description="هر پروژه یک داستان است؛ از چالش برند تا نتیجه‌ای که با عدد اندازه‌گیری می‌شود."
      />
      <section className="pb-24">
        <WorkFilter projects={projects} />
      </section>
    </>
  );
}
