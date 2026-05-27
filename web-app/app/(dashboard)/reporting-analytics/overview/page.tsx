'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, Download, Users, FileText, DollarSign, ArrowRight, ChevronRight } from 'lucide-react';

export default function AnalyticsOverviewPage() {
  const [stats, setStats] = useState({ employees: 0, deployed: 0, travelReady: 0, docs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/employees/stats').then(r => r.json()).catch(() => ({})),
      fetch('/api/documents').then(r => r.json()).catch(() => ({}))
    ]).then(([e, d]) => {
      const es = e.success ? (e.data || e.stats || {}) : {};
      const ds = d.success && Array.isArray(d.data) ? d.data : [];
      setStats({
        employees: es.total || es.totalEmployees || 0,
        deployed: es.deployed || 0,
        travelReady: es.travelReady || 0,
        docs: ds.length || 0
      });
    }).finally(() => setLoading(false));
  }, []);

  const reportTypes = [
    { title: 'Employee Reports', href: '/reporting-analytics/employee-reports', icon: Users, desc: 'Registration, deployment & status analytics', color: 'bg-blue-500' },
    { title: 'Document Reports', href: '/reporting-analytics/document-reports', icon: FileText, desc: 'Processing & verification analytics', color: 'bg-purple-500' },
    { title: 'Financial Reports', href: '/reporting-analytics/financial-reports', icon: DollarSign, desc: 'Revenue, commissions & billing metrics', color: 'bg-emerald-500' },
    { title: 'Export Data', href: '/reporting-analytics/export', icon: Download, desc: 'Bulk export employee data & reports', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-ink">Reporting & Analytics</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Employees', value: stats.employees, icon: Users, color: 'text-brand-600', bg: 'bg-brand-50' },
          { label: 'Travel Ready', value: stats.travelReady, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Deployed', value: stats.deployed, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Documents', value: stats.docs, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl border border-slate-200 ${item.bg} p-5 shadow-sm`}>
            <item.icon className={`h-6 w-6 ${item.color} mb-3`} />
            <p className="text-3xl font-bold text-ink">{loading ? '...' : item.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-600">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map(r => (
          <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm">
            <div className={`rounded-xl ${r.color} p-3 text-white group-hover:scale-105 transition-transform shrink-0`}>
              <r.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink text-lg">{r.title}</h3>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-slate-500 mt-1">{r.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
