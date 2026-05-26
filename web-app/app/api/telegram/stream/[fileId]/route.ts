import { getTelegramFileUrl } from '@/lib/telegram/bot';
import { handleAuthError, notFound, serverError } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured } from '@/lib/db/errors';

export async function GET(_: Request, { params }: { params: { fileId: string } }) {
  try {
    const session = requireSession();

    if (isDatabaseConfigured()) {
      const employee = await db.employee.findFirst({
        where: { tgVideoId: params.fileId, agencyId: session.agencyId }
      });
      if (!employee) {
        return notFound('Video not found for this agency.');
      }
    }

    const fileUrl = await getTelegramFileUrl(params.fileId);
    const response = await fetch(fileUrl, { cache: 'no-store' });

    if (!response.ok || !response.body) {
      return serverError('Telegram video stream could not be opened.');
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'video/mp4',
        'Cache-Control': 'private, max-age=300'
      }
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    const message = error instanceof Error ? error.message : 'Telegram video stream failed.';
    return serverError(message);
  }
}
