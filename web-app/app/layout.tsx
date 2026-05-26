import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { getTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let langCode = 'en';
  let langDir = 'ltr';
  try {
    const t = getTranslations();
    langCode = t.language.code;
    langDir = t.language.direction;
  } catch {
    // cookies() not available during SSR/build
  }

  return (
    <html lang={langCode} dir={langDir}>
      <body>{children}</body>
    </html>
  );
}
