import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { JournalFilter } from "@/components/journal/JournalFilter";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "ژورنال",
  path: "/journal",
  description: "بینش، ترند و مطالعه موردی از تیم آرکا؛ درباره برندینگ، پروداکشن و دیجیتال مارکتینگ.",
});

export default async function JournalPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    include: { author: { select: { name: true, avatar: true } } },
  });

  return (
    <>
      <PageHero
        eyebrow="ژورنال"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "ژورنال" }]}
        title={<>بینش و <span className="text-gradient">الهام</span></>}
        description="آنچه در آرکا می‌آموزیم را با شما به اشتراک می‌گذاریم."
      />
      <section className="pb-24">
        <JournalFilter posts={posts} />
      </section>
    </>
  );
}
