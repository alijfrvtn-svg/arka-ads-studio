import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/types";

// Edge-safe session helpers (jose only) — importable from middleware.
export const SESSION_COOKIE = "arka_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return new TextEncoder().encode(process.env.AUTH_SECRET || "arka_dev_secret");
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
