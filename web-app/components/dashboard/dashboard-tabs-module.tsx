'use client';

import { useState } from 'react';
import { LayoutDashboard, BarChart3, CheckSquare2, Activity } from 'lucide-react';
import { useLanguage } from '@/components/layout/language-provider';
import { DashboardOverviewModule } from '@/components/dashboard/dashboard-overview-module';
import { TrendsModule } from '@/components/dashboard/trends-module';
import { TasksModule } from '@/components/dashboard/tasks-module';
import { ActivitiesModule } from '@/components/dashboard/activities-module';

interface Props { initialTab?: string }

export function DashboardTabsModule({ initialTab }: Props) {
  const { dict } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab && ['overview', 'trends', 'tasks', 'activities'].includes(initialTab) ? initialTab : 'overview');

  const tabs = [
    { id: 'overview', label: dict.common.overview, icon: LayoutDashboard, desc: dict.common.kpiCards },
    { id: 'trends', label: dict.common.trends, icon: BarChart3, desc: dict.common.analytics },
    { id: 'tasks', label: dict.common.tasks, icon: CheckSquare2, desc: dict.common.tasks },
    { id: 'activities', label: dict.common.activities, icon: Activity, desc: dict.common.activities },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs at top */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-sm dark:shadow-soft-dark flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-600 text-white shadow-sm dark:shadow-soft-dark'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
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
