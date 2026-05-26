import { ok, serverError, unauthorized } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { generateTOTPSecret, generateOTPAuthURL, generateBackupCodes, hashBackupCodes } from '@/lib/mfa/totp';

export async function POST() {
  try {
    const session = requireSession();
    if (!session) return unauthorized();

    const user = await db.user.findUnique({ where: { id: session.userId }, select: { email: true } });
    if (!user) return unauthorized('User not found');

    const secret = generateTOTPSecret();
    const codes = generateBackupCodes(8);
    const hashedCodes = hashBackupCodes(codes);

    await db.user.update({
      where: { id: session.userId },
      data: { totpSecret: secret, backupCodes: hashedCodes, twoFactorEnabled: false },
    });

    const otpauth = generateOTPAuthURL(secret, user.email);

    return ok({
      secret,
      otpauth,
      qrcode: otpauth,
      backupCodes: codes,
    });
  } catch (error) {
    return serverError();
  }
}
