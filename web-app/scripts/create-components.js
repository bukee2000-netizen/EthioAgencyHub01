const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'components');
const appDir = path.join(__dirname, '..', 'app', '(dashboard)');

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created:', filePath);
}

// 1. CV Generator
write(
  path.join(componentsDir, 'employees', 'cv-generator.tsx'),
  `'use client';

import { useState } from 'react';
import { FileText, Download, Share2 } from 'lucide-react';

type Template = 'standard' | 'detailed' | 'compact';

export function CvGenerator() {
  const [template, setTemplate] = useState<Template>('standard');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dest, setDest] = useState('');
  const [exp, setExp] = useState('');
  const [lang, setLang] = useState('');
  const [skills, setSkills] = useState('');

  const preview = [
    \`CV - \${name || '[Name]'}\`,
    \`Role: \${role || '[Role]'}  |  Destination: \${dest || '[Destination]'}\`,
    \`Experience: \${exp || '[Years]'} years  |  Languages: \${lang || '[Languages]'}\`,
    \`Skills: \${skills || '[Skills]'}\`,
    '',
    \`Template: \${template === 'standard' ? 'Standard (1-page)' : template === 'detailed' ? 'Detailed (2-page with photo)' : 'Compact (half-page summary)'}\`
  ].join('\\n');

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold"><FileText className="h-5 w-5 text-brand-600" /> CV Generator</h3>
          <div className="flex gap-2">
            {(['standard', 'detailed', 'compact'] as Template[]).map(t => (
              <button key={t} onClick={() => setTemplate(t)}
                className={\`rounded-xl px-3 py-1 text-xs font-semibold capitalize \${template === t ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}\`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Destination" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={exp} onChange={e => setExp(e.target.value)} placeholder="Experience (years)" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={lang} onChange={e => setLang(e.target.value)} placeholder="Languages" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Preview</h3>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm">{preview}</pre>
        <div className="mt-4 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"><Download className="h-4 w-4" /> Download PDF</button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold"><Share2 className="h-4 w-4" /> Share</button>
        </div>
      </section>
    </div>
  );
}
`
);

// 2. CV Search
write(
  path.join(componentsDir, 'employees', 'cv-search.tsx'),
  `'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export function CvSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    try {
      const res = await fetch(\`/api/employees?q=\${encodeURIComponent(query)}\`);
      const data = await res.json();
      setResults(data.success ? data.data : []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Search className="h-5 w-5 text-brand-600" /> CV Database Search</h3>
        <div className="mt-4 flex gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, role, destination..." className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 text-sm" />
          <button onClick={search} disabled={loading} className="rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? 'Searching...' : 'Search'}</button>
        </div>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {results.length === 0 ? <p className="text-sm text-slate-500">No results. Enter a search term above.</p> : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400"><tr><th className="py-2">Name</th><th className="py-2">Role</th><th className="py-2">Destination</th><th className="py-2">Status</th></tr></thead>
            <tbody>{results.map((emp: any) => <tr key={emp.id} className="border-t"><td className="py-2 font-medium">{emp.name}</td><td className="py-2">{emp.role}</td><td className="py-2">{emp.destination}</td><td className="py-2">{emp.status}</td></tr>)}</tbody>
          </table>
        )}
      </section>
    </div>
  );
}
`
);

// 3. Visa Timeline
write(
  path.join(componentsDir, 'documents', 'visa-timeline.tsx'),
  `'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = ['Applied', 'Documents Submitted', 'Embassy Review', 'Approved', 'Issued'];

export function VisaTimeline() {
  const [current, setCurrent] = useState(2);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Visa Tracking Timeline</h3>
        <p className="mt-1 text-sm text-slate-500">Track visa application status from submission to issuance.</p>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={\`flex h-10 w-10 items-center justify-center rounded-full \${i < current ? 'bg-emerald-100 text-emerald-600' : i === current ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 text-slate-400'}\`}>
                  {i < current ? <CheckCircle2 className="h-5 w-5" /> : i === current ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: \`\${(current / (steps.length - 1)) * 100}%\` }} />
          </div>
        </div>
      </section>
    </div>
  );
}
`
);

