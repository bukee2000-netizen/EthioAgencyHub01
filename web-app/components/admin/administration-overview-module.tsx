'use client';

import { useState } from 'react';
import { Settings, Users, Lock, FileText, Activity, CreditCard, AlertCircle, BarChart3, TrendingUp, PieChart } from 'lucide-react';
import Link from 'next/link';

export function AdministrationOverviewModule() {
  const adminSections = [
    {
      title: 'User Management',
      description: 'Create, edit, and manage user accounts and permissions.',
      icon: Users,
      href: '/administration/users',
      count: '12 users'
    },
    {
      title: 'Roles & Permissions',
      description: 'Configure roles and access control for the platform.',
      icon: Lock,
      href: '/administration/roles-permissions',
      count: '4 roles'
    },
    {
      title: 'System Settings',
      description: 'Configure agency settings, storage, and integrations.',
      icon: Settings,
      href: '/administration/settings',
      count: '3 configs'
    },
    {
      title: 'Subscription & Billing',
      description: 'Manage billing, plans, and payment information.',
      icon: CreditCard,
      href: '/administration/billing',
      count: 'Pro Plan'
    },
    {
      title: 'Activity Logs',
      description: 'Review audit trail and system activity history.',
      icon: Activity,
      href: '/administration/logs',
      count: '2,345 events'
    },
    {
      title: 'Audit Trail',
      description: 'Compliance and security audit records.',
      icon: FileText,
      href: '/administration/audit',
      count: 'Full history'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Administration</h2>
          </div>
          <Settings className="h-8 w-8 text-brand-600 opacity-20" />
        </div>
      </div>

      {/* Admin Sections Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow hover:border-brand-400"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="h-8 w-8 text-brand-600" />
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700">
                  {section.count}
                </span>
              </div>
              <h3 className="font-semibold text-ink dark:text-ink-dark">{section.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{section.description}</p>
              <p className="mt-4 text-xs font-medium text-brand-600 hover:text-brand-700">
                Open â†’
              </p>
            </Link>
          );
        })}
      </div>

      {/* Security Alert */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900">Security Notice</h3>
            <p className="mt-1 text-sm text-amber-800">
              All administrative changes are logged and auditable. Ensure you have proper authorization before making changes.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Recent Admin Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-ink dark:text-ink-dark">User Added</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">fatima@agency.com added by admin</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-ink dark:text-ink-dark">Role Updated</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">AGENT role permissions modified</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">1 day ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-ink dark:text-ink-dark">Settings Changed</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">System timezone updated to UTC+3</p>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
