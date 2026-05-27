'use client';

import { Plus, ChevronRight } from 'lucide-react';
import type { AgentContract } from './types';

export function ContractsTab({ contracts }: { contracts: AgentContract[] }) {
  const processSteps = [
    { step: 1, title: 'Master Contract', desc: 'Sign agreement with foreign agent' },
    { step: 2, title: 'CV Database Access', desc: 'Grant agent access to CV database' },
    { step: 3, title: 'Employee Selection', desc: 'Agent browses & selects candidate' },
    { step: 4, title: 'Individual Contract', desc: 'Generate contract for selected employee' },
    { step: 5, title: 'Agent Payment', desc: 'Agent pays all costs to agency' },
    { step: 6, title: 'Deployment', desc: 'Employee travels - zero cost to employee' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-bold text-ink dark:text-ink-dark mb-4">Two-Level Contract System</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Master Contract Agreement</h4>
            <p className="text-sm text-blue-700">Agency ↔ Foreign Agent</p>
            <p className="text-xs text-blue-600 mt-2">Annual agreement covering quota, commission rate, cost coverage, terms.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-800 mb-2">Individual Employee Contract</h4>
            <p className="text-sm text-green-700">Foreign Agent → Selected Employee</p>
            <p className="text-xs text-green-600 mt-2">Generated per employee after selection. Includes job details, salary, benefits.</p>
          </div>
        </div>
        <h4 className="font-semibold text-ink dark:text-ink-dark mt-6 mb-4">6-Step Process Flow</h4>
        <div className="flex flex-wrap gap-3">
          {processSteps.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                <span className="h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {idx < processSteps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Active Master Contracts</h3>
          <button className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-800"><Plus className="h-4 w-4" /> New Contract</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Country</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Value (ETB)</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Quota</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Commission</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Expiry</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{contract.agentName}</td>
                  <td className="px-6 py-4">{contract.country}</td>
                  <td className="px-6 py-4">{contract.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(contract.used/contract.quota)*100}%` }} />
                      </div>
                      <span className="text-xs">{contract.used}/{contract.quota}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{contract.commissionRate}%</td>
                  <td className="px-6 py-4">{contract.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      contract.status === 'active' ? 'bg-green-100 text-green-700' :
                      contract.status === 'expiring' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{contract.status}</span>
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


