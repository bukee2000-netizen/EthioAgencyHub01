'use client';

import { Building2, Users, Handshake, MapPin } from 'lucide-react';
import Link from 'next/link';

export function InstitutionsModule() {
  const stats = [
    { label: 'Partner Institutions', value: '56', icon: Building2, color: 'bg-cyan-100 text-cyan-600' },
    { label: 'Active Collaborations', value: '34', icon: Handshake, color: 'bg-teal-100 text-teal-600' },
    { label: 'Contacts', value: '142', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Countries', value: '18', icon: MapPin, color: 'bg-sky-100 text-sky-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">Institution Management</h1>
        <p className="mt-2 text-slate-500">Manage institutional partners and collaboration agreements</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl ${stat.color} p-6`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/institutions/institution-detail" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all">
          <Building2 className="h-5 w-5 text-cyan-600 mb-3" />
          <p className="font-semibold text-ink">Institution Details</p>
          <p className="text-xs text-slate-500 mt-1">View institutions</p>
        </Link>
        <Link href="/institutions/partners" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all">
          <Users className="h-5 w-5 text-cyan-600 mb-3" />
          <p className="font-semibold text-ink">Partners</p>
          <p className="text-xs text-slate-500 mt-1">Manage partners</p>
        </Link>
        <Link href="/institutions/collaboration" className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all">
          <Handshake className="h-5 w-5 text-cyan-600 mb-3" />
          <p className="font-semibold text-ink">Collaboration</p>
          <p className="text-xs text-slate-500 mt-1">Agreements</p>
        </Link>
      </div>

      {/* Recent Institutions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Recent Institutions</h3>
        <div className="space-y-3">
          {[
            { name: 'Saudi Medical Group', country: 'Saudi Arabia', contacts: 5, status: 'active' },
            { name: 'Gulf Staffing Solutions', country: 'UAE', contacts: 8, status: 'active' },
            { name: 'Qatar Development Corp', country: 'Qatar', contacts: 3, status: 'inactive' },
          ].map((inst, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
              <div>
                <p className="font-semibold text-ink">{inst.name}</p>
                <p className="text-xs text-slate-500">{inst.country} • {inst.contacts} contacts</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                inst.status === 'active' ? 'bg-green-100 text-green-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {inst.status.charAt(0).toUpperCase() + inst.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
