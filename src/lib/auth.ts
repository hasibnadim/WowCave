import { createHmac, createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

export const SESSION_COOKIE_NAME = "wowcave_session";
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const SESSION_SECRET = process.env.SESSION_SECRET || "wowcave-local-session-secret";

export type SessionPayload = {
  userId: string;
  email: string;
  displayName?: string | null;
  exp: number;
};

function encodeBase64(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

export function signSession(payload: Omit<SessionPayload, "exp"> & { exp?: number }) {
  const sessionPayload: SessionPayload = {
    ...payload,
    exp: payload.exp ?? Date.now() + SESSION_TTL_MS,
  };

  const encodedPayload = encodeBase64(JSON.stringify(sessionPayload));
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifySession(token: string | null): SessionPayload | null {
  if (!token) return null;

  const [encodedPayload, receivedSignature] = token.split(".");
  if (!encodedPayload || !receivedSignature) return null;

  const expectedSignature = createHmac("sha256", SESSION_SECRET)
    .update(encodedPayload)
    .digest("base64url");

  if (expectedSignature.length !== receivedSignature.length) {
    return null;
  }

  try {
    if (!timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSignature))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const sessionPayload = JSON.parse(decodeBase64(encodedPayload)) as SessionPayload;

    if (!sessionPayload.userId || !sessionPayload.email || !(sessionPayload.exp > Date.now())) {
      return null;
    }

    return sessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt.toString("hex")}:${hash}`;
}

export function verifyPassword(password: string, storedHash?: string) {
  if (!storedHash) return false;

  try {
    const [saltHex, expectedHash] = storedHash.split(":");
    if (!saltHex || !expectedHash) return false;

    const salt = Buffer.from(saltHex, "hex");
    const derivedHash = scryptSync(password, salt, 64).toString("hex");
    const expected = Buffer.from(expectedHash, "hex");
    const actual = Buffer.from(derivedHash, "hex");

    if (expected.length !== actual.length) {
      return false;
    }

    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export function sanitizeUser(user: {
  _id?: { toString(): string } | string;
  email?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  photoURL?: string | null;
  provider?: string | null;
  providerData?: { providerId?: string | null }[];
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}) {
  const displayName = user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Player";

  return {
    id: typeof user._id === "string" ? user._id : user._id?.toString(),
    email: user.email || "",
    displayName,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    username: user.username || "",
    photoURL: user.photoURL || "",
    provider: user.provider || "email",
    hasPassword: user.providerData?.some((provider) => provider.providerId === "password") ?? user.provider === "email",
    createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : null,
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : null,
  };
}

export async function hashPasswordAsync(password: string) {
  return hashPassword(password);
}

export function getSafeDisplayName(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : "Player";
}

export function buildDisplayName(firstName?: string | null, lastName?: string | null, fallback?: string | null) {
  const resolved = [firstName, lastName].filter(Boolean).join(" ").trim();
  return resolved || getSafeDisplayName(fallback);
}

export function createUserToken(user: { _id?: { toString(): string } | string; email: string; displayName?: string | null }) {
  return signSession({
    userId: typeof user._id === "string" ? user._id : user._id?.toString() || "",
    email: user.email,
    displayName: user.displayName || null,
  });
}
