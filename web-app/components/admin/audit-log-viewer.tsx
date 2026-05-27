'use client';

import { useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';

type AuditEntry = {
  id: string;
  actorId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  createdAt: string;
};

export function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const url = resource ? `/api/audit?resource=${encodeURIComponent(resource)}` : '/api/audit';
      const res = await fetch(url);
      const data = await res.json();
      setEntries(data.success ? data.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [resource]);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink dark:text-ink-dark"><History className="h-5 w-5 text-brand-600" /> Audit trail</h3>
        <div className="flex items-center gap-2">
          <select
            value={resource}
            onChange={(event) => setResource(event.target.value)}
            className="rounded-2xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            <option value="">All resources</option>
            <option value="user">User</option>
            <option value="employee">Employee</option>
            <option value="travel">Travel</option>
            <option value="agent">Agent</option>
          </select>
          <button type="button" onClick={load} className="rounded-2xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading audit entries...</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">No audit events yet.</p>
      ) : (
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
            <tr><th className="py-2">When</th><th className="py-2">Actor</th><th className="py-2">Action</th><th className="py-2">Resource</th></tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="py-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">{new Date(entry.createdAt).toLocaleString()}</td>
                <td className="py-2">{entry.actorId ?? 'system'}</td>
                <td className="py-2 font-semibold text-ink dark:text-ink-dark">{entry.action}</td>
                <td className="py-2">{entry.resource}{entry.resourceId ? `/${entry.resourceId}` : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
