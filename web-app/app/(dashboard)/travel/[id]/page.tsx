import Link from 'next/link';
import { ArrowLeft, Route } from 'lucide-react';

export default function TravelDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 p-6">
      <Link href="/travel" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Travel Management
      </Link>
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-brand-100 p-3"><Route className="h-6 w-6 text-brand-600" /></div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Travel Record</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">ID: {params.id}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center text-slate-400">
        <p>Travel detail page. Select a record from the travel management module.</p>
      </div>
    </div>
  );
}
