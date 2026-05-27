'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

const steps = ['Applied', 'Documents Submitted', 'Embassy Review', 'Approved', 'Issued'];

export function VisaTimeline() {
  const [current, setCurrent] = useState(2);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="text-lg font-bold">Visa Tracking Timeline</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track visa application status from submission to issuance.</p>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${i < current ? 'bg-emerald-100 text-emerald-600' : i === current ? 'bg-brand-100 text-brand-600' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-400'}`}>
                  {i < current ? <CheckCircle2 className="h-5 w-5" /> : i === current ? <Clock className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <span className="text-xs font-medium">{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 h-2 rounded-full bg-slate-100 dark:bg-slate-700/50">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(current / (steps.length - 1)) * 100}%` }} />
          </div>
        </div>
      </section>
    </div>
  );
}