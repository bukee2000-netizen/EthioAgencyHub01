'use client';

import { Settings, Zap, Database, Shield } from 'lucide-react';

export function AdminSettings() {
  const settings = [
    { category: 'System', icon: Settings, items: ['Maintenance Mode', 'Backup Schedule', 'Cache Settings'] },
    { category: 'Security', icon: Shield, items: ['Password Policy', 'Session Timeout', 'IP Whitelist'] },
    { category: 'Database', icon: Database, items: ['Connection Pool', 'Query Timeout', 'Max Connections'] },
    { category: 'Performance', icon: Zap, items: ['Rate Limiting', 'API Throttling', 'Cache Duration'] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink">System Settings</h1>
        <p className="mt-2 text-slate-500">Configure system-wide settings and preferences</p>
      </div>

      {/* Settings Groups */}
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg bg-red-100 p-3">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-ink">{group.category}</h3>
              </div>
              <ul className="space-y-2">
                {group.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 cursor-pointer">
                    <span className="text-slate-600">{item}</span>
                    <span className="text-blue-600 font-semibold cursor-pointer">Edit →</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Global Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Global Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <span className="text-slate-700 font-medium">Email Notifications</span>
            <button className="w-12 h-6 bg-green-600 rounded-full"></button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <span className="text-slate-700 font-medium">API Access</span>
            <button className="w-12 h-6 bg-green-600 rounded-full"></button>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <span className="text-slate-700 font-medium">Audit Logging</span>
            <button className="w-12 h-6 bg-green-600 rounded-full"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
