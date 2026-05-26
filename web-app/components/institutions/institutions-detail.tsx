'use client';

import { Building2, MapPin, Users, FileText, CheckCircle2 } from 'lucide-react';

export function InstitutionDetail() {
  const institutions = [
    { id: 'INST-001', name: 'Saudi Medical Group', country: 'Saudi Arabia', contacts: 5, status: 'active', mou: 'Signed' },
    { id: 'INST-002', name: 'Gulf Staffing Solutions', country: 'UAE', contacts: 8, status: 'active', mou: 'Signed' },
    { id: 'INST-003', name: 'Qatar Development Corp', country: 'Qatar', contacts: 3, status: 'inactive', mou: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Institution Details</h1>
        <p className="mt-2 text-slate-500">Comprehensive information about partner institutions</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
          <p className="text-sm text-slate-600">Total Partners</p>
          <p className="mt-2 text-2xl font-bold text-cyan-600">56</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-teal-50 to-teal-100/50">
          <p className="text-sm text-slate-600">Active</p>
          <p className="mt-2 text-2xl font-bold text-teal-600">48</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <p className="text-sm text-slate-600">MOUs Signed</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">42</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-sky-50 to-sky-100/50">
          <p className="text-sm text-slate-600">Contacts</p>
          <p className="mt-2 text-2xl font-bold text-sky-600">142</p>
        </div>
      </div>

      {/* Institutions Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-ink">Partner Institutions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Institution</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Country</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Contacts</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">MOU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">{inst.name}</td>
                  <td className="px-6 py-4 text-slate-600">{inst.country}</td>
                  <td className="px-6 py-4">{inst.contacts}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      inst.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      inst.mou === 'Signed' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inst.mou}
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
