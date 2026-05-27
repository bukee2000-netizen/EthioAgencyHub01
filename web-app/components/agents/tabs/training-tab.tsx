'use client';

import { UserPlus, Users, RefreshCw, MessageSquare, Calendar } from 'lucide-react';
import type { TrainingSession, SupportTicket } from './types';

export function TrainingSupportTab({ training, support }: { training: TrainingSession[], support: SupportTicket[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <UserPlus className="h-6 w-6 text-blue-600 mb-2" />
          <p className="font-bold text-blue-800">New Agent Orientation</p>
          <p className="text-xs text-blue-600 mt-1">CV database, contract process, cost coverage</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <Users className="h-6 w-6 text-purple-600 mb-2" />
          <p className="font-bold text-purple-800">In-Country Staff Induction</p>
          <p className="text-xs text-purple-600 mt-1">Arrival protocols, embassy registration, welfare</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <RefreshCw className="h-6 w-6 text-green-600 mb-2" />
          <p className="font-bold text-green-800">Annual Refresher</p>
          <p className="text-xs text-green-600 mt-1">MOLSA updates, immigration law changes</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <MessageSquare className="h-6 w-6 text-amber-600 mb-2" />
          <p className="font-bold text-amber-800">Ongoing Support</p>
          <p className="text-xs text-amber-600 mt-1">2-hour response SLA, monthly bulletins</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Training Schedule</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {training.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink dark:text-ink-dark">{item.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {item.date} • {item.participants} participants • Role: {item.assignedRole}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Agent Support Desk</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">SLA: Response within 2 hours</span>
        </div>
        <div className="space-y-3">
          {support.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div>
                <p className="font-medium text-ink dark:text-ink-dark">{ticket.query}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ticket.agentName} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>{ticket.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


