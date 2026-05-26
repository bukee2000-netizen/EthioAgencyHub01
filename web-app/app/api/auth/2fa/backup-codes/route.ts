import { ok, serverError, unauthorized } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { generateBackupCodes, hashBackupCodes } from '@/lib/mfa/totp';

export async function POST() {
  try {
    const session = requireSession();
    if (!session) return unauthorized();

    const codes = generateBackupCodes(8);
    const hashedCodes = hashBackupCodes(codes);

    await db.user.update({
      where: { id: session.userId },
      data: { backupCodes: hashedCodes },
    });

    return ok({ backupCodes: codes });
  } catch (error) {
    return serverError();
  }
}
