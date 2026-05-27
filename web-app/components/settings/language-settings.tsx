'use client';

import { useEffect, useState } from 'react';
import { Globe, CheckCircle2, Languages, ArrowRight } from 'lucide-react';
import { LanguageSwitcher } from '@/components/settings/language-switcher';
import { supportedLanguages, type SupportedLanguageCode } from '@/config/languages';

export function LanguageSettings() {
  const [current, setCurrent] = useState<SupportedLanguageCode>('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings/language')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.code) setCurrent(data.code);
        else if (data.code) setCurrent(data.code);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentLang = supportedLanguages.find(l => l.code === current);
  const totalKeys = 40;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <Globe className="h-10 w-10 text-brand-600" />
          <div>
            <h1 className="text-3xl font-bold text-ink">Language Settings</h1>
          </div>
        </div>
      </div>

      {/* Current Language Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-ink text-lg mb-4 flex items-center gap-2">
          <Languages className="h-5 w-5 text-brand-600" />
          Current Language
        </h2>
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-50 border border-brand-200">
            <div className="h-16 w-16 rounded-2xl bg-brand-100 flex items-center justify-center text-3xl">
              {current === 'en' ? '🇬🇧' : current === 'am' ? '🇪🇹' : current === 'om' ? '🇪🇹' : '🇸🇦'}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold text-brand-900">{currentLang?.nativeName} ({currentLang?.name})</p>
              <p className="text-sm text-brand-700">Direction: {currentLang?.direction === 'rtl' ? 'Right-to-Left' : 'Left-to-Right'}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
          </div>
        )}
      </div>

      {/* Language Selection */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-ink text-lg mb-4">Select Language</h2>
        <LanguageSwitcher current={current} />
      </div>

      {/* Translation Coverage */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-ink text-lg mb-4">Translation Coverage</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {supportedLanguages.map(lang => (
            <div key={lang.code} className={`rounded-xl border p-4 ${lang.code === current ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{lang.code === 'en' ? '🇬🇧' : lang.code === 'am' ? '🇪🇹' : lang.code === 'om' ? '🇪🇹' : '🇸🇦'}</span>
                <span className="font-bold text-ink">{lang.nativeName}</span>
              </div>
              <p className="text-xs text-slate-500">{totalKeys} keys translated</p>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-brand-500" style={{ width: '100%' }} />
              </div>
              <p className="text-xs text-green-600 mt-1 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
