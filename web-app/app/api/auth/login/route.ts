import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth.schema';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { verifyPassword } from '@/lib/auth/password';
import { signSessionToken, generateRefreshToken, generateCsrfToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, REFRESH_COOKIE_NAME, CSRF_COOKIE_NAME, sessionCookieOptions, refreshCookieOptions, csrfCookieOptions } from '@/lib/auth/cookies';
import { serverError, unauthorized, validationError } from '@/lib/api/responses';
import { writeAuditLog } from '@/lib/audit/log';
import { getClientKey, rateLimit } from '@/lib/security/rate-limit';
import { demoUsers } from '@/lib/mock-data';

export async function POST(req: Request) {
  const limit = rateLimit(getClientKey(req, 'login'), 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'RATE_LIMITED', message: 'Too many login attempts. Please wait and try again.' } },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
    );
  }

  const body = await req.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return validationError('Invalid login payload', parsed.error.flatten());
  }

  // Demo login when database is not configured
  if (!isDatabaseConfigured()) {
    const demoUser = demoUsers.find(u => u.email === parsed.data.email && u.password === parsed.data.password);
    
    if (!demoUser) {
      return unauthorized('Invalid demo credentials. Try: admin@ethioagency.com / admin123');
    }

    const sessionToken = signSessionToken({ userId: demoUser.id, agencyId: demoUser.agencyId, role: demoUser.role as 'AGENCY_ADMIN' | 'AGENT' | 'VIEWER' | 'SUPER_ADMIN', email: demoUser.email });
    const refreshToken = generateRefreshToken(demoUser.id, 1);
    const csrfToken = generateCsrfToken();

    const response = NextResponse.json({
      success: true,
      data: { 
        user: { id: demoUser.id, email: demoUser.email, agencyId: demoUser.agencyId, role: demoUser.role },
        csrfToken,
        isDemo: true
      }
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);
    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
    
    return response;
  }

  try {
    const user = await db.user.findUnique({ where: { email: parsed.data.email } });

    if (!user) {
      return unauthorized('Invalid email or password.');
    }

    const passwordOk = await verifyPassword(parsed.data.password, user.passwordHash);

    if (!passwordOk) {
      return unauthorized('Invalid email or password.');
    }

    if (user.twoFactorEnabled) {
      const challengeToken = signSessionToken({ userId: user.id, agencyId: user.agencyId, role: user.role, email: user.email, mfaChallenge: true });
      const response = NextResponse.json({
        success: true,
        data: { mfaRequired: true, email: user.email }
      });
      response.cookies.set('mfa_challenge', challengeToken, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', path: '/', maxAge: 300
      });
      return response;
    }

    const sessionToken = signSessionToken({ userId: user.id, agencyId: user.agencyId, role: user.role, email: user.email });
    const refreshToken = generateRefreshToken(user.id, 1);
    const csrfToken = generateCsrfToken();

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await db.refreshToken.create({
        data: {
          userId: user.id,
          tokenId: refreshToken,
          expiresAt
        }
      });
    } catch {
      // Refresh token table may not exist yet
    }

    const response = NextResponse.json({
      success: true,
      data: { 
        user: { id: user.id, email: user.email, agencyId: user.agencyId, role: user.role },
        csrfToken
      }
    });

    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions);
    response.cookies.set(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, csrfCookieOptions);
    
    await writeAuditLog({ agencyId: user.agencyId, actorId: user.id, action: 'login', resource: 'user', resourceId: user.id });
    return response;
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return unauthorized('Authentication database is unavailable.');
    }
    return serverError();
  }
}