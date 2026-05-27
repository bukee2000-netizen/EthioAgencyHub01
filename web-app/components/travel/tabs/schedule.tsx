'use client';

import { useState } from 'react';
import { Calendar, Plus, Plane } from 'lucide-react';
import { TravelEmployee } from './types';

export function ScheduleTab({ employees }: { employees: TravelEmployee[] }) {
  const [selectedRoute, setSelectedRoute] = useState('all');
  const routes = Array.from(new Set(employees.map(e => `${e.terminal || 'T2'} → ${e.destination}`).filter(Boolean)));

  const filtered = selectedRoute === 'all' ? employees : employees.filter(e => `${e.terminal || 'T2'} → ${e.destination}` === selectedRoute);

  const groupedByDate = filtered.reduce((acc: Record<string, typeof filtered>, emp) => {
    const date = emp.departureDate || 'Unassigned';
    if (!acc[date]) acc[date] = [];
    acc[date].push(emp);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark"><Calendar className="h-6 w-6 text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-ink dark:text-ink-dark text-lg">Logistics Planner</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Airline schedules, itinerary batches, and hostel slot management.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-sm dark:shadow-soft-dark">
            <Plus className="h-4 w-4" />
            Import Itinerary
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Route:</span>
        <button onClick={() => setSelectedRoute('all')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedRoute === 'all' ? 'bg-brand-600 text-white shadow-sm dark:shadow-soft-dark' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>All Routes</button>
        {routes.slice(0, 5).map(r => (
          <button key={r} onClick={() => setSelectedRoute(r)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedRoute === r ? 'bg-brand-600 text-white shadow-sm dark:shadow-soft-dark' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>{r}</button>
        ))}
      </div>

      {Object.entries(groupedByDate).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()).map(([date, emps]) => {
        const isSoon = Math.abs(new Date(date).getTime() - Date.now()) < 3 * 86400000;
        return (
          <div key={date} className={`rounded-2xl border ${isSoon ? 'border-red-200 bg-red-50/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} shadow-sm dark:shadow-soft-dark overflow-hidden`}>
            <div className={`px-6 py-3 flex items-center justify-between border-b ${isSoon ? 'border-red-100 bg-red-50' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
              <div className="flex items-center gap-3">
                <Calendar className={`h-5 w-5 ${isSoon ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="font-bold text-ink dark:text-ink-dark">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {isSoon && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">72-Hour Window</span>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500 dark:text-slate-400">{emps.length} employee{emps.length > 1 ? 's' : ''}</span>
                <span className="text-slate-400">Max: 12</span>
                <button className="text-blue-600 text-xs font-semibold hover:underline">Sync Calendar</button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {emps.map(emp => {
                const days = Math.ceil((new Date(emp.departureDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={emp.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${days <= 3 && days > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                        <Plane className={`h-5 w-5 ${days <= 3 && days > 0 ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-ink dark:text-ink-dark text-sm">{emp.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{emp.flightNumber || 'Flight TBD'} • {emp.departureTime || 'TBD'} • {emp.terminal || 'T2'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{emp.destination}</span>
                      {days > 0 && days <= 3 && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">{days}d left</span>}
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">Assign</button>
                        <button className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50">Slot</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {Object.keys(groupedByDate).length === 0 && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-12">No scheduled flights for this route.</div>
      )}
    </div>
  );
}
