'use client';

import { Users, Calendar, CheckCircle2, FileText } from 'lucide-react';
import Link from 'next/link';

export function HajjUmrahModule() {
  const stats = [
    { label: 'Total Pilgrims', value: '342', icon: Users, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Registered Groups', value: '8', icon: Calendar, color: 'bg-pink-100 text-pink-600' },
    { label: 'Approved', value: '289', icon: CheckCircle2, color: 'bg-green-100 text-green-600' },
    { label: 'Documentation', value: '98%', icon: FileText, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Hajj & Umrah Management</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl ${stat.color} p-6`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/hajj-umrah/pilgrim-detail" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
          <Users className="h-5 w-5 text-purple-600 mb-3" />
          <p className="font-semibold text-ink dark:text-ink-dark">Pilgrim Details</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">View pilgrim profiles</p>
        </Link>
        <Link href="/hajj-umrah/requirements" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
          <CheckCircle2 className="h-5 w-5 text-purple-600 mb-3" />
          <p className="font-semibold text-ink dark:text-ink-dark">Requirements</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check requirements</p>
        </Link>
        <Link href="/hajj-umrah/documentation" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
          <FileText className="h-5 w-5 text-purple-600 mb-3" />
          <p className="font-semibold text-ink dark:text-ink-dark">Documentation</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Document management</p>
        </Link>
        <Link href="/hajj-umrah" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
          <Calendar className="h-5 w-5 text-purple-600 mb-3" />
          <p className="font-semibold text-ink dark:text-ink-dark">Groups</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage pilgrim groups</p>
        </Link>
      </div>

      {/* Recent Groups */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-bold text-ink dark:text-ink-dark mb-4">Pilgrim Groups</h3>
        <div className="space-y-3">
          {[
            { name: 'Ramadan Umrah 2026 - Group A', pilgrims: 45, status: 'registered', departure: '2026-04-15' },
            { name: 'Hajj 2026 - Main Group', pilgrims: 156, status: 'approved', departure: '2026-07-15' },
            { name: 'Umrah - Business Group', pilgrims: 32, status: 'planning', departure: '2026-06-01' },
          ].map((group, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div>
                <p className="font-semibold text-ink dark:text-ink-dark">{group.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{group.pilgrims} pilgrims</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                group.status === 'approved' ? 'bg-green-100 text-green-700' :
                group.status === 'registered' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
