// Runs only inside a Netlify build/dev environment.
// Provisions (or reuses) a Netlify DB (Neon Postgres) branch for the current
// deploy context and writes it to .env as DATABASE_URL so Prisma can read it
// via `env("DATABASE_URL")` in prisma/schema.prisma.
const fs = require("fs");
const path = require("path");

if (!process.env.NETLIFY) {
  console.log("[setup-netlify-db] Not running on Netlify — skipping (local dev uses .env as-is).");
  process.exit(0);
}

try {
  const { getConnectionString } = require("@netlify/database");
  const url = getConnectionString();

  if (!url) {
    console.warn("[setup-netlify-db] No connection string returned — is the Neon extension enabled for this site?");
    process.exit(0);
  }

  const envPath = path.join(__dirname, "..", ".env");
  const existing = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const withoutOldUrl = existing
    .split("\n")
    .filter((line) => !line.startsWith("DATABASE_URL="))
    .join("\n");

  fs.writeFileSync(envPath, `${withoutOldUrl}\nDATABASE_URL="${url}"\n`);
  console.log("[setup-netlify-db] DATABASE_URL set from Netlify DB (Neon).");
} catch (err) {
  console.warn("[setup-netlify-db] Skipping:", err.message);
}
