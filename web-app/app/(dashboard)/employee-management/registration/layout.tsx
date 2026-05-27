import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function RegistrationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-brand-50 to-emerald-50 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-ink dark:text-ink-dark">Employee Registration</h2>
          </div>
          <Link
            href="/employee-management"
            className="flex items-center gap-1 text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
          >
            Back to Dashboard <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      {children}
    </div>
  );
}
