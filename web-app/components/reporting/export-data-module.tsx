'use client';

import { useState } from 'react';
import { Download, FileText, Database, Package, BarChart3 } from 'lucide-react';

export function ExportDataModule() {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedData, setSelectedData] = useState<string[]>(['employees']);

  const dataCategories = [
    { id: 'employees', label: 'Employee Data', records: 156, icon: 'ðŸ‘¥' },
    { id: 'documents', label: 'Documents', records: 892, icon: 'ðŸ“„' },
    { id: 'travel', label: 'Travel Records', records: 156, icon: 'âœˆï¸' },
    { id: 'pilgrims', label: 'Pilgrims', records: 78, icon: 'ðŸ•Œ' },
    { id: 'agents', label: 'Agents', records: 20, icon: 'ðŸ‘¨â€ðŸ’¼' },
    { id: 'financial', label: 'Financial Data', records: 342, icon: 'ðŸ’°' },
  ];

  const exportFormats = [
    { id: 'csv', label: 'CSV', description: 'Comma-separated values', icon: 'ðŸ“Š' },
    { id: 'excel', label: 'Excel', description: 'Microsoft Excel workbook', icon: 'ðŸ“ˆ' },
    { id: 'pdf', label: 'PDF', description: 'Portable Document Format', icon: 'ðŸ“‹' },
    { id: 'json', label: 'JSON', description: 'JSON format for API integration', icon: 'âš™ï¸' },
  ];

  const toggleDataCategory = (id: string) => {
    setSelectedData(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const calculateTotalRecords = () => {
    return dataCategories
      .filter(cat => selectedData.includes(cat.id))
      .reduce((sum, cat) => sum + cat.records, 0);
  };

  const recentExports = [
    { id: 1, name: 'Employee-Roster-Feb2024.csv', size: '2.3 MB', date: '2024-02-15 14:32', status: 'completed' },
    { id: 2, name: 'Financial-Report-Jan2024.xlsx', size: '1.8 MB', date: '2024-02-10 09:15', status: 'completed' },
    { id: 3, name: 'Travel-Records-Q1.pdf', size: '5.1 MB', date: '2024-02-05 16:45', status: 'completed' },
    { id: 4, name: 'Database-Backup-Full.json', size: '12.4 MB', date: '2024-01-31 22:00', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div>
          <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Export Data</h2>
        </div>
      </div>

      {/* Export Configuration */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Data Selection */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Select Data to Export</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {dataCategories.map(category => (
              <label
                key={category.id}
                className="flex items-center gap-3 p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-brand-600 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedData.includes(category.id)}
                  onChange={() => toggleDataCategory(category.id)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-xl">{category.icon}</span>
                <div>
                  <p className="font-medium text-ink dark:text-ink-dark">{category.label}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{category.records} records</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-blue-50 p-6">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Export Summary</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Selected Categories</p>
              <p className="text-3xl font-bold text-brand-600 mt-1">{selectedData.length}</p>
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300">Total Records</p>
              <p className="text-3xl font-bold text-ink dark:text-ink-dark mt-1">{calculateTotalRecords().toLocaleString()}</p>
            </div>
            <div className="pt-4 border-t border-brand-200">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700 transition-colors">
                <Download className="h-5 w-5" />
                Export Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Format Selection */}
      <div>
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Choose Export Format</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {exportFormats.map(format => (
            <button
              key={format.id}
              onClick={() => setSelectedFormat(format.id)}
              className={`rounded-2xl border-2 p-6 text-center transition-colors ${
                selectedFormat === format.id
                  ? 'border-brand-600 bg-brand-50'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
              }`}
            >
              <p className="text-3xl mb-2">{format.icon}</p>
              <p className="font-semibold text-ink dark:text-ink-dark">{format.label}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Advanced Options</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Date Range</label>
            <select className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none">
              <option>All Time</option>
              <option>This Year</option>
              <option>This Month</option>
              <option>Last 7 Days</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Include Archived</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 rounded" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Include archived records</span>
            </label>
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Recent Exports</h3>
        </div>
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">File Name</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Size</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentExports.map(exp => (
              <tr key={exp.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{exp.name}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{exp.size}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{exp.date}</td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {exp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="flex items-center justify-end gap-1 text-brand-600 hover:text-brand-700">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
