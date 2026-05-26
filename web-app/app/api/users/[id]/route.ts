import { z } from 'zod';
import { handleAuthError, ok, serverError, validationError, notFound } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { hashPassword } from '@/lib/auth/password';
import { writeAuditLog } from '@/lib/audit/log';

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(['AGENCY_ADMIN', 'AGENT', 'VIEWER']).optional()
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    if (!isDatabaseConfigured()) return notFound();

    const user = await db.user.findFirst({
      where: { id: params.id, agencyId: session.agencyId },
      select: { id: true, email: true, role: true, createdAt: true, twoFactorEnabled: true }
    });
    if (!user) return notFound('User not found');
    return ok(user);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = userUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid payload', parsed.error.flatten());
    if (!isDatabaseConfigured()) return ok({ id: params.id, source: 'mock' });

    const existing = await db.user.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!existing) return notFound('User not found');

    const data: Record<string, unknown> = {};
    if (parsed.data.email) data.email = parsed.data.email;
    if (parsed.data.role) data.role = parsed.data.role;
    if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);

    const user = await db.user.update({
      where: { id: params.id },
      data,
      select: { id: true, email: true, role: true, createdAt: true }
    });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'update_user', resource: 'user', resourceId: user.id, metadata: { changes: Object.keys(data) } });
    return ok(user);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    if (!isDatabaseConfigured()) return ok({ success: true, source: 'mock' });

    const user = await db.user.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!user) return notFound('User not found');
    if (user.id === session.userId) return validationError('Cannot delete yourself');

    await db.user.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'delete_user', resource: 'user', resourceId: params.id });
    return ok({ success: true });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}