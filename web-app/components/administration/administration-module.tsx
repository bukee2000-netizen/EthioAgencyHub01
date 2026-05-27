'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BadgeCheck, Users, Lock, Settings, BarChart3, Zap, Search, Plus,
  Edit, Trash2, X, Save, CheckCircle2, AlertCircle, Shield, Eye, 
  Clock, Mail, Phone, Building2, Calendar, Activity, Key
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  usersCount: number;
  color: string;
}

export function AdministrationModule() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const mockUsers: User[] = [
      { id: 'U001', name: 'Abebe Kebede', email: 'abebe@ethioagency.com', phone: '+251911234567', role: 'SUPER_ADMIN', department: 'IT', status: 'active', lastLogin: '2024-03-15T10:30:00Z', createdAt: '2023-01-15', permissions: ['all'] },
      { id: 'U002', name: 'Sara Mulatu', email: 'sara@ethioagency.com', phone: '+251912345678', role: 'AGENCY_ADMIN', department: 'Operations', status: 'active', lastLogin: '2024-03-15T09:15:00Z', createdAt: '2023-03-20', permissions: ['employees', 'documents', 'travel'] },
      { id: 'U003', name: 'Mohammed Ali', email: 'mohammed@ethioagency.com', phone: '+251913456789', role: 'AGENT', department: 'Recruitment', status: 'active', lastLogin: '2024-03-14T16:45:00Z', createdAt: '2023-06-10', permissions: ['cv_view', 'employees_view'] },
      { id: 'U004', name: 'Fatima Jemal', email: 'fatima@ethioagency.com', phone: '+251914567890', role: 'VIEWER', department: 'Finance', status: 'inactive', lastLogin: '2024-02-28T11:00:00Z', createdAt: '2023-08-15', permissions: ['reports_view'] },
      { id: 'U005', name: 'Ibrahim Dibaba', email: 'ibrahim@ethioagency.com', phone: '+251915678901', role: 'HR_MANAGER', department: 'Human Resources', status: 'active', lastLogin: '2024-03-15T08:30:00Z', createdAt: '2023-02-01', permissions: ['employees', 'reports', 'settings'] },
    ];

    setUsers(mockUsers);
  };

  const filteredUsers = users.filter(user => {
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    return true;
  });

  const roles: Role[] = [
    { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', permissions: ['all'], usersCount: 1, color: 'bg-red-500' },
    { id: 'AGENCY_ADMIN', name: 'Agency Admin', description: 'Agency-level administration', permissions: ['employees', 'documents', 'travel', 'agents', 'reports'], usersCount: 3, color: 'bg-blue-500' },
    { id: 'AGENT', name: 'Agent', description: 'Can manage CVs and employees', permissions: ['cv_view', 'employees_view', 'employees_edit'], usersCount: 12, color: 'bg-green-500' },
    { id: 'HR_MANAGER', name: 'HR Manager', description: 'Manage employees and documents', permissions: ['employees', 'documents', 'reports'], usersCount: 2, color: 'bg-purple-500' },
    { id: 'VIEWER', name: 'Viewer', description: 'Read-only access', permissions: ['reports_view'], usersCount: 8, color: 'bg-slate-50 dark:bg-slate-800/500' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
  };

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.id === role);
    return roleData?.color || 'bg-slate-50 dark:bg-slate-800/500';
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalRoles = roles.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-3">
              <BadgeCheck className="h-7 w-7 text-red-600" />
              Administration
            </h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Plus className="h-4 w-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-red-600" />
            <span className="text-xs font-medium text-green-600">+3 this month</span>
          </div>
          <p className="text-3xl font-bold text-red-800">{users.length}</p>
          <p className="text-sm font-medium text-red-700 mt-1">Total Users</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">{activeUsers}</p>
          <p className="text-sm font-medium text-green-700 mt-1">Active Users</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Lock className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-800">{totalRoles}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Roles</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-800">128</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Permissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
              activeTab === 'users' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm ${
              activeTab === 'roles' 
                ? 'border-red-500 text-red-600' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
            }`}
          >
            <Lock className="h-4 w-4" />
            Roles & Permissions
          </button>
        </nav>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Search and Filters */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-4 text-sm focus:border-red-500 focus:outline-none"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="AGENCY_ADMIN">Agency Admin</option>
                <option value="AGENT">Agent</option>
                <option value="HR_MANAGER">HR Manager</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">User</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Department</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Last Login</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium text-ink dark:text-ink-dark">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor(user.role)}`}>
                          {user.role.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.department}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="Edit">
                            <Edit className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="View">
                            <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-red-50" title="Delete">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <div key={role.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${role.color} flex items-center justify-center`}>
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink dark:text-ink-dark">{role.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{role.description}</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 4).map((perm) => (
                    <span key={perm} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded text-xs">
                      {perm.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {role.permissions.length > 4 && (
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded text-xs">
                      +{role.permissions.length - 4} more
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4">
                <span className="text-sm text-slate-600 dark:text-slate-300">{role.usersCount} users</span>
                <button className="text-xs font-medium text-red-600 hover:text-red-800">Edit Role</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/administration/settings" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-red-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Settings className="h-5 w-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-ink dark:text-ink-dark">System Settings</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure system preferences</p>
        </Link>
        <Link href="/administration/logs" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-red-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-ink dark:text-ink-dark">System Logs</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">View system activity logs</p>
        </Link>
        <Link href="/administration/audit" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-red-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-ink dark:text-ink-dark">Audit Trail</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track user actions</p>
        </Link>
        <Link href="/administration/billing" className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 hover:border-red-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Key className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-ink dark:text-ink-dark">Billing</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage subscriptions</p>
        </Link>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Add New User</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Full Name *</label>
                  <input type="text" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email *</label>
                  <input type="email" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                  <input type="tel" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="+251911234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Role *</label>
                  <select className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                    <option value="">Select Role</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="AGENCY_ADMIN">Agency Admin</option>
                    <option value="AGENT">Agent</option>
                    <option value="HR_MANAGER">HR Manager</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Department</label>
                  <input type="text" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., IT, Operations" />
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white">
                <Save className="h-4 w-4" />
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}