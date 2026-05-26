import { NextResponse } from 'next/server';
import { handleAuthError, created, ok, serverError } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

// GET /api/travel/departure - Get arrival tracking info
export async function GET(req: Request) {
  try {
    requireSession();

    const { searchParams } = new URL(req.url);
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!isDatabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          arrivals: [
            { employee: 'Mekdes Tesfaye', flight: 'ET-412', destination: 'Saudi Arabia', arrivedAt: new Date().toISOString(), status: 'in-country' },
            { employee: 'Hana Bekele', flight: 'ET-602', destination: 'UAE', arrivedAt: new Date().toISOString(), status: 'in-country' }
          ],
          summary: { total: 2, inCountry: 2, issues: 0 }
        },
        source: 'mock'
      });
    }

    const since = new Date();
    since.setDate(since.getDate() - daysBack);

    const arrivals = await db.travel.findMany({
      where: {
        status: { in: ['ARRIVED'] },
        updatedAt: { gte: since }
      },
      include: { employee: true },
      orderBy: { updatedAt: 'desc' },
      take: 100
    });

    return NextResponse.json({
      success: true,
      data: {
        arrivals: arrivals.map(a => ({
          id: a.id,
          employeeName: a.employee?.name || 'Unknown',
          employeeId: a.employeeId,
          flightNumber: a.flightNumber,
          destination: a.destination,
          origin: a.origin,
          arrivedAt: a.updatedAt.toISOString(),
          status: a.status,
          transitStatus: a.transitStatus,
          localAgentName: a.localAgentName
        })),
        summary: {
          total: arrivals.length,
          inCountry: arrivals.filter(a => a.status === 'ARRIVED').length,
          issues: arrivals.filter(a => a.transitStatus && JSON.stringify(a.transitStatus).includes('crisis')).length
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

// PATCH /api/travel/arrival - Confirm arrival
export async function PATCH(req: Request) {
  try {
    const session = requireSession();
    const { travelId, notes } = await req.json();

    if (!travelId) {
      return NextResponse.json(
        { success: false, error: 'Missing travelId' },
        { status: 400 }
      );
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ success: true, id: travelId, status: 'ARRIVED', source: 'mock' });
    }

    const updated = await db.travel.update({
      where: { id: travelId },
      data: {
        status: 'ARRIVED',
        transitStatus: { inCountry: 'confirmed', notes: notes || '' }
      }
    });

    return ok(updated);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}