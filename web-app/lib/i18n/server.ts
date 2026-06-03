import { cookies } from 'next/headers';
import { defaultLanguage, supportedLanguages, type SupportedLanguageCode } from '@/config/languages';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const LANGUAGE_COOKIE_NAME = 'eah_lang';

export async function getLanguage(): Promise<SupportedLanguageCode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value as SupportedLanguageCode | undefined;
  if (value && supportedLanguages.some((l) => l.code === value)) {
    return value;
  }
  return defaultLanguage;
}

export async function getTranslations() {
  const code = await getLanguage();
  return { code, dict: getDictionary(code), language: supportedLanguages.find((l) => l.code === code)! };
}
