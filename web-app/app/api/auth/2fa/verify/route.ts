import { ok, serverError, unauthorized, validationError } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { verifyTOTP, verifyBackupCode } from '@/lib/mfa/totp';
import { z } from 'zod';
import { cookies } from 'next/headers';

const verifySchema = z.object({
  token: z.string().min(1),
  type: z.enum(['totp', 'backup']).default('totp'),
});

export async function POST(req: Request) {
  try {
    const session = requireSession();
    if (!session) return unauthorized();

    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) return validationError('Invalid request', parsed.error.flatten());

    const user = await db.user.findUnique({ where: { id: session.userId } });
    if (!user?.totpSecret) return validationError('2FA not set up');

    let valid = false;

    if (parsed.data.type === 'totp') {
      valid = verifyTOTP(parsed.data.token, user.totpSecret);
      if (valid && !user.twoFactorEnabled) {
        await db.user.update({
          where: { id: session.userId },
          data: { twoFactorEnabled: true },
        });
      }
    } else {
      if (!user.backupCodes) return validationError('No backup codes available');
      const remaining = verifyBackupCode(parsed.data.token, user.backupCodes);
      if (remaining) {
        await db.user.update({
          where: { id: session.userId },
          data: { backupCodes: remaining },
        });
        valid = true;
      }
    }

    if (!valid) return validationError('Invalid verification code');

    const cookieStore = cookies();
    cookieStore.set('mfa_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    return ok({ verified: true });
  } catch (error) {
    return serverError();
  }
}
