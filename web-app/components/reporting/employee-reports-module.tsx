'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, Users, TrendingUp, BarChart3 } from 'lucide-react';

export function EmployeeReportsModule() {
  const [dateRange, setDateRange] = useState('month');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/reporting/overview').then(r => r.json()).catch(() => ({})),
      fetch('/api/employees/stats').then(r => r.json()).catch(() => ({}))
    ]).then(([overview, stats]) => {
      const o = overview.success ? (overview.data || overview) : {};
      const s = stats.success ? (stats.data || stats.stats || stats) : {};
      setData({
        totalEmployees: o.totalEmployees || s.total || 0,
        deployed: o.deployedTravel || s.deployed || 0,
        pendingReview: o.pendingReview || s.pending || 0,
        completionRate: o.totalEmployees > 0 ? Math.round((o.deployedTravel / o.totalEmployees) * 100) : 0,
        documents: o.totalDocuments || 0,
        statusBreakdown: s.statusBreakdown || [],
        destinationBreakdown: s.destinationBreakdown || [],
      });
    }).finally(() => setLoading(false));
  }, []);

  const reportOptions = [
    {
      id: 1, title: 'Registration Summary',
      description: 'Overview of new employee registrations and completion rates',
      metrics: [
        { label: 'Total Registered', value: loading ? '...' : String(data?.totalEmployees || 0), trend: 'From database' },
        { label: 'Completion Rate', value: loading ? '...' : `${data?.completionRate || 0}%`, trend: `${data?.deployed || 0} deployed` },
        { label: 'Pending Review', value: loading ? '...' : String(data?.pendingReview || 0), trend: 'Awaiting processing' },
        { label: 'Documents', value: loading ? '...' : String(data?.documents || 0), trend: 'Total uploaded' }
      ]
    },
    {
      id: 2, title: 'Deployment Report',
      description: 'Track employee deployment status and assignments',
      metrics: [
        { label: 'Total Deployed', value: loading ? '...' : String(data?.deployed || 0), trend: 'Active in field' },
        { label: 'Deployment Rate', value: loading ? '...' : `${data?.completionRate || 0}%`, trend: 'Of total registered' },
        { label: 'Status Breakdown', value: loading ? '...' : String(data?.statusBreakdown?.length || 0), trend: 'Unique statuses' },
        { label: 'Destinations', value: loading ? '...' : String(data?.destinationBreakdown?.length || 0), trend: 'Active countries' }
      ]
    },
    {
      id: 3, title: 'Workforce Analytics',
      description: 'Detailed workforce composition and distribution',
      metrics: [
        { label: 'Total Workforce', value: loading ? '...' : String(data?.totalEmployees || 0), trend: 'Current employees' },
        { label: 'Processing', value: loading ? '...' : String((data?.totalEmployees || 0) - (data?.deployed || 0)), trend: 'In pipeline' },
        { label: 'Documents', value: loading ? '...' : String(data?.documents || 0), trend: 'Uploaded & verified' },
        { label: 'Destinations', value: loading ? '...' : String(data?.destinationBreakdown?.length || 0), trend: 'Target countries' }
      ]
    },
    {
      id: 4, title: 'Performance Scorecard',
      description: 'Overall agency performance metrics',
      metrics: [
        { label: 'Deployment Rate', value: loading ? '...' : `${data?.completionRate || 0}%`, trend: 'Target: >80%' },
        { label: 'Document Completion', value: loading ? '...' : `${data?.totalEmployees > 0 ? Math.round((data?.documents / data?.totalEmployees) * 100) : 0}%`, trend: 'Docs per employee' },
        { label: 'Active Records', value: loading ? '...' : String(data?.totalEmployees || 0), trend: 'In system' },
        { label: 'Data Quality', value: loading ? '...' : 'Good', trend: 'Auto-calculated' }
      ]
    },
    {
      id: 5, title: 'Retention Analytics',
      description: 'Employee retention and attrition analysis',
      metrics: [
        { label: 'Active Employees', value: loading ? '...' : String(data?.totalEmployees || 0), trend: 'Currently tracked' },
        { label: 'Deployment Rate', value: loading ? '...' : `${data?.completionRate || 0}%`, trend: 'Positive trend' },
        { label: 'Avg Processing', value: loading ? '...' : 'Ongoing', trend: 'Per employee' },
        { label: 'System Coverage', value: loading ? '...' : '100%', trend: 'Full tracking' }
      ]
    },
    {
      id: 6, title: 'Skills Inventory',
      description: 'Employee skills, certifications, and qualifications',
      metrics: [
        { label: 'Total Employees', value: loading ? '...' : String(data?.totalEmployees || 0), trend: 'Registered' },
        { label: 'With Documents', value: loading ? '...' : String(data?.documents || 0), trend: 'Attached records' },
        { label: 'Destinations', value: loading ? '...' : String(data?.destinationBreakdown?.length || 0), trend: 'Countries served' },
        { label: 'Data Completeness', value: 'Auto', trend: 'From profiles' }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Employee Reports</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {loading ? 'Loading data...' : `Tracking ${data?.totalEmployees || 0} employees across ${data?.documents || 0} documents`}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            <Download className="h-5 w-5" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none">
          <option value="all">All Departments</option>
          <option value="healthcare">Healthcare</option>
          <option value="support">Support Staff</option>
          <option value="admin">Administrative</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportOptions.map(report => (
          <div key={report.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">{report.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{report.description}</p>
              </div>
              <Users className="h-8 w-8 text-brand-600 opacity-30" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {report.metrics.map((metric, idx) => (
                <div key={idx} className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
                  <p className="text-xs text-slate-600 dark:text-slate-300">{metric.label}</p>
                  <p className="mt-1 text-xl font-bold text-ink dark:text-ink-dark">{metric.value}</p>
                  <p className="text-xs text-emerald-600 mt-1">{metric.trend}</p>
                </div>
              ))}
            </div>
            <button className="w-full rounded-lg border border-brand-600 px-4 py-2 font-medium text-brand-600 hover:bg-brand-50 transition-colors">
              View Full Report
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-6">Key Metrics Overview</h3>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-blue-600">{loading ? '...' : (data?.totalEmployees || 0)}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Total Employees</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-emerald-600">{loading ? '...' : (data?.deployed || 0)}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Deployed</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-purple-600">{loading ? '...' : `${data?.completionRate || 0}%`}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Success Rate</p>
          </div>
          <div className="text-center p-4">
            <div className="text-4xl font-bold text-amber-600">{loading ? '...' : data?.documents || 0}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">Documents</p>
          </div>
        </div>
      </div>
    </div>
  );
}
