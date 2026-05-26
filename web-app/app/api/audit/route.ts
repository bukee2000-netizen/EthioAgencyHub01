import { handleAuthError, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const { searchParams } = new URL(req.url);
    const take = Math.min(Number(searchParams.get('limit') ?? 100), 500);
    const resource = searchParams.get('resource') ?? undefined;

    const data = await db.auditLog.findMany({
      where: { agencyId: session.agencyId, ...(resource ? { resource } : {}) },
      orderBy: { createdAt: 'desc' },
      take
    });
    return ok(data, { total: data.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
