'use client';

import { Lock, ShieldCheck, Users } from 'lucide-react';

export function AdminRolesPermissions() {
  const roles = [
    { name: 'Admin', users: 3, permissions: 48, status: 'active' },
    { name: 'Manager', users: 12, permissions: 32, status: 'active' },
    { name: 'Staff', users: 142, permissions: 8, status: 'active' },
    { name: 'Agent', users: 24, permissions: 6, status: 'active' },
    { name: 'Viewer', users: 6, permissions: 2, status: 'active' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Roles & Permissions</h1>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-red-50 to-red-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Roles</p>
          <p className="mt-2 text-2xl font-bold text-red-600">5</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-purple-50 to-purple-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Permissions</p>
          <p className="mt-2 text-2xl font-bold text-purple-600">96</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-pink-50 to-pink-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Assigned Users</p>
          <p className="mt-2 text-2xl font-bold text-pink-600">187</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 bg-gradient-to-br from-rose-50 to-rose-100/50">
          <p className="text-sm text-slate-600 dark:text-slate-300">Last Modified</p>
          <p className="mt-2 text-2xl font-bold text-rose-600">2 days</p>
        </div>
      </div>

      {/* Roles Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Role Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Users</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Permissions</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {roles.map((role, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:bg-slate-700/50">
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{role.name}</td>
                  <td className="px-6 py-4 flex items-center gap-1 text-slate-600 dark:text-slate-300">
                    <Users className="h-4 w-4" /> {role.users}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      {role.permissions}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      Active
                    </span>
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
