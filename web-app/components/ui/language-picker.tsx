'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, CheckCircle2 } from 'lucide-react';
import { supportedLanguages, type SupportedLanguageCode } from '@/config/languages';

type LanguagePickerProps = {
  currentLanguage: SupportedLanguageCode;
  onLanguageChange?: (language: SupportedLanguageCode) => void;
  variant: 'dropdown' | 'cards';
};

const langFlags: Record<string, string> = { en: '🇬🇧', am: '🇪🇹', om: '🇪🇹', ar: '🇸🇦' };

export function LanguagePicker({ currentLanguage, onLanguageChange, variant }: LanguagePickerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SupportedLanguageCode>(currentLanguage);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (code: SupportedLanguageCode) => {
    if (variant === 'cards' && code === selected && code === currentLanguage) return;
    setSelected(code);
    setError(null);
    if (variant === 'dropdown') setIsOpen(false);
    onLanguageChange?.(code);
    try {
      const res = await fetch('/api/settings/language', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!res.ok) throw new Error('Failed to save language');
      localStorage.setItem('language', code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save language');
      return;
    }
    startTransition(() => {
      router.refresh();
      window.location.reload();
    });
  };

  if (variant === 'cards') {
    return (
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {supportedLanguages.map((lang) => {
            const isActive = selected === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                disabled={pending}
                className={`group relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                  isActive
                    ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-900/30 shadow-sm dark:shadow-soft-dark'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-sm dark:hover:shadow-soft-dark'
                } ${pending ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                  isActive ? 'bg-brand-100 dark:bg-brand-800/50' : 'bg-slate-100 dark:bg-slate-700/50'
                }`}>
                  {langFlags[lang.code] || '🌐'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isActive ? 'text-brand-800 dark:text-brand-200' : 'text-ink dark:text-ink-dark'}`}>{lang.nativeName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${lang.direction === 'rtl' ? 'bg-purple-100 dark:bg-purple-800/50 text-purple-700 dark:text-purple-300' : 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300'}`}>
                      {lang.direction === 'rtl' ? 'RTL' : 'LTR'}
                    </span>
                    {isActive && <CheckCircle2 className="h-5 w-5 text-brand-600 ml-auto" />}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{lang.name}</p>
                </div>
              </button>
            );
          })}
        </div>
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </div>
    );
  }

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
