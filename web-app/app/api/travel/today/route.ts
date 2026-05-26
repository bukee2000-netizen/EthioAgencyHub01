import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { TravelStatus } from '@prisma/client';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({
        today: { departures: 0, arrivals: 0, statuses: {} },
        upcoming: [],
        recent: [],
        source: 'mock'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayDepartures, recentTravels, statusCounts] = await Promise.all([
      db.travel.count({
        where: {
          employee: { agencyId: session.agencyId },
          departureAt: { gte: today, lt: tomorrow },
          status: 'DEPARTED'
        }
      }),
      db.travel.findMany({
        where: { employee: { agencyId: session.agencyId } },
        orderBy: { departureAt: 'desc' },
        take: 10,
        include: { employee: { select: { name: true, passportNumber: true } } }
      }),
      db.travel.groupBy({
        by: ['status'],
        where: { employee: { agencyId: session.agencyId } },
        _count: true
      })
    ]);

    const upcoming = await db.travel.findMany({
      where: {
        employee: { agencyId: session.agencyId },
        departureAt: { gte: tomorrow },
        status: { in: ['SCHEDULED', 'TICKETED', 'READY'] as TravelStatus[] }
      },
      orderBy: { departureAt: 'asc' },
      take: 20
    });

    return ok({
      today: {
        departures: todayDepartures,
        upcoming: upcoming.length,
        statuses: Object.fromEntries(statusCounts.map((s: any) => [s.status, s._count]))
      },
      upcoming: upcoming.map((t: any) => ({
        id: t.id,
        employeeName: t.employee?.name,
        destination: t.destination,
        departureAt: t.departureAt,
        status: t.status,
        flightNumber: t.flightNumber
      })),
      recent: recentTravels.map((t: any) => ({
        id: t.id,
        employeeName: t.employee?.name,
        destination: t.destination,
        departureAt: t.departureAt,
        status: t.status,
        passportNumber: t.employee?.passportNumber
      })),
      total: statusCounts.reduce((sum: number, s: any) => sum + s._count, 0)
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}