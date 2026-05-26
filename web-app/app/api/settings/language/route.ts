import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({
        languages: [
          { code: 'en', name: 'English' },
          { code: 'am', name: 'Amharic' },
          { code: 'om', name: 'Oromo' },
          { code: 'ar', name: 'Arabic' }
        ],
        default: 'en',
        source: 'mock'
      });
    }

    const settings = await db.systemSetting.findMany({
      where: { agencyId: session.agencyId }
    });

    return ok(settings);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ ...body, source: 'mock' });
    }

    return ok(body);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
