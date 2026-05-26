import { getTelegramFileUrl } from '@/lib/telegram/bot';
import { handleAuthError, notFound, serverError } from '@/lib/api/responses';
import { requireSession } from '@/lib/auth/session';

export async function GET(_: Request, { params }: { params: { fileId: string } }) {
  try {
    const session = requireSession();

    const fileUrl = await getTelegramFileUrl(params.fileId);

    if (!fileUrl) {
      return notFound('Photo not found.');
    }

    const response = await fetch(fileUrl, { cache: 'no-store' });

    if (!response.ok || !response.body) {
      return serverError('Telegram photo could not be retrieved.');
    }

    const contentType = response.headers.get('Content-Type') ?? 'image/jpeg';

    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=300'
      }
    });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    const message = error instanceof Error ? error.message : 'Telegram photo retrieval failed.';
    return serverError(message);
  }
}
