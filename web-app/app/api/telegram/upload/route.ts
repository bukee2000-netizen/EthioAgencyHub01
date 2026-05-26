import { NextRequest, NextResponse } from 'next/server';
import { telegramService } from '@/lib/telegram';
import { handleAuthError, ok, serverError, unauthorized } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const session = requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN']);

    if (!telegramService.isConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Telegram bot not configured. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID in environment variables.' },
        { status: 503 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const pilgrimId = formData.get('pilgrimId') as string;
    const docType = formData.get('docType') as string;

    if (!file || !pilgrimId || !docType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: file, pilgrimId, docType' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await telegramService.uploadPilgrimDocument(
      pilgrimId,
      docType,
      buffer,
      file.name
    );

    if (result.success) {
      return ok({
        success: true,
        fileId: result.fileId,
        fileName: file.name,
        docType,
        pilgrimId,
        uploadedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: result.error || 'Upload failed' },
      { status: 500 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;
    console.error('Telegram upload API error:', error);
    return serverError('Failed to upload file to Telegram');
  }
}

export async function GET(req: NextRequest) {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'VIEWER']);

    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'fileId is required' },
        { status: 400 }
      );
    }

    if (!telegramService.isConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Telegram bot not configured' },
        { status: 503 }
      );
    }

    const fileUrl = await telegramService.getFile(fileId);

    if (fileUrl) {
      return ok({ success: true, fileUrl });
    }

    return NextResponse.json(
      { success: false, error: 'File not found' },
      { status: 404 }
    );
  } catch (error) {
    const authResponse = handleAuthError(error);
    if (authResponse) return authResponse;
    return serverError('Failed to get file');
  }
}