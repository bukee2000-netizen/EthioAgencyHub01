'use client';

import { useState, useEffect } from 'react';
import {
  Plane, Calendar, Ticket, CheckCircle2, Clock, Users,
  MapPin, FileText, Download, Upload, Search, Filter,
  ChevronRight, Bus, Building2, Smartphone, Shield, BadgeCheck,
  ArrowRight, MapPinned, MessageSquare, Home, RefreshCw, Eye, Edit,
  Printer, FileCheck, Clock4, PlaneTakeoff, PlaneLanding, UserCheck,
  Bell, BellRing, CheckSquare, X, Save, Plus, CreditCard, Receipt,
  ChevronDown, ChevronUp, Globe, BookOpen, DollarSign, Send,
  ClipboardList, Luggage, Timer, Flag, CheckSquare2, BarChart3,
  ChevronLeft, Radio, Video, LayoutDashboard, Route, BarChart4,
  CalendarRange, UsersRound, VideoIcon, SquareCheckBig, Handshake,
  QrCode
} from 'lucide-react';
import { TravelEmployee, TicketBooking, TravelModuleProps } from './tabs/types';
import { OverviewTab } from './tabs/command-center';
import { ScheduleTab } from './tabs/schedule';
import { TicketsTab } from './tabs/tickets';
import { DepartureTab } from './tabs/departures';
import { PreparationTab } from './tabs/preparation';
import { ArrivalTab } from './tabs/arrival';
import { useToast } from '@/components/ui/toast-provider';

