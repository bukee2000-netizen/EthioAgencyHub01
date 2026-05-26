import { NextRequest } from 'next/server';
import { ok, serverError, validationError } from '@/lib/api/responses';
import { requireRole } from '@/lib/auth/session';
import { extractPassportData } from '@/lib/passport/ocr';
import { parsePassportData, mapPassportToFormFields } from '@/lib/utils/passport-parser';
import { z } from 'zod';

const ocrSchema = z.object({
  image: z.string().min(1, 'Image data is required'),
  type: z.enum(['passport', 'national_id', 'visa']).default('passport'),
});

export async function POST(req: NextRequest) {
  try {
    requireRole(['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT']);

    const body = await req.json();
    const parsed = ocrSchema.safeParse(body);
    if (!parsed.success) {
      return validationError('Invalid request', parsed.error.flatten());
    }

    const { image } = parsed.data;
    const result = await extractPassportData(image, 'eng+amh');

    if (!result.success) {
      return ok({
        success: false,
        text: '',
        fields: parsePassportData(''),
        formFields: {},
        confidence: 0,
        error: result.error || 'OCR processing failed',
        source: 'server',
      });
    }

    return ok({
      success: true,
      text: result.text,
      fields: result.fields,
      formFields: result.formFields,
      confidence: result.confidence,
      source: 'server',
    });
  } catch (error) {
    return serverError();
  }
}
