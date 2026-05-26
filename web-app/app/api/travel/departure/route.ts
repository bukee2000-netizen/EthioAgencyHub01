import { NextResponse } from 'next/server';
import { handleAuthError, created, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';
import { z } from 'zod';

const departureSchema = z.object({
  travelIds: z.array(z.string()).min(1),
  departureDate: z.string().min(1),
  notes: z.string().optional()
});

// GET /api/travel/departure - Get today's departure summary
export async function GET(req: Request) {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          departingToday: [
            { flight: 'ET-412', destination: 'Riyadh', ready: 12, total: 15, status: 'on-time' },
            { flight: 'ET-602', destination: 'Dubai', ready: 9, total: 12, status: 'delayed' }
          ],
          summary: { total: 21, ready: 21, notReady: 3, delayed: 1 }
        },
        source: 'mock'
      });
    }

    const departing = await db.travel.findMany({
      where: {
        departureAt: { gte: today, lt: tomorrow },
        status: { in: ['SCHEDULED', 'TICKETED', 'READY', 'DEPARTED'] }
      },
      include: { employee: true },
      orderBy: { departureAt: 'asc' }
    });

    const ready = departing.filter(t => t.status === 'READY' || t.status === 'DEPARTED').length;
    const notReady = departing.filter(t => t.status === 'SCHEDULED' || t.status === 'TICKETED').length;

    const flights = departing.reduce((acc: any[], t) => {
      const flight = acc.find(f => f.flight === t.flightNumber);
      if (flight) {
        flight.ready += t.status === 'READY' || t.status === 'DEPARTED' ? 1 : 0;
        flight.total += 1;
      } else {
        acc.push({
          flight: t.flightNumber || 'N/A',
          destination: t.destination,
          airline: t.airline,
          departureTime: t.departureTime,
          terminal: t.terminal,
          ready: t.status === 'READY' || t.status === 'DEPARTED' ? 1 : 0,
          total: 1,
          status: t.departureTime ? 'on-time' : 'pending'
        });
      }
      return acc;
    }, []);

    return NextResponse.json({
      success: true,
      data: {
        departingToday: flights,
        summary: {
          total: departing.length,
          ready,
          notReady,
          delayed: flights.filter(f => f.status === 'delayed').length
        }
      }
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

// POST /api/travel/departure - Mark travel as departed
export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { travelIds, departureDate, notes } = departureSchema.parse(await req.json());

    if (!isDatabaseConfigured()) {
      return created({ ids: travelIds, status: 'departed', source: 'mock' });
    }

    const updated = await db.$transaction(
      travelIds.map((id: string) =>
        db.travel.update({
          where: { id, employee: { agencyId: session.agencyId } },
          data: {
            status: 'DEPARTED',
            departureAt: departureDate ? new Date(departureDate) : new Date()
          }
        })
      )
    );

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'departure',
      resource: 'travel',
      metadata: { travelIds, notes }
    });

    return created({ ids: updated.map(t => t.id), status: 'departed' });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}