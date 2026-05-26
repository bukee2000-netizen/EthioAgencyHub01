'use client';

import { useState, useTransition } from 'react';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supportedLanguages, type SupportedLanguageCode } from '@/config/languages';

type Props = {
  currentLanguage: SupportedLanguageCode;
  onLanguageChange: (language: SupportedLanguageCode) => void;
};

export function LanguageSelector({ currentLanguage, onLanguageChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = async (code: SupportedLanguageCode) => {
    setIsOpen(false);
    onLanguageChange(code);
    try {
      await fetch('/api/settings/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
    } catch {
      // ignore
    }
    startTransition(() => {
      router.refresh();
      window.location.reload();
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={pending}
        className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-600 px-2 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        type="button"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{supportedLanguages.find((l) => l.code === currentLanguage)?.nativeName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-36 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg dark:shadow-soft-dark">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`block w-full px-3 py-2 text-left text-xs font-medium transition ${
                currentLanguage === lang.code
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              } first:rounded-t-lg last:rounded-b-lg`}
              type="button"
            >
              <span className="block">{lang.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
