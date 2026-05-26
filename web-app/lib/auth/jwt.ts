import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export type SessionPayload = {
  userId: string;
  agencyId: string;
  role: 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENT' | 'VIEWER';
  email?: string;
  mfaChallenge?: boolean;
};

export type RefreshTokenPayload = {
  userId: string;
  tokenId: string;
  version: number;
};

const TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long.');
  }
  return secret;
}

export function signSessionToken(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as SessionPayload;
}

export function generateRefreshToken(userId: string, version: number = 1): string {
  const payload: RefreshTokenPayload = {
    userId,
    tokenId: crypto.randomUUID(),
    version
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, getJwtSecret()) as RefreshTokenPayload;
}

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCsrfToken(token: string, expected: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
