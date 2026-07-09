// One-time, secret-protected endpoint to seed the production database.
// Trigger once after the first deploy: POST /api/admin/seed?secret=<SEED_SECRET>
// SEED_SECRET is set as a Netlify environment variable (not committed to git).
import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "../../../../prisma/seed-logic";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await seedDatabase();
    return NextResponse.json({ ok: true, message: "Seed complete." });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
