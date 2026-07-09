import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { signSession, sessionCookieOptions } from "@/lib/session";
import type { Role } from "@/types";

const schema = z.object({
  email: z.string().email("ایمیل نامعتبر است"),
  password: z.string().min(1, "رمز عبور را وارد کنید"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "ورودی نامعتبر" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  const invalid = NextResponse.json({ error: "ایمیل یا رمز عبور نادرست است" }, { status: 401 });
  if (!user || !user.active) return invalid;

  const ok = await verifyPassword(password, user.password);
  if (!ok) return invalid;

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  const token = await signSession({
    sub: user.id,
    email: user.email,
    role: user.role as Role,
    name: user.name,
  });

  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set({ ...sessionCookieOptions, value: token });
  return res;
}
