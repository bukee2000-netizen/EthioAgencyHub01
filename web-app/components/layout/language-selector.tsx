'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { supportedLanguages, type SupportedLanguageCode } from '@/config/languages';

type Props = {
  currentLanguage: SupportedLanguageCode;
  onLanguageChange: (language: SupportedLanguageCode) => void;
};

export function LanguageSelector({ currentLanguage, onLanguageChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        type="button"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{supportedLanguages.find((l) => l.code === currentLanguage)?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-slate-200 bg-white shadow-lg">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-3 text-left text-sm font-medium transition ${
                currentLanguage === lang.code
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-50'
              } first:rounded-t-2xl last:rounded-b-2xl`}
              type="button"
            >
              <span className="block">{lang.nativeName}</span>
              <span className="text-xs text-slate-500">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
