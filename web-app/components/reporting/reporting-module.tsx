'use client';

import { BarChart3, PieChart, TrendingUp, FileText, Download } from 'lucide-react';
import Link from 'next/link';

export function ReportingAnalyticsModule() {
  const stats = [
    { label: 'Reports Generated', value: '156', icon: FileText, color: 'bg-green-100 text-green-600' },
    { label: 'Data Points', value: '12.4K', icon: BarChart3, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Export Formats', value: '5', icon: Download, color: 'bg-teal-100 text-teal-600' },
    { label: 'Export Quota', value: '98%', icon: TrendingUp, color: 'bg-cyan-100 text-cyan-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Reporting & Analytics</h1>
        <p className="mt-2 text-slate-500">Generate operational reports and analytics insights</p>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/reporting-analytics/overview" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50/50 transition-all">
          <BarChart3 className="h-5 w-5 text-green-600 mb-3" />
          <p className="font-semibold text-ink">Overview</p>
          <p className="text-xs text-slate-500 mt-1">Dashboard</p>
        </Link>
        <Link href="/reporting-analytics/employee-reports" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50/50 transition-all">
          <FileText className="h-5 w-5 text-green-600 mb-3" />
          <p className="font-semibold text-ink">Employee</p>
          <p className="text-xs text-slate-500 mt-1">Employee reports</p>
        </Link>
        <Link href="/reporting-analytics/document-reports" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50/50 transition-all">
          <FileText className="h-5 w-5 text-green-600 mb-3" />
          <p className="font-semibold text-ink">Documents</p>
          <p className="text-xs text-slate-500 mt-1">Document reports</p>
        </Link>
        <Link href="/reporting-analytics/financial-reports" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50/50 transition-all">
          <TrendingUp className="h-5 w-5 text-green-600 mb-3" />
          <p className="font-semibold text-ink">Financial</p>
          <p className="text-xs text-slate-500 mt-1">Revenue reports</p>
        </Link>
        <Link href="/reporting-analytics/export" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-green-200 hover:bg-green-50/50 transition-all">
          <Download className="h-5 w-5 text-green-600 mb-3" />
          <p className="font-semibold text-ink">Export</p>
          <p className="text-xs text-slate-500 mt-1">Download data</p>
        </Link>
      </div>

      {/* Available Reports */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Available Reports</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'Monthly Employee Summary',
            'Document Processing Pipeline',
            'Travel & Departure Summary',
            'Agency Performance KPIs',
            'Financial & Commission Report',
            'Compliance & Audit Report',
          ].map((report, idx) => (
            <button
              key={idx}
              className="text-left p-4 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50/50 transition-all flex items-center justify-between group"
            >
              <span className="font-medium text-slate-700 group-hover:text-green-700">{report}</span>
              <Download className="h-4 w-4 text-slate-400 group-hover:text-green-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
