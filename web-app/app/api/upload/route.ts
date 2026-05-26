import { created, serverError, validationError } from '@/lib/api/responses';
import { saveToTeledriveFolder } from '@/lib/teledrive/storage';
import { uploadShortVideoToTelegram } from '@/lib/telegram/bot';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  const folder = formData.get('folder');
  const caption = formData.get('caption');

  if (!(file instanceof File)) {
    return validationError('A file field is required.');
  }

  try {
    if (file.type.startsWith('video/')) {
      const telegramVideo = await uploadShortVideoToTelegram(file, typeof caption === 'string' ? caption : undefined);
      return created({ route: 'telegram', ...telegramVideo });
    }

    const filePath = await saveToTeledriveFolder(file, typeof folder === 'string' ? folder : 'documents');
    return created({ route: 'teledrive', filePath });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'File upload failed.';
    return serverError(message);
  }
}
