import { handleAuthError, ok, serverError } from '@/lib/api/responses';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = getSession();
    if (!session) {
      return serverError('Authentication required');
    }

    if (!isDatabaseConfigured()) {
      return ok({ id: session.userId, name: 'Demo Agent' });
    }

    if (session.role !== 'AGENT') {
      return ok({ id: session.userId, name: 'Admin User', role: session.role });
    }

    const agent = await db.agent.findFirst({
      where: { id: session.userId }
    });

    return ok({
      id: agent?.id || session.userId,
      name: agent?.name || 'Agent',
      role: session.role
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}