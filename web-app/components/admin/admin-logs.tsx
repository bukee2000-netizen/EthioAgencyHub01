'use client';

import { FileText, Download, Calendar } from 'lucide-react';

export function AdminLogs() {
  const logs = [
    { id: 'LOG-001', timestamp: '2026-03-18 14:32', user: 'Ahmed Abdi', action: 'User Created', module: 'Administration', status: 'success' },
    { id: 'LOG-002', timestamp: '2026-03-18 13:15', user: 'Fatima Hassan', action: 'Role Modified', module: 'Administration', status: 'success' },
    { id: 'LOG-003', timestamp: '2026-03-18 12:45', user: 'Mohammed Ali', action: 'Settings Updated', module: 'System', status: 'success' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">System Logs</h1>
        <p className="mt-2 text-slate-500">View detailed system activity and events</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-red-50 to-red-100/50">
          <p className="text-sm text-slate-600">Total Logs</p>
          <p className="mt-2 text-2xl font-bold text-red-600">2,847</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-green-50 to-green-100/50">
          <p className="text-sm text-slate-600">Success</p>
          <p className="mt-2 text-2xl font-bold text-green-600">2,801</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <p className="text-sm text-slate-600">Warnings</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">34</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-red-100 to-red-200/50">
          <p className="text-sm text-slate-600">Errors</p>
          <p className="mt-2 text-2xl font-bold text-red-700">12</p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Activity Log</h3>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Timestamp</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">User</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Action</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Module</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">{log.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{log.user}</td>
                  <td className="px-6 py-4">{log.action}</td>
                  <td className="px-6 py-4">{log.module}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
