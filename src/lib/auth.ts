import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { UserRole, SessionPayload } from "./types";
import { db } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-clinic-saas-production-quality-minimum-32-chars";
const COOKIE_NAME = "clinic_saas_session";

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, 10);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export function signToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signToken(payload);
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return token;
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Role authorization checks
export function hasRole(session: SessionPayload | null, allowedRoles: UserRole[]): boolean {
  if (!session) return false;
  if (session.isSuperAdmin) return true;
  if (!session.role) return false;
  return allowedRoles.includes(session.role);
}

export function requireTenant(session: SessionPayload | null, targetClinicId: string): boolean {
  if (!session) return false;
  if (session.isSuperAdmin) return true;
  return session.clinicId === targetClinicId;
}
