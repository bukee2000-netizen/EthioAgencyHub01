import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/lib/telegram/config', () => ({
  getTelegramConfig: () => ({ botToken: 'test', channelId: 'test', maxFileSize: 100000000, allowedVideoExtensions: ['mp4'], allowedDocumentExtensions: ['pdf'] }),
  validateFileSize: () => ({ valid: true }),
  validateFileExtension: () => ({ valid: true })
}));

describe('validateVideoUpload', () => {
  it('accepts video files', async () => {
    const { validateVideoUpload } = await import('@/lib/telegram/bot');
    const file = new File(['video'], 'interview.mp4', { type: 'video/mp4' });
    const result = validateVideoUpload(file);
    expect(result.valid).toBe(true);
  });

  it('rejects non-video files', async () => {
    const { validateVideoUpload } = await import('@/lib/telegram/bot');
    const file = new File(['pdf'], 'passport.pdf', { type: 'application/pdf' });
    const result = validateVideoUpload(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Only video files');
  });
});