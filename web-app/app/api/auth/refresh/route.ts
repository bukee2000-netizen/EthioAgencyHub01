import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { verifyRefreshToken, generateRefreshToken, generateCsrfToken, signSessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, REFRESH_COOKIE_NAME, CSRF_COOKIE_NAME, sessionCookieOptions, refreshCookieOptions, csrfCookieOptions } from '@/lib/auth/cookies';
import { serverError, unauthorized } from '@/lib/api/responses';

export async function POST(req: Request) {
  if (!isDatabaseConfigured()) {
    return unauthorized('Database is not configured.');
  }

  try {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
    
    if (!refreshTokenValue) {
      return unauthorized('No refresh token provided.');
    }

    const payload = verifyRefreshToken(refreshTokenValue);
    
    const storedToken = await db.refreshToken.findFirst({
      where: { 
        userId: payload.userId,
        tokenId: { contains: payload.tokenId.slice(0, 8) },
        revoked: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!storedToken) {
      return unauthorized('Invalid or expired refresh token.');
    }

    const user = await db.user.findUnique({ where: { id: payload.userId } });
    
    if (!user || user.deletedAt) {
      return unauthorized('User not found or deleted.');
    }

    await db.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true }
    });

    const newSessionToken = signSessionToken({ userId: user.id, agencyId: user.agencyId, role: user.role, email: user.email });
    const newRefreshToken = generateRefreshToken(user.id, payload.version + 1);
    const csrfToken = generateCsrfToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.refreshToken.create({
      data: {
        userId: user.id,
        tokenId: newRefreshToken,
        expiresAt
      }
    });

    const response = NextResponse.json({
      success: true,
      data: { 
        user: { id: user.id, email: user.email, agencyId: user.agencyId, role: user.role },
        csrfToken
      }
    });

    response.cookies.set(SESSION_COOKIE_NAME, newSessionToken, sessionCookieOptions);
    response.cookies.set(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
    
    return response;
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return unauthorized('Database unavailable.');
    }
    return unauthorized('Invalid refresh token.');
  }
}