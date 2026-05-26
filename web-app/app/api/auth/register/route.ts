import { NextResponse } from 'next/server';
import { registerAgencySchema } from '@/lib/validations/auth.schema';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { hashPassword } from '@/lib/auth/password';
import { signSessionToken } from '@/lib/auth/jwt';
import { SESSION_COOKIE_NAME, sessionCookieOptions } from '@/lib/auth/cookies';
import { created, serverError, unauthorized, validationError } from '@/lib/api/responses';

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerAgencySchema.safeParse(body);

  if (!parsed.success) {
    return validationError('Invalid registration payload', parsed.error.flatten());
  }

  if (!isDatabaseConfigured()) {
    return unauthorized('Database is not configured for registration.');
  }

  try {
    const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return validationError('Email already registered');
    }

    const agency = await db.agency.create({ data: { name: parsed.data.agencyName } });
    const user = await db.user.create({
      data: {
        agencyId: agency.id,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        role: 'AGENCY_ADMIN'
      }
    });

    const token = signSessionToken({ userId: user.id, agencyId: user.agencyId, role: user.role, email: user.email });
    const response = created({ user: { id: user.id, email: user.email, agencyId: user.agencyId, role: user.role } });
    response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions);
    return response;
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return unauthorized('Registration database is unavailable.');
    }
    return serverError();
  }
}