// 4. Cross Match Results
write(
  path.join(componentsDir, 'documents', 'cross-match-results.tsx'),
  `'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function CrossMatchResults() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/documents/cross-match', { method: 'POST' });
      const data = await res.json();
      setResults(data.success ? data.data : null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 text-brand-600" /> Cross-Match Verification</h3>
          <button onClick={run} disabled={loading} className="rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? 'Running...' : 'Run verification'}</button>
        </div>
        <p className="mt-1 text-sm text-slate-500">Verify all employees have required documents (passport, visa, medical).</p>
      </section>
      {results && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{results.matched}</p>
              <p className="text-sm text-emerald-600">Matched</p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-4 text-center">
              <p className="text-2xl font-bold text-brand-700">{results.checked}</p>
              <p className="text-sm text-brand-600">Checked</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{results.flagged}</p>
              <p className="text-sm text-red-600">Flagged</p>
            </div>
          </div>
          {results.details?.length > 0 && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-red-700"><AlertTriangle className="h-4 w-4" /> Missing documents</h4>
              <ul className="mt-2 space-y-1 text-sm">
                {results.details.map((d: any, i: number) => (
                  <li key={i} className="rounded-xl bg-red-50 px-3 py-2">Employee {d.employeeId}: missing {d.missing.join(', ')}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
`
);

// 5. Travel Calendar
write(
  path.join(componentsDir, 'travel', 'travel-calendar.tsx'),
  `'use client';

import { useEffect, useState } from 'react';
import { Plane, Calendar } from 'lucide-react';

export function TravelCalendar() {
  const [travels, setTravels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/travel')
      .then(r => r.json())
      .then(d => setTravels(d.success ? d.data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Calendar className="h-5 w-5 text-brand-600" /> Travel Schedule</h3>
        <p className="mt-1 text-sm text-slate-500">Upcoming employee departures and travel arrangements.</p>
      </section>
      {loading ? <p className="text-sm text-slate-500">Loading...</p> : travels.length === 0 ? (
        <p className="text-sm text-slate-500">No scheduled travel yet.</p>
      ) : (
        <div className="space-y-3">
          {travels.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Plane className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{t.destination}</p>
                  <p className="text-xs text-slate-500">{t.departureAt ? new Date(t.departureAt).toLocaleDateString() : 'TBD'}</p>
                </div>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{t.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`
);

// 6. Roles Matrix
write(
  path.join(componentsDir, 'admin', 'roles-matrix.tsx'),
  `'use client';

import { Shield } from 'lucide-react';

const roles = ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'VIEWER'];
const modules = ['Employee Mgmt', 'Documents', 'Travel', 'Hajj/Umrah', 'Institutions', 'Agents', 'Admin', 'Reporting'];

const perms: Record<string, string[]> = {
  SUPER_ADMIN: modules,
  AGENCY_ADMIN: modules,
  AGENT: ['Employee Mgmt', 'Documents', 'Travel', 'Hajj/Umrah', 'Institutions', 'Agents'],
  VIEWER: ['Employee Mgmt', 'Documents', 'Travel', 'Reporting']
};

export function RolesMatrix() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold"><Shield className="h-5 w-5 text-brand-600" /> Roles & Permissions</h3>
        <p className="mt-1 text-sm text-slate-500">Module access by role. Checked = allowed.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="py-2 text-left">Role</th>{modules.map(m => <th key={m} className="py-2 text-center text-xs">{m}</th>)}</tr></thead>
            <tbody>
              {roles.map(role => (
                <tr key={role} className="border-b border-slate-100">
                  <td className="py-2 font-semibold">{role}</td>
                  {modules.map(m => (
                    <td key={m} className="py-2 text-center">
                      {perms[role].includes(m) ? <span className="text-emerald-600">Yes</span> : <span className="text-slate-300">No</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
`
);

