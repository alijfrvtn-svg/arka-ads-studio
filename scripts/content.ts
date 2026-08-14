/**
 * ARKA — content CLI (bulk edits against the live database).
 *
 * Same database the admin panel reads/writes, so anything done here shows up in
 * /admin immediately and stays editable there. Mirrors the admin actions'
 * conventions (JSON-as-String columns, slugify, bcrypt) — never write raw values
 * that the panel would not have produced.
 *
 *   npx tsx scripts/content.ts <command> [args]
 *
 * Commands:
 *   health                      connection + row counts per model
 *   audit-media                 every external image/video URL stored in content
 *   list <model> [n]            recent rows of a model (project|post|service|industry|...)
 *   get <model> <slug|id>       one row as JSON
 *   set <model> <slug> <k=v..>  patch fields on one row (JSON/array values allowed)
 *   import <file.json>          bulk upsert — see IMPORT SHAPE below
 *   export <model> <file.json>  dump a model to a JSON file
 *
 * IMPORT SHAPE — { "posts": [...], "projects": [...], "services": [...],
 *                  "industries": [...], "testimonials": [...], "stats": [...] }
 * Each item keys off `slug` (or `id`), so re-running an import updates rather
 * than duplicating. Array/object fields may be given as real arrays — they are
 * JSON.stringify'd to match the schema's String columns.
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync } from "node:fs";

const db = new PrismaClient({ log: ["error"] });

// ————— helpers mirroring lib/utils + lib/actions —————

/** Same as lib/utils slugify — keeps Persian/Arabic letters, collapses the rest. */
const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

/** Schema stores arrays/objects as JSON strings (SQLite portability). */
const J = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v ?? []));

const JSON_FIELDS = new Set([
  "gallery", "tags", "tagsEn", "tagsAr", "metrics", "metricsEn", "metricsAr",
  "credits", "creditsEn", "creditsAr", "keywords", "keywordsEn", "keywordsAr",
  "features", "featuresEn", "featuresAr", "workflow", "workflowEn", "workflowAr",
  "faqs", "faqsEn", "faqsAr", "pricing", "pricingEn", "pricingAr",
  "approach", "approachEn", "approachAr", "socials", "permissions",
  "heroHeadline", "heroHeadlineEn", "heroHeadlineAr",
  "workflowSteps", "workflowStepsEn", "workflowStepsAr",
  "storyParagraphs", "storyParagraphsEn", "storyParagraphsAr",
  "values", "valuesEn", "valuesAr", "timeline", "timelineEn", "timelineAr",
  "galleryImages", "serviceOptions", "serviceOptionsEn", "serviceOptionsAr",
  "budgetOptions", "budgetOptionsEn", "budgetOptionsAr",
  "heroSlides", "heroSlidesEn", "heroSlidesAr",
]);

/** Encode any JSON-shaped field before it reaches Prisma. */
function normalize(data: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = JSON_FIELDS.has(k) ? J(v) : v;
  }
  return out;
}

const MODELS = {
  project: db.project, post: db.post, service: db.service, industry: db.industry,
  client: db.client, testimonial: db.testimonial, media: db.media, stat: db.stat,
  team: db.teamMember, lead: db.lead, user: db.user, setting: db.setting,
} as const;
type ModelName = keyof typeof MODELS;

function model(name: string) {
  const m = MODELS[name as ModelName];
  if (!m) throw new Error(`unknown model "${name}" — one of: ${Object.keys(MODELS).join(", ")}`);
  return m as any;
}

/** Rows are addressed by whichever unique column that model actually keys on. */
const keyOf = (name: string) =>
  ["project", "post", "service", "industry"].includes(name) ? "slug" : name === "setting" ? "key" : "id";

// ————— commands —————

async function health() {
  const t0 = Date.now();
  await db.$queryRaw`SELECT 1`;
  console.log(`connected in ${Date.now() - t0}ms\n`);
  const counts = await Promise.all(
    Object.entries(MODELS).map(async ([name, m]) => [name, await (m as any).count()] as const),
  );
  for (const [name, n] of counts) console.log(`  ${name.padEnd(12)} ${n}`);
  const home = await db.homePage.findUnique({ where: { id: "home" } });
  console.log(`\n  homePage     ${home ? `row present (updated ${home.updatedAt.toISOString()})` : "MISSING — page falls back to code defaults"}`);
}

