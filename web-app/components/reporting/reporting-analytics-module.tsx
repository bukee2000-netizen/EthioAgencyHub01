'use client';

import { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Filter, Calendar, Users, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface ReportOption {
  title: string;
  description: string;
  icon: any;
  href: string;
  lastGenerated?: string;
}

export function ReportingAnalyticsModule() {
  const [dateRange, setDateRange] = useState('month');

  const reports: ReportOption[] = [
    {
      title: 'Employee Reports',
      description: 'Registration, deployment, and status analytics by agent and destination.',
      icon: Users,
      href: '/reporting-analytics/employee-reports',
      lastGenerated: '2 days ago'
    },
    {
      title: 'Document Reports',
      description: 'Document processing, verification status, and pipeline analytics.',
      icon: FileText,
      href: '/reporting-analytics/document-reports',
      lastGenerated: '1 day ago'
    },
    {
      title: 'Financial Reports',
      description: 'Revenue, commissions, billing, and financial performance metrics.',
      icon: DollarSign,
      href: '/reporting-analytics/financial-reports',
      lastGenerated: '5 days ago'
    },
    {
      title: 'Export Data',
      description: 'Bulk export employee data, CVs, and reports in multiple formats.',
      icon: Download,
      href: '/reporting-analytics/export',
      lastGenerated: undefined
    }
  ];

  const keyMetrics = [
    { label: 'Total Employees', value: '156', change: '+12%', color: 'bg-blue-100 text-blue-700' },
    { label: 'Deployment Rate', value: '87%', change: '+5%', color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Avg Processing Time', value: '8.5 days', change: '-2 days', color: 'bg-purple-100 text-purple-700' },
    { label: 'Commission Pending', value: 'ETB 45K', change: '+8K', color: 'bg-amber-100 text-amber-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Reporting & Analytics</h2>
          </div>
          <BarChart3 className="h-8 w-8 text-brand-600 opacity-20" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-600 focus:outline-none"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>

        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
          <Calendar className="h-4 w-4" />
          Select Dates
        </button>

        <button className="ml-auto flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {keyMetrics.map((metric, idx) => (
          <div key={idx} className={`rounded-2xl p-6 ${metric.color}`}>
            <p className="text-sm font-medium opacity-80">{metric.label}</p>
            <p className="mt-2 text-2xl font-bold">{metric.value}</p>
            <p className="mt-1 text-xs font-semibold opacity-70">
              {metric.change} from last period
            </p>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Link
              key={report.href}
              href={report.href}
              className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="h-8 w-8 text-brand-600" />
                {report.lastGenerated && (
                  <span className="text-xs text-slate-500">{report.lastGenerated}</span>
                )}
              </div>
              <h3 className="font-semibold text-ink">{report.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{report.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs font-medium text-brand-600">Generate Report →</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics Dashboard Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-ink mb-6">Agency Performance Overview</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Sample Chart 1 */}
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600 mb-4">Employee Status Distribution</p>
            <div className="space-y-3">
              {[
                { label: 'Deployed', value: 45, color: 'bg-emerald-500' },
                { label: 'Ready', value: 38, color: 'bg-blue-500' },
                { label: 'In Review', value: 32, color: 'bg-yellow-500' },
                { label: 'Registered', value: 41, color: 'bg-slate-500' }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-ink">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Chart 2 */}
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-medium text-slate-600 mb-4">Top Destinations</p>
            <div className="space-y-3">
              {[
                { destination: 'Saudi Arabia', count: 45, percent: 28 },
                { destination: 'UAE', count: 32, percent: 20 },
                { destination: 'Qatar', count: 28, percent: 18 },
                { destination: 'Kuwait', count: 22, percent: 14 },
                { destination: 'Others', count: 29, percent: 20 }
              ].map((item) => (
                <div key={item.destination}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{item.destination}</span>
                    <span className="text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-brand-600"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Reports */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="font-semibold text-ink mb-4">Suggested Reports</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            'Monthly KPI Summary',
            'Agent Performance Ranking',
            'Document Processing Efficiency',
            'Destination-wise Deployment',
            'Financial Summary Report',
            'Compliance & Audit Report'
          ].map((report) => (
            <button
              key={report}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              {report}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
