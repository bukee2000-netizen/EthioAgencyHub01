import { created, serverError, validationError } from '@/lib/api/responses';
import { uploadPhotoToTelegram } from '@/lib/telegram/bot';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  const photoType = formData.get('photoType');
  const employeeName = formData.get('employeeName');

  if (!(file instanceof File)) {
    return validationError('A photo file is required.');
  }

  try {
    const typeLabel = typeof photoType === 'string' ? photoType : 'photo';
    const name = typeof employeeName === 'string' && employeeName.trim() ? employeeName : 'Unknown';
    const caption = `Employee photo (${typeLabel}): ${name}`;
    const telegramPhoto = await uploadPhotoToTelegram(file, caption);

    return created({
      ...telegramPhoto,
      photoType: typeLabel,
      employeeName: name
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Telegram photo upload failed.';
    return serverError(message);
  }
}
