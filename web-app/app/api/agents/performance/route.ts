import { handleAuthError, notFound, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-perf-1', period: '2026-Q1', employees: 12, deployed: 10, successRate: 92, source: 'mock' },
        { id: 'mock-perf-2', period: '2026-Q2', employees: 15, deployed: 13, successRate: 87, source: 'mock' },
      ], { source: 'mock' });
    }

    const agent = await db.agent.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!agent) return notFound('Agent not found');

    const employees = await db.employee.findMany({
      where: { selectedByAgent: params.id },
      select: { id: true, status: true, createdAt: true, updatedAt: true }
    });

    const groupedByMonth: Record<string, { total: number; deployed: number; archived: number }> = {};
    employees.forEach(emp => {
      const month = new Date(emp.createdAt).toISOString().slice(0, 7);
      if (!groupedByMonth[month]) groupedByMonth[month] = { total: 0, deployed: 0, archived: 0 };
      groupedByMonth[month].total++;
      if (emp.status === 'DEPLOYED') groupedByMonth[month].deployed++;
      if (emp.status === 'ARCHIVED') groupedByMonth[month].archived++;
    });

    const performance = Object.entries(groupedByMonth).map(([period, data]) => ({
      id: `perf-${period}`,
      period,
      employees: data.total,
      deployed: data.deployed,
      archived: data.archived,
      successRate: data.total > 0 ? Math.round((data.deployed / data.total) * 100) : 0
    }));

    return ok(performance);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}