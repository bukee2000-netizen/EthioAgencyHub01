'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, LineChart, Calendar } from 'lucide-react';

export function TrendsModule() {
  const [timeRange, setTimeRange] = useState('month');

  const metrics = [
    {
      label: 'Total Registrations',
      current: 156,
      previous: 142,
      trend: 'up',
      percentChange: 9.9
    },
    {
      label: 'Documents Processed',
      current: 892,
      previous: 845,
      trend: 'up',
      percentChange: 5.6
    },
    {
      label: 'Travel Bookings',
      current: 34,
      previous: 28,
      trend: 'up',
      percentChange: 21.4
    },
    {
      label: 'Deployment Rate',
      current: 92,
      previous: 88,
      trend: 'up',
      percentChange: 4.5
    },
    {
      label: 'Avg Processing Time',
      current: 4.2,
      previous: 5.1,
      trend: 'down',
      percentChange: 17.6
    },
    {
      label: 'Customer Satisfaction',
      current: 94,
      previous: 91,
      trend: 'up',
      percentChange: 3.3
    },
  ];

  const monthlyData = [
    { month: 'Jan', registrations: 128, documents: 720, travel: 24 },
    { month: 'Feb', registrations: 142, documents: 845, travel: 28 },
    { month: 'Mar', registrations: 156, documents: 892, travel: 34 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Trends & Analytics</h2>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2 justify-center">
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Key Performance Indicators</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{metric.label}</p>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-ink dark:text-ink-dark">{metric.current}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">from {metric.previous}</p>
                </div>
                <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span className="font-semibold">{metric.percentChange}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Data Visualization */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-base font-semibold text-ink dark:text-ink-dark mb-4">Monthly Performance</h3>
        <div className="space-y-8">
          {/* Registrations Trend */}
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200 mb-3">Employee Registrations</p>
            <div className="flex items-end justify-around gap-2 h-32">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-lg" style={{ height: `${(data.registrations / 160) * 100}%` }} />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{data.month}</p>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark">{data.registrations}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Trend */}
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200 mb-3">Documents Processed</p>
            <div className="flex items-end justify-around gap-2 h-32">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg" style={{ height: `${(data.documents / 920) * 100}%` }} />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{data.month}</p>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark">{data.documents}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Travel Trend */}
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200 mb-3">Travel Bookings</p>
            <div className="flex items-end justify-around gap-2 h-32">
              {monthlyData.map((data, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: `${(data.travel / 35) * 100}%` }} />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{data.month}</p>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark">{data.travel}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trends & Insights */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h3 className="text-base font-semibold text-ink dark:text-ink-dark mb-3">Trends & Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-emerald-900">Positive Growth</p>
              <p className="text-sm text-emerald-800 mt-1">
                All key metrics show positive month-over-month growth, indicating strong operational performance.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900">Processing Efficiency</p>
              <p className="text-sm text-blue-800 mt-1">
                Average processing time decreased by 17.6%, demonstrating improved workflow efficiency.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
            <Calendar className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-900">Seasonal Pattern</p>
              <p className="text-sm text-amber-800 mt-1">
                Travel bookings peak in February-March, likely aligned with Hajj and Umrah seasons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
          <h3 className="text-base font-semibold text-ink dark:text-ink-dark">Period Comparison</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Metric</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">This Month</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Last Month</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.slice(0, 6).map((metric, idx) => (
              <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-4 py-3 font-medium text-ink dark:text-ink-dark">{metric.label}</td>
                <td className="px-4 py-3 font-semibold text-ink dark:text-ink-dark">{metric.current}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{metric.previous}</td>
                <td className={`px-4 py-3 font-semibold ${metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? '+' : '-'}{metric.percentChange}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
