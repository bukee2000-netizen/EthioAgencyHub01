'use client';

import { useState, useEffect } from 'react';
import { Download, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';

export function FinancialReportsModule() {
  const [dateRange, setDateRange] = useState('month');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reporting/financial-reports')
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          const records = res.data || [];
          const totalRevenue = records.reduce((sum: number, r: any) => sum + (r.ticketCost || 0), 0);
          const paid = records.filter((r: any) => r.paymentStatus === 'completed' || r.paymentStatus === 'paid');
          const paidTotal = paid.reduce((sum: number, r: any) => sum + (r.ticketCost || 0), 0);
          const pending = records.filter((r: any) => r.paymentStatus === 'pending' || r.paymentStatus === 'partial');
          const pendingTotal = pending.reduce((sum: number, r: any) => sum + (r.ticketCost || 0), 0);
          const destinations = Array.from(new Set(records.map((r: any) => r.destination).filter(Boolean)));
          setData({ totalRevenue, paidTotal, pendingTotal, recordCount: records.length, destinations: destinations.length, paidCount: paid.length, pendingCount: pending.length });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const financialMetrics = [
    {
      id: 1, title: 'Revenue Summary',
      description: 'Total agency revenue from travel bookings',
      metrics: [
        { label: 'Total Revenue', value: loading ? '...' : `${data?.totalRevenue?.toLocaleString() || 0} ETB`, trend: 'From all bookings' },
        { label: 'Paid', value: loading ? '...' : `${data?.paidTotal?.toLocaleString() || 0} ETB`, trend: `${data?.paidCount || 0} completed` },
        { label: 'Pending', value: loading ? '...' : `${data?.pendingTotal?.toLocaleString() || 0} ETB`, trend: `${data?.pendingCount || 0} pending` },
        { label: 'Collection Rate', value: loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.paidTotal / data?.totalRevenue) * 100) : 0}%`, trend: 'Of total billed' }
      ]
    },
    {
      id: 2, title: 'Payment Tracking',
      description: 'Payment status distribution across travel bookings',
      metrics: [
        { label: 'Total Bookings', value: loading ? '...' : String(data?.recordCount || 0), trend: 'All travel records' },
        { label: 'Paid', value: loading ? '...' : String(data?.paidCount || 0), trend: 'Completed payments' },
        { label: 'Pending', value: loading ? '...' : String(data?.pendingCount || 0), trend: 'Awaiting payment' },
        { label: 'Destinations', value: loading ? '...' : String(data?.destinations || 0), trend: 'Unique countries' }
      ]
    },
    {
      id: 3, title: 'Expense Overview',
      description: 'Booking costs and financial commitments',
      metrics: [
        { label: 'Total Cost', value: loading ? '...' : `${data?.totalRevenue?.toLocaleString() || 0} ETB`, trend: 'Sum of all bookings' },
        { label: 'Avg Per Booking', value: loading ? '...' : `${data?.recordCount > 0 ? Math.round((data?.totalRevenue || 0) / data?.recordCount).toLocaleString() : 0} ETB`, trend: 'Average ticket cost' },
        { label: 'Paid Ratio', value: loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.paidTotal / data?.totalRevenue) * 100) : 0}%`, trend: 'Collected' },
        { label: 'Pending Ratio', value: loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.pendingTotal / data?.totalRevenue) * 100) : 0}%`, trend: 'Outstanding' }
      ]
    },
    {
      id: 4, title: 'Profitability Analysis',
      description: 'Revenue and collection metrics',
      metrics: [
        { label: 'Gross Revenue', value: loading ? '...' : `${data?.totalRevenue?.toLocaleString() || 0} ETB`, trend: 'From bookings' },
        { label: 'Collected', value: loading ? '...' : `${data?.paidTotal?.toLocaleString() || 0} ETB`, trend: 'Received' },
        { label: 'Outstanding', value: loading ? '...' : `${data?.pendingTotal?.toLocaleString() || 0} ETB`, trend: 'To be collected' },
        { label: 'Collection Ratio', value: loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.paidTotal / data?.totalRevenue) * 100) : 0}%`, trend: 'Efficiency metric' }
      ]
    },
    {
      id: 5, title: 'Cash Flow Summary',
      description: 'Inflows and outflows analysis',
      metrics: [
        { label: 'Total Inflow', value: loading ? '...' : `${data?.paidTotal?.toLocaleString() || 0} ETB`, trend: 'Collected payments' },
        { label: 'Expected', value: loading ? '...' : `${data?.pendingTotal?.toLocaleString() || 0} ETB`, trend: 'Pending collection' },
        { label: 'Total Pipeline', value: loading ? '...' : `${data?.totalRevenue?.toLocaleString() || 0} ETB`, trend: 'All bookings' },
        { label: 'Active Bookings', value: loading ? '...' : String(data?.recordCount || 0), trend: 'Total records' }
      ]
    },
    {
      id: 6, title: 'Payment Status',
      description: 'Outstanding invoices and collections',
      metrics: [
        { label: 'Total Outstanding', value: loading ? '...' : `${data?.pendingTotal?.toLocaleString() || 0} ETB`, trend: 'Pending collection' },
        { label: 'Collected', value: loading ? '...' : `${data?.paidTotal?.toLocaleString() || 0} ETB`, trend: 'Received' },
        { label: 'Collection Rate', value: loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.paidTotal / data?.totalRevenue) * 100) : 0}%`, trend: 'Efficiency' },
        { label: 'Bookings', value: loading ? '...' : String(data?.recordCount || 0), trend: 'All travel records' }
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">Financial Reports</h2>
            <p className="mt-2 text-slate-600">
              {loading ? 'Loading...' : `${data?.recordCount || 0} bookings, ${data?.totalRevenue?.toLocaleString() || 0} ETB total revenue`}
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            <Download className="h-5 w-5" />
            Export Financials
          </button>
        </div>
      </div>

      <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
        className="rounded-lg border border-slate-200 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none">
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="quarter">This Quarter</option>
        <option value="year">This Year</option>
      </select>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <p className="text-sm font-medium text-slate-600">Total Revenue</p>
            <p className="mt-3 text-3xl font-bold text-emerald-700">{loading ? '...' : `${(data?.totalRevenue || 0).toLocaleString()} ETB`}</p>
            <p className="text-xs text-emerald-600 mt-2">From travel bookings</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Collected</p>
            <p className="mt-3 text-3xl font-bold text-green-600">{loading ? '...' : `${(data?.paidTotal || 0).toLocaleString()} ETB`}</p>
            <p className="text-xs text-green-600 mt-2">Paid bookings</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Outstanding</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{loading ? '...' : `${(data?.pendingTotal || 0).toLocaleString()} ETB`}</p>
            <p className="text-xs text-amber-600 mt-2">Pending collection</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">Collection Rate</p>
            <p className="mt-3 text-3xl font-bold text-blue-700">{loading ? '...' : `${data?.totalRevenue > 0 ? Math.round((data?.paidTotal / data?.totalRevenue) * 100) : 0}%`}</p>
            <p className="text-xs text-emerald-600 mt-2">Of total billed</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {financialMetrics.map(report => (
          <div key={report.id} className="rounded-2xl border border-slate-200 bg-white p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-ink">{report.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{report.description}</p>
              </div>
              <DollarSign className="h-8 w-8 text-brand-600 opacity-30" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {report.metrics.map((metric, idx) => (
                <div key={idx} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-600">{metric.label}</p>
                  <p className="mt-1 text-xl font-bold text-ink">{metric.value}</p>
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

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-ink mb-6">Revenue Overview</h3>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="font-medium text-slate-700 mb-3">Revenue Distribution</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-slate-500">Collected</p>
                <p className="text-lg font-bold text-emerald-700">{loading ? '...' : `${(data?.paidTotal || 0).toLocaleString()} ETB`}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className="text-lg font-bold text-amber-700">{loading ? '...' : `${(data?.pendingTotal || 0).toLocaleString()} ETB`}</p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-3">Booking Summary</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs text-slate-500">Total Bookings</p>
                <p className="text-lg font-bold text-blue-700">{loading ? '...' : data?.recordCount || 0}</p>
              </div>
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-xs text-slate-500">Destinations</p>
                <p className="text-lg font-bold text-purple-700">{loading ? '...' : data?.destinations || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
