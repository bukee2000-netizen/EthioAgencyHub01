import { ok, serverError, handleAuthError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET(req: Request) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';
    const role = url.searchParams.get('role') || '';
    const destination = url.searchParams.get('destination') || '';
    const status = url.searchParams.get('status') || '';
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!isDatabaseConfigured()) {
      return ok([], { source: 'mock', total: 0 });
    }

    const where: any = { employee: { agencyId: session.agencyId } };

    if (q) {
      where.employee.OR = [
        { firstName: { contains: q } },
        { lastName: { contains: q } },
        { name: { contains: q } },
        { passportNumber: { contains: q } },
      ];
    }
    if (role) where.employee.role = { contains: role };
    if (destination) where.employee.destination = { contains: destination };
    if (status) where.employee.status = status;

    const [cvs, total] = await Promise.all([
      db.generatedCv.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true, firstName: true, lastName: true, name: true,
              role: true, jobRole: true, destination: true, country: true,
              status: true, education: true, experience: true,
              languages: true, additionalSkills: true,
              passportSizePhotoPath: true, fullBodyPhotoPath: true,
              createdAt: true, contactPhone: true, email: true,
              nationality: true, gender: true, dateOfBirth: true, region: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      db.generatedCv.count({ where })
    ]);

    return ok(cvs, { total, offset, limit });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}
