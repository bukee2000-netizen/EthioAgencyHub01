import { handleAuthError, ok, serverError, notFound } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function POST(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const { action, employeeId, data } = body;

    if (!action || !employeeId) {
      return new Response(JSON.stringify({ success: false, error: { message: 'Missing action or employeeId' } }), { status: 400 });
    }

    if (!isDatabaseConfigured()) {
      return ok({ bridged: true, action, employeeId, source: 'mock' });
    }

    const employee = await db.employee.findFirst({ where: { id: employeeId, agencyId: session.agencyId } });
    if (!employee) return notFound('Employee not found');

    switch (action) {
      // MOLS Approved → Auto-unlock Visa & Notify
      case 'mols_approved': {
        await db.molsRecord.updateMany({
          where: { employeeId },
          data: { visaUnlocked: true }
        });
        return ok({ message: `Visa unlocked for ${employee.name}. Ready for visa processing.` });
      }

      // Visa Approved → Notify Ticket Department
      case 'visa_approved': {
        await db.visaApplication.updateMany({
          where: { employeeId },
          data: { ticketNotified: true }
        });
        return ok({ message: `Ticket department notified: "Visa ready for ${employee.name}. You may now book the flight."` });
      }

      // Cross-Match Passed → Update employee readiness
      case 'cross_match_pass': {
        await db.employee.update({
          where: { id: employeeId },
          data: { status: 'TRAVEL_READY' }
        });
        return ok({ message: `${employee.name} cleared for travel. Status updated to TRAVEL_READY.` });
      }

      // Cross-Match Failed → Flag employee
      case 'cross_match_fail': {
        return ok({
          message: `Errors detected for ${employee.name}. Correct before proceeding.`,
          errors: data?.errors || []
        });
      }

      default:
        return new Response(JSON.stringify({ success: false, error: { message: `Unknown action: ${action}` } }), { status: 400 });
    }
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
