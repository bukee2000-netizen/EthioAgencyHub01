'use client';

import { useState } from 'react';
import { Shield, Save, RotateCcw } from 'lucide-react';

type Permission = 'create' | 'read' | 'update' | 'delete';
type Role = 'SUPER_ADMIN' | 'AGENCY_ADMIN' | 'AGENT' | 'VIEWER';

interface RolePermissions {
  [role: string]: {
    [resource: string]: Permission[];
  };
}

const RESOURCES = [
  'employees', 'documents', 'travels', 'agents', 'institutions', 
  'pilgrims', 'users', 'billing', 'reports', 'settings', 'audit'
];

const DEFAULT_PERMISSIONS: RolePermissions = {
  SUPER_ADMIN: {
    employees: ['create', 'read', 'update', 'delete'],
    documents: ['create', 'read', 'update', 'delete'],
    travels: ['create', 'read', 'update', 'delete'],
    agents: ['create', 'read', 'update', 'delete'],
    institutions: ['create', 'read', 'update', 'delete'],
    pilgrims: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    billing: ['create', 'read', 'update', 'delete'],
    reports: ['create', 'read', 'update', 'delete'],
    settings: ['create', 'read', 'update', 'delete'],
    audit: ['read']
  },
  AGENCY_ADMIN: {
    employees: ['create', 'read', 'update', 'delete'],
    documents: ['create', 'read', 'update', 'delete'],
    travels: ['create', 'read', 'update', 'delete'],
    agents: ['create', 'read', 'update', 'delete'],
    institutions: ['create', 'read', 'update', 'delete'],
    pilgrims: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update'],
    billing: ['read'],
    reports: ['read'],
    settings: ['read', 'update'],
    audit: ['read']
  },
  AGENT: {
    employees: ['read', 'update'],
    documents: ['create', 'read', 'update'],
    travels: ['read'],
    agents: ['read'],
    institutions: ['read'],
    pilgrims: ['read'],
    users: [],
    billing: [],
    reports: [],
    settings: [],
    audit: []
  },
  VIEWER: {
    employees: ['read'],
    documents: ['read'],
    travels: ['read'],
    agents: ['read'],
    institutions: ['read'],
    pilgrims: ['read'],
    users: [],
    billing: [],
    reports: ['read'],
    settings: [],
    audit: ['read']
  }
};

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: 'Super Admin',
  AGENCY_ADMIN: 'Agency Admin',
  AGENT: 'Agent',
  VIEWER: 'Viewer'
};

const PERMISSION_LABELS: Record<Permission, string> = {
  create: 'Create',
  read: 'Read',
  update: 'Update',
  delete: 'Delete'
};

export function RolesMatrixEditor() {
  const [permissions, setPermissions] = useState<RolePermissions>(DEFAULT_PERMISSIONS);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (role: Role, resource: string, permission: Permission) => {
    setPermissions(prev => {
      const current = prev[role]?.[resource] || [];
      const updated = current.includes(permission)
        ? current.filter(p => p !== permission)
        : [...current, permission];
      
      return {
        ...prev,
        [role]: { ...prev[role], [resource]: updated }
      };
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(permissions)
      });
      if (res.ok) {
        setHasChanges(false);
        alert('Permissions saved successfully');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };

  const handleReset = () => {
    setPermissions(DEFAULT_PERMISSIONS);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Shield className="h-5 w-5 text-brand-600" />
              Roles & Permissions Matrix
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-left font-medium text-slate-500">Resource</th>
                {Object.entries(ROLE_LABELS).map(([role, label]) => (
                  <th key={role} className="pb-3 text-center font-medium text-slate-500">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RESOURCES.map(resource => (
                <tr key={resource}>
                  <td className="py-3 font-medium capitalize">{resource}</td>
                  {Object.keys(ROLE_LABELS).map(role => (
                    <td key={role} className="py-3">
                      <div className="flex justify-center gap-1">
                        {(['create', 'read', 'update', 'delete'] as Permission[]).map(perm => {
                          const hasPerm = permissions[role]?.[resource]?.includes(perm);
                          return (
                            <button
                              key={perm}
                              onClick={() => togglePermission(role as Role, resource, perm)}
                              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                hasPerm
                                  ? 'bg-brand-100 text-brand-700'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                              title={PERMISSION_LABELS[perm]}
                            >
                              {perm.charAt(0).toUpperCase()}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Permission Legend</h3>
        <div className="mt-4 flex flex-wrap gap-4">
          {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="rounded bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700">
                {key.charAt(0).toUpperCase()}
              </span>
              <span className="text-sm text-slate-600">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}