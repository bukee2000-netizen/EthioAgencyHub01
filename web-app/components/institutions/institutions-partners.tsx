'use client';

import { Users, CheckCircle2 } from 'lucide-react';

export function InstitutionPartners() {
  const partners = [
    { name: 'Ahmed Al-Mansouri', institution: 'Saudi Medical Group', role: 'Director', email: 'ahmed@saudi.com', status: 'active' },
    { name: 'Fatima Al-Mazrouei', institution: 'Gulf Staffing Solutions', role: 'Manager', email: 'fatima@gulf.com', status: 'active' },
    { name: 'Mohammed Al-Qahtani', institution: 'Qatar Development', role: 'Coordinator', email: 'mohammed@qatar.com', status: 'inactive' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Partner Contacts</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Contacts</p>
          <p className="mt-2 text-2xl font-bold text-cyan-600">142</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-green-50 to-green-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Active</p>
          <p className="mt-2 text-2xl font-bold text-green-600">128</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Key Contacts</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">24</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Follow-ups</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">6</p>
        </div>
      </div>

      {/* Partners Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Active Partners</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Institution</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partners.map((partner, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{partner.name}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{partner.institution}</td>
                  <td className="px-6 py-4">{partner.role}</td>
                  <td className="px-6 py-4 text-blue-600">{partner.email}</td>
                  <td className="px-6 py-4">
                    {partner.status === 'active' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="text-xs text-slate-500 dark:text-slate-400">Inactive</span>
                    )}
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