/** Which external hosts the live content actually depends on (VPN / speed audit). */
async function auditMedia() {
  const urls: string[] = [];
  const push = (...v: (string | null | undefined)[]) => v.forEach((x) => x && urls.push(x));

  for (const p of await db.project.findMany()) push(p.cover, p.poster, p.heroVideo, p.beforeImage, p.afterImage, ...JSON.parse(p.gallery || "[]"));
  for (const p of await db.post.findMany()) push(p.cover, p.ogImage);
  for (const s of await db.service.findMany()) push(s.cover, s.heroVideo, s.ogImage);
  for (const i of await db.industry.findMany()) push(i.cover, i.heroVideo, i.ogImage);
  for (const c of await db.client.findMany()) push(c.logo);
  for (const t of await db.testimonial.findMany()) push(t.avatar);
  for (const t of await db.teamMember.findMany()) push(t.avatar);
  for (const m of await db.media.findMany()) push(m.url);
  const about = await db.aboutPage.findUnique({ where: { id: "about" } });
  if (about) push(about.storyVideo, about.storyPoster, about.galleryVideo, about.galleryPoster, ...JSON.parse(about.galleryImages || "[]"));

  const byHost = new Map<string, number>();
  for (const u of urls) {
    let host = "(relative / same-origin)";
    try { if (/^https?:\/\//.test(u)) host = new URL(u).host; } catch {}
    byHost.set(host, (byHost.get(host) ?? 0) + 1);
  }
  console.log(`${urls.length} media URLs referenced by live content:\n`);
  for (const [host, n] of [...byHost].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${host}`);
  }
}

async function list(name: string, n = 20) {
  const rows = await model(name).findMany({ take: n, orderBy: { createdAt: "desc" } }).catch(() => model(name).findMany({ take: n }));
  for (const r of rows) console.log(`  ${(r.slug ?? r.id ?? r.key ?? "").padEnd(38)} ${r.title ?? r.name ?? r.author ?? r.label ?? ""}`);
  console.log(`\n${rows.length} rows`);
}

async function get(name: string, key: string) {
  const row = await model(name).findUnique({ where: { [keyOf(name)]: key } });
  console.log(JSON.stringify(row, null, 2));
}

async function set(name: string, key: string, pairs: string[]) {
  const data: Record<string, unknown> = {};
  for (const p of pairs) {
    const i = p.indexOf("=");
    if (i < 0) throw new Error(`bad pair "${p}" — expected key=value`);
    const k = p.slice(0, i);
    const raw = p.slice(i + 1);
    // Let callers pass real JSON (arrays, numbers, booleans) or a plain string.
    let v: unknown = raw;
    if (/^(\[|\{|true$|false$|-?\d+(\.\d+)?$)/.test(raw)) { try { v = JSON.parse(raw); } catch {} }
    data[k] = v;
  }
  const row = await model(name).update({ where: { [keyOf(name)]: key }, data: normalize(data) });
  console.log(`updated ${name} ${key}:`, Object.keys(data).join(", "));
  return row;
}

/** Bulk upsert. Keys off slug (content models) or id, so imports are idempotent. */
async function importFile(file: string) {
  const payload = JSON.parse(readFileSync(file, "utf8")) as Record<string, Record<string, unknown>[]>;
  const PLURAL: Record<string, ModelName> = {
    projects: "project", posts: "post", services: "service", industries: "industry",
    clients: "client", testimonials: "testimonial", stats: "stat", team: "team", media: "media",
  };
  for (const [plural, items] of Object.entries(payload)) {
    const name = PLURAL[plural];
    if (!name) { console.warn(`  skipping unknown collection "${plural}"`); continue; }
    const k = keyOf(name);
    for (const item of items) {
      const data = normalize(item);
      if (k === "slug" && !data.slug && typeof data.title === "string") data.slug = slugify(data.title);
      const where = { [k]: data[k] } as Record<string, unknown>;
      if (where[k] == null) { console.warn(`  skipping ${name} without ${k}`); continue; }
      await model(name).upsert({ where, create: data, update: data });
      console.log(`  ✓ ${name} ${where[k]}`);
    }
  }
}

async function exportModel(name: string, file: string) {
  const rows = await model(name).findMany();
  writeFileSync(file, JSON.stringify(rows, null, 2), "utf8");
  console.log(`wrote ${rows.length} ${name} rows → ${file}`);
}

// ————— entry —————

async function main() {
  const [cmd, ...args] = process.argv.slice(2);
  switch (cmd) {
    case "health": return health();
    case "audit-media": return auditMedia();
    case "list": return list(args[0], args[1] ? Number(args[1]) : undefined);
    case "get": return get(args[0], args[1]);
    case "set": return void (await set(args[0], args[1], args.slice(2)));
    case "import": return importFile(args[0]);
    case "export": return exportModel(args[0], args[1]);
    default:
      console.log("commands: health | audit-media | list <model> [n] | get <model> <key> | set <model> <key> k=v… | import <file.json> | export <model> <file.json>");
      console.log(`models:   ${Object.keys(MODELS).join(", ")}`);
  }
}

main()
  .catch((e) => { console.error("\n✗", e.message); process.exitCode = 1; })
  .finally(() => db.$disconnect());
