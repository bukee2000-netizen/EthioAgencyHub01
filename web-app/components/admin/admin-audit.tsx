'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';

export function AdminAudit() {
  const auditTrail = [
    { id: 'AUD-001', timestamp: '2026-03-18 14:32', user: 'Ahmed Abdi', action: 'User Created', details: 'Mohammed.hassan@agency.com', status: 'approved' },
    { id: 'AUD-002', timestamp: '2026-03-18 13:15', user: 'Fatima Hassan', action: 'Permission Modified', details: 'Manager role updated', status: 'approved' },
    { id: 'AUD-003', timestamp: '2026-03-18 12:45', user: 'System', action: 'Backup Completed', details: 'Daily backup executed', status: 'approved' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Audit Trail</h1>
        <p className="mt-2 text-slate-500">Track and monitor administrative actions and changes</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-red-50 to-red-100/50">
          <p className="text-sm text-slate-600">Total Audits</p>
          <p className="mt-2 text-2xl font-bold text-red-600">1,247</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-green-50 to-green-100/50">
          <p className="text-sm text-slate-600">Approved</p>
          <p className="mt-2 text-2xl font-bold text-green-600">1,198</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <p className="text-sm text-slate-600">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">28</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <p className="text-sm text-slate-600">This Month</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">234</p>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-ink">Recent Changes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Timestamp</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">User</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Action</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Details</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditTrail.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">{audit.timestamp}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700">{audit.user}</td>
                  <td className="px-6 py-4">{audit.action}</td>
                  <td className="px-6 py-4 text-slate-600">{audit.details}</td>
                  <td className="px-6 py-4">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
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
