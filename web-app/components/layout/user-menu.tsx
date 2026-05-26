'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, LogOut, ShieldCheck } from 'lucide-react';

type Props = {
  email?: string;
  role: string;
};

export function UserMenu({ email, role }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const onLogout = async () => {
    setPending(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/login');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2 md:flex">
        <ShieldCheck className="h-5 w-5 text-brand-600" />
        <div className="text-left">
          <p className="text-sm font-semibold text-ink">{email ?? 'Signed in'}</p>
          <p className="text-xs text-slate-500">{role}</p>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>
      <button
        type="button"
        onClick={onLogout}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
      >
        <LogOut className="h-4 w-4" /> {pending ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  );
}
