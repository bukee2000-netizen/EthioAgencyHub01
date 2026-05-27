'use client';

import type { Agent, InCountryStaff } from './types';

export function InCountryStaffTab({ agents }: { agents: Agent[] }) {
  const staffByCountry: Record<string, InCountryStaff[]> = {};
  agents.forEach(agent => {
    agent.inCountryStaff.forEach(staff => {
      if (!staffByCountry[staff.country]) staffByCountry[staff.country] = [];
      staffByCountry[staff.country].push(staff);
    });
  });

  const countryFlags: Record<string, string> = {
    Kuwait: '🇰🇼', 'Saudi Arabia': '🇸🇦', UAE: '🇦🇪', Qatar: '🇶🇦', Bahrain: '🇧🇭'
  };

  const taskMatrix = [
    { task: 'Airport Arrival', manager: 'Oversight', coordinator: 'Lead', field: 'Assist' },
    { task: 'Embassy Registration', manager: 'Policy', coordinator: 'Process', field: 'Submit' },
    { task: 'Worker Welfare', manager: 'Review', coordinator: 'Monitor', field: 'Report' },
    { task: 'Crisis Response', manager: 'Authorize', coordinator: 'Execute', field: 'Escalate' },
    { task: 'Documentation', manager: 'Audit', coordinator: 'Verify', field: 'Collect' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(staffByCountry).map(([country, staff]) => (
          <div key={country} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink dark:text-ink-dark flex items-center gap-2">
                <span>{countryFlags[country] || '🌍'}</span> {country}
              </h3>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{staff.length} staff</span>
            </div>
            <div className="divide-y divide-slate-100">
              {staff.map((person, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink dark:text-ink-dark">{person.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{person.role}</p>
                      <p className="text-xs text-slate-400 mt-1">{person.phone}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {person.tasks.map(task => (
                        <span key={task} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{task}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">Task Assignment Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Task</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Manager</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">In-Country Coordinator</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700 dark:text-slate-200">Field Support Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taskMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{row.task}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.manager}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{row.coordinator}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.field}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


