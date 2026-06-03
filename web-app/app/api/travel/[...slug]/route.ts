import { Prisma, TravelStatus } from '@prisma/client';
import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { travelCreateSchema, travelUpdateSchema } from '@/lib/validations/travel.schema';
import { writeAuditLog } from '@/lib/audit/log';
import { notifyTravelReady } from '@/lib/whatsapp/notifications';

const bookingSchema = z.object({
  employeeId: z.string().min(1),
  destination: z.string().min(1),
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  class: z.enum(['economy', 'business', 'first']),
  departureDate: z.string().min(1),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  origin: z.string().min(1),
  terminal: z.string().optional(),
  ticketCost: z.number().min(0),
  currency: z.string().min(1),
  bookingReference: z.string().optional(),
  paymentMethod: z.enum(['telebirr', 'cbe', 'awash', 'card']).optional(),
  notes: z.string().optional(),
});

const bookingUpdateSchema = z.object({
  id: z.string().optional(),
  status: z.enum(['booked', 'issued', 'cancelled', 'used']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  ticketNumber: z.string().optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

const SUB_RESOURCES = new Set(['ticket', 'schedule', 'today', 'departure', 'arrival', 'booking', 'stats']);

function isUUID(s: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export async function GET(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];

    if (!isDatabaseConfigured()) {
      if (path.length === 0) return ok([], { source: 'mock' });
      return ok({ module: 'travel', path, status: 'scaffold' });
    }

    // Base path: list all travels
    if (path.length === 0) {
      const data = await db.travel.findMany({
        where: { employee: { agencyId: session.agencyId } },
        orderBy: { departureAt: 'asc' },
        take: 100,
      });
      return ok(data, { total: data.length });
    }

    const [first, ...rest] = path;

    // If first segment looks like a UUID, treat it as a travel ID
    if (!SUB_RESOURCES.has(first) && isUUID(first)) {
      const travel = await db.travel.findFirst({
        where: { id: first, employee: { agencyId: session.agencyId } },
      });
      if (!travel) return notFound('Travel record not found');
      return ok(travel);
    }

    const id = rest[0];

    switch (first) {
      case 'ticket': {
        if (!id) return notFound('Ticket ID required');
        const travel = await db.travel.findFirst({
          where: { id, employee: { agencyId: session.agencyId } },
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
            employee: { agencyId: session.agencyId },
          },
          include: { employee: { select: { id: true, name: true, passportNumber: true } } },
          orderBy: { departureAt: 'asc' },
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
            employee: { agencyId: session.agencyId },
          },
          include: { employee: true },
          orderBy: { departureAt: 'asc' },
        });
        return ok(todayTravels);
      }
      case 'departure': {
        const departures = await db.travel.findMany({
          where: {
            status: { in: ['SCHEDULED', 'TICKETED', 'READY'] },
            employee: { agencyId: session.agencyId },
          },
          include: { employee: true },
          orderBy: { departureAt: 'asc' },
          take: 50,
        });
        return ok(departures);
      }
      case 'arrival': {
        const arrivals = await db.travel.findMany({
          where: {
            status: 'ARRIVED',
            employee: { agencyId: session.agencyId },
          },
          include: { employee: true },
          orderBy: { updatedAt: 'desc' },
          take: 50,
        });
        return ok(arrivals);
      }
      case 'booking': {
        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get('employeeId');
        const status = searchParams.get('status');

        const where: any = { employee: { agencyId: session.agencyId }, status: 'TICKETED' };
        if (employeeId) where.employeeId = employeeId;
        if (status) where.status = status;

        const bookings = await db.travel.findMany({
          where,
          include: { employee: { select: { id: true, name: true, passportNumber: true, contactPhone: true } } },
          orderBy: { createdAt: 'desc' },
          take: 100,
        });

        const mappedBookings = bookings.map((b: any) => ({
          id: b.id,
          employeeId: b.employeeId,
          employee: b.employee,
          destination: b.destination,
          airline: b.airline || '',
          flightNumber: b.flightNumber || '',
          class: b.class || 'economy',
          departureDate: b.departureAt ? new Date(b.departureAt).toISOString().split('T')[0] : '',
          departureTime: b.departureTime || '',
          arrivalTime: b.arrivalTime || '',
          origin: b.origin || '',
          terminal: b.terminal || '',
          ticketCost: b.ticketCost || 0,
          currency: b.currency || 'ETB',
          paymentStatus: b.paymentStatus || 'pending',
          bookingReference: b.bookingReference || '',
          ticket: b.ticket || '',
          status: b.status,
        }));

        return ok(mappedBookings, { total: mappedBookings.length });
      }
      case 'stats': {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get('date');
        const targetDate = dateStr ? new Date(dateStr) : new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const travels = await db.travel.findMany({
          where: {
            employee: { agencyId: session.agencyId },
            departureAt: { gte: startOfDay, lte: endOfDay },
          },
          include: {
            employee: { select: { id: true, name: true, passportNumber: true, contactPhone: true, destination: true } },
          },
          orderBy: { departureAt: 'asc' },
        });

        const departureStats = await db.travel.groupBy({
          by: ['destination'],
          where: {
            employee: { agencyId: session.agencyId },
            departureAt: { gte: startOfDay, lte: endOfDay },
          },
          _count: true,
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
            status: t.status,
          })),
          stats: {
            total: travels.length,
            byDestination: Object.fromEntries(departureStats.map((d: any) => [d.destination, d._count])),
          },
        });
      }
      default:
        return notFound(`Unknown travel sub-route: ${first}`);
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
      return created({ path, ...body, source: 'mock' });
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
            status: 'TICKETED',
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
            status: 'TICKETED',
          },
        });

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'schedule_create',
          resource: 'travel',
          resourceId: travel.id,
          metadata: { flightNumber, airline, destination },
        });

        return ok(travel);
      }
      case 'booking': {
        const parsed = bookingSchema.safeParse(body);
        if (!parsed.success) return validationError('Invalid booking payload', parsed.error.flatten());

        const { employeeId, destination, airline, flightNumber, class: travelClass, departureDate, departureTime, arrivalTime, origin, terminal, ticketCost, currency, bookingReference, notes } = parsed.data;

        const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
        if (!employee) return notFound('Employee not found');

        const travel = await db.travel.create({
          data: {
            employeeId,
            destination,
            departureAt: new Date(departureDate),
            airline,
            flightNumber,
            departureTime,
            arrivalTime,
            origin,
            terminal,
            class: travelClass,
            ticketCost,
            currency,
            paymentStatus: 'pending',
            bookingReference,
            status: 'TICKETED',
            ticket: `${airline}-${flightNumber}`,
          },
        });

        if (employee.contactPhone) {
          notifyTravelReady({
            name: employee.name || '',
            phone: employee.contactPhone,
            employeeId: employee.id,
            destination,
            departureDate,
            groupName: employee.name,
          }).catch(err => console.error('[WhatsApp] Travel booking notification failed:', err));
        }

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'booking_create',
          resource: 'travel',
          resourceId: travel.id,
          metadata: { flightNumber, airline, destination, cost: ticketCost },
        });

        return created(travel);
      }
      default: {
        // Base path POST: create travel
        const parsed = travelCreateSchema.safeParse(body);
        if (!parsed.success) return validationError('Invalid travel payload', parsed.error.flatten());

        const employee = await db.employee.findFirst({ where: { id: parsed.data.employeeId, agencyId: session.agencyId } });
        if (!employee) return notFound('Employee not found for this agency');

        const travel = await db.travel.create({ data: parsed.data });

        if ((parsed.data.status === 'READY' || parsed.data.status === 'TICKETED') && employee.contactPhone) {
          notifyTravelReady({
            name: employee.name || '',
            phone: employee.contactPhone,
            employeeId: employee.id,
            destination: parsed.data.destination,
            departureDate: parsed.data.departureAt?.toISOString() || '',
            groupName: employee.name,
          }).catch(err => console.error('[WhatsApp] Travel notification failed:', err));
        }

        await writeAuditLog({
          agencyId: session.agencyId,
          actorId: session.userId,
          action: 'create',
          resource: 'travel',
          resourceId: travel.id,
          metadata: { destination: travel.destination },
        });
        return created(travel);
      }
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PUT(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const path = params.slug ?? [];
    if (path.length !== 1 || SUB_RESOURCES.has(path[0])) {
      return notFound('Invalid travel update path.');
    }

    const id = path[0];
    const body = await req.json();
    const parsed = travelUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid update payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok({ id, ...parsed.data, source: 'mock' });
    }

    const existing = await db.travel.findFirst({ where: { id, employee: { agencyId: session.agencyId } } });
    if (!existing) return notFound('Travel record not found');

    const travel = await db.travel.update({ where: { id }, data: parsed.data });
    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'update',
      resource: 'travel',
      resourceId: travel.id,
    });
    return ok(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request, { params }: { params: { slug?: string[] } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const path = params.slug ?? [];
    const body = await req.json();
    const parsed = bookingUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid booking update payload', parsed.error.flatten());

    const [resource] = path;

    if (resource === 'booking') {
      const id = parsed.data.id || new URL(req.url).searchParams.get('id');
      if (!id) return notFound('Booking ID required');

      const existing = await db.travel.findFirst({ where: { id }, include: { employee: true } });
      if (!existing || existing.employee?.agencyId !== session.agencyId) return notFound('Booking not found');

      const { status, paymentStatus, ticketNumber, paymentReference } = parsed.data;
      const update: Prisma.TravelUpdateInput = {};
      if (status) update.status = status as TravelStatus;
      if (paymentStatus) update.paymentStatus = paymentStatus;
      if (ticketNumber) update.ticket = ticketNumber;

      if (paymentStatus === 'paid' && existing.employee?.contactPhone) {
        notifyTravelReady({
          name: existing.employee?.name || '',
          phone: existing.employee?.contactPhone || '',
          employeeId: existing.employeeId,
          destination: existing.destination,
          departureDate: existing.departureAt?.toISOString() || '',
        }).catch(err => console.error('[WhatsApp] Payment confirmation failed:', err));
      }

      const updated = await db.travel.update({ where: { id }, data: update });

      await writeAuditLog({
        agencyId: session.agencyId,
        actorId: session.userId,
        action: 'booking_update',
        resource: 'travel',
        resourceId: id,
        metadata: { status, paymentStatus },
      });

      return ok(updated);
    }

    // PATCH /:id — partial travel update (same as PUT for simplicity)
    if (path.length === 1 && !SUB_RESOURCES.has(path[0])) {
      const id = path[0];
      if (!isDatabaseConfigured()) return ok({ id, ...body, source: 'mock' });

      const existing = await db.travel.findFirst({ where: { id, employee: { agencyId: session.agencyId } } });
      if (!existing) return notFound('Travel record not found');

      const travel = await db.travel.update({ where: { id }, data: body });
      return ok(travel);
    }

    return validationError('Unknown PATCH resource');
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
