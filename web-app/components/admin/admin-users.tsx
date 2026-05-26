'use client';

import { Users, Shield, Eye, Ban } from 'lucide-react';

export function AdminUsers() {
  const users = [
    { id: 'USR-001', name: 'Ahmed Abdi', email: 'ahmed@agency.com', role: 'Admin', status: 'active', lastLogin: '2026-03-18' },
    { id: 'USR-002', name: 'Fatima Hassan', email: 'fatima@agency.com', role: 'Manager', status: 'active', lastLogin: '2026-03-17' },
    { id: 'USR-003', name: 'Mohammed Ali', email: 'mohammed@agency.com', role: 'Staff', status: 'inactive', lastLogin: '2026-03-10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">User Management</h1>
        <p className="mt-2 text-slate-500">Create, manage, and control user accounts</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-red-50 to-red-100/50">
          <p className="text-sm text-slate-600">Total Users</p>
          <p className="mt-2 text-2xl font-bold text-red-600">187</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-green-50 to-green-100/50">
          <p className="text-sm text-slate-600">Active</p>
          <p className="mt-2 text-2xl font-bold text-green-600">165</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
          <p className="text-sm text-slate-600">Inactive</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">18</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <p className="text-sm text-slate-600">Pending Approval</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">4</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-ink">Users List</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-700">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
