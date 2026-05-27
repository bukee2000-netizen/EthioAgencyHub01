'use client';

import { useState } from 'react';
import {
  PlaneLanding, Plane, Users, Bell, CheckCircle2, Send, Shield, Handshake
} from 'lucide-react';
import { TravelEmployee } from './types';

export function ArrivalTab({ employees }: { employees: TravelEmployee[] }) {
  const [confirmedArrivals, setConfirmedArrivals] = useState<string[]>([]);
  const arrived = employees.filter(e => e.status === 'arrived');
  const departed = employees.filter(e => e.status === 'departed');
  const inTransit = departed.filter(e => !confirmedArrivals.includes(e.id));

  const handleConfirmArrival = (id: string) => {
    setConfirmedArrivals(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 shadow-sm dark:shadow-soft-dark">
          <PlaneLanding className="h-6 w-6 text-emerald-600 mb-3" />
          <p className="text-3xl font-bold text-emerald-800">{arrived.length + confirmedArrivals.length}</p>
          <p className="text-sm font-medium text-emerald-700">Confirmed Arrivals</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5 shadow-sm dark:shadow-soft-dark">
          <Plane className="h-6 w-6 text-amber-600 mb-3" />
          <p className="text-3xl font-bold text-amber-800">{inTransit.length}</p>
          <p className="text-sm font-medium text-amber-700">In Transit</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5 shadow-sm dark:shadow-soft-dark">
          <Users className="h-6 w-6 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-blue-800">{employees.filter(e => e.inCountryStaff).length}</p>
          <p className="text-sm font-medium text-blue-700">In-Country Staff</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5 shadow-sm dark:shadow-soft-dark">
          <Bell className="h-6 w-6 text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-purple-800">{inTransit.length > 0 ? 1 : 0}</p>
          <p className="text-sm font-medium text-purple-700">Pending Notifications</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
            <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2"><PlaneLanding className="h-5 w-5 text-emerald-600" /> Pending Arrival Confirmation</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{inTransit.length} to confirm</span>
          </div>
          <div className="divide-y divide-slate-100">
            {inTransit.map(emp => (
              <div key={emp.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-ink dark:text-ink-dark text-sm">{emp.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{emp.destination} • {emp.flightNumber} • In-country: {emp.inCountryStaff || 'Unassigned'}</p>
                  </div>
                </div>
                <button onClick={() => handleConfirmArrival(emp.id)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm dark:shadow-soft-dark">
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Arrival
                </button>
              </div>
            ))}
            {inTransit.length === 0 && (
              <p className="text-center text-slate-500 dark:text-slate-400 py-12">All departed employees have confirmed arrivals.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
          <h3 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Handshake className="h-5 w-5 text-brand-600" /> In-Country Staff Actions</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-emerald-800 text-sm">Click "Confirm Arrival"</p>
              <p className="text-xs text-emerald-700 mt-1">Once employee lands in destination country</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-1"><Send className="h-4 w-4" /> Auto-Notification</div>
              <p className="text-xs text-blue-700">Family & Agent will be notified when arrival is confirmed.</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-800 font-bold text-sm mb-1"><Shield className="h-4 w-4" /> Safe Arrival Protocol</div>
              <p className="text-xs text-purple-700">In-country staff must confirm within 24 hours of landing.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-ink dark:text-ink-dark">Confirmed Arrivals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-left">Destination</th>
                <th className="px-6 py-3 text-left">Flight</th>
                <th className="px-6 py-3 text-left">In-Country Staff</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[...arrived, ...employees.filter(e => confirmedArrivals.includes(e.id))].map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-3 font-medium">{emp.name}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{emp.destination}</td>
                  <td className="px-6 py-3">{emp.flightNumber || '-'}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{emp.inCountryStaff || '-'}</td>
                  <td className="px-6 py-3 text-slate-500 dark:text-slate-400">{emp.departureDate}</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Arrived Safely</span>
                  </td>
                </tr>
              ))}
              {arrived.length === 0 && confirmedArrivals.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">No arrivals recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
