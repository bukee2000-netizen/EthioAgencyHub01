'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { supportedLanguages, type SupportedLanguageCode } from '@/config/languages';
import { CheckCircle2, Globe } from 'lucide-react';

type Props = { current: SupportedLanguageCode };

const langFlags: Record<string, string> = { en: '🇬🇧', am: '🇪🇹', om: '🇪🇹', ar: '🇸🇦' };

export function LanguageSwitcher({ current }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState<SupportedLanguageCode>(current);
  const [error, setError] = useState<string | null>(null);

  const onChange = async (code: SupportedLanguageCode) => {
    if (code === selected && code === current) return;
    setSelected(code);
    setError(null);
    try {
      const res = await fetch('/api/settings/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      if (!res.ok) throw new Error('Failed to save language');
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save language');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {supportedLanguages.map((lang) => {
          const isActive = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => onChange(lang.code)}
              disabled={pending}
              className={`group relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
                isActive
                  ? 'border-brand-600 bg-brand-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-brand-300 hover:shadow-sm'
              } ${pending ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                isActive ? 'bg-brand-100' : 'bg-slate-100'
              }`}>
                {langFlags[lang.code] || '🌐'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${isActive ? 'text-brand-800' : 'text-ink'}`}>{lang.nativeName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${lang.direction === 'rtl' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {lang.direction === 'rtl' ? 'RTL' : 'LTR'}
                  </span>
                  {isActive && <CheckCircle2 className="h-5 w-5 text-brand-600 ml-auto" />}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{lang.name}</p>
              </div>
            </button>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
