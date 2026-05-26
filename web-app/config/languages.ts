export type SupportedLanguageCode = 'en' | 'am' | 'om' | 'ar';

export type SupportedLanguage = {
  code: SupportedLanguageCode;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
};

export const supportedLanguages: SupportedLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', direction: 'ltr' },
  { code: 'om', name: 'Oromo', nativeName: 'Afaan Oromoo', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' }
];

export const defaultLanguage: SupportedLanguageCode = 'en';
