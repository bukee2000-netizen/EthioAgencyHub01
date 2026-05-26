import { ok, serverError, unauthorized } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const session = requireSession();
    if (!session) return unauthorized();

    await db.user.update({
      where: { id: session.userId },
      data: { twoFactorEnabled: false, totpSecret: null, backupCodes: null },
    });

    const cookieStore = cookies();
    cookieStore.delete('mfa_verified');

    return ok({ disabled: true });
  } catch (error) {
    return serverError();
  }
}
