export type TelegramVideoUploadResult = {
  messageId: number;
  fileId: string;
  uniqueFileId: string;
  fileSize?: number;
  mimeType?: string;
  duration?: number;
};
