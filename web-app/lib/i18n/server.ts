import { cookies } from 'next/headers';
import { defaultLanguage, supportedLanguages, type SupportedLanguageCode } from '@/config/languages';
import { getDictionary } from '@/lib/i18n/dictionaries';

export const LANGUAGE_COOKIE_NAME = 'eah_lang';

export function getLanguage(): SupportedLanguageCode {
  const value = cookies().get(LANGUAGE_COOKIE_NAME)?.value as SupportedLanguageCode | undefined;
  if (value && supportedLanguages.some((l) => l.code === value)) {
    return value;
  }
  return defaultLanguage;
}

export function getTranslations() {
  const code = getLanguage();
  return { code, dict: getDictionary(code), language: supportedLanguages.find((l) => l.code === code)! };
}
