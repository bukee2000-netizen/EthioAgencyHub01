'use client';

import { useState, useEffect } from 'react';
import { CVDatabaseModule } from '@/components/employees/cv-search';
import { Sparkles, CheckCircle2, Users, Briefcase, Globe, Award } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role?: string;
  destination?: string;
  status: string;
  education?: string;
  experience?: string;
  languages?: string[];
  createdAt: string;
}

export default function SkillMatchingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/employees?limit=200')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setEmployees(data.data.map((e: any) => ({
            id: e.id,
            name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Unknown',
            role: e.role || e.jobRole || '-',
            destination: e.destination || e.country || 'Open',
            status: e.status || 'REGISTERED',
            education: e.education || '-',
            experience: e.experience || '-',
            languages: e.languages || [],
            createdAt: e.createdAt,
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const roleCounts: Record<string, number> = {};
  const destCounts: Record<string, number> = {};
  employees.forEach(e => {
    const role = e.role || 'Other';
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    const dest = e.destination || 'Open';
    destCounts[dest] = (destCounts[dest] || 0) + 1;
  });

  const topRoles = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topDests = Object.entries(destCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-brand-50 to-purple-50 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Skill Matching</h2>
            <p className="mt-2 text-slate-600">Match {loading ? '...' : employees.length} employees to deployment opportunities.</p>
          </div>
        </div>
      </section>

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Briefcase className="h-5 w-5 text-brand-600" /> Top Roles</h3>
            <div className="space-y-2.5">
              {topRoles.map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{role}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${(count / employees.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-brand-600" /> Top Destinations</h3>
            <div className="space-y-2.5">
              {topDests.map(([dest, count]) => (
                <div key={dest} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{dest}</span>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-32 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${(count / employees.length) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CVDatabaseModule />
    </div>
  );
}
