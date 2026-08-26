import crypto from "node:crypto";
import type { Request, Response } from "express";
import { query } from "./db";

const COOKIE_NAME = "studiocraft_admin_session";
const SESSION_DAYS = 7;

type Admin = { id: number; email: string };

type SessionRow = { admin_id: number; email: string; expires_at: Date };

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

export async function createSession(admin: Admin, response: Response) {
  const sessionId = crypto.randomBytes(32).toString("hex");
  await query(
    "INSERT INTO admin_sessions (id, admin_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
    [sessionId, admin.id],
  );
  response.cookie(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

export async function getAdmin(request: Request): Promise<Admin | null> {
  const sessionId = request.cookies?.[COOKIE_NAME];
  if (!sessionId) return null;
  const result = await query<SessionRow>(
    `SELECT s.admin_id, a.email, s.expires_at
     FROM admin_sessions s JOIN admins a ON a.id = s.admin_id
     WHERE s.id = $1 AND s.expires_at > NOW()`
    , [sessionId],
  );
  const session = result.rows[0];
  return session ? { id: session.admin_id, email: session.email } : null;
}

export async function destroySession(request: Request, response: Response) {
  const sessionId = request.cookies?.[COOKIE_NAME];
  if (sessionId) await query("DELETE FROM admin_sessions WHERE id = $1", [sessionId]);
  response.clearCookie(COOKIE_NAME);
}
