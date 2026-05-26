import { created, serverError, validationError } from '@/lib/api/responses';
import { db } from '@/lib/db/prisma';
import { isDatabaseConfigured, isDatabaseConnectionError } from '@/lib/db/errors';
import { uploadShortVideoToTelegram } from '@/lib/telegram/bot';

export async function POST(req: Request) {
  const formData = await req.formData();
  const video = formData.get('video');
  const employeeId = formData.get('employeeId');
  const employeeName = formData.get('employeeName');

  if (!(video instanceof File)) {
    return validationError('A video file field is required.');
  }

  try {
    const caption = typeof employeeName === 'string' && employeeName.trim() ? `Interview video: ${employeeName}` : 'Employee interview video';
    const telegramVideo = await uploadShortVideoToTelegram(video, caption);

    if (typeof employeeId === 'string' && employeeId && isDatabaseConfigured()) {
      await db.employee.update({
        where: { id: employeeId },
        data: { tgVideoId: telegramVideo.fileId, status: 'INTERVIEW_UPLOADED' }
      });
    }

    return created({ ...telegramVideo, employeeId: typeof employeeId === 'string' ? employeeId : null });
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      return serverError('Telegram upload succeeded, but employee database update failed.');
    }

    const message = error instanceof Error ? error.message : 'Telegram interview upload failed.';
    return serverError(message);
  }
}