// 7. System Settings
write(
  path.join(componentsDir, 'settings', 'system-settings.tsx'),
  `'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export function SystemSettings() {
  const [agency, setAgency] = useState('');
  const [telegram, setTelegram] = useState('');
  const [teledrive, setTeledrive] = useState('');
  const [saved, setSaved] = useState(false);

  const submit = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">System Settings</h3>
        <p className="mt-1 text-sm text-slate-500">Configure agency, Telegram bot, and Teledrive settings.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium">Agency name<input value={agency} onChange={e => setAgency(e.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" /></label>
          <label className="flex flex-col gap-1 text-sm font-medium">Telegram bot token<input value={telegram} onChange={e => setTelegram(e.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" /></label>
          <label className="flex flex-col gap-1 text-sm font-medium md:col-span-2">Teledrive sync path<input value={teledrive} onChange={e => setTeledrive(e.target.value)} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" /></label>
        </div>
        <button onClick={submit} className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2 text-sm font-semibold text-white"><Save className="h-4 w-4" /> Save</button>
        {saved && <p className="mt-2 text-sm text-emerald-600">Settings saved.</p>}
      </section>
    </div>
  );
}
`
);

// 8. Reporting Dashboard
write(
  path.join(componentsDir, 'reporting', 'reporting-dashboard.tsx'),
  `'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, FileCheck } from 'lucide-react';

export function ReportingDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reporting/overview')
      .then(r => r.json())
      .then(d => setData(d.success ? d.data : null))
      .finally(() => setLoading(false));
  }, []);

  const stat = (icon: any, label: string, value: string | number, color: string) => (
    <div className={`rounded-2xl p-4 ${color}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value ?? 0}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold"><BarChart3 className="h-5 w-5 text-brand-600" /> Reporting Overview</h3>
        <p className="mt-1 text-sm text-slate-500">Operational metrics across all modules.</p>
      </section>
      {loading ? <p className="text-sm text-slate-500">Loading metrics...</p> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stat(<Users className="h-4 w-4 text-brand-600" />, 'Employees', data?.employees?.total, 'bg-brand-50')}
          {stat(<FileCheck className="h-4 w-4 text-emerald-600" />, 'Documents', data?.documents?.total, 'bg-emerald-50')}
          {stat(<TrendingUp className="h-4 w-4 text-blue-600" />, 'Travel Scheduled', data?.travel?.scheduled, 'bg-blue-50')}
          {stat(<Users className="h-4 w-4 text-purple-600" />, 'Pilgrims', data?.pilgrims?.total, 'bg-purple-50')}
        </div>
      )}
    </div>
  );
}
`
);

// Update page files to use new components
write(
  path.join(appDir, 'employee-management', 'cv-generator', 'templates', 'page.tsx'),
  `import { CvGenerator } from '@/components/employees/cv-generator';\n\nexport default function Page() {\n  return <CvGenerator />;\n}\n`
);

write(
  path.join(appDir, 'employee-management', 'cv-database', 'search', 'page.tsx'),
  `import { CvSearch } from '@/components/employees/cv-search';\n\nexport default function Page() {\n  return <CvSearch />;\n}\n`
);

write(
  path.join(appDir, 'documents', 'visa', 'page.tsx'),
  `import { VisaTimeline } from '@/components/documents/visa-timeline';\n\nexport default function Page() {\n  return <VisaTimeline />;\n}\n`
);

write(
  path.join(appDir, 'documents', 'cross-match', 'page.tsx'),
  `import { CrossMatchResults } from '@/components/documents/cross-match-results';\n\nexport default function Page() {\n  return <CrossMatchResults />;\n}\n`
);

write(
  path.join(appDir, 'travel', 'schedule', 'page.tsx'),
  `import { TravelCalendar } from '@/components/travel/travel-calendar';\n\nexport default function Page() {\n  return <TravelCalendar />;\n}\n`
);

write(
  path.join(appDir, 'administration', 'roles', 'page.tsx'),
  `import { RolesMatrix } from '@/components/admin/roles-matrix';\n\nexport default function Page() {\n  return <RolesMatrix />;\n}\n`
);

write(
  path.join(appDir, 'administration', 'settings', 'page.tsx'),
  `import { SystemSettings } from '@/components/settings/system-settings';\n\nexport default function Page() {\n  return <SystemSettings />;\n}\n`
);

write(
  path.join(appDir, 'reporting-analytics', 'overview', 'page.tsx'),
  `import { ReportingDashboard } from '@/components/reporting/reporting-dashboard';\n\nexport default function Page() {\n  return <ReportingDashboard />;\n}\n`
);

console.log('\\nAll components and pages created successfully!');
console.log('Created 8 components + 8 updated page files.');
