import { handleAuthError, ok, serverError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { isDatabaseConfigured } from '@/lib/db/errors';
import { z } from 'zod';

const systemSettingsSchema = z.object({
  agency: z.object({
    name: z.string().min(1),
    country: z.string(),
    timezone: z.string(),
    language: z.string(),
    currency: z.string()
  }).optional(),
  notifications: z.object({
    emailAlerts: z.boolean(),
    telegramNotifications: z.boolean(),
    dailyDigest: z.boolean(),
    criticalAlerts: z.boolean()
  }).optional(),
  storage: z.object({
    provider: z.string(),
    maxFileSize: z.string(),
    retentionDays: z.string()
  }).optional(),
  telegram: z.object({
    botToken: z.string().optional(),
    chatId: z.string().optional(),
    uploadEnabled: z.boolean()
  }).optional()
});

export async function GET() {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    
    const settings = {
      agency: {
        name: process.env.AGENCY_NAME || 'My Agency',
        country: process.env.AGENCY_COUNTRY || 'ET',
        timezone: process.env.AGENCY_TIMEZONE || 'Africa/Addis_Ababa',
        language: process.env.AGENCY_LANGUAGE || 'en',
        currency: process.env.AGENCY_CURRENCY || 'ETB'
      },
      notifications: {
        emailAlerts: process.env.EMAIL_ALERTS === 'true',
        telegramNotifications: process.env.TELEGRAM_NOTIFICATIONS === 'true',
        dailyDigest: process.env.DAILY_DIGEST === 'true',
        criticalAlerts: process.env.CRITICAL_ALERTS !== 'false'
      },
      storage: {
        provider: process.env.STORAGE_PROVIDER || 'teledrive',
        maxFileSize: process.env.MAX_FILE_SIZE || '100',
        retentionDays: process.env.RETENTION_DAYS || '90'
      },
      telegram: {
        uploadEnabled: process.env.TELEGRAM_UPLOAD_ENABLED !== 'false'
      }
    };

    return ok(settings);
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    return serverError();
  }
}

export async function POST(req: Request) {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);
    const body = await req.json();
    const parsed = systemSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return ok({ success: false, error: 'Invalid settings format' });
    }

    const settings = parsed.data;
    
    if (settings.agency) {
      process.env.AGENCY_NAME = settings.agency.name;
      process.env.AGENCY_COUNTRY = settings.agency.country;
      process.env.AGENCY_TIMEZONE = settings.agency.timezone;
      process.env.AGENCY_LANGUAGE = settings.agency.language;
      process.env.AGENCY_CURRENCY = settings.agency.currency;
    }
    
    if (settings.notifications) {
      process.env.EMAIL_ALERTS = String(settings.notifications.emailAlerts);
      process.env.TELEGRAM_NOTIFICATIONS = String(settings.notifications.telegramNotifications);
      process.env.DAILY_DIGEST = String(settings.notifications.dailyDigest);
      process.env.CRITICAL_ALERTS = String(settings.notifications.criticalAlerts);
    }
    
    if (settings.storage) {
      process.env.STORAGE_PROVIDER = settings.storage.provider;
      process.env.MAX_FILE_SIZE = settings.storage.maxFileSize;
      process.env.RETENTION_DAYS = settings.storage.retentionDays;
    }
    
    if (settings.telegram) {
      if (settings.telegram.botToken) process.env.TELEGRAM_BOT_TOKEN = settings.telegram.botToken;
      if (settings.telegram.chatId) process.env.TG_CHANNEL_ID = settings.telegram.chatId;
      process.env.TELEGRAM_UPLOAD_ENABLED = String(settings.telegram.uploadEnabled);
    }

    return ok({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    const authRes = handleAuthError(error);
    if (authRes) return authRes;
    return serverError();
  }
}