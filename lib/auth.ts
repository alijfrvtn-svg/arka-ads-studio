import "server-only";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { verifySession, SESSION_COOKIE } from "./session";
import { can } from "./rbac";
import type { Role } from "@/types";

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

/** Resolve the currently signed-in admin user (or null). */
export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySession(token);
  if (!payload?.sub) return null;
  const user = await db.user.findUnique({ where: { id: String(payload.sub) } });
  if (!user || !user.active) return null;
  return user;
}

/** Throw if not authenticated — for use in server actions. */
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

/** Throw if the user lacks a permission — for use in server actions. */
export async function requirePermission(permission: string) {
  const user = await requireUser();
  const perms = safePerms(user.permissions);
  if (!can(user.role as Role, perms, permission)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

function safePerms(raw: string): string[] {
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}
