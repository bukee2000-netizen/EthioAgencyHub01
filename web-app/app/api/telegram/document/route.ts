import { created, serverError, validationError } from '@/lib/api/responses';
import { uploadDocumentToTelegram } from '@/lib/telegram/bot';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  const employeeName = formData.get('employeeName');

  if (!(file instanceof File)) {
    return validationError('A document file is required.');
  }

  try {
    const name = typeof employeeName === 'string' && employeeName.trim() ? employeeName : 'Unknown';
    const caption = `Employee document: ${name}`;
    const telegramDoc = await uploadDocumentToTelegram(file, caption);

    return created({
      success: true,
      ...telegramDoc,
      employeeName: name
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Telegram document upload failed.';
    return serverError(message);
  }
}
