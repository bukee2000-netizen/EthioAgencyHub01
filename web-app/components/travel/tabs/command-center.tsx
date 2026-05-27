'use client';

import {
  BellRing, Shield, FileText, FileCheck, Building2, Bus, Home, BadgeCheck,
  PlaneLanding, Ticket, Smartphone, Plane, Users
} from 'lucide-react';
import { TravelEmployee } from './types';

export function OverviewTab({ employees }: { employees: TravelEmployee[] }) {
  const total = employees.length;
  const inRural = employees.filter(e => e.status === 'pending' || e.transitStatus.t72hours === 'pending').length;
  const inTransit = employees.filter(e => e.status === 'transit_to_addis' || e.transitStatus.t72hours === 'bus_started').length;
  const atHostel = employees.filter(e => e.status === 'hostel_checkin' || e.transitStatus.t48hours === 'arrived_hostel').length;
  const ready = employees.filter(e => e.status === 'ready' || e.status === 'orientation_done').length;
  const departed = employees.filter(e => e.status === 'departed').length;
  const arrived = employees.filter(e => e.status === 'arrived').length;
  const urgent72 = employees.filter(e => e.transitStatus.t72hours !== 'confirmed' && e.transitStatus.t72hours !== 'bus_started').length;
  const visaCleared = employees.filter(e => e.documents.visa).length;
  const medicalCleared = employees.filter(e => e.documents.yellowCard).length;

  return (
    <div className="space-y-6">
      {urgent72 > 0 && (
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5 shadow-sm dark:shadow-soft-dark">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-red-100"><BellRing className="h-6 w-6 text-red-600" /></div>
            <div className="flex-1">
              <p className="font-bold text-red-800 text-lg">72-hour Departure Alert – Action Required</p>
              <p className="text-sm text-red-700 mt-1">{urgent72} employee{urgent72 > 1 ? 's' : ''} reaching the 72-hour departure mark need confirmation.</p>
            </div>
            <button className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-sm dark:shadow-soft-dark">View Tasks</button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          Department Bridge – Clearance Status
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-800 flex items-center gap-2"><FileText className="h-4 w-4" /> Visa Department</span>
              <span className="text-sm font-bold text-blue-700">{visaCleared}/{total}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-blue-100">
              <div className="h-2.5 rounded-full bg-blue-500 transition-all" style={{ width: `${total ? (visaCleared / total) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-blue-600 mt-2">{total - visaCleared} employee{total - visaCleared !== 1 ? 's' : ''} pending visa issuance</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-green-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-green-800 flex items-center gap-2"><FileCheck className="h-4 w-4" /> Medical Department</span>
              <span className="text-sm font-bold text-green-700">{medicalCleared}/{total}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-green-100">
              <div className="h-2.5 rounded-full bg-green-500 transition-all" style={{ width: `${total ? (medicalCleared / total) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-green-600 mt-2">{total - medicalCleared} employee{total - medicalCleared !== 1 ? 's' : ''} need medical clearance</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5">
          <Building2 className="h-6 w-6 text-amber-600 mb-3" />
          <p className="text-3xl font-bold text-amber-800">{inRural}</p>
          <p className="text-sm font-medium text-amber-700">In Rural Areas</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <Bus className="h-6 w-6 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-blue-800">{inTransit}</p>
          <p className="text-sm font-medium text-blue-700">En Route to Addis</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <Home className="h-6 w-6 text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-purple-800">{atHostel}</p>
          <p className="text-sm font-medium text-purple-700">At Agency Hostel</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <BadgeCheck className="h-6 w-6 text-green-600 mb-3" />
          <p className="text-3xl font-bold text-green-800">{ready}</p>
          <p className="text-sm font-medium text-green-700">Cleared for Travel</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-ink dark:text-ink-dark mb-4">Travel Pipeline Overview</h3>
        <div className="flex items-center gap-1 h-10 rounded-xl overflow-hidden">
          {[
            { label: 'Rural', count: inRural, color: 'bg-amber-500' },
            { label: 'Transit', count: inTransit, color: 'bg-blue-500' },
            { label: 'Hostel', count: atHostel, color: 'bg-purple-500' },
            { label: 'Ready', count: ready, color: 'bg-green-500' },
            { label: 'Departed', count: departed, color: 'bg-cyan-500' },
            { label: 'Arrived', count: arrived, color: 'bg-emerald-500' },
          ].map(s => (
            <div key={s.label} className={`${s.color} h-full flex items-center justify-center text-white text-xs font-bold transition-all`} style={{ width: `${total ? (s.count / total) * 100 : 0}%`, minWidth: s.count > 0 ? '4%' : '0' }}>
              {s.count > 0 ? `${Math.round((s.count / total) * 100)}%` : ''}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          {[{ label: 'Rural', count: inRural }, { label: 'Transit', count: inTransit }, { label: 'Hostel', count: atHostel }, { label: 'Ready', count: ready }, { label: 'Departed', count: departed }, { label: 'Arrived', count: arrived }].map(s => (
            <span key={s.label}>{s.label}: <strong>{s.count}</strong></span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-ink dark:text-ink-dark">Recent Travelers</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {employees.slice(0, 8).map(emp => (
            <div key={emp.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-ink dark:text-ink-dark text-sm">{emp.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{emp.destination} • {emp.flightNumber || 'No flight'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  emp.status === 'arrived' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  emp.status === 'departed' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  emp.status === 'ready' ? 'bg-green-50 text-green-700 border-green-200' :
                  emp.status === 'orientation_done' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  emp.status === 'hostel_checkin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>{emp.status.replace(/_/g, ' ')}</span>
                {emp.localAgentName && <span className="text-xs text-slate-400">Agent: {emp.localAgentName}</span>}
              </div>
            </div>
          ))}
          {employees.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-8">No travelers found.</p>}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-brand-600" /> Digital Roles & Tasks</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: 'Visa Staff', task: 'Switches status to "Visa Issued" → auto-moves employee to Tickets section', icon: FileText, color: 'bg-blue-50 text-blue-700' },
            { role: 'Ticket Staff', task: 'Uses Country/Airline filters to purchase group tickets and upload PDF', icon: Ticket, color: 'bg-green-50 text-green-700' },
            { role: 'Airport Staff', task: 'Uses tablet at Bole Airport to check names off departure list', icon: Smartphone, color: 'bg-purple-50 text-purple-700' },
            { role: 'In-Country Staff', task: 'Clicks "Confirmed Arrival" once employee lands at destination', icon: PlaneLanding, color: 'bg-amber-50 text-amber-700' },
          ].map(r => (
            <div key={r.role} className="rounded-xl border border-slate-100 dark:border-slate-700 p-4 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center mb-3`}><r.icon className="h-5 w-5" /></div>
              <h4 className="font-bold text-ink dark:text-ink-dark text-sm">{r.role}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.task}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
