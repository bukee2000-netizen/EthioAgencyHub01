import crypto from 'crypto';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TG_CHANNEL_ID || process.env.TELEGRAM_CHANNEL_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramFileResponse {
  ok: boolean;
  result?: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    file_path: string;
  };
  description?: string;
}

interface TelegramMessageResponse {
  ok: boolean;
  result?: {
    message_id: number;
    chat: { id: number; title?: string };
    document?: { file_id: string; file_name: string; file_size: number };
    photo?: Array<{ file_id: string; file_size: number }>;
  };
  description?: string;
}

interface TelegramUploadResult {
  success: boolean;
  fileId?: string;
  fileUrl?: string;
  messageId?: number;
  error?: string;
}

export class TelegramService {
  private static instance: TelegramService;
  private botToken: string;
  private channelId: string;

  private constructor() {
    this.botToken = TELEGRAM_BOT_TOKEN || '';
    this.channelId = TELEGRAM_CHANNEL_ID || '';
  }

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  isConfigured(): boolean {
    return !!(this.botToken && this.channelId);
  }

  async sendDocument(
    fileBuffer: Buffer,
    fileName: string,
    caption?: string
  ): Promise<TelegramUploadResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Telegram bot not configured' };
    }

    try {
      const formData = new FormData();
      formData.append('chat_id', this.channelId);
      formData.append('document', new Blob([new Uint8Array(fileBuffer)]), fileName);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await fetch(`${TELEGRAM_API_URL}/sendDocument`, {
        method: 'POST',
        body: formData as any,
      });

      const data: TelegramMessageResponse = await response.json();

      if (data.ok && data.result) {
        return {
          success: true,
          fileId: data.result.document?.file_id,
          messageId: data.result.message_id,
        };
      }

      return { success: false, error: data.description || 'Upload failed' };
    } catch (error) {
      console.error('Telegram upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  async sendPhoto(
    fileBuffer: Buffer,
    fileName: string,
    caption?: string
  ): Promise<TelegramUploadResult> {
    if (!this.isConfigured()) {
      return { success: false, error: 'Telegram bot not configured' };
    }

    try {
      const formData = new FormData();
      formData.append('chat_id', this.channelId);
      formData.append('photo', new Blob([new Uint8Array(fileBuffer)]), fileName);
      if (caption) {
        formData.append('caption', caption);
      }

      const response = await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
        method: 'POST',
        body: formData as any,
      });

      const data: TelegramMessageResponse = await response.json();

      if (data.ok && data.result) {
        const photo = data.result.photo?.[0];
        return {
          success: true,
          fileId: photo?.file_id,
          messageId: data.result.message_id,
        };
      }

      return { success: false, error: data.description || 'Upload failed' };
    } catch (error) {
      console.error('Telegram photo upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  async getFile(fileId: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return null;
    }

    try {
      const response = await fetch(
        `${TELEGRAM_API_URL}/getFile?file_id=${fileId}`
      );
      const data: TelegramFileResponse = await response.json();

      if (data.ok && data.result) {
        return `https://api.telegram.org/file/bot${this.botToken}/${data.result.file_path}`;
      }

      return null;
    } catch (error) {
      console.error('Telegram get file error:', error);
      return null;
    }
  }

  async sendMessage(text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.channelId,
          text,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Telegram send message error:', error);
      return false;
    }
  }

  generateFileName(pilgrimId: string, docType: string, extension: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `pilgrim_${pilgrimId}_${docType}_${timestamp}_${random}.${extension}`;
  }

  async uploadPilgrimDocument(
    pilgrimId: string,
    docType: string,
    fileBuffer: Buffer,
    originalFileName: string
  ): Promise<{ success: boolean; fileId?: string; error?: string }> {
    const extension = originalFileName.split('.').pop() || 'pdf';
    const fileName = this.generateFileName(pilgrimId, docType, extension);
    const caption = `Pilgrim: ${pilgrimId}\nDocument Type: ${docType}\nOriginal: ${originalFileName}\nUploaded: ${new Date().toISOString()}`;

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension.toLowerCase())) {
      const result = await this.sendPhoto(fileBuffer, fileName, caption);
      return { success: result.success, fileId: result.fileId, error: result.error };
    } else {
      const result = await this.sendDocument(fileBuffer, fileName, caption);
      return { success: result.success, fileId: result.fileId, error: result.error };
    }
  }
}

export const telegramService = TelegramService.getInstance();