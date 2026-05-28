'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error?.message ?? 'Login failed');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input name="email" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600" placeholder="admin@ethioagency.com" type="email" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Password
        <input name="password" className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600" placeholder="••••••••" type="password" required minLength={8} />
      </label>
      <p className="text-xs text-slate-500">Demo login: admin@ethioagency.com / admin123</p>
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}
      <button disabled={loading} className="block w-full rounded-2xl bg-brand-600 px-4 py-3 text-center font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" type="submit">
        {loading ? 'Signing in...' : 'Sign in to dashboard'}
      </button>
    </form>
  );
}
