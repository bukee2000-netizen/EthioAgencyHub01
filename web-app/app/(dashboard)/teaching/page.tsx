'use client';

import { useState } from 'react';
import { BookOpen, Users, Building2, FileText, Plane, Briefcase, Landmark, BadgeCheck, Heart, ChevronDown, ChevronUp, Copy, CheckCircle2 } from 'lucide-react';
import { demoUsers } from '@/lib/mock-data';
import { seedAgencies, seedAgents, seedEmployees, seedInstitutions, seedDocuments, seedTravels, seedPilgrims, seedVisaApplications, seedMolsRecords, seedCrossMatchResults } from '@/lib/seed-data';

const sections = [
  { id: 'users', label: 'Demo Users', icon: Users, data: demoUsers, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
  { id: 'agencies', label: 'Agencies', icon: Building2, data: seedAgencies, color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
  { id: 'agents', label: 'Agents', icon: Briefcase, data: seedAgents, color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
  { id: 'employees', label: 'Employees', icon: Users, data: seedEmployees, color: 'bg-green-50 text-green-700', border: 'border-green-200' },
  { id: 'institutions', label: 'Institutions', icon: Landmark, data: seedInstitutions, color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' },
  { id: 'documents', label: 'Documents', icon: FileText, data: seedDocuments, color: 'bg-cyan-50 text-cyan-700', border: 'border-cyan-200' },
  { id: 'travels', label: 'Travel', icon: Plane, data: seedTravels, color: 'bg-rose-50 text-rose-700', border: 'border-rose-200' },
  { id: 'visa', label: 'Visa Apps', icon: BadgeCheck, data: seedVisaApplications, color: 'bg-violet-50 text-violet-700', border: 'border-violet-200' },
  { id: 'mols', label: 'MOLS', icon: Landmark, data: seedMolsRecords, color: 'bg-orange-50 text-orange-700', border: 'border-orange-200' },
  { id: 'pilgrims', label: 'Pilgrims', icon: Heart, data: seedPilgrims, color: 'bg-pink-50 text-pink-700', border: 'border-pink-200' },
];

export default function TeachingPage() {
  const [expanded, setExpanded] = useState<string[]>(['users']);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-brand-100"><BookOpen className="h-8 w-8 text-brand-600" /></div>
          <div>
            <h1 className="text-3xl font-bold text-ink">Teaching / Demo Data</h1>
            <p className="mt-2 text-slate-600 max-w-2xl">Sample data for training and testing purposes. All records are fictional and for demonstration only.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {sections.map(s => (
          <div key={s.id} className={`rounded-2xl border ${s.border} ${s.color} p-4 shadow-sm`}>
            <s.icon className="h-6 w-6 mb-2" />
            <p className="text-xl font-bold">{Array.isArray(s.data) ? s.data.length : 0}</p>
            <p className="text-sm font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button onClick={() => toggle(section.id)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${section.color}`}><section.icon className="h-5 w-5" /></div>
                <span className="font-bold text-ink">{section.label}</span>
                <span className="text-xs text-slate-400">({Array.isArray(section.data) ? section.data.length : 0} records)</span>
              </div>
              {expanded.includes(section.id) ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>

            {expanded.includes(section.id) && (
              <div className="border-t border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        {Array.isArray(section.data) && section.data.length > 0 && Object.keys(section.data[0]).map(key => (
                          <th key={key} className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase whitespace-nowrap">{key}</th>
                        ))}
                        <th className="px-4 py-2.5 text-xs font-bold text-slate-500 uppercase">Copy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.isArray(section.data) && section.data.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 text-xs">
                          {Object.keys(section.data[0]).map(key => (
                            <td key={key} className="px-4 py-2.5 text-slate-700 max-w-[200px] truncate whitespace-nowrap">
                              {typeof row[key] === 'boolean' ? (row[key] ? '✓' : '✗') : String(row[key] || '')}
                            </td>
                          ))}
                          <td className="px-4 py-2.5">
                            <button onClick={() => copyToClipboard(row, `${section.id}-${i}`)} className="text-brand-600 hover:text-brand-800">
                              {copiedId === `${section.id}-${i}` ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
