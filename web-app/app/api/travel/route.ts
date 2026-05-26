import { created, handleAuthError, notFound, ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { travelCreateSchema } from '@/lib/validations/travel.schema';
import { writeAuditLog } from '@/lib/audit/log';
import { notifyTravelReady } from '@/lib/whatsapp/notifications';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const data = await db.travel.findMany({
      where: { employee: { agencyId: session.agencyId } },
      orderBy: { departureAt: 'asc' },
      take: 100
    });
    return ok(data, { total: data.length });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const body = await req.json();
    const parsed = travelCreateSchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid travel payload', parsed.error.flatten());

    if (!isDatabaseConfigured()) {
      return created({ ...parsed.data, id: 'mock-' + Date.now(), status: 'SCHEDULED', source: 'mock' });
    }

const employee = await db.employee.findFirst({ where: { id: parsed.data.employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found for this agency');

    const travel = await db.travel.create({ data: parsed.data });

    // Send WhatsApp notification if travel is ready
    if ((parsed.data.status === 'READY' || parsed.data.status === 'TICKETED') && employee.contactPhone) {
      notifyTravelReady({
        name: employee.name || '',
        phone: employee.contactPhone,
        employeeId: employee.id,
        destination: parsed.data.destination,
        departureDate: parsed.data.departureAt?.toISOString() || '',
        groupName: employee.name
      }).catch(err => console.error('[WhatsApp] Travel notification failed:', err));
    }

    await writeAuditLog({ agencyId: session.agencyId, actorId: session.userId, action: 'create', resource: 'travel', resourceId: travel.id, metadata: { destination: travel.destination } });
    return created(travel);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
