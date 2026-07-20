import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";

export async function POST() {
  // Must resolve who's logging out BEFORE clearing the cookie — afterward the
  // session token is gone and there's no way to know which user this was.
  const user = await getSessionUser();
  if (user) {
    const now = new Date();
    await db.user.update({ where: { id: user.id }, data: { lastLogoutAt: now } });
    // Close EVERY open session, not just the most recent — a user who logged
    // in from another device (or whose session predates this feature) can
    // have more than one row with logoutAt still null, and leaving those
    // open would let them silently inflate the weekly activity report.
    await db.sessionLog.updateMany({ where: { userId: user.id, logoutAt: null }, data: { logoutAt: now } });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: SESSION_COOKIE, value: "", maxAge: 0, path: "/" });
  return res;
}
