import { z } from 'zod';
import { created, handleAuthError, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { hashPassword } from '@/lib/auth/password';
import { writeAuditLog } from '@/lib/audit/log';

const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['AGENCY_ADMIN', 'AGENT', 'VIEWER']).default('VIEWER')
});

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    if (!isDatabaseConfigured()) return ok([], { source: 'mock' });

    const users = await db.user.findMany({
      where: { agencyId: session.agencyId },
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    return ok(users, { total: users.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid user payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ id: 'mock-' + Date.now(), email: parsed.data.email, role: parsed.data.role, source: 'mock' });
    }

    const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return validationError('Email already exists');

    const user = await db.user.create({
      data: {
        agencyId: session.agencyId,
        email: parsed.data.email,
        passwordHash: await hashPassword(parsed.data.password),
        role: parsed.data.role
      },
      select: { id: true, email: true, role: true, createdAt: true }
    });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'invite', resource: 'user', resourceId: user.id, metadata: { email: user.email, role: user.role } });
    return created(user);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
