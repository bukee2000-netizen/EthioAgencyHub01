'use client';

import { useState } from 'react';
import { Search, Filter, Download, BarChart3, TrendingUp } from 'lucide-react';

export function ActivitiesModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const [activities] = useState([
    {
      id: 1,
      timestamp: '2024-02-15 16:32:05',
      user: 'Yohannes Tefera',
      action: 'Employee Registered',
      target: 'Senait Assefa',
      icon: '👤',
      category: 'registration'
    },
    {
      id: 2,
      timestamp: '2024-02-15 15:18:12',
      user: 'Getnet Kabede',
      action: 'Document Verified',
      target: 'Passport - Abebe Tadesse',
      icon: '✓',
      category: 'document'
    },
    {
      id: 3,
      timestamp: '2024-02-15 14:45:44',
      user: 'Senait Assefa',
      action: 'Travel Scheduled',
      target: 'Flight SR-123456 to Riyadh',
      icon: '✈️',
      category: 'travel'
    },
    {
      id: 4,
      timestamp: '2024-02-15 13:22:05',
      user: 'Marta Desalegn',
      action: 'CV Generated',
      target: 'Getnet Kabede - Nurse',
      icon: '📄',
      category: 'document'
    },
    {
      id: 5,
      timestamp: '2024-02-15 12:15:33',
      user: 'Admin',
      action: 'Settings Updated',
      target: 'System Configuration',
      icon: '⚙️',
      category: 'system'
    },
    {
      id: 6,
      timestamp: '2024-02-15 11:08:19',
      user: 'Zainab Hassan',
      action: 'Hajj Registration',
      target: 'Pilgrimage 2024 Hajj',
      icon: '🕌',
      category: 'hajj'
    },
    {
      id: 7,
      timestamp: '2024-02-15 10:45:52',
      user: 'Yohannes Tefera',
      action: 'Payment Processed',
      target: 'Agency Commission Payment',
      icon: '💰',
      category: 'billing'
    },
    {
      id: 8,
      timestamp: '2024-02-14 18:30:22',
      user: 'Getnet Kabede',
      action: 'Report Generated',
      target: 'Monthly Performance Report',
      icon: '📊',
      category: 'reporting'
    },
  ]);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || activity.category === filterType;
    return matchesSearch && matchesType;
  });

  const categories = [
    { value: 'all', label: 'All Activities' },
    { value: 'registration', label: 'Registrations' },
    { value: 'document', label: 'Documents' },
    { value: 'travel', label: 'Travel' },
    { value: 'hajj', label: 'Hajj' },
    { value: 'billing', label: 'Billing' },
    { value: 'system', label: 'System' },
    { value: 'reporting', label: 'Reporting' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Activities</h2>
        <button className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm dark:shadow-soft-dark">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Activity Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 text-center shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Total Activities</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{activities.length}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 text-center shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Today</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">7</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 text-center shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">This Week</p>
          <p className="mt-1 text-2xl font-bold text-purple-700">32</p>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-4 text-center shadow-sm dark:shadow-soft-dark">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300">This Month</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">142</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-1.5 text-sm focus:border-brand-600 focus:outline-none shadow-sm dark:shadow-soft-dark"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium focus:border-brand-600 focus:outline-none shadow-sm dark:shadow-soft-dark"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Activities Timeline */}
      <div className="space-y-2">
        {filteredActivities.map(activity => (
          <div key={activity.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 hover:shadow-md transition-shadow shadow-sm dark:shadow-soft-dark">
            <div className="flex items-center gap-3">
              <div className="text-2xl flex-shrink-0">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-ink dark:text-ink-dark">{activity.action}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">{activity.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                  <span className="font-medium">{activity.target}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300 font-medium">No activities found</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
