import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const travels = await db.travel.findMany({
      where: { employee: { agencyId: session.agencyId } },
      include: {
        employee: { select: { id: true, name: true, destination: true } }
      },
      orderBy: { departureAt: 'desc' }
    });

    const financials = travels.map(t => ({
      id: t.id,
      employeeName: t.employee?.name || 'Unknown',
      employeeId: t.employeeId,
      destination: t.destination,
      departureAt: t.departureAt,
      ticketCost: t.ticketCost || 0,
      currency: t.currency || 'ETB',
      paymentStatus: t.paymentStatus || 'pending',
      totalCost: t.ticketCost || 0
    }));

    return ok(financials, { total: financials.length });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}