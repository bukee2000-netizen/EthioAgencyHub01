'use client';

import { CreditCard, DollarSign, Users } from 'lucide-react';
import type { FinancialRecord } from './types';

export function FinancialsTab({ financials }: { financials: FinancialRecord[] }) {
  const totalReceivables = financials.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = financials.filter(f => f.status !== 'pending').reduce((sum, f) => sum + f.amount, 0);

  const typeColors: Record<string, string> = {
    ticket: 'bg-blue-100 text-blue-700',
    visa: 'bg-purple-100 text-purple-700',
    medical: 'bg-green-100 text-green-700',
    transport: 'bg-orange-100 text-orange-700',
    commission: 'bg-amber-100 text-amber-700',
    fee: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">✓ Zero-Cost Employee Model</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-green-200">
            <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-semibold text-ink dark:text-ink-dark">Agent Pays</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tickets, visa, medical, transport</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-green-200">
            <DollarSign className="h-6 w-6 text-amber-600 mb-2" />
            <p className="font-semibold text-ink dark:text-ink-dark">Agency Earns</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Commission + processing fees</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-green-200">
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-semibold text-ink dark:text-ink-dark">Employee Pays</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ZERO - Fully covered</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Receivables</p>
          <p className="text-2xl font-bold text-amber-700">{totalReceivables.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ETB outstanding</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Received</p>
          <p className="text-2xl font-bold text-green-700">{totalPaid.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ETB confirmed</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Per-Employee Financial Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Employee</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{rec.employeeName}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{rec.agentName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize ${typeColors[rec.type]}`}>{rec.type}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{rec.amount.toLocaleString()} ETB</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{rec.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rec.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      rec.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>{rec.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