export function TravelManagementModule({ initialTab }: TravelModuleProps) {
  const { addToast } = useToast();
  const tabMap: Record<string, any> = { overview: 'overview', schedule: 'schedule', tickets: 'tickets', departure: 'departure', preparation: 'preparation', arrival: 'arrival' };
  const [activeTab, setActiveTab] = useState<any>(initialTab && tabMap[initialTab] ? tabMap[initialTab] : 'overview');
  const [employees, setEmployees] = useState<TravelEmployee[]>([]);
  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    employeeId: '',
    destination: '',
    airline: '',
    flightNumber: '',
    class: 'economy',
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    origin: 'Addis Ababa',
    terminal: 'T2',
    ticketCost: 0,
    currency: 'SAR',
    bookingReference: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateBooking = async () => {
    try {
      const res = await fetch('/api/travel/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsBookingModalOpen(false);
        loadData();
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      addToast({ title: 'Error', description: 'Failed to create booking. Please try again.', type: 'error' });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [travelRes, bookingRes, employeesRes] = await Promise.all([
        fetch('/api/travel'),
        fetch('/api/travel/booking'),
        fetch('/api/employees')
      ]);

      const [travelData, bookingData, employeesData] = await Promise.all([
        travelRes.json(),
        bookingRes.json(),
        employeesRes.json()
      ]);

      if (travelData.success && travelData.data) {
        const mappedEmployees: TravelEmployee[] = travelData.data.map((t: any) => ({
          id: t.id,
          employeeId: t.employeeId || '',
          name: t.employee?.name || 'Unknown',
          phone: t.employee?.phone || '',
          destination: t.destination || '',
          flightNumber: t.flightNumber || '',
          departureDate: t.departureAt ? new Date(t.departureAt).toISOString().split('T')[0] : '',
          departureTime: t.departureTime || '',
          arrivalTime: t.arrivalTime || '',
          terminal: t.terminal || '',
          ticketNumber: t.ticket || '',
          status: t.status === 'DEPARTED' ? 'departed' : t.status === 'ARRIVED' ? 'arrived' : t.status === 'READY' ? 'ready' : 'pending',
          documents: {
            passport: true,
            visa: true,
            yellowCard: true,
            ticket: !!t.ticket,
            orientationComplete: false
          },
          localAgentId: t.localAgentId,
          localAgentName: t.localAgentName,
          assignedStaffId: t.assignedStaffId,
          assignedStaffName: t.assignedStaffName,
          inCountryStaff: t.inCountryStaff,
          transitStatus: t.transitStatus || { t72hours: 'pending', t48hours: 'pending', t24hours: 'pending' }
        }));
        setEmployees(mappedEmployees);
      }

      if (bookingData.success && bookingData.data) {
        const mappedBookings: TicketBooking[] = bookingData.data.map((b: any) => ({
          id: b.id,
          employeeId: b.employeeId,
          employeeName: b.employee?.name || '',
          phone: b.employee?.phone || '',
          destination: b.destination,
          airline: b.airline || '',
          flightNumber: b.flightNumber || '',
          class: b.class || 'economy',
          departureDate: b.departureAt ? new Date(b.departureAt).toISOString().split('T')[0] : '',
          departureTime: b.departureTime || '',
          arrivalTime: b.arrivalTime || '',
          origin: b.origin || 'Addis Ababa',
          terminal: b.terminal || '',
          ticketCost: b.ticketCost || 0,
          currency: b.currency || 'SAR',
          paymentStatus: b.paymentStatus || 'pending',
          bookedBy: 'Agency Admin',
          bookedDate: new Date().toISOString().split('T')[0],
          bookingReference: b.bookingReference || '',
          status: b.status === 'TICKETED' ? 'issued' : b.status === 'DEPARTED' ? 'used' : 'booked'
        }));
        setBookings(mappedBookings);
      }

      if (employeesData.success && employeesData.data && employeesData.data.length > 0) {
        const regEmployees: TravelEmployee[] = employeesData.data.map((e: any) => ({
          id: e.id,
          employeeId: e.id,
          name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || e.name || 'Unknown',
          phone: e.contactPhone || e.phone || '',
          destination: e.destination || e.country || 'Open',
          flightNumber: '',
          departureDate: '',
          departureTime: '',
          arrivalTime: '',
          terminal: 'T2',
          ticketNumber: '',
          status: 'pending' as const,
          documents: { passport: !!e.passportNumber, visa: false, yellowCard: false, ticket: false, orientationComplete: false },
          transitStatus: { t72hours: 'pending' as const, t48hours: 'pending' as const, t24hours: 'pending' as const }
        }));
        if (employees.length === 0) {
          setEmployees(regEmployees);
        }
      }
    } catch (error) {
      console.error('Failed to load travel data:', error);
      addToast({ title: 'Error', description: 'Failed to load travel data. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const t72Count = employees.filter(e => {
    const days = Math.ceil((new Date(e.departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 3 && days > 2;
  }).length;
  const t48Count = employees.filter(e => {
    const days = Math.ceil((new Date(e.departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 2 && days > 1;
  }).length;
  const t24Count = employees.filter(e => {
    const days = Math.ceil((new Date(e.departureDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 1;
  }).length;
  const readyCount = employees.filter(e => e.status === 'ready').length;
  const departedCount = employees.filter(e => e.status === 'departed').length;
  const arrivedCount = employees.filter(e => e.status === 'arrived').length;

  const tabs = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard, description: 'Live travel pipeline & alerts' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, description: 'Itinerary & slot management' },
    { id: 'tickets', label: 'Tickets', icon: Ticket, description: 'Booking & financial workflow' },
    { id: 'departure', label: "Today's Departures", icon: PlaneTakeoff, description: 'Live operations & check-in' },
    { id: 'preparation', label: 'Departure Prep', icon: CheckCircle2, description: '72-hour checklist & orientation' },
    { id: 'arrival', label: 'Arrival', icon: PlaneLanding, description: 'In-country arrival confirmation' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-3">
              <Plane className="h-7 w-7 text-blue-600" />
              Travel Management
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Travel
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              <Printer className="h-4 w-4" />
              Print Travel Pack
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-6">
        <div className="rounded-2xl bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-5 w-5 text-red-600" />
            <span className="text-xs font-bold text-red-600">72h Alert</span>
          </div>
          <p className="text-2xl font-bold text-red-800">{t72Count}</p>
          <p className="text-xs text-red-600">Workers starting journey</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Bus className="h-5 w-5 text-orange-600" />
            <span className="text-xs font-bold text-orange-600">48h</span>
          </div>
          <p className="text-2xl font-bold text-orange-800">{t48Count}</p>
          <p className="text-xs text-orange-600">Arriving in Addis</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="h-5 w-5 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-600">24h</span>
          </div>
          <p className="text-2xl font-bold text-yellow-800">{t24Count}</p>
          <p className="text-xs text-yellow-600">Final prep</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-xs font-bold text-green-600">Ready</span>
          </div>
          <p className="text-2xl font-bold text-green-800">{readyCount}</p>
          <p className="text-xs text-green-600">Ready to fly</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <PlaneTakeoff className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-800">{departedCount}</p>
          <p className="text-xs text-blue-600">Departed</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <PlaneLanding className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-800">{arrivedCount}</p>
          <p className="text-xs text-emerald-600">Arrived safely</p>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <nav className="flex gap-4 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && <OverviewTab employees={filteredEmployees} />}
      {activeTab === 'schedule' && <ScheduleTab employees={employees} />}
      {activeTab === 'tickets' && <TicketsTab employees={filteredEmployees} />}
      {activeTab === 'departure' && <DepartureTab employees={employees} />}
      {activeTab === 'preparation' && <PreparationTab employees={filteredEmployees} />}
      {activeTab === 'arrival' && <ArrivalTab employees={employees} />}
    </div>
  );
}
