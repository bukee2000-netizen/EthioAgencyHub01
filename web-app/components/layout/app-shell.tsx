'use client';

import { ReactNode, useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { UserMenu } from '@/components/layout/user-menu';
import { Sidebar } from '@/components/layout/sidebar';
import { LanguageSelector } from '@/components/layout/language-selector';
import { useSidebar } from '@/components/layout/sidebar-provider';
import { useLanguage } from '@/components/layout/language-provider';
import { modules } from '@/lib/mock-data';
import type { SessionPayload } from '@/lib/auth/jwt';
import Link from 'next/link';

export function AppShell({ children, session }: { children: ReactNode; session: SessionPayload | null }) {
  const { isOpen, isHovering } = useSidebar();
  const { language, dict, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const allNavItems = modules.flatMap(m => [
    { title: m.title, href: m.href, icon: m.icon, isMain: true },
    ...(m.submenu?.map(s => ({ title: s.title, href: s.href, icon: s.icon, isMain: false, parent: m.title })) || [])
  ]);

  const filteredNav = searchQuery
    ? allNavItems.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar dict={dict} />

      <div className={`transition-all duration-300 lg:ml-0 ${isOpen ? 'lg:pl-72' : 'lg:pl-20'}`}>
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/85 px-5 py-3 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">Multi-tenant command center</p>
              <h1 className="text-xl font-bold text-ink">Foreign Employment Operations</h1>
            </div>
            <div className="relative w-full max-w-xs lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search modules, pages..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-sm focus:border-brand-500 focus:outline-none" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
              {searchQuery && (
                <div className="absolute top-full right-0 mt-1 w-80 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg z-50">
                  {filteredNav.length > 0 ? filteredNav.slice(0, 10).map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setSearchQuery('')}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-brand-50 transition-colors ${item.isMain ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                      {!item.isMain && <span className="text-[10px] text-slate-400 ml-auto truncate">{(item as any).parent}</span>}
                    </Link>
                  )) : <p className="px-4 py-3 text-sm text-slate-500 text-center">No results found</p>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-2xl border border-slate-200 p-3 text-slate-600 hover:bg-slate-50" type="button" aria-label="Notifications">
                <Bell className="h-5 w-5" />
              </button>
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />
              <UserMenu role={session?.role ?? 'Guest'} email={session?.email} />
            </div>
          </div>
        </header>
        <main className="px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
