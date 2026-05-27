'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CVDatabaseModule } from '@/components/employees/cv-search';
import { Database, Search, UsersRound, FileText, TrendingUp, Briefcase, Globe } from 'lucide-react';

export default function CVDatabasePage() {
  const [stats, setStats] = useState({ total: 0, travelReady: 0, deployed: 0, roles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees/stats')
      .then(r => r.json())
      .then(data => { if (data.success && data.data) setStats(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark">
        <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">CV Database</h2>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-200 p-5">
          <UsersRound className="h-6 w-6 text-brand-600 mb-2" />
          <p className="text-3xl font-bold text-brand-800">{loading ? '-' : stats.total}</p>
          <p className="text-sm font-medium text-brand-700">Total Employees</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
          <p className="text-3xl font-bold text-green-800">{loading ? '-' : stats.travelReady || 0}</p>
          <p className="text-sm font-medium text-green-700">Travel Ready</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5">
          <Globe className="h-6 w-6 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-800">{loading ? '-' : stats.deployed || 0}</p>
          <p className="text-sm font-medium text-emerald-700">Deployed</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <Briefcase className="h-6 w-6 text-purple-600 mb-2" />
          <p className="text-3xl font-bold text-purple-800">{loading ? '-' : stats.roles || 0}</p>
          <p className="text-sm font-medium text-purple-700">Job Roles</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/employee-management/cv-database/search" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark transition hover:shadow-md hover:border-brand-300">
          <Search className="mb-3 h-6 w-6 text-brand-600" />
          <h3 className="font-semibold text-ink dark:text-ink-dark">Advanced Search</h3>
        </Link>
        <Link href="/employee-management/cv-database/employee-profiles" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark transition hover:shadow-md hover:border-brand-300">
          <UsersRound className="mb-3 h-6 w-6 text-brand-600" />
          <h3 className="font-semibold text-ink dark:text-ink-dark">Employee Profiles</h3>
        </Link>
        <Link href="/employee-management/cv-database/skill-matching" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark transition hover:shadow-md hover:border-brand-300">
          <Database className="mb-3 h-6 w-6 text-brand-600" />
          <h3 className="font-semibold text-ink dark:text-ink-dark">Skill Matching</h3>
        </Link>
      </section>

      <CVDatabaseModule />
    </div>
  );
}
