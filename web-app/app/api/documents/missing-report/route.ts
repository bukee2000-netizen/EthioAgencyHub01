import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const missingReportSchema = z.object({
  employeeId: z.string().min(1),
  reason: z.string().min(10),
  reportedTo: z.string().optional()
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'report-1', employeeId: 'mock-1', reason: 'Employee not responding', reportedTo: 'MOLS', status: 'pending', source: 'mock' }
      ], { source: 'mock' });
    }

    const reports = await db.missingPersonReport.findMany({
      where: { agencyId: session.agencyId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return ok(reports);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = missingReportSchema.safeParse(body);

    if (!parsed.success) return validationError('Invalid report payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), status: 'reported', source: 'mock' });
    }

    const report = await db.missingPersonReport.create({
      data: {
        ...parsed.data,
        agencyId: session.agencyId
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'missing_report',
      resource: 'missing_person_report',
      resourceId: report.id,
      metadata: { employeeId: parsed.data.employeeId, reason: parsed.data.reason }
    });

    return created(report);
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
