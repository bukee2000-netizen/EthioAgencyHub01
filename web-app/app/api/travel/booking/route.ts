import { Prisma, TravelStatus } from '@prisma/client';
import { z } from 'zod';
import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
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
  status: z.enum(['booked', 'issued', 'cancelled', 'used']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  ticketNumber: z.string().optional(),
  paymentReference: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: any = { travel: { employee: { agencyId: session.agencyId } } };
    if (employeeId) where.travelId = employeeId;
    if (status) where.status = status;

    const bookings = await db.travel.findMany({
      where: { employee: { agencyId: session.agencyId }, status: 'TICKETED' },
      include: { employee: { select: { id: true, name: true, passportNumber: true, contactPhone: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const mappedBookings = bookings.map(b => ({
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
      status: b.status
    }));

    return ok(mappedBookings, { total: mappedBookings.length });
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
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid booking payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), status: 'booked', source: 'mock' });
    }

    const { employeeId, destination, airline, flightNumber, class: travelClass, departureDate, departureTime, arrivalTime, origin, terminal, ticketCost, currency, bookingReference, paymentMethod, notes } = parsed.data;

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
        ticket: `${airline}-${flightNumber}`
      }
    });

    // Send WhatsApp notification
    if (employee.contactPhone) {
      notifyTravelReady({
        name: employee.name || '',
        phone: employee.contactPhone,
        employeeId: employee.id,
        destination,
        departureDate,
        groupName: employee.name
      }).catch(err => console.error('[WhatsApp] Travel booking notification failed:', err));
    }

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'booking_create',
      resource: 'travel',
      resourceId: travel.id,
      metadata: { flightNumber, airline, destination, cost: ticketCost }
    });

    return created(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = bookingUpdateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid booking update payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return ok({ id: body.id, ...parsed.data, source: 'mock' });
    }

    const { status, paymentStatus, ticketNumber, paymentReference, notes } = parsed.data;
    const id = new URL(req.url).searchParams.get('id');
    if (!id) return notFound('Booking ID required');

    const existing = await db.travel.findFirst({ where: { id }, include: { employee: true } });
    if (!existing || existing.employee?.agencyId !== session.agencyId) return notFound('Booking not found');

    const update: Prisma.TravelUpdateInput = {};
    if (status) update.status = status as TravelStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (ticketNumber) update.ticket = ticketNumber;

    // Handle payment webhook events
    if (paymentStatus === 'paid') {
      update.paymentStatus = 'paid';
      if (existing.employee?.contactPhone) {
        notifyTravelReady({
          name: existing.employee?.name || '',
          phone: existing.employee?.contactPhone || '',
          employeeId: existing.employeeId,
          destination: existing.destination,
          departureDate: existing.departureAt?.toISOString() || '',
        }).catch(err => console.error('[WhatsApp] Payment confirmation failed:', err));
      }
    }

    const updated = await db.travel.update({ where: { id }, data: update });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'booking_update',
      resource: 'travel',
      resourceId: id,
      metadata: { status, paymentStatus }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}