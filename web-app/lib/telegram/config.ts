export interface TelegramConfig {
  botToken: string;
  channelId: string;
  maxFileSize: number;
  allowedVideoExtensions: string[];
  allowedDocumentExtensions: string[];
}

export function getTelegramConfig(): TelegramConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const channelId = process.env.TG_CHANNEL_ID;
  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '104857600', 10);
  
  if (!botToken || !channelId) {
    throw new Error('TELEGRAM_BOT_TOKEN and TG_CHANNEL_ID are required for Telegram media routing.');
  }

  return {
    botToken,
    channelId,
    maxFileSize: Math.min(maxFileSize, 209715200),
    allowedVideoExtensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    allowedDocumentExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  };
}

export function validateFileSize(fileSize: number): { valid: boolean; error?: string } {
  const config = getTelegramConfig();
  
  if (fileSize > config.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${Math.round(config.maxFileSize / 1048576)}MB`
    };
  }
  
  return { valid: true };
}

export function validateFileExtension(filename: string, type: 'video' | 'document'): { valid: boolean; error?: string } {
  const config = getTelegramConfig();
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const allowedExtensions = type === 'video' ? config.allowedVideoExtensions : config.allowedDocumentExtensions;
  
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File extension .${ext} is not allowed. Allowed: ${allowedExtensions.join(', ')}`
    };
  }
  
  return { valid: true };
}