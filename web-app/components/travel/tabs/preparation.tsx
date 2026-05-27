'use client';

import { useState } from 'react';
import {
  Shield, Phone, FileText, Video, Luggage, Home, CheckCircle2, AlertCircle
} from 'lucide-react';
import { TravelEmployee } from './types';

export function PreparationTab({ employees }: { employees: TravelEmployee[] }) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({
    call72: [], documents: [], orientation: [], baggage: [], family: []
  });

  const toggle = (section: string, id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [section]: prev[section].includes(id) ? prev[section].filter(x => x !== id) : [...prev[section], id]
    }));
  };

  const totalEmployees = employees.length;
  const docVerified = employees.filter(e => e.documents.passport && e.documents.visa && e.documents.yellowCard).length;
  const orientationDone = employees.filter(e => e.documents.orientationComplete).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-bold text-ink dark:text-ink-dark text-lg">Safety Gates – 100% Readiness Checklist</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Every employee must pass all gates before reaching Bole International Airport.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">72-Hour Call</p>
          <p className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{completedSteps.call72.length}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100 dark:bg-slate-700/50"><div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${totalEmployees ? (completedSteps.call72.length / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Documents Verified</p>
          <p className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{docVerified}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100 dark:bg-slate-700/50"><div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${totalEmployees ? (docVerified / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Orientation Watched</p>
          <p className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{orientationDone}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100 dark:bg-slate-700/50"><div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${totalEmployees ? (orientationDone / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Baggage Checked</p>
          <p className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{completedSteps.baggage.length}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100 dark:bg-slate-700/50"><div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${totalEmployees ? (completedSteps.baggage.length / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-100"><Phone className="h-5 w-5 text-blue-600" /></div>
            <h4 className="font-bold text-ink dark:text-ink-dark">72-Hour Call – Confirm departure from village</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.call72.includes(emp.id) ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.call72.includes(emp.id)} onChange={() => toggle('call72', emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">{emp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{emp.destination} • Agent: {emp.localAgentName || '-'}</p>
                </div>
                {completedSteps.call72.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-100"><FileText className="h-5 w-5 text-purple-600" /></div>
            <h4 className="font-bold text-ink dark:text-ink-dark">Document Handover – Passport, Visa, Contract verified</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => {
              const allDocs = emp.documents.passport && emp.documents.visa && emp.documents.yellowCard;
              return (
                <div key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${allDocs ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-ink-dark">{emp.name}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className={emp.documents.passport ? 'text-green-600' : 'text-red-500'}>Passport {emp.documents.passport ? '✓' : '✗'}</span>
                      <span className={emp.documents.visa ? 'text-green-600' : 'text-red-500'}>Visa {emp.documents.visa ? '✓' : '✗'}</span>
                      <span className={emp.documents.yellowCard ? 'text-green-600' : 'text-red-500'}>Medical {emp.documents.yellowCard ? '✓' : '✗'}</span>
                    </div>
                  </div>
                  {allDocs ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-100"><Video className="h-5 w-5 text-green-600" /></div>
            <h4 className="font-bold text-ink dark:text-ink-dark">Orientation Video – "How to Navigate the Airport"</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.orientation.includes(emp.id) ? 'bg-green-50 border border-green-200' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.orientation.includes(emp.id)} onChange={() => toggle('orientation', emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">{emp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{emp.localAgentName ? `Confirmed by ${emp.localAgentName}` : 'Not assigned'}</p>
                </div>
                {completedSteps.orientation.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
              </label>
            ))}
          </div>
          <button className="mt-3 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 shadow-sm dark:shadow-soft-dark">
            <Video className="h-4 w-4 inline-block mr-2" />Watch Airport Guide Video
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-100"><Luggage className="h-5 w-5 text-amber-600" /></div>
            <h4 className="font-bold text-ink dark:text-ink-dark">Baggage Weight Check – Avoid extra fees</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.baggage.includes(emp.id) ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.baggage.includes(emp.id)} onChange={() => toggle('baggage', emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-amber-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">{emp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Rural area: {['Jimma', 'Wolkite', 'Nekemte', 'Arba Minch'][Math.floor(Math.random() * 4)]} • Expected: 20-30kg</p>
                </div>
                {completedSteps.baggage.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />}
              </label>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
            <Luggage className="h-4 w-4 inline-block mr-1" />
            Reminder: Rural workers often carry heavy luggage. Advise 20kg max to avoid extra fees.
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100"><Home className="h-5 w-5 text-red-600" /></div>
          <h4 className="font-bold text-ink dark:text-ink-dark">Rural Connectivity – Family Emergency Contact</h4>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Log the family emergency contact status so agency staff can reach the family once the employee arrives safely abroad.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {employees.slice(0, 6).map(emp => (
            <label key={emp.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${completedSteps.family.includes(emp.id) ? 'bg-green-50 border-green-200' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              <input type="checkbox" checked={completedSteps.family.includes(emp.id)} onChange={() => toggle('family', emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{emp.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{emp.destination} • {emp.phone}</p>
              </div>
              {completedSteps.family.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
