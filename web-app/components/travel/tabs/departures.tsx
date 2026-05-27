'use client';

import { useState } from 'react';
import {
  Users, MapPin, CheckCircle2, AlertCircle, PlaneTakeoff, Send,
  Smartphone, QrCode, Bell, MessageSquare
} from 'lucide-react';
import { TravelEmployee } from './types';

export function DepartureTab({ employees }: { employees: TravelEmployee[] }) {
  const today = employees.filter(e => e.status === 'ready' || e.status === 'departed' || e.status === 'orientation_done');
  const [checkedIn, setCheckedIn] = useState<string[]>([]);
  const [boarded, setBoarded] = useState<string[]>([]);
  const [noShow, setNoShow] = useState<string[]>([]);

  const total = today.length;
  const checked = checkedIn.length;
  const onBoard = boarded.length;
  const missing = noShow.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-4">
          <Users className="h-5 w-5 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-blue-800">{total}</p>
          <p className="text-xs font-medium text-blue-700">Today&apos;s Manifest</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-4">
          <MapPin className="h-5 w-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold text-amber-800">{checked}</p>
          <p className="text-xs font-medium text-amber-700">Arrived at Airport</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-800">{onBoard}</p>
          <p className="text-xs font-medium text-green-700">Boarded</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-800">{missing}</p>
          <p className="text-xs font-medium text-red-700">No-Show</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2"><PlaneTakeoff className="h-5 w-5 text-brand-600" /> Live Departure Manifest</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Bole International Airport</span>
        </div>
        <div className="divide-y divide-slate-100">
          {today.map(emp => {
            const isChecked = checkedIn.includes(emp.id);
            const isBoarded = boarded.includes(emp.id);
            const isMissing = noShow.includes(emp.id);
            return (
              <div key={emp.id} className={`px-6 py-4 transition-all ${isBoarded ? 'bg-green-50' : isMissing ? 'bg-red-50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-ink dark:text-ink-dark truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{emp.flightNumber || 'Flight TBD'} • {emp.departureTime || 'TBD'} • Terminal {emp.terminal}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{emp.destination}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Agent: {emp.assignedStaffName || '-'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!isChecked && !isBoarded && !isMissing && (
                      <button onClick={() => setCheckedIn(prev => [...prev, emp.id])} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700">
                        <MapPin className="h-3.5 w-3.5 inline-block mr-1" />Arrived at Airport
                      </button>
                    )}
                    {isChecked && !isBoarded && (
                      <button onClick={() => { setBoarded(prev => [...prev, emp.id]); setCheckedIn(prev => prev.filter(x => x !== emp.id)); }} className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5 inline-block mr-1" />Boarded
                      </button>
                    )}
                    {isBoarded && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />Confirmed
                      </span>
                    )}
                    {!isBoarded && !isMissing && (
                      <button onClick={() => setNoShow(prev => [...prev, emp.id])} className="px-3 py-2 border border-red-200 text-red-600 rounded-xl text-xs font-bold hover:bg-red-50">
                        No-Show
                      </button>
                    )}
                    {isMissing && (
                      <span className="px-3 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold">Delayed – Reschedule</span>
                    )}
                  </div>
                </div>
                {isBoarded && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-700 bg-green-100 rounded-lg px-4 py-2">
                    <Send className="h-3.5 w-3.5" />
                    Automated message sent to In-Country Staff: {emp.name} has boarded flight {emp.flightNumber}.
                  </div>
                )}
                {isMissing && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-700 bg-red-100 rounded-lg px-4 py-2">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Alert sent to Agent: {emp.name} did not arrive from rural area. Rescheduling required.
                  </div>
                )}
              </div>
            );
          })}
          {today.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-12">No departures scheduled for today.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-ink dark:text-ink-dark">Airport Staff Tablet – Bole International</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm">
            <QrCode className="h-8 w-8 text-brand-600 mb-2" />
            <h4 className="font-semibold text-sm">Scan Boarding Pass</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use camera to scan employee QR code and auto-check-in.</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm">
            <Bell className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm">Push Notification to Office</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Alert operations manager when group has passed security.</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm">
            <MessageSquare className="h-8 w-8 text-amber-600 mb-2" />
            <h4 className="font-semibold text-sm">Flag Delayed Departure</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Notify agents in rural areas if employee is missing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
