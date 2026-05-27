'use client';

import { Search, UserCheck, CreditCard, UserPlus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { CVSelection, Agent } from './types';

export function CVPipelineTab({ selections, agents, onSelectEmployee }: { selections: CVSelection[], agents: Agent[], onSelectEmployee?: (employee: any, agentId: string) => void }) {
  const stageColors: Record<string, string> = {
    browsing: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300',
    selected: 'bg-blue-100 text-blue-700',
    contract_sent: 'bg-amber-100 text-amber-700',
    contract_signed: 'bg-purple-100 text-purple-700',
    paid: 'bg-green-100 text-green-700',
    deployed: 'bg-emerald-100 text-emerald-700',
  };

  const stageLabels: Record<string, string> = {
    browsing: 'CV Browsing',
    selected: 'Employee Selected',
    contract_sent: 'Contract Sent',
    contract_signed: 'Contract Signed',
    paid: 'Agent Paid',
    deployed: 'Deployed',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">CV Database Sharing Model</h3>
          <Link href="/employee-management/cv-database" className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800">
            <ExternalLink className="h-4 w-4" />
            Browse CV Database
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Search className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="font-semibold text-blue-800">Agent Browses</p>
            <p className="text-xs text-blue-600 mt-1">Access CV database & filter by job category</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <UserCheck className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="font-semibold text-purple-800">Agent Selects</p>
            <p className="text-xs text-purple-600 mt-1">Choose candidate & issue contract</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <CreditCard className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="font-semibold text-green-800">Agent Pays All Costs</p>
            <p className="text-xs text-green-600 mt-1">Zero cost to employee</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">Select Employee for Agent</p>
            <p className="text-sm text-amber-700">Browse CV database and assign employee to agent</p>
          </div>
          <Link href="/employee-management/cv-database/search?mode=select" className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            <UserPlus className="h-4 w-4" />
            Select Employee
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">CV Selection Pipeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Employee</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Country</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Stage</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selections.map((sel) => (
                <tr key={sel.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4"><p className="font-medium text-ink dark:text-ink-dark">{sel.employeeName}</p><p className="text-xs text-slate-500 dark:text-slate-400">{sel.role}</p></td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{sel.agentName}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{sel.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColors[sel.stage]}`}>{stageLabels[sel.stage]}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-700">{sel.totalCost.toLocaleString()} ETB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


