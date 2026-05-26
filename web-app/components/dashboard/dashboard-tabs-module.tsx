'use client';

import { useState } from 'react';
import { LayoutDashboard, BarChart3, CheckSquare2, Activity } from 'lucide-react';
import { DashboardOverviewModule } from '@/components/dashboard/dashboard-overview-module';
import { TrendsModule } from '@/components/dashboard/trends-module';
import { TasksModule } from '@/components/dashboard/tasks-module';
import { ActivitiesModule } from '@/components/dashboard/activities-module';

interface Props { initialTab?: string }

export function DashboardTabsModule({ initialTab }: Props) {
  const [activeTab, setActiveTab] = useState(initialTab && ['overview', 'trends', 'tasks', 'activities'].includes(initialTab) ? initialTab : 'overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'KPI cards & quick actions' },
    { id: 'trends', label: 'Trends', icon: BarChart3, desc: 'Registration & deployment analytics' },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare2, desc: 'Pending tasks & assignments' },
    { id: 'activities', label: 'Activities', icon: Activity, desc: 'Recent system activity log' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs at top */}
      <div className="rounded-3xl border border-slate-200 bg-white p-1.5 shadow-sm flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <DashboardOverviewModule />}
      {activeTab === 'trends' && <TrendsModule />}
      {activeTab === 'tasks' && <TasksModule />}
      {activeTab === 'activities' && <ActivitiesModule />}
    </div>
  );
}
