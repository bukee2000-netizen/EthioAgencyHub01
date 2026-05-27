import { TasksModule } from '@/components/dashboard/tasks-module';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-sm dark:shadow-soft-dark flex gap-1 overflow-x-auto">
        <a href="/dashboard" className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all whitespace-nowrap">Overview</a>
        <a href="/dashboard/trends" className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all whitespace-nowrap">Trends</a>
        <a href="/dashboard/tasks" className="px-5 py-3 rounded-2xl text-sm font-bold bg-brand-600 text-white shadow-sm transition-all whitespace-nowrap">Tasks</a>
        <a href="/dashboard/activities" className="px-5 py-3 rounded-2xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all whitespace-nowrap">Activities</a>
      </div>
      <TasksModule />
    </div>
  );
}
