import { created, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: Request) {
  const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);
   
  const formData = await req.formData();
  const file = formData.get('file');
  const prefixRaw = formData.get('prefix');

  if (!(file instanceof File)) {
    return validationError('A file field is required.');
  }

  if (file.size > MAX_FILE_SIZE) {
    return validationError(`File size exceeds maximum allowed size of 100MB.`);
  }

  const prefix = typeof prefixRaw === 'string' ? prefixRaw : 'uploads';
  const key = `${prefix}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  try {
    const { getPresignedUploadUrl } = await import('@/lib/r2/presign');
    const uploadUrl = await getPresignedUploadUrl(key, file.type);
    return created({ uploadUrl, key, fileName: file.name, fileType: file.type, fileSize: file.size });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'File upload failed.';
    return serverError(message);
  }
}
