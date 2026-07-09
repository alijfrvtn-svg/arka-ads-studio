import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Section, Container } from "@/components/ui/Section";
import { IndustryShowcase } from "@/components/industries/IndustryShowcase";
import { getIndustries } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "صنایع",
  path: "/industries",
  description: "راهکارهای خلاق و دیجیتال اختصاصی آرکا برای ۱۲ صنعت؛ از پزشکی و خودرو تا فشن و فین‌تک.",
});

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero
        eyebrow="صنایع"
        breadcrumb={[{ label: "خانه", href: "/" }, { label: "صنایع" }]}
        title={<>تخصص در <span className="text-gradient">هر صنعت</span></>}
        description="نشانگر را روی هر صنعت ببرید و رویکرد اختصاصی ما را کشف کنید."
      />
      <Section>
        <Container>
          <IndustryShowcase industries={industries} />
        </Container>
      </Section>
    </>
  );
}
