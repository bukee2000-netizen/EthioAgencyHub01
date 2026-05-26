import { ok, serverError, unauthorized } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';

export async function GET() {
  try {
    const session = requireSession();
    if (!session) return unauthorized();

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, role: true, twoFactorEnabled: true },
    });

    if (!user) return unauthorized('User not found');

    return ok(user);
  } catch (error) {
    return serverError();
  }
}
