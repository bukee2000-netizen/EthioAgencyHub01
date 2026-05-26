import { Prisma } from '@prisma/client';
import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { z } from 'zod';

const exportSchema = z.object({
  type: z.enum(['employees', 'documents', 'financial', 'travel']),
  format: z.enum(['csv', 'pdf']).default('csv'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  agencyId: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = exportSchema.safeParse(body);

    if (!parsed.success) return validationError('Invalid export payload', parsed.error.flatten());

    const { type, format, dateFrom, dateTo } = parsed.data;

    if (!isDatabaseConfigured()) {
      return ok({
        exportId: 'export-' + Date.now(),
        type,
        format,
        records: 0,
        status: 'ready',
        downloadUrl: '/api/export/download/' + Date.now(),
        source: 'mock'
      });
    }

    let records: unknown[] = [];

    switch (type) {
      case 'employees':
        records = await db.employee.findMany({ where: { agencyId: session.agencyId } });
        break;
      case 'documents':
        records = await db.document.findMany({ where: { employee: { agencyId: session.agencyId } } });
        break;
      case 'financial':
        records = await db.paymentWebhook.findMany({});
        break;
      case 'travel':
        records = await db.travel.findMany({ where: { employee: { agencyId: session.agencyId } } });
        break;
    }

    return ok({
      exportId: 'export-' + Date.now(),
      type,
      format,
      records: records.length,
      status: 'ready',
      source: 'mock'
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
