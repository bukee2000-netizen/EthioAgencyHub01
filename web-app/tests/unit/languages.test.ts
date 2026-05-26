import { describe, expect, it } from 'vitest';
import { supportedLanguages } from '@/config/languages';
import { getDictionary } from '@/lib/i18n/dictionaries';

describe('language support', () => {
  it('includes English, Amharic, Oromo, and Arabic', () => {
    const codes = supportedLanguages.map((language) => language.code).sort();
    expect(codes).toEqual(['am', 'ar', 'en', 'om']);
  });

  it('marks Arabic as right-to-left', () => {
    const arabic = supportedLanguages.find((language) => language.code === 'ar');
    expect(arabic?.direction).toBe('rtl');
  });

  it('provides dictionaries for every language', () => {
    for (const language of supportedLanguages) {
      const dict = getDictionary(language.code);
      expect(dict.common.dashboard).toBeTruthy();
      expect(dict.billing.title).toBeTruthy();
    }
  });
});
