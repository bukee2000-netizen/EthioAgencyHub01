'use client';

import { useState } from 'react';
import {
  Globe, CheckCircle2, DollarSign, Timer, Search, CheckSquare2, ClipboardList,
  BookOpen, CreditCard, Receipt, Printer, ChevronUp, ChevronDown, Plane, Shield,
  MapPin, AlertCircle, Send, RefreshCw, Clock, Luggage, Plus, FileCheck, Building2,
  X, Save, Ticket
} from 'lucide-react';
import { TravelEmployee, TicketBooking, BookingFormData } from './types';

export function TicketsTab({ employees }: { employees: TravelEmployee[] }) {
  const [countryFilter, setCountryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [airlineFilter, setAirlineFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const ticketEmployees = employees.map(e => ({
    ...e,
    ticketStatus: e.documents.ticket ? 'issued' as const : e.status === 'ready' ? 'booked' as const : 'ready_to_book' as const,
    airline: (['Ethiopian', 'Emirates', 'FlyDubai', 'Qatar Airways'] as const)[Math.floor(Math.random() * 4)],
    bookingRef: e.documents.ticket ? `BK-${e.id}-${e.employeeId.slice(-4)}` : undefined,
    baseFare: Math.floor(8000 + Math.random() * 12000),
    tax: Math.floor(1000 + Math.random() * 3000),
    commission: Math.floor(500 + Math.random() * 1500),
    passportValid: e.documents.passport,
    visaIssued: e.documents.visa,
    medicalScanned: e.documents.yellowCard,
    ruralLocation: ['Jimma', 'Wolkite', 'Nekemte', 'Arba Minch', 'Hossaena'][Math.floor(Math.random() * 5)],
    travelTime: Math.floor(6 + Math.random() * 14) + ' hrs',
    contactConfirmed: Math.random() > 0.3,
    departureDate: e.departureDate || new Date(Date.now() + Math.floor(Math.random() * 7) * 86400000).toISOString().split('T')[0],
    flightNumber: e.flightNumber || `FL${Math.floor(100 + Math.random() * 900)}`,
  }));

  const countries = Array.from(new Set(ticketEmployees.map(e => e.destination))).filter(Boolean);
  const airlines = ['Ethiopian', 'Emirates', 'FlyDubai', 'Qatar Airways'];
  const statuses = ['ready_to_book', 'booked', 'issued'];

  const filtered = ticketEmployees.filter(e => {
    if (countryFilter !== 'all' && e.destination !== countryFilter) return false;
    if (statusFilter !== 'all' && e.ticketStatus !== statusFilter) return false;
    if (airlineFilter !== 'all' && e.airline !== airlineFilter) return false;
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.bookingRef?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const summary = {
    totalThisWeek: filtered.length,
    issuedToday: filtered.filter(e => e.ticketStatus === 'issued').length,
    pendingPayments: filtered.filter(e => e.ticketStatus === 'booked').length,
    urgent: filtered.filter(e => e.ticketStatus !== 'issued' && Math.abs(new Date(e.departureDate).getTime() - Date.now()) < 2 * 86400000).length,
  };

  const getStatusBadge = (s: string) => {
    if (s === 'issued') return { label: 'Ticketed', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' };
    if (s === 'booked') return { label: 'Booked (Pending Pay)', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' };
    return { label: 'Ready to Book', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' };
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filtered.length) setSelectedIds([]);
    else setSelectedIds(filtered.map(e => e.id));
  };

  const handleBulkAction = (action: string) => {
    alert(`${action} for ${selectedIds.length} employees`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600">This Week</span>
          </div>
          <p className="text-2xl font-bold text-blue-800">{summary.totalThisWeek}</p>
          <p className="text-xs font-medium text-blue-700">Total to Fly</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-xs font-semibold text-green-600">Today</span>
          </div>
          <p className="text-2xl font-bold text-green-800">{summary.issuedToday}</p>
          <p className="text-xs font-medium text-green-700">Tickets Issued</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{summary.pendingPayments}</p>
          <p className="text-xs font-medium text-yellow-700">Pending Payments</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Timer className="h-5 w-5 text-red-600" />
            <span className="text-xs font-semibold text-red-600">&lt; 48hrs</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{summary.urgent}</p>
          <p className="text-xs font-medium text-red-700">Urgent (Flagged)</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Country</label>
            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="all">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="ready_to_book">Ready to Book</option>
              <option value="booked">Booking in Progress</option>
              <option value="issued">Ticketed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Airline</label>
            <select value={airlineFilter} onChange={e => setAirlineFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="all">All Airlines</option>
              {airlines.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Booking Reference</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or PNR..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 items-end pb-0.5">
            <button onClick={() => { setCountryFilter('all'); setStatusFilter('all'); setAirlineFilter('all'); setSearchQuery(''); }} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2 mb-3">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          Today&apos;s Booking & Buying
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100"><Search className="h-4 w-4 text-blue-600" /></div>
              <span className="font-semibold text-sm">Check Availability</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Verify seats for a specific group</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100"><BookOpen className="h-4 w-4 text-purple-600" /></div>
              <span className="font-semibold text-sm">Reserve / Book</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Create PNR without payment</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100"><CreditCard className="h-4 w-4 text-green-600" /></div>
              <span className="font-semibold text-sm">Final Buy</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Issue ticket after verification</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-100"><Receipt className="h-4 w-4 text-amber-600" /></div>
              <span className="font-semibold text-sm">Upload Receipt</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Attach payment receipt</p>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-300 bg-brand-50 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm dark:shadow-soft-dark">
          <p className="text-sm font-bold text-brand-800 flex items-center gap-2">
            <CheckSquare2 className="h-5 w-5" />
            {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleBulkAction('Reserve')} className="rounded-xl border border-brand-300 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
              Bulk Reserve
            </button>
            <button onClick={() => handleBulkAction('Buy Tickets')} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 shadow-sm dark:shadow-soft-dark">
              <CreditCard className="h-4 w-4 inline-block mr-1.5" />Bulk Buy Tickets
            </button>
            <button onClick={() => setSelectedIds([])} className="rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm dark:shadow-soft-dark">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold text-ink dark:text-ink-dark">Employee Ticket Checklist</h3>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{filtered.length} employees</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAll} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600" />
                </th>
                <th className="px-4 py-3 text-left">Employee Name</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Airline</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((emp) => {
                const badge = getStatusBadge(emp.ticketStatus);
                const isExpanded = expandedId === emp.id;
                const flightIn48 = !emp.documents.ticket && Math.abs(new Date(emp.departureDate).getTime() - Date.now()) < 2 * 86400000;
                return (
                  <>
                    <tr key={emp.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${flightIn48 ? 'bg-red-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleSelect(emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600" />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpandedId(isExpanded ? null : emp.id)} className="flex items-center gap-2 font-medium text-ink dark:text-ink-dark hover:text-brand-600">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          {emp.name}
                        </button>
                        {emp.bookingRef && <p className="text-xs text-slate-400 ml-6">Ref: {emp.bookingRef}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{emp.destination}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{emp.airline}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                          <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {emp.ticketStatus === 'ready_to_book' && (
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">Book Now</button>
                          )}
                          {emp.ticketStatus === 'booked' && (
                            <button className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">Buy Ticket</button>
                          )}
                          {emp.ticketStatus === 'issued' && (
                            <button className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-200">
                              <Printer className="h-3.5 w-3.5 inline-block mr-1" />Print/View
                            </button>
                          )}
                          {flightIn48 && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold animate-pulse">URGENT</span>}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${emp.id}-detail`}>
                        <td colSpan={6} className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                          <div className="grid gap-5 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Plane className="h-4 w-4 text-blue-600" /> Flight Info</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Flight:</span><span className="font-medium">{emp.flightNumber}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Date:</span><span className="font-medium">{emp.departureDate}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Time:</span><span className="font-medium">{emp.departureTime || 'TBD'} - {emp.arrivalTime || 'TBD'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Airline:</span><span className="font-medium">{emp.airline}</span></div>
                                {emp.bookingRef && <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">PNR:</span><span className="font-bold text-blue-600">{emp.bookingRef}</span></div>}
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600" /> Price Summary</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Base Fare:</span><span className="font-medium">{emp.baseFare.toLocaleString()} ETB</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Tax:</span><span className="font-medium">+ {emp.tax.toLocaleString()} ETB</span></div>
                                <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-2"><span className="font-bold text-slate-700 dark:text-slate-200">Total:</span><span className="font-bold">{(emp.baseFare + emp.tax).toLocaleString()} ETB</span></div>
                                <div className="flex justify-between text-emerald-600"><span className="font-medium">Agency Commission:</span><span className="font-medium">+ {emp.commission.toLocaleString()} ETB</span></div>
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Document Check</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2"><span className={emp.passportValid ? 'text-green-600' : 'text-red-500'}>{emp.passportValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Passport Valid ({'>'}6 Months)</span></div>
                                <div className="flex items-center gap-2"><span className={emp.visaIssued ? 'text-green-600' : 'text-red-500'}>{emp.visaIssued ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Visa Issued</span></div>
                                <div className="flex items-center gap-2"><span className={emp.medicalScanned ? 'text-green-600' : 'text-red-500'}>{emp.medicalScanned ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Medical/Yellow Card Scanned</span></div>
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                  <h5 className="font-semibold text-slate-700 dark:text-slate-200 text-xs mb-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-orange-500" /> Rural Trigger Info</h5>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Location:</span><span className="font-medium">{emp.ruralLocation}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Travel to Addis:</span><span className="font-medium">{emp.travelTime}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Contact:</span>
                                      <span className={`font-medium ${emp.contactConfirmed ? 'text-green-600' : 'text-red-500'}`}>
                                        {emp.contactConfirmed ? 'Confirmed' : 'Unreachable'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {emp.ticketStatus === 'ready_to_book' && (
                              <>
                                <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"><BookOpen className="h-3.5 w-3.5 inline-block mr-1.5" />Check Availability</button>
                                <button className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"><Send className="h-3.5 w-3.5 inline-block mr-1.5" />Notify Agent</button>
                              </>
                            )}
                            {emp.ticketStatus === 'booked' && (
                              <>
                                <button className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"><CreditCard className="h-3.5 w-3.5 inline-block mr-1.5" />Buy & Issue Ticket</button>
                                <button className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"><Receipt className="h-3.5 w-3.5 inline-block mr-1.5" />Upload Receipt</button>
                              </>
                            )}
                            {emp.ticketStatus === 'issued' && (
                              <>
                                <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"><Printer className="h-3.5 w-3.5 inline-block mr-1.5" />Print Travel Pack</button>
                                <button className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"><Send className="h-3.5 w-3.5 inline-block mr-1.5" />Send SMS Notification</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">No employees found matching the selected filters.</div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          Airline Update & Sync
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-700" />
              <h4 className="font-semibold text-yellow-800">Update Flight Status</h4>
            </div>
            <p className="text-sm text-yellow-700">Mark if a scheduled flight has been delayed, cancelled, or changed.</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded-lg bg-yellow-100 px-4 py-1.5 text-xs font-semibold text-yellow-700 hover:bg-yellow-200">Mark Delayed</button>
              <button className="rounded-lg bg-red-100 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">Cancelled</button>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Luggage className="h-5 w-5 text-blue-700" />
              <h4 className="font-semibold text-blue-800">Baggage Policy Update</h4>
            </div>
            <p className="text-sm text-blue-700">Note if airline changed weight limits (rural workers often have heavy luggage).</p>
            <button className="mt-3 rounded-lg bg-blue-100 px-4 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200">Update Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Booking Tab - Agency Ticket Booking & Payment
export function BookingTab({ bookings, setBookings, isBookingModalOpen, setIsBookingModalOpen, bookingForm, setBookingForm, handleCreateBooking, employees }: { bookings: TicketBooking[], setBookings: (b: TicketBooking[]) => void, isBookingModalOpen: boolean, setIsBookingModalOpen: (v: boolean) => void, bookingForm: BookingFormData, setBookingForm: (f: BookingFormData) => void, handleCreateBooking: () => void, employees: TravelEmployee[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBookings = bookings.filter(b => {
    if (searchQuery && !b.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) && !b.bookingReference.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const totalCost = bookings.reduce((sum, b) => sum + b.ticketCost, 0);
  const paidCount = bookings.filter(b => b.paymentStatus === 'paid').length;
  const pendingCount = bookings.filter(b => b.paymentStatus === 'pending').length;
  const issuedCount = bookings.filter(b => b.status === 'issued').length;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      booked: 'bg-blue-100 text-blue-700',
      issued: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      used: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      refunded: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-blue-800">Agency Responsibility: Ticket Booking & Payment</h3>
            <p className="text-sm text-blue-700">The agency is responsible for booking and paying for all employee flights. Ticket costs are covered by the agency.</p>
          </div>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Book New Ticket
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Ticket className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-800">{bookings.length}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Total Bookings</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">{paidCount}</p>
          <p className="text-sm font-medium text-green-700 mt-1">Paid</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          <p className="text-sm font-medium text-yellow-700 mt-1">Pending Payment</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <FileCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-800">{issuedCount}</p>
          <p className="text-sm font-medium text-emerald-700 mt-1">Issued</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Building2 className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-800">{totalCost.toLocaleString()}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Total Cost (SAR)</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or booking reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
        >
          <option value="all">All Status</option>
          <option value="booked">Booked</option>
          <option value="issued">Issued</option>
          <option value="cancelled">Cancelled</option>
          <option value="used">Used</option>
        </select>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="font-bold text-ink dark:text-ink-dark">All Ticket Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left">Booking Ref</th>
                <th className="px-6 py-3 text-left">Employee</th>
                <th className="px-6 py-3 text-left">Flight</th>
                <th className="px-6 py-3 text-left">Date & Time</th>
                <th className="px-6 py-3 text-left">Destination</th>
                <th className="px-6 py-3 text-right">Cost</th>
                <th className="px-6 py-3 text-center">Payment</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-3">
                    <p className="font-mono font-bold text-blue-600">{booking.bookingReference}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Booked: {booking.bookedDate}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.employeeName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.airline}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{booking.flightNumber} ({booking.class})</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.departureDate}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{booking.departureTime} - {booking.arrivalTime}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    {booking.destination}
                    <p className="text-xs text-slate-400">Terminal {booking.terminal}</p>
                  </td>
                  <td className="px-6 py-3 text-right font-bold">
                    {booking.ticketCost.toLocaleString()} {booking.currency}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {booking.paymentStatus === 'pending' && (
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">
                          Pay Now
                        </button>
                      )}
                      {booking.status === 'booked' && (
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">
                          Issue
                        </button>
                      )}
                      <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
                        <Printer className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="sticky top-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Book New Flight Ticket</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 font-medium">
                  <Building2 className="h-5 w-5" />
                  Agency Payment Responsibility
                </div>
                <p className="text-sm text-blue-700 mt-1">The agency will cover the cost of this ticket. Payment will be processed upon booking.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Employee *</label>
                  <select 
                    value={bookingForm.employeeId}
                    onChange={(e) => setBookingForm({...bookingForm, employeeId: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.employeeId || emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Destination *</label>
                  <select 
                    value={bookingForm.destination}
                    onChange={(e) => setBookingForm({...bookingForm, destination: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
                  >
                    <option value="">Select Destination</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="UAE">UAE</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Bahrain">Bahrain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Airline *</label>
                  <select 
                    value={bookingForm.airline}
                    onChange={(e) => setBookingForm({...bookingForm, airline: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
                  >
                    <option value="">Select Airline</option>
                    <option value="Saudi Arabian Airlines">Saudi Arabian Airlines (SV)</option>
                    <option value="Emirates">Emirates (EK)</option>
                    <option value="Qatar Airways">Qatar Airways (QR)</option>
                    <option value="Kuwait Airways">Kuwait Airways (WY)</option>
                    <option value="Ethiopian Airlines">Ethiopian Airlines (ET)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Flight Number *</label>
                  <input 
                    type="text" 
                    value={bookingForm.flightNumber}
                    onChange={(e) => setBookingForm({...bookingForm, flightNumber: e.target.value})}
                    placeholder="e.g., SV414" 
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Departure Date *</label>
                  <input 
                    type="date" 
                    value={bookingForm.departureDate}
                    onChange={(e) => setBookingForm({...bookingForm, departureDate: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Departure Time *</label>
                  <input 
                    type="time" 
                    value={bookingForm.departureTime}
                    onChange={(e) => setBookingForm({...bookingForm, departureTime: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Arrival Time *</label>
                  <input 
                    type="time" 
                    value={bookingForm.arrivalTime}
                    onChange={(e) => setBookingForm({...bookingForm, arrivalTime: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Class *</label>
                  <select 
                    value={bookingForm.class}
                    onChange={(e) => setBookingForm({...bookingForm, class: e.target.value as any})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Terminal</label>
                  <select 
                    value={bookingForm.terminal}
                    onChange={(e) => setBookingForm({...bookingForm, terminal: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm"
                  >
                    <option value="T1">Terminal 1</option>
                    <option value="T2">Terminal 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Estimated Cost *</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={bookingForm.ticketCost}
                      onChange={(e) => setBookingForm({...bookingForm, ticketCost: Number(e.target.value)})}
                      placeholder="0.00" 
                      className="flex-1 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" 
                    />
                    <select 
                      value={bookingForm.currency}
                      onChange={(e) => setBookingForm({...bookingForm, currency: e.target.value})}
                      className="w-24 rounded-xl border border-slate-300 dark:border-slate-600 px-2 py-2.5 text-sm"
                    >
                      <option value="SAR">SAR</option>
                      <option value="AED">AED</option>
                      <option value="QAR">QAR</option>
                      <option value="KWD">KWD</option>
                      <option value="ETB">ETB</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setIsBookingModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button 
                onClick={handleCreateBooking}
                disabled={!bookingForm.employeeId || !bookingForm.destination || !bookingForm.airline || !bookingForm.flightNumber || !bookingForm.departureDate}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Book Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
