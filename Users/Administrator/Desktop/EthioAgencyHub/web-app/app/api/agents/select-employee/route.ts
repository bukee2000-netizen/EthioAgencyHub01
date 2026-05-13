import { NextResponse } from 'next/server';
import { handleAuthError, ok, serverError, forbidden, notFound, validationError } from '@/lib/api/responses';
import { requireRole, getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { z } from 'zod';
import { writeAuditLog } from '@/lib/audit/log';

const selectSchema = z.object({
  employeeId: z.string().min(1),
  agentId: z.string().min(1)
});

export async function POST(req: Request) {
  try {
    const session = getSession();
    if (!session) {
      return forbidden('Authentication required');
    }

    if (session.role !== 'AGENT' && session.role !== 'AGENCY_ADMIN') {
      return forbidden('Only agents can select employees');
    }

    if (!isDatabaseConfigured()) {
      return validationError('Database not configured');
    }

    const body = await req.json();
    const parsed = selectSchema.safeParse(body);

    if (!parsed.success) {
      return validationError('Invalid payload', parsed.error.flatten());
    }

    const { employeeId, agentId } = parsed.data;

    const employee = await db.employee.findFirst({
      where: { id: employeeId, agencyId: session.agencyId }
    });

    if (!employee) {
      return notFound('Employee not found');
    }

    if (employee.selectedByAgent && employee.selectedByAgent !== agentId) {
      return forbidden('This employee has already been selected by another agent');
    }

    if (employee.selectedByAgent === agentId) {
      return ok({ message: 'Employee already selected by you', employee });
    }

    const updated = await db.employee.update({
      where: { id: employeeId },
      data: {
        selectedByAgent: agentId,
        selectedAt: new Date()
      }
    });

    await writeAuditLog({
      agencyId: session.agencyId,
      actorId: session.userId,
      action: 'select_employee',
      resource: 'employee',
      resourceId: employeeId,
      metadata: { agentId, employeeName: employee.name }
    });

    return ok({ 
      message: 'Employee selected successfully',
      employee: updated 
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return serverError('Database unavailable.');
    }
    if (error instanceof Error && error.message.includes('already been selected')) {
      return forbidden(error.message);
    }
    return serverError();
  }
}

export async function GET(req: Request) {
  try {
    const session = getSession();
    if (!session) {
      return forbidden('Authentication required');
    }

    const { searchParams } = new URL(req.url);
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return validationError('Agent ID required');
    }

    if (!isDatabaseConfigured()) {
      return ok({ employees: [], selectedCount: 0 });
    }

    const employees = await db.employee.findMany({
      where: { 
        agencyId: session.agencyId,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { documents: true, travels: true }
        }
      }
    });

    const mySelections = employees.filter(e => e.selectedByAgent === agentId);
    
    return ok({
      employees,
      selectedCount: mySelections.length,
      mySelections: mySelections.map(e => e.id)
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}