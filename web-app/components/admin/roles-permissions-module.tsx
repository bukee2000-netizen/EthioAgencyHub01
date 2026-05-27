'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, Shield } from 'lucide-react';

export function RolesPermissionsModule() {
  const [roles] = useState([
    {
      id: 1,
      name: 'Admin',
      description: 'Full system access and configuration',
      users: 2,
      permissions: ['Create Users', 'Manage Roles', 'View Logs', 'Configure Settings', 'Manage Billing'],
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 2,
      name: 'Supervisor',
      description: 'Team management and reporting',
      users: 3,
      permissions: ['Create Employees', 'View Reports', 'Approve Documents', 'Manage Team'],
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      name: 'Officer',
      description: 'Handle documents and registrations',
      users: 5,
      permissions: ['Register Employees', 'Process Documents', 'Schedule Travel', 'View Employees'],
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      name: 'Agent',
      description: 'Field agent with limited access',
      users: 8,
      permissions: ['View Employees', 'Register Clients', 'Submit Documents'],
      color: 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-100'
    },
  ]);

  const allPermissions = [
    'Create Users', 'Edit Users', 'Delete Users', 'Manage Roles', 'View Logs', 'Configure Settings',
    'Manage Billing', 'Create Employees', 'Edit Employees', 'Delete Employees', 'View Reports',
    'Approve Documents', 'Reject Documents', 'Manage Team', 'Register Employees', 'Process Documents',
    'Schedule Travel', 'View Employees', 'Register Clients', 'Submit Documents', 'Export Data'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Roles & Permissions</h2>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            <Plus className="h-5 w-5" />
            Create Role
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Roles</p>
          <p className="mt-2 text-4xl font-bold text-blue-700">{roles.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Users</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{roles.reduce((sum, r) => sum + r.users, 0)}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Permissions</p>
          <p className="mt-2 text-4xl font-bold text-purple-700">{allPermissions.length}</p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {roles.map(role => (
          <div key={role.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${role.color}`}>
                    {role.name}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{role.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                  <Eye className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
                  <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Assigned Users</p>
              <p className="text-2xl font-bold text-ink dark:text-ink-dark">{role.users}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Permissions</p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-slate-100 dark:bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-6">Permission Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Permission</th>
                {roles.map(role => (
                  <th key={role.id} className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPermissions.slice(0, 10).map((perm, idx) => (
                <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">{perm}</td>
                  {roles.map(role => (
                    <td key={role.id} className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={role.permissions.includes(perm)}
                        readOnly
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 cursor-not-allowed"
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <td colSpan={5} className="px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
                  Showing 10 of {allPermissions.length} permissions
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
