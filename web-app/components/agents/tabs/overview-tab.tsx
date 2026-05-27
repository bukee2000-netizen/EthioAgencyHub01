'use client';

import { useState } from 'react';
import { Users, Plane, Globe, DollarSign, ChevronRight, CheckCircle2, FileText, Search, UserCheck, Send, CreditCard } from 'lucide-react';
import type { Agent, AgentContract, CVSelection } from './types';

export function OverviewTab({ agents, contracts, selections, onAddAgent }: { agents: Agent[], contracts: AgentContract[], selections: CVSelection[], onAddAgent?: () => void }) {
  const [role, setRole] = useState<'manager' | 'officer' | 'in_country'>('manager');

  const totalDeployments = agents.reduce((sum, a) => sum + a.totalDeployments, 0);
  const totalRevenue = agents.reduce((sum, a) => sum + a.totalRevenue, 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingSelections = selections.filter(s => s.stage !== 'deployed').length;

  const cycleSteps = [
    { step: 1, title: 'Master Contract', desc: 'Signed with foreign agent', icon: FileText },
    { step: 2, title: 'CV Database', desc: 'Agent browses available candidates', icon: Search },
    { step: 3, title: 'Selection', desc: 'Agent selects employee', icon: UserCheck },
    { step: 4, title: 'Individual Contract', desc: 'Sent to employee', icon: Send },
    { step: 5, title: 'Agent Payment', desc: 'Agent pays all costs', icon: CreditCard },
    { step: 6, title: 'Deployment', desc: 'Employee departs - zero cost', icon: Plane },
  ];

  const topAgents = [...agents].sort((a, b) => b.totalDeployments - a.totalDeployments).slice(0, 3);

  const recentActivity = [
    { action: 'Contract renewed', agent: 'Gulf Recruitment Co.', time: '2 hours ago', type: 'contract' },
    { action: 'Employee deployed', agent: 'Saudi Manpower Solutions', time: '5 hours ago', type: 'deployment' },
    { action: 'Payment received', agent: 'Emirates Staffing LLC', time: '1 day ago', type: 'payment' },
    { action: 'CV selected', agent: 'Qatar Career Hub', time: '1 day ago', type: 'cv' },
  ];

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">View as:</span>
        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
          {(['manager', 'officer', 'in_country'] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${role === r ? 'bg-amber-100 text-amber-700' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>
              {r === 'manager' ? 'Manager' : r === 'officer' ? 'Officer' : 'In-Country'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-amber-600" />
            <span className="text-xs font-medium text-green-600">+3 this month</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">{agents.length}</p>
          <p className="text-sm font-medium text-amber-700 mt-1">Active Agents</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Plane className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-green-600">+156 this quarter</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{totalDeployments.toLocaleString()}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Total Deployments</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Globe className="h-6 w-6 text-green-600" />
            <span className="text-xs font-medium text-green-600">All operational</span>
          </div>
          <p className="text-3xl font-bold text-green-800">{new Set(agents.map(a => a.country)).size}</p>
          <p className="text-sm font-medium text-green-700 mt-1">Countries Active</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <span className="text-xs font-medium text-green-600">+12% YoY</span>
          </div>
          <p className="text-3xl font-bold text-purple-800">{(totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Revenue (ETB)</p>
        </div>
      </div>

      {/* Cycle Flow */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-bold text-ink dark:text-ink-dark mb-4">Complete Deployment Cycle</h3>
        <div className="flex flex-wrap items-center gap-2">
          {cycleSteps.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                <span className="h-6 w-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                <div>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark">{item.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              </div>
              {idx < cycleSteps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Employee Departure: Zero cost to employee — All costs covered by agent
          </p>
        </div>
      </div>

      {/* Top Agents & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark mb-4">Top Performing Agents</h3>
          <div className="space-y-3">
            {topAgents.map((agent, idx) => (
              <div key={agent.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">{idx + 1}</div>
                  <div>
                    <p className="font-semibold text-ink dark:text-ink-dark">{agent.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{agent.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">{agent.totalDeployments}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">deployments</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'contract' ? 'bg-blue-500' :
                  activity.type === 'deployment' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">{activity.action}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.agent}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


