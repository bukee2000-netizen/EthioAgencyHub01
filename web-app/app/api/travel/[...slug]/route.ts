import { handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      return ok({ module: 'travel', path, status: 'Travel sub-route scaffold' });
    }

    if (path.length === 0) {
      const travels = await db.travel.findMany({
        where: { employee: { agencyId: session.agencyId } },
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100
      });
      return ok(travels, { total: travels.length });
    }

    const [resource, id] = path;

    switch (resource) {
      case 'ticket': {
        if (!id) return notFound('Ticket ID required');
        const travel = await db.travel.findFirst({
          where: { id, employee: { agencyId: session.agencyId } }
        });
        if (!travel) return notFound('Travel record not found');
        return ok(travel);
      }
      case 'schedule': {
        const date = id;
        const startOfDay = date ? new Date(date) : new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const schedules = await db.travel.findMany({
          where: {
            departureAt: { gte: startOfDay, lte: endOfDay },
            employee: { agencyId: session.agencyId }
          },
          include: { employee: { select: { id: true, name: true, passportNumber: true } } },
          orderBy: { departureAt: 'asc' }
        });
        return ok(schedules);
      }
      case 'today': {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayTravels = await db.travel.findMany({
          where: {
            departureAt: { gte: today, lt: tomorrow },
            employee: { agencyId: session.agencyId }
          },
          include: { employee: true },
          orderBy: { departureAt: 'asc' }
        });
        return ok(todayTravels);
      }
      case 'departure': {
        const departures = await db.travel.findMany({
          where: {
            status: { in: ['SCHEDULED', 'TICKETED', 'READY'] },
            employee: { agencyId: session.agencyId }
          },
          include: { employee: true },
          orderBy: { departureAt: 'asc' },
          take: 50
        });
        return ok(departures);
      }
      case 'arrival': {
        const arrivals = await db.travel.findMany({
          where: {
            status: 'ARRIVED',
            employee: { agencyId: session.agencyId }
          },
          include: { employee: true },
          orderBy: { updatedAt: 'desc' },
          take: 50
        });
        return ok(arrivals);
      }
      default:
        return notFound(`Unknown travel sub-route: ${resource}`);
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];
    const body = await req.json();

    if (!isDatabaseConfigured()) {
      return ok({ path, ...body, source: 'mock' });
    }

    const [resource] = path;

    switch (resource) {
      case 'schedule': {
        const { employeeId, flightNumber, airline, departureAt, arrivalAt, origin, destination, terminal, class: travelClass, gate, boardingGroup } = body;
        const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
        if (!employee) return notFound('Employee not found');

        const existing = await db.travel.findFirst({ where: { employeeId } });
        const travel = await db.travel.upsert({
          where: { id: existing?.id ?? 'none' },
          create: {
            employeeId,
            flightNumber,
            airline,
            departureAt: new Date(departureAt),
            arrivalTime: arrivalAt ? new Date(arrivalAt).toISOString() : undefined,
            origin,
            destination,
            terminal,
            class: travelClass,
            gate,
            boardingGroup,
            status: 'TICKETED'
          },
          update: {
            flightNumber,
            airline,
            departureAt: new Date(departureAt),
            arrivalTime: arrivalAt ? new Date(arrivalAt).toISOString() : undefined,
            origin,
            destination,
            terminal,
            class: travelClass,
            gate,
            boardingGroup,
            status: 'TICKETED'
          }
        });

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'schedule_create',
          resource: 'travel',
          resourceId: travel.id,
          metadata: { flightNumber, airline, destination }
        });

        return ok(travel);
      }
      default:
        return validationError(`Unknown POST resource: ${resource}`);
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
