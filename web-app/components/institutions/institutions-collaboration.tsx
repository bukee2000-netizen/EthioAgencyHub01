'use client';

import { Handshake, FileText, Calendar } from 'lucide-react';

export function InstitutionCollaboration() {
  const collaborations = [
    { id: 'COLL-001', institution: 'Saudi Medical Group', type: 'Employment', startDate: '2024-01-15', status: 'active', mou: 'Signed' },
    { id: 'COLL-002', institution: 'Gulf Staffing', type: 'Training', startDate: '2024-03-20', status: 'active', mou: 'Signed' },
    { id: 'COLL-003', institution: 'Qatar Development', type: 'Joint Venture', startDate: '2024-06-01', status: 'negotiation', mou: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Collaboration Agreements</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Agreements</p>
          <p className="mt-2 text-2xl font-bold text-cyan-600">34</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-green-50 to-green-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Active</p>
          <p className="mt-2 text-2xl font-bold text-green-600">28</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">In Negotiation</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">4</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Expiring Soon</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">2</p>
        </div>
      </div>

      {/* Collaborations Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Collaboration Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Institution</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Start Date</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">MOU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {collaborations.map((coll) => (
                <tr key={coll.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{coll.institution}</td>
                  <td className="px-6 py-4">{coll.type}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{coll.startDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      coll.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {coll.status.charAt(0).toUpperCase() + coll.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      coll.mou === 'Signed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {coll.mou}
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
