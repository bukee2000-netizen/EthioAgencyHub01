import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

const scheduleSchema = z.object({
  employeeId: z.string().min(1),
  flightNumber: z.string().min(1),
  airline: z.string().min(1),
  departureAt: z.coerce.date(),
  arrivalAt: z.coerce.date().optional(),
  origin: z.string().min(1),
  destination: z.string().min(1),
  terminal: z.string().optional(),
  class: z.enum(['economy', 'business', 'first']).optional(),
  gate: z.string().optional(),
  boardingGroup: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const employeeId = searchParams.get('employeeId');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const dateFilter = date ? (() => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      return { gte: startOfDay, lte: endOfDay };
    })() : undefined;

    const where: Prisma.TravelWhereInput = {
      employee: { agencyId: session.agencyId },
      ...(dateFilter ? { departureAt: dateFilter } : {}),
      ...(employeeId ? { employeeId } : {}),
    };

    const schedules = await db.travel.findMany({
      where,
      orderBy: { departureAt: 'asc' },
      include: { employee: { select: { id: true, name: true, passportNumber: true } } }
    });

    return ok(schedules, { total: schedules.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = scheduleSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid schedule payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), source: 'mock' });
    }

    const { employeeId, flightNumber, airline, departureAt, arrivalAt, origin, destination, terminal, class: travelClass, gate, boardingGroup } = parsed.data;

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    const travel = await db.travel.update({
      where: { id: employeeId },
      data: {
        flightNumber,
        airline,
        departureAt,
        arrivalTime: arrivalAt?.toISOString(),
        origin,
        destination,
        terminal,
        class: travelClass,
        status: 'TICKETED',
        ticket: `${airline}-${flightNumber}`,
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

    return created(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}