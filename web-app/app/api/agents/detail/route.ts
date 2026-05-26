import { handleAuthError, notFound, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { EmployeeStatus } from '@prisma/client';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok({
        id: params.id,
        name: 'Mock Agent',
        phone: '+251911234567',
        active: true,
        employeesCount: 5,
        contractsCount: 3,
        performance: {
          totalEmployees: 5,
          activeEmployees: 4,
          deployedCount: 2,
          avgCompletionRate: 85,
          source: 'mock'
        },
        source: 'mock'
      });
    }

    const agent = await db.agent.findFirst({
      where: { id: params.id, agencyId: session.agencyId },
    });
    if (!agent) return notFound('Agent not found');

    const [employeesCount, activeEmployees, deployedCount] = await Promise.all([
      db.employee.count({ where: { selectedByAgent: params.id } }),
      db.employee.count({ where: { selectedByAgent: params.id, status: { not: 'ARCHIVED' as EmployeeStatus } } }),
      db.employee.count({ where: { selectedByAgent: params.id, status: 'DEPLOYED' as EmployeeStatus } }),
    ]);

    return ok({
      ...agent,
      employeesCount,
      activeEmployees,
      deployedCount,
      contractsCount: 0,
      performance: {
        totalEmployees: employeesCount,
        activeEmployees,
        deployedCount,
        avgCompletionRate: employeesCount > 0 ? Math.round((deployedCount / employeesCount) * 100) : 0
      }
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}