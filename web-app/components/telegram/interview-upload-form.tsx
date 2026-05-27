'use client';

import { FormEvent, useState } from 'react';
import { UploadCloud } from 'lucide-react';

type UploadResult = {
  fileId: string;
  messageId: number;
  duration?: number;
  fileSize?: number;
};

export function InterviewUploadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/telegram/interview', {
      method: 'POST',
      body: formData
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error?.message ?? 'Interview upload failed');
      return;
    }

    setResult(payload.data);
  }

  return (
    <form className="rounded-3xl border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark" onSubmit={handleSubmit}>
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-50 dark:bg-brand-900/30 p-3 text-brand-700 dark:text-brand-300">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-ink dark:text-ink-dark">Telegram short interview upload</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Videos are sent to the configured private Telegram channel.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Employee ID
          <input name="employeeId" className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:border-brand-600" placeholder="Optional database ID" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Employee name
          <input name="employeeName" className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:border-brand-600" placeholder="For Telegram caption" />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Short video
        <input name="video" className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-6 text-sm" type="file" accept="video/*" required />
      </label>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">{error}</p> : null}
      {result ? (
        <div className="mt-4 rounded-2xl bg-brand-50 dark:bg-brand-900/30 px-4 py-3 text-sm text-brand-900 dark:text-brand-100">
          Uploaded to Telegram. File ID: <span className="font-mono text-xs">{result.fileId}</span>
        </div>
      ) : null}

      <button className="mt-5 rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading} type="submit">
        {loading ? 'Uploading...' : 'Upload interview video'}
      </button>
    </form>
  );
}
