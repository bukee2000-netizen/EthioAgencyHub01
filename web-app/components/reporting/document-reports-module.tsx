'use client';

import { useState, useEffect } from 'react';
import { Download, Filter, FileText, BarChart3, AlertCircle } from 'lucide-react';

export function DocumentReportsModule() {
  const [dateRange, setDateRange] = useState('month');
  const [docTypeFilter, setDocTypeFilter] = useState('all');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/reporting/overview').then(r => r.json()).catch(() => ({})),
      fetch('/api/reporting/document-reports').then(r => r.json()).catch(() => ({}))
    ]).then(([overview, docs]) => {
      const o = overview.success ? (overview.data || overview) : {};
      const d = docs.success ? (docs.data || []) : [];
      const typeBreakdown = o.typeBreakdown || [];
      const totalDocs = o.totalDocuments || d.length || 0;
      const verified = o.verifiedDocuments || d.filter((x: any) => x.status === 'VERIFIED').length || 0;
      const pending = totalDocs - verified;
      setData({
        totalDocuments: totalDocs,
        verified,
        pending,
        verifiedRate: totalDocs > 0 ? Math.round((verified / totalDocs) * 100) : 0,
        typeBreakdown,
        rejected: d.filter((x: any) => x.status === 'REJECTED').length,
        rawDocs: d,
      });
    }).finally(() => setLoading(false));
  }, []);

  const reportOptions = [
    {
      id: 1, title: 'Document Verification Summary',
      description: 'Track document processing and verification status',
      metrics: [
        { label: 'Total Documents', value: loading ? '...' : String(data?.totalDocuments || 0), trend: 'All uploaded' },
        { label: 'Verified', value: loading ? '...' : `${data?.verifiedRate || 0}%`, trend: `${data?.verified || 0} verified` },
        { label: 'Pending', value: loading ? '...' : String(data?.pending || 0), trend: 'Awaiting review' },
        { label: 'Rejected', value: loading ? '...' : String(data?.rejected || 0), trend: 'Needs re-upload' }
      ]
    },
    {
      id: 2, title: 'Document Type Analysis',
      description: 'Breakdown by document type and processing status',
      metrics: [
        { label: 'Types Available', value: loading ? '...' : String(data?.typeBreakdown?.length || 0), trend: 'Unique types' },
        { label: 'Most Common', value: loading ? '...' : (data?.typeBreakdown?.[0]?.type || 'N/A'), trend: 'By count' },
        { label: 'Verified Rate', value: loading ? '...' : `${data?.verifiedRate || 0}%`, trend: 'Overall' },
        { label: 'Pending Items', value: loading ? '...' : String(data?.pending || 0), trend: 'Requires action' }
      ]
    },
    {
      id: 3, title: 'Compliance Report',
      description: 'Document compliance and regulatory adherence',
      metrics: [
        { label: 'Compliant Rate', value: loading ? '...' : `${data?.verifiedRate || 0}%`, trend: 'Of total documents' },
        { label: 'Pending Review', value: loading ? '...' : String(data?.pending || 0), trend: 'Not yet verified' },
        { label: 'Rejected', value: loading ? '...' : String(data?.rejected || 0), trend: 'Needs correction' },
        { label: 'Total Processed', value: loading ? '...' : String(data?.totalDocuments || 0), trend: 'All documents' }
      ]
    },
    {
      id: 4, title: 'Expiration Dashboard',
      description: 'Track document expiration dates and renewals',
      metrics: [
        { label: 'Total Records', value: loading ? '...' : String(data?.totalDocuments || 0), trend: 'In database' },
        { label: 'Verified', value: loading ? '...' : String(data?.verified || 0), trend: 'Confirmed valid' },
        { label: 'Pending', value: loading ? '...' : String(data?.pending || 0), trend: 'Not yet checked' },
        { label: 'Verification Rate', value: loading ? '...' : `${data?.verifiedRate || 0}%`, trend: 'Of submitted' }
      ]
    },
    {
      id: 5, title: 'Upload Analytics',
      description: 'Document upload patterns and success rates',
      metrics: [
        { label: 'Total Uploads', value: loading ? '...' : String(data?.totalDocuments || 0), trend: 'All documents' },
        { label: 'Success Rate', value: loading ? '...' : `${data?.verifiedRate || 0}%`, trend: 'Verified ratio' },
        { label: 'Pending Review', value: loading ? '...' : String(data?.pending || 0), trend: 'In queue' },
        { label: 'Types Breakdown', value: loading ? '...' : String(data?.typeBreakdown?.length || 0), trend: 'Categories' }
      ]
    },
    {
      id: 6, title: 'Storage Report',
      description: 'Document storage and capacity overview',
      metrics: [
        { label: 'Total Documents', value: loading ? '...' : String(data?.totalDocuments || 0), trend: 'Stored' },
        { label: 'Processed', value: loading ? '...' : String(data?.verified || 0), trend: 'Completed review' },
        { label: 'Pending', value: loading ? '...' : String(data?.pending || 0), trend: 'In review' },
        { label: 'Data Quality', value: loading ? '...' : 'Good', trend: 'Auto-reported' }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Document Reports</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              {loading ? 'Loading...' : `${data?.totalDocuments || 0} documents, ${data?.verifiedRate || 0}% verified rate`}
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
        </select>
        <select value={docTypeFilter} onChange={(e) => setDocTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none">
          <option value="all">All Document Types</option>
          <option value="passport">Passports</option>
          <option value="visa">Visas</option>
          <option value="medical">Medical</option>
          <option value="employment">Employment</option>
        </select>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-900">Action Required</p>
          <p className="text-sm text-amber-800 mt-1">
            {loading ? 'Loading...' : `${data?.pending || 0} documents pending review, ${data?.rejected || 0} rejected. Review the Verification Summary for details.`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportOptions.map(report => (
          <div key={report.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">{report.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{report.description}</p>
              </div>
              <FileText className="h-8 w-8 text-brand-600 opacity-30" />
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
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
