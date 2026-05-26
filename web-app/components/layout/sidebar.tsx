'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronDown, Globe2, LayoutDashboard, X, PlusCircle, FileText, Plane, Ticket } from 'lucide-react';
import { modules } from '@/lib/mock-data';
import { siteConfig } from '@/config/site';
import { useSidebar } from '@/components/layout/sidebar-provider';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type Props = { dict: Dictionary };

export function Sidebar({ dict }: Props) {
  const { isOpen, toggle, isHovering, setIsHovering } = useSidebar();
  const pathname = usePathname();
  const [expandedModules, setExpandedModules] = useState<string[]>(['Employee Management', 'Documents', 'Travel']);

  const toggleModule = (title: string) => {
    setExpandedModules(prev => prev.includes(title) ? prev.filter(m => m !== title) : [...prev, title]);
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  // Hover expansion is handled directly by onMouseEnter/onMouseLeave

  const sidebarWidth = isOpen ? 'w-72' : isHovering ? 'w-72' : 'w-20';

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-10 bg-black/50 lg:hidden" onClick={toggle} />}

      <aside
        className={`fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 lg:translate-x-0 ${
          isOpen || isHovering ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        } ${sidebarWidth}`}
        onMouseEnter={() => !isOpen && setIsHovering(true)}
        onMouseLeave={() => !isOpen && setIsHovering(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-5 py-4 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => isOpen && toggle()}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm">
              <Globe2 className="h-6 w-6" />
            </div>
            {(isOpen || isHovering) && (
              <div>
                <p className="font-bold text-ink">{siteConfig.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Agency operations</p>
              </div>
            )}
          </Link>
          {(isOpen || isHovering) && (
            <>
              <button onClick={toggle} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 hidden lg:block" type="button" title={isOpen ? "Collapse sidebar" : "Pin sidebar"}>
                {isOpen ? <ChevronLeft className="h-5 w-5 text-slate-500 dark:text-slate-400" /> : <ChevronRight className="h-5 w-5 text-slate-500 dark:text-slate-400" />}
              </button>
              <button onClick={toggle} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 lg:hidden" type="button" aria-label="Close sidebar">
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {/* Dashboard */}
          <div className="mb-2">
            <Link href="/dashboard"
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${isActive('/dashboard') ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-ink dark:hover:text-ink-dark'}`}>
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              {(isOpen || isHovering) && <span className="truncate">{dict.common.dashboard}</span>}
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 my-2" />

          {/* Module Groups */}
          {modules.map((module) => {
            const isExpanded = expandedModules.includes(module.title);
            const modActive = isActive(module.href);
            return (
              <div key={module.title} className="mb-1">
                <div className={`flex items-center gap-0 rounded-xl transition-colors cursor-pointer ${modActive ? 'bg-brand-50 dark:bg-brand-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  onClick={() => { if (module.submenu?.length) toggleModule(module.title); }}>
                  <Link href={module.href}
                    className={`flex flex-1 items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${modActive ? 'text-brand-700 dark:text-brand-400' : 'text-slate-600 dark:text-slate-300 hover:text-ink dark:hover:text-ink-dark'}`}
                    onClick={(e) => e.stopPropagation()}>
                    <module.icon className="h-5 w-5 shrink-0" />
                    {(isOpen || isHovering) && <span className="truncate">{module.title}</span>}
                  </Link>
                  {(isOpen || isHovering) && module.submenu && module.submenu.length > 0 && (
                    <span className={`mr-2 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} text-slate-400 dark:text-slate-500`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  )}
                </div>
                {(isOpen || isHovering) && isExpanded && module.submenu && module.submenu.length > 0 && (
                  <div className="ml-6 space-y-0.5 border-l border-slate-200 dark:border-slate-700 py-1 pl-3">
                    {module.submenu.map((sub) => {
                      const subActive = isActive(sub.href);
                      return (
                        <Link key={sub.href} href={sub.href}
                          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${subActive ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                          <sub.icon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{sub.title}</span>
                          {subActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {(isOpen || isHovering) && (
          <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              <Link href="/employee-management/registration" className="flex flex-col items-center gap-1 rounded-xl bg-brand-50 py-2 text-brand-700 hover:bg-brand-100 transition-colors" title="Register Employee">
                <PlusCircle className="h-4 w-4" />
                <span className="text-[10px] font-semibold">Register</span>
              </Link>
              <Link href="/travel" className="flex flex-col items-center gap-1 rounded-xl bg-blue-50 py-2 text-blue-700 hover:bg-blue-100 transition-colors" title="Travel">
                <Plane className="h-4 w-4" />
                <span className="text-[10px] font-semibold">Travel</span>
              </Link>
              <Link href="/documents" className="flex flex-col items-center gap-1 rounded-xl bg-purple-50 py-2 text-purple-700 hover:bg-purple-100 transition-colors" title="Documents">
                <FileText className="h-4 w-4" />
                <span className="text-[10px] font-semibold">Documents</span>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile toggle */}
      {!isOpen && !isHovering && (
        <button onClick={toggle} className="fixed bottom-6 left-6 z-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg hover:bg-slate-50 lg:hidden" type="button" aria-label="Open sidebar">
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </button>
      )}
    </>
  );
}
