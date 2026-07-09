// Temporary diagnostic endpoint — reports what the deployed function's
// Prisma client actually sees, and which DB host it's connected to
// (host only, never the full connection string / credentials).
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let dbHost = "unknown";
  try {
    dbHost = new URL(process.env.DATABASE_URL || "").host;
  } catch {}

  try {
    const [projects, services, industries, clients] = await Promise.all([
      db.project.count(),
      db.service.count(),
      db.industry.count(),
      db.client.count(),
    ]);
    return NextResponse.json({ ok: true, dbHost, counts: { projects, services, industries, clients } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, dbHost, error: message }, { status: 500 });
  }
}
