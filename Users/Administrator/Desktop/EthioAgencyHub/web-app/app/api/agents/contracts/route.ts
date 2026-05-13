import { handleAuthError, notFound, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { writeAuditLog } from '@/lib/audit/log';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!isDatabaseConfigured()) {
      return ok([
        { id: 'mock-contract-1', employeeName: 'John Doe', contractType: 'Standard', startDate: '2026-01-15', endDate: '2026-07-15', salary: 15000, status: 'active', source: 'mock' },
        { id: 'mock-contract-2', employeeName: 'Jane Smith', contractType: 'Premium', startDate: '2026-03-01', endDate: '2026-09-01', salary: 20000, status: 'pending', source: 'mock' },
      ]);
    }

    const agent = await db.agent.findFirst({ where: { id: params.id, agencyId: session.agencyId } });
    if (!agent) return notFound('Agent not found');

    const employees = await db.employee.findMany({
      where: { selectedByAgent: params.id },
      include: {
        travels: { take: 1, orderBy: { createdAt: 'desc' } },
        documents: { take: 1, orderBy: { createdAt: 'desc' } }
      }
    });

    const contracts = employees.map(emp => ({
      id: `contract-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      contractType: emp.role || 'Standard',
      startDate: emp.createdAt.toISOString().split('T')[0],
      endDate: emp.passportExpiryDate?.toISOString().split('T')[0] || 'N/A',
      salary: 0,
      status: emp.status === 'DEPLOYED' ? 'active' : emp.status === 'REGISTERED' ? 'pending' : 'inactive',
      destination: emp.destination || 'TBD',
      statusColor: emp.status === 'DEPLOYED' ? 'bg-green-100 text-green-700' : emp.status === 'REGISTERED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
    }));

    return ok(contracts);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}