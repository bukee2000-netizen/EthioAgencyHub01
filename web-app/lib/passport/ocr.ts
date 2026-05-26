import Tesseract from 'tesseract.js';
import { parsePassportData, mapPassportToFormFields, type PassportData } from '@/lib/utils/passport-parser';

export interface OCRResult {
  success: boolean;
  text: string;
  confidence: number;
  fields?: Partial<PassportData>;
  formFields?: Record<string, string>;
  error?: string;
}

export async function extractPassportData(
  imageFile: File | Blob | string,
  language: string = 'eng+amh'
): Promise<OCRResult> {
  try {
    let imageSource: Parameters<typeof Tesseract.recognize>[0];

    if (imageFile instanceof File || imageFile instanceof Blob) {
      imageSource = imageFile;
    } else if (typeof imageFile === 'string') {
      imageSource = imageFile;
    } else {
      return { success: false, text: '', confidence: 0, error: 'Invalid image input' };
    }

    const { data: { text, confidence } } = await Tesseract.recognize(
      imageSource,
      language,
      {
        logger: (m) => {
          console.log('[Passport OCR]', m.status, Math.round(m.progress * 100) + '%');
        },
      }
    );

    const fields = parsePassportData(text);
    const formFields = mapPassportToFormFields(fields);

    return {
      success: true,
      text: text.trim(),
      confidence,
      fields,
      formFields
    };
  } catch (error) {
    return {
      success: false,
      text: '',
      confidence: 0,
      error: error instanceof Error ? error.message : 'OCR extraction failed'
    };
  }
}

export async function batchExtractPassportData(
  files: (File | Blob | string)[],
  language: string = 'eng+amh'
): Promise<OCRResult[]> {
  const results: OCRResult[] = [];
  for (let i = 0; i < files.length; i++) {
    const result = await extractPassportData(files[i], language);
    results.push(result);
  }
  return results;
}
