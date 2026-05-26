import { Prisma } from '@prisma/client';
import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const employeeStatsSchema = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);

    if (!isDatabaseConfigured()) {
      return ok({
        total: 45,
        byStatus: { REGISTERED: 20, DOCUMENT_REVIEW: 10, MOLS_PENDING: 5, INTERVIEW_UPLOADED: 5, TRAVEL_READY: 3, DEPLOYED: 2 },
        byDestination: { 'Saudi Arabia': 25, 'UAE': 12, 'Qatar': 5, 'Kuwait': 3 },
        byRole: { Nurse: 20, Engineer: 10, Teacher: 8, Other: 7 },
        source: 'mock'
      });
    }

    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    const where: Prisma.EmployeeWhereInput = {
      agencyId: session.agencyId,
      ...(fromDate || toDate ? {
        createdAt: {
          ...(fromDate ? { gte: new Date(fromDate) } : {}),
          ...(toDate ? { lte: new Date(toDate) } : {}),
        }
      } : {}),
    };

    const [byStatus, byDestination, total, byRole] = await Promise.all([
      db.employee.groupBy({ by: ['status'], where, _count: true }),
      db.employee.groupBy({ by: ['destination'], where, _count: true }),
      db.employee.count({ where }),
      db.employee.groupBy({ by: ['role'], where, _count: true }),
    ]);

    return ok({
      total,
      byStatus: Object.fromEntries(byStatus.map((g: any) => [g.status, g._count])),
      byDestination: Object.fromEntries(byDestination.map((g: any) => [g.destination, g._count])),
      byRole: Object.fromEntries(byRole.map((g: any) => [g.role || 'Unknown', g._count])),
    });
  } catch (error) {
    const authRes = () => null;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}