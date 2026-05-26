'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import type { SupportedLanguageCode } from '@/config/languages';
import { defaultLanguage } from '@/config/languages';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { getDictionary } from '@/lib/i18n/dictionaries';

type LanguageContextType = {
  language: SupportedLanguageCode;
  dict: Dictionary;
  setLanguage: (language: SupportedLanguageCode) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguageCode>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as SupportedLanguageCode | null;
    if (saved) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = (newLanguage: SupportedLanguageCode) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);
    // Update HTML dir attribute for RTL support
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const dict = getDictionary(language);

  return (
    <LanguageContext.Provider value={{ language, dict, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
