import { ok, serverError, notFound } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({
        id: params.id,
        name: 'Professional Template',
        layout: 'modern',
        sections: ['header', 'summary', 'experience', 'education', 'skills'],
        source: 'mock'
      });
    }

    const template = await db.cVTemplate.findUnique({
      where: { id: params.id }
    });

    if (!template) return notFound('Template not found');

    return ok(template);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
