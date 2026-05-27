'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileCheck2, Upload, FileText, Landmark, AlertCircle, CheckCircle2, ArrowRight, Search, Users, Globe, Clock } from 'lucide-react';

export function DocumentsOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, processing: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          const docs = data.data;
          setStats({
            total: docs.length,
            pending: docs.filter((d: any) => d.status === 'PENDING').length,
            approved: docs.filter((d: any) => d.status === 'VERIFIED' || d.status === 'APPROVED').length,
            processing: docs.filter((d: any) => d.status === 'PROCESSING' || d.status === 'REVIEW').length,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const documentCategories = [
    { title: 'Upload Documents', href: '/documents/upload', icon: Upload, desc: 'Add new documents to the system', color: 'bg-blue-500' },
    { title: 'Visa Documents', href: '/documents/visa', icon: FileText, desc: 'Manage visa applications & timelines', color: 'bg-purple-500' },
    { title: 'MOLS Processing', href: '/documents/mols', icon: Landmark, desc: 'Track MOLS submissions & status', color: 'bg-orange-500' },
    { title: 'Missing Reports', href: '/documents/missing-report', icon: AlertCircle, desc: 'Find & resolve missing documents', color: 'bg-red-500' },
    { title: 'Cross-Match', href: '/documents/cross-match', icon: CheckCircle2, desc: 'Verify document-employee matches', color: 'bg-green-500' },
    { title: 'Employee Documents', href: '/employee-management/profiles', icon: Users, desc: 'View documents per employee', color: 'bg-brand-500' },
  ];

  const quickLinks = [
    { label: 'View All Documents', href: '/documents/upload', count: loading ? '-' : stats.total },
    { label: 'Pending Reviews', href: '/documents/upload?status=pending', count: loading ? '-' : stats.pending },
    { label: 'Approved Documents', href: '/documents/upload?status=approved', count: loading ? '-' : stats.approved },
    { label: 'In Processing', href: '/documents/mols', count: loading ? '-' : stats.processing },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark">
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Document Management</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Documents', value: stats.total, icon: FileCheck2, color: 'bg-blue-500', text: 'text-blue-700' },
          { label: 'Pending Review', value: stats.pending, icon: AlertCircle, color: 'bg-orange-500', text: 'text-orange-700' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'bg-green-500', text: 'text-green-700' },
          { label: 'In Processing', value: stats.processing, icon: Clock, color: 'bg-purple-500', text: 'text-purple-700' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:shadow-md transition-shadow">
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg ${stat.color} p-3 text-white`}><stat.icon className="h-5 w-5" /></div>
            </div>
            <p className="text-3xl font-bold text-ink dark:text-ink-dark">{loading ? '...' : stat.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {documentCategories.map((cat) => (
          <Link key={cat.href} href={cat.href} className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm dark:shadow-soft-dark hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-xl ${cat.color} p-3 text-white group-hover:scale-105 transition-transform`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="font-bold text-ink dark:text-ink-dark text-lg">{cat.title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Quick Access</h3>
        </div>
        <div className="grid gap-0 divide-y divide-slate-100 dark:divide-slate-700">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{link.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-600">{link.count}</span>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
