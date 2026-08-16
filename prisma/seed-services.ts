/**
 * Sync the 28 service pages into the database.
 *
 * Idempotent: rows are upserted by slug, so running it twice changes nothing and
 * an admin's edits to fields this script does not set (cover, pricing, faqs,
 * workflow, heroVideo…) survive a re-run.
 *
 * The four pre-existing SEO landing pages are retired rather than deleted —
 * they are unpublished here and 301'd in next.config.ts, so whatever ranking
 * they earned moves to the closest new page instead of turning into a 404.
 *
 *   npx tsx prisma/seed-services.ts
 */
import { PrismaClient } from "@prisma/client";
import { SERVICES_28 } from "./services-28";

const db = new PrismaClient();

/** Old slug -> the new page that inherits its topic. Mirrors next.config.ts. */
const RETIRED = [
  "branding-and-digital-marketing-services",
  "web-design-and-seo-services",
  "graphic-design-logo-visual-identity",
  "content-creation-and-social-media-management",
];

async function main() {
  let created = 0;
  let updated = 0;

  for (const [i, s] of SERVICES_28.entries()) {
    const existing = await db.service.findUnique({ where: { slug: s.slug }, select: { id: true } });
    const data = {
      title: s.title,
      titleEn: s.titleEn,
      tagline: s.tagline,
      excerpt: s.excerpt,
      description: s.description,
      department: s.department,
      icon: s.icon,
      features: JSON.stringify(s.features),
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
      keywords: JSON.stringify(s.keywords),
      // Order carries the department blocks: 0-6 branding, 10-16 photography,
      // 20-26 web/SEO, 30-36 marketing. The gaps leave room to insert without
      // renumbering everything after it.
      order: { DESIGN: 0, FILM: 10, DIGITAL: 20, STRATEGY: 30 }[s.department] + (i % 7),
      published: true,
    };
    await db.service.upsert({ where: { slug: s.slug }, create: { slug: s.slug, ...data }, update: data });
    existing ? updated++ : created++;
    console.log(`  ${existing ? "~" : "+"} ${s.department.padEnd(8)} ${s.slug}`);
  }

  const retired = await db.service.updateMany({
    where: { slug: { in: RETIRED } },
    data: { published: false },
  });

  console.log(`\n${created} created, ${updated} updated, ${retired.count} retired (301'd in next.config.ts)`);

  const total = await db.service.count({ where: { published: true } });
  const byDept = await db.service.groupBy({
    by: ["department"],
    where: { published: true },
    _count: true,
  });
  console.log(`published total: ${total}`);
  for (const d of byDept) console.log(`  ${d.department.padEnd(8)} ${d._count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
