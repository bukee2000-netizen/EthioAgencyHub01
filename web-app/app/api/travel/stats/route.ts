import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date');

    if (!isDatabaseConfigured()) {
      return ok({ schedule: [], stats: { total: 0, byDestination: {} }, source: 'mock' });
    }

    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const travels = await db.travel.findMany({
      where: {
        employee: { agencyId: session.agencyId },
        departureAt: { gte: startOfDay, lte: endOfDay }
      },
      include: {
        employee: {
          select: { id: true, name: true, passportNumber: true, contactPhone: true, destination: true }
        }
      },
      orderBy: { departureAt: 'asc' }
    });

    const departureStats = await db.travel.groupBy({
      by: ['destination'],
      where: {
        employee: { agencyId: session.agencyId },
        departureAt: { gte: startOfDay, lte: endOfDay }
      },
      _count: true
    });

    return ok({
      schedule: travels.map((t: any) => ({
        id: t.id,
        employeeId: t.employeeId,
        employeeName: t.employee?.name || 'Unknown',
        passportNumber: t.employee?.passportNumber,
        phone: t.employee?.contactPhone,
        destination: t.destination,
        departureAt: t.departureAt,
        departureTime: t.departureTime,
        arrivalTime: t.arrivalTime,
        flightNumber: t.flightNumber,
        airline: t.airline,
        terminal: t.terminal,
        class: t.class,
        status: t.status
      })),
      stats: {
        total: travels.length,
        byDestination: Object.fromEntries(departureStats.map((d: any) => [d.destination, d._count]))
      }
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}