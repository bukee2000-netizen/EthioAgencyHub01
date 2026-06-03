import { created, ok, serverError, unauthorized, validationError } from '@/lib/api/responses';
import { getPresignedUploadUrl, getPresignedDownloadUrl } from '@/lib/r2/presign';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (!key) return validationError('"key" query param is required.');
    const url = await getPresignedDownloadUrl(key);
    return ok({ url, key });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate presigned download URL.';
    return serverError(message);
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return unauthorized('Authentication required.');
    }

    const body = await req.json();
    const { action, key, contentType } = body;

    if (!key) {
      return validationError('"key" is required.');
    }

    if (action === 'upload') {
      if (!contentType) {
        return validationError('"contentType" is required for upload.');
      }
      const url = await getPresignedUploadUrl(key, contentType);
      return created({ url, key, action: 'upload' });
    }

    if (action === 'download') {
      const url = await getPresignedDownloadUrl(key);
      return created({ url, key, action: 'download' });
    }

    return validationError('"action" must be "upload" or "download".');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate presigned URL.';
    return serverError(message);
  }
}
