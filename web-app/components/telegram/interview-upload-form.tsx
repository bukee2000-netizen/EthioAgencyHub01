'use client';

import { FormEvent, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { uploadFile } from '@/lib/r2/upload';

export function InterviewUploadForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(event.currentTarget);
    const videoFile = formData.get('video') as File | null;
    const employeeName = formData.get('employeeName') as string || 'unknown';

    if (!videoFile) {
      setError('Video file is required');
      setLoading(false);
      return;
    }

    try {
      const key = `interviews/${employeeName}-${Date.now()}-${videoFile.name}`;
      const result = await uploadFile(videoFile, key);
      setResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Interview upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-brand-50 dark:bg-brand-900/30 p-3 text-brand-700 dark:text-brand-300">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-ink dark:text-ink-dark">Interview video upload</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Videos are stored in Cloudflare R2.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Employee ID
          <input name="employeeId" className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:border-brand-600" placeholder="Optional database ID" />
        </label>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          Employee name
          <input name="employeeName" className="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 outline-none focus:border-brand-600" placeholder="For R2 object key" />
        </label>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200">
        Short video
        <input name="video" className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 px-4 py-6 text-sm" type="file" accept="video/*" required />
      </label>

      {error ? <p className="mt-4 rounded-2xl bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-300">{error}</p> : null}
      {result ? (
        <div className="mt-4 rounded-2xl bg-brand-50 dark:bg-brand-900/30 px-4 py-3 text-sm text-brand-900 dark:text-brand-100">
          Uploaded to R2. Key: <span className="font-mono text-xs">{result.key}</span>
        </div>
      ) : null}

      <button className="mt-5 rounded-2xl bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" disabled={loading} type="submit">
        {loading ? 'Uploading...' : 'Upload interview video'}
      </button>
    </form>
  );
}
