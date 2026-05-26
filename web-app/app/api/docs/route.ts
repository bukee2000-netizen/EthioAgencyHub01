import { ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';

export async function GET() {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    if (!isDatabaseConfigured()) {
      return ok({
        apiEndpoints: true,
        database: false,
        telegram: !!process.env.TELEGRAM_BOT_TOKEN,
        teledrive: !!process.env.UPLOAD_PATH,
        mols: !!(process.env.MOLS_API_URL && process.env.MOLS_API_KEY),
        whatsapp: !!process.env.WHATSAPP_API_TOKEN,
        source: 'mock'
      });
    }

    const [userCount, employeeCount, agencyCount, documentCount, travelCount] = await Promise.all([
      db.user.count(),
      db.employee.count(),
      db.agency.count(),
      db.document.count(),
      db.travel.count()
    ]);

    return ok({
      apiEndpoints: true,
      database: true,
      telegram: !!process.env.TELEGRAM_BOT_TOKEN,
      teledrive: !!process.env.UPLOAD_PATH,
      mols: !!(process.env.MOLS_API_URL && process.env.MOLS_API_KEY),
      stats: { users: userCount, employees: employeeCount, agencies: agencyCount, documents: documentCount, travels: travelCount }
    });
  } catch (error) {
    if (isDatabaseConnectionError(error)) return serverError('Database unavailable.');
    return serverError();
  }
}