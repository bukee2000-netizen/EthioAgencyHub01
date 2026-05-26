import { Prisma } from '@prisma/client';
import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get('employeeId');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock' });
    }

    const where: Prisma.DocumentWhereInput = {
      employee: { agencyId: session.agencyId },
      ...(employeeId ? { employeeId } : {}),
    };

    const reports = await db.document.findMany({
      where,
      include: { employee: { select: { id: true, name: true, role: true, destination: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return ok(reports, { total: reports.length });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}