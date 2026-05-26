'use client';

import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Shield } from 'lucide-react';

export function UserManagementModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users] = useState([
    { id: 1, name: 'Yohannes Tefera', email: 'yohannes@ethio.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, name: 'Senait Assefa', email: 'senait@ethio.com', role: 'Agent', status: 'Active', joinDate: '2024-01-20' },
    { id: 3, name: 'Getnet Kabede', email: 'getnet@ethio.com', role: 'Supervisor', status: 'Active', joinDate: '2024-02-01' },
    { id: 4, name: 'Marta Desalegn', email: 'marta@ethio.com', role: 'Agent', status: 'Inactive', joinDate: '2024-01-10' },
    { id: 5, name: 'Abebe Tadesse', email: 'abebe@ethio.com', role: 'Officer', status: 'Active', joinDate: '2024-02-05' },
    { id: 6, name: 'Zainab Hassan', email: 'zainab@ethio.com', role: 'Agent', status: 'Active', joinDate: '2024-01-25' },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = ['Admin', 'Supervisor', 'Officer', 'Agent'];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Supervisor': return 'bg-blue-100 text-blue-800';
      case 'Officer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'text-emerald-600' : 'text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink">User Management</h2>
            <p className="mt-2 text-slate-600">
              Manage system users, roles, and access permissions.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Total Users</p>
          <p className="mt-2 text-4xl font-bold text-blue-700">{users.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Active</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{users.filter(u => u.status === 'Active').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Admins</p>
          <p className="mt-2 text-4xl font-bold text-red-700">{users.filter(u => u.role === 'Admin').length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 text-center">
          <p className="text-sm font-medium text-slate-600">Inactive</p>
          <p className="mt-2 text-4xl font-bold text-amber-700">{users.filter(u => u.status === 'Inactive').length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-10 pr-4 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 font-medium focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">User</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">Role</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">Join Date</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-ink">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${getStatusColor(user.status)}`}>
                    ● {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{user.joinDate}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Eye className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition">
                      <Edit2 className="h-4 w-4 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg transition">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center">
          <Shield className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">No users found</p>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
