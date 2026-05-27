'use client';

import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';

type User = { id: string; email: string; role: string; createdAt: string };

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'AGENCY_ADMIN' | 'AGENT' | 'VIEWER'>('VIEWER');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message ?? 'Failed to load users');
      setUsers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error?.message ?? 'Failed to invite user');
      setEmail('');
      setPassword('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="flex items-center gap-2 text-lg font-bold text-ink dark:text-ink-dark"><UserPlus className="h-5 w-5 text-brand-600" /> Invite user</h3>
        <form onSubmit={invite} className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="user@example.com"
            className="rounded-2xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Temporary password (min 8)"
            className="rounded-2xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          />
          <select
            value={role}
            onChange={(event) => setRole(event.target.value as typeof role)}
            className="rounded-2xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm"
          >
            <option value="VIEWER">Viewer</option>
            <option value="AGENT">Agent</option>
            <option value="AGENCY_ADMIN">Agency admin</option>
          </select>
          <button type="submit" disabled={submitting} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50">
            {submitting ? 'Inviting...' : 'Send invite'}
          </button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Agency users</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">{users.length} users</span>
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">No users yet. Invite your first teammate above.</p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <tr><th className="py-2">Email</th><th className="py-2">Role</th><th className="py-2">Created</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 dark:border-slate-700">
                  <td className="py-2 font-medium text-ink dark:text-ink-dark">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2 text-slate-500 dark:text-slate-400 dark:text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
