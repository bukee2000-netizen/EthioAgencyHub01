'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export function ActivityLogsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const [logs] = useState([
    {
      id: 1,
      timestamp: '2024-02-15 14:32:05',
      user: 'Yohannes Tefera',
      action: 'User Registered',
      target: 'Senait Assefa',
      status: 'success',
      ipAddress: '192.168.1.100',
      details: 'New employee registered in system'
    },
    {
      id: 2,
      timestamp: '2024-02-15 14:28:12',
      user: 'Getnet Kabede',
      action: 'Document Verified',
      target: 'Passport - Abebe Tadesse',
      status: 'success',
      ipAddress: '192.168.1.101',
      details: 'Passport document verified and approved'
    },
    {
      id: 3,
      timestamp: '2024-02-15 14:15:44',
      user: 'Senait Assefa',
      action: 'Travel Scheduled',
      target: 'Flight SR-123456',
      status: 'success',
      ipAddress: '192.168.1.102',
      details: 'Travel booking confirmed for Riyadh'
    },
    {
      id: 4,
      timestamp: '2024-02-15 13:45:22',
      user: 'Admin',
      action: 'Settings Changed',
      target: 'System Settings',
      status: 'warning',
      ipAddress: '192.168.1.103',
      details: 'Max upload size updated from 50MB to 100MB'
    },
    {
      id: 5,
      timestamp: '2024-02-15 13:12:05',
      user: 'Marta Desalegn',
      action: 'Login Failed',
      target: 'User Account',
      status: 'error',
      ipAddress: '192.168.1.104',
      details: 'Failed login attempt - incorrect password'
    },
  ]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case 'error': return <Trash2 className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Activity Logs</h2>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-6 py-3 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <Download className="h-5 w-5" />
            Export Logs
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Actions</p>
          <p className="mt-2 text-4xl font-bold text-blue-700">{logs.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Success</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{logs.filter(l => l.status === 'success').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Warnings</p>
          <p className="mt-2 text-4xl font-bold text-amber-700">{logs.filter(l => l.status === 'warning').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Errors</p>
          <p className="mt-2 text-4xl font-bold text-red-700">{logs.filter(l => l.status === 'error').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Actions</option>
          <option value="User Registered">User Registered</option>
          <option value="Document Verified">Document Verified</option>
          <option value="Travel Scheduled">Travel Scheduled</option>
          <option value="Settings Changed">Settings Changed</option>
          <option value="Login Failed">Login Failed</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Timestamp</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Action</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Target</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">IP Address</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <tr key={log.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{log.timestamp}</td>
                <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{log.user}</td>
                <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{log.action}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{log.target}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600 dark:text-slate-300">{log.ipAddress}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="text-xs font-semibold capitalize">{log.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">Showing {filteredLogs.length} of {logs.length} logs</p>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50">Previous</button>
          <button className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50">Next</button>
        </div>
      </div>
    </div>
  );
}
