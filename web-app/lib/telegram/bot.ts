import { getTelegramConfig, validateFileSize, validateFileExtension } from './config';

type TelegramVideo = {
  file_id: string;
  file_unique_id: string;
  duration?: number;
  mime_type?: string;
  file_size?: number;
};

type TelegramSendVideoResponse = {
  ok: boolean;
  result?: {
    message_id: number;
    video?: TelegramVideo;
  };
  description?: string;
};

type TelegramGetFileResponse = {
  ok: boolean;
  result?: {
    file_id: string;
    file_unique_id: string;
    file_size?: number;
    file_path?: string;
  };
  description?: string;
};

const SHORT_VIDEO_MAX_MB = Number(process.env.TELEGRAM_SHORT_VIDEO_MAX_MB ?? 50);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

function getBotApiUrl(method: string) {
  const { botToken } = getTelegramConfig();
  return `https://api.telegram.org/bot${botToken}/${method}`;
}

function getFileApiUrl(filePath: string) {
  const { botToken } = getTelegramConfig();
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

export function validateVideoUpload(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('video/')) {
    return { valid: false, error: 'Only video files are accepted for Telegram interview uploads.' };
  }
  
  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.valid) return sizeValidation;
  
  const extValidation = validateFileExtension(file.name, 'video');
  if (!extValidation.valid) return extValidation;
  
  const maxBytes = SHORT_VIDEO_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `Short interview video must be ${SHORT_VIDEO_MAX_MB}MB or smaller.` };
  }
  
  return { valid: true };
}

export async function uploadShortVideoToTelegram(file: File, caption?: string): Promise<{
  messageId: number;
  fileId: string;
  uniqueFileId: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
}> {
  const validation = validateVideoUpload(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { channelId } = getTelegramConfig();
  
  const uploadFn = async () => {
    const formData = new FormData();
    formData.set('chat_id', channelId);
    formData.set('supports_streaming', 'true');
    formData.set('video', file, file.name || 'interview-video.mp4');

    if (caption) {
      formData.set('caption', caption.slice(0, 1024));
    }

    const response = await fetch(getBotApiUrl('sendVideo'), {
      method: 'POST',
      body: formData
    });
    const payload = (await response.json()) as TelegramSendVideoResponse;

    if (!response.ok || !payload.ok || !payload.result?.video?.file_id) {
      throw new Error(payload.description ?? 'Telegram video upload failed.');
    }

    return payload;
  };

  const result = await retryWithBackoff(uploadFn);
  
  return {
    messageId: result.result!.message_id,
    fileId: result.result!.video!.file_id,
    uniqueFileId: result.result!.video!.file_unique_id,
    fileSize: result.result!.video!.file_size,
    mimeType: result.result!.video!.mime_type,
    duration: result.result!.video!.duration
  };
}

export async function getTelegramFileUrl(fileId: string): Promise<string> {
  const fetchFn = async () => {
    const response = await fetch(getBotApiUrl(`getFile?file_id=${encodeURIComponent(fileId)}`), { cache: 'no-store' });
    const payload = (await response.json()) as TelegramGetFileResponse;

    if (!response.ok || !payload.ok || !payload.result?.file_path) {
      throw new Error(payload.description ?? 'Telegram file lookup failed.');
    }

    return payload;
  };

  const result = await retryWithBackoff(fetchFn);
  return getFileApiUrl(result.result!.file_path || '');
}

export async function sendTelegramMessage(text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown'): Promise<number> {
  const { channelId } = getTelegramConfig();
  
  const response = await fetch(getBotApiUrl('sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: channelId,
      text: text.slice(0, 4096),
      parse_mode: parseMode
    })
  });
  
  const payload = await response.json();
  
  if (!response.ok || !payload.ok) {
    throw new Error(payload.description ?? 'Telegram message send failed.');
  }
  
  return payload.result.message_id;
}

type TelegramPhoto = {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  width?: number;
  height?: number;
};

type TelegramSendPhotoResponse = {
  ok: boolean;
  result?: {
    message_id: number;
    photo?: TelegramPhoto[];
  };
  description?: string;
};

const PHOTO_MAX_MB = Number(process.env.TELEGRAM_PHOTO_MAX_MB ?? 10);

export function validatePhotoUpload(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Only image files are accepted for photo uploads.' };
  }

  const sizeValidation = validateFileSize(file.size);
  if (!sizeValidation.valid) return sizeValidation;

  const extValidation = validateFileExtension(file.name, 'document');
  if (!extValidation.valid) return extValidation;

  const maxBytes = PHOTO_MAX_MB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, error: `Photo must be ${PHOTO_MAX_MB}MB or smaller.` };
  }

  return { valid: true };
}

export async function uploadDocumentToTelegram(file: File, caption?: string): Promise<{
  messageId: number;
  fileId: string;
  uniqueFileId: string;
  fileSize?: number;
  mimeType?: string;
}> {
  const { channelId } = getTelegramConfig();

  const uploadFn = async () => {
    const formData = new FormData();
    formData.set('chat_id', channelId);
    formData.set('document', file, file.name || 'document.pdf');

    if (caption) {
      formData.set('caption', caption.slice(0, 1024));
    }

    const response = await fetch(getBotApiUrl('sendDocument'), {
      method: 'POST',
      body: formData
    });
    const payload = (await response.json()) as any;

    if (!response.ok || !payload.ok || !payload.result?.document?.file_id) {
      throw new Error(payload.description ?? 'Telegram document upload failed.');
    }

    return payload;
  };

  const result = await retryWithBackoff(uploadFn);

  return {
    messageId: result.result!.message_id,
    fileId: result.result!.document!.file_id,
    uniqueFileId: result.result!.document!.file_unique_id,
    fileSize: result.result!.document!.file_size,
    mimeType: result.result!.document!.mime_type
  };
}

export async function uploadPhotoToTelegram(file: File, caption?: string): Promise<{
  messageId: number;
  fileId: string;
  uniqueFileId: string;
  fileSize?: number;
}> {
  const validation = validatePhotoUpload(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { channelId } = getTelegramConfig();

  const uploadFn = async () => {
    const formData = new FormData();
    formData.set('chat_id', channelId);
    formData.set('photo', file, file.name || 'photo.jpg');

    if (caption) {
      formData.set('caption', caption.slice(0, 1024));
    }

    const response = await fetch(getBotApiUrl('sendPhoto'), {
      method: 'POST',
      body: formData
    });
    const payload = (await response.json()) as TelegramSendPhotoResponse;

    if (!response.ok || !payload.ok || !payload.result?.photo?.length) {
      throw new Error(payload.description ?? 'Telegram photo upload failed.');
    }

    return payload;
  };

  const result = await retryWithBackoff(uploadFn);
  const bestPhoto = result.result!.photo!.reduce((best, p) =>
    (!best || (p.file_size && best.file_size && p.file_size > best.file_size) ? p : best)
  );

  return {
    messageId: result.result!.message_id,
    fileId: bestPhoto.file_id,
    uniqueFileId: bestPhoto.file_unique_id,
    fileSize: bestPhoto.file_size
  };
}