import { handleAuthError, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok({
        totalEmployees: 0,
        totalDocuments: 0,
        verifiedDocuments: 0,
        deployedTravel: 0,
        scheduledTravel: 0,
        pendingReview: 0,
        statusBreakdown: [],
        typeBreakdown: [],
        employees: { total: 0, byStatus: {}, byDestination: {} },
        documents: { total: 0, byType: {}, verified: 0 },
        travel: { scheduled: 0, departed: 0 },
        pilgrims: { total: 0 },
        agents: { total: 0, active: 0 },
        source: 'mock'
      });
    }

    const [empCount, docCount, travelCount, pilgrimCount, agentCount] = await Promise.all([
      db.employee.count({ where: { agencyId: session.agencyId } }),
      db.document.count({ where: { employee: { agencyId: session.agencyId } } }),
      db.travel.count({ where: { employee: { agencyId: session.agencyId } } }),
      db.pilgrim.count({ where: { agencyId: session.agencyId } }),
      db.agent.count({ where: { agencyId: session.agencyId } })
    ]);

    const [empByStatus, docByType, travelScheduled, travelDeparted, docVerified, activeAgents] = await Promise.all([
      db.employee.groupBy({ by: ['status'], where: { agencyId: session.agencyId }, _count: true }),
      db.document.groupBy({ by: ['type'], where: { employee: { agencyId: session.agencyId } }, _count: true }),
      db.travel.count({ where: { employee: { agencyId: session.agencyId }, status: 'SCHEDULED' } }),
      db.travel.count({ where: { employee: { agencyId: session.agencyId }, status: 'DEPARTED' } }),
      db.document.count({ where: { employee: { agencyId: session.agencyId }, status: 'VERIFIED' } }),
      db.agent.count({ where: { agencyId: session.agencyId, active: true } })
    ]);

    const statusBreakdown = empByStatus.map((g) => ({ status: g.status, count: g._count }));
    const typeBreakdown = docByType.map((g) => ({ type: g.type, count: g._count }));

    return ok({
      totalEmployees: empCount,
      totalDocuments: docCount,
      verifiedDocuments: docVerified,
      deployedTravel: travelDeparted,
      scheduledTravel: travelScheduled,
      pendingReview: empCount - travelDeparted,
      statusBreakdown,
      typeBreakdown,
      employees: {
        total: empCount,
        byStatus: Object.fromEntries(empByStatus.map((g) => [g.status, g._count]))
      },
      documents: {
        total: docCount,
        byType: Object.fromEntries(docByType.map((g) => [g.type, g._count])),
        verified: docVerified
      },
      travel: { scheduled: travelScheduled, departed: travelDeparted },
      pilgrims: { total: pilgrimCount },
      agents: { total: agentCount, active: activeAgents }
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
