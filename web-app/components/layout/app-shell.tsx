'use client';

import { ReactNode, useState } from 'react';
import { Bell, Search, X, Sun, Moon } from 'lucide-react';
import { UserMenu } from '@/components/layout/user-menu';
import { Sidebar } from '@/components/layout/sidebar';
import { LanguageSelector } from '@/components/layout/language-selector';
import { useSidebar } from '@/components/layout/sidebar-provider';
import { useLanguage } from '@/components/layout/language-provider';
import { useTheme } from '@/components/layout/theme-provider';
import { modules } from '@/lib/mock-data';
import type { SessionPayload } from '@/lib/auth/jwt';
import Link from 'next/link';

export function AppShell({ children, session }: { children: ReactNode; session: SessionPayload | null }) {
  const { isOpen, isHovering } = useSidebar();
  const { language, dict, setLanguage } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const allNavItems = modules.flatMap(m => [
    { title: m.title, href: m.href, icon: m.icon, isMain: true },
    ...(m.submenu?.map(s => ({ title: s.title, href: s.href, icon: s.icon, isMain: false, parent: m.title })) || [])
  ]);

  const filteredNav = searchQuery
    ? allNavItems.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar dict={dict} />

      <div className={`transition-all duration-300 lg:ml-0 ${isOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 px-4 py-2 backdrop-blur lg:px-6">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-sm font-bold text-ink dark:text-ink-dark truncate shrink-0">Foreign Employment Operations</h1>
            <div className="relative max-w-[160px] lg:max-w-[200px] w-full">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={dict.common.search}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 py-1.5 pl-7 pr-6 text-xs text-ink dark:text-ink-dark focus:border-brand-500 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-3 w-3" />
                </button>
              )}
              {searchQuery && (
                <div className="absolute top-full right-0 mt-1 w-72 max-h-60 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg dark:shadow-soft-dark z-50">
                  {filteredNav.length > 0 ? filteredNav.slice(0, 10).map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSearchQuery('')}
                      className={`flex items-center gap-2 px-3 py-2 text-xs hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors ${item.isMain ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300'}`}>
                      <item.icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {!item.isMain && <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto truncate">{(item as any).parent}</span>}
                    </Link>
                  )) : <p className="px-3 py-2 text-xs text-slate-500 text-center">No results found</p>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={toggleTheme}
                className="rounded-lg border border-slate-200 dark:border-slate-600 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                type="button"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="rounded-lg border border-slate-200 dark:border-slate-600 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" type="button" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </button>
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              <UserMenu role={session?.role ?? 'Guest'} email={session?.email} />
            </div>
          </div>
        </header>
        <main className="px-4 py-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}
