'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plane, Calendar, Ticket, CheckCircle2, AlertCircle, Clock, Users, 
  MapPin, Phone, Mail, FileText, Download, Upload, Search, Filter,
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

interface TravelEmployee {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  destination: string;
  flightNumber: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  terminal: string;
  ticketNumber: string;
  status: 'pending' | 'transit_to_addis' | 'hostel_checkin' | 'orientation_done' | 'ready' | 'departed' | 'arrived';
  documents: {
    passport: boolean;
    visa: boolean;
    yellowCard: boolean;
    ticket: boolean;
    orientationComplete: boolean;
  };
  localAgentId?: string;
  localAgentName?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  inCountryStaff?: string;
  transitStatus: {
    t72hours: 'pending' | 'confirmed' | 'bus_started';
    t48hours: 'pending' | 'confirmed' | 'arrived_hostel';
    t24hours: 'pending' | 'ready';
  };
  notes?: string;
}

interface TicketBooking {
  id: string;
  employeeId: string;
  employeeName: string;
  phone: string;
  destination: string;
  airline: string;
  flightNumber: string;
  class: 'economy' | 'business' | 'first';
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  terminal: string;
  ticketCost: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookedBy: string;
  bookedDate: string;
  bookingReference: string;
  status: 'booked' | 'issued' | 'cancelled' | 'used';
}

interface FlightSchedule {
  id: string;
  flightNumber: string;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  terminal: string;
  capacity: number;
  booked: number;
  date: string;
}

interface TravelModuleProps { initialTab?: string }

export function TravelManagementModule({ initialTab }: TravelModuleProps) {
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
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-slate-100 text-slate-700',
      transit_to_addis: 'bg-blue-100 text-blue-700',
      hostel_checkin: 'bg-indigo-100 text-indigo-700',
      orientation_done: 'bg-purple-100 text-purple-700',
      ready: 'bg-green-100 text-green-700',
      departed: 'bg-amber-100 text-amber-700',
      arrived: 'bg-emerald-100 text-emerald-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      transit_to_addis: 'Transit to Addis',
      hostel_checkin: 'Hostel Check-in',
      orientation_done: 'Orientation Done',
      ready: 'Ready to Fly',
      departed: 'Departed',
      arrived: 'Arrived Safely',
    };
    return labels[status] || status;
  };

  // Stats calculation
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
      {/* Header */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink flex items-center gap-3">
              <Plane className="h-7 w-7 text-blue-600" />
              Travel Management
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Travel
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
              <Printer className="h-4 w-4" />
              Print Travel Pack
            </button>
          </div>
        </div>
      </div>

      {/* Stats - Readiness Funnel */}
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

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
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
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab employees={filteredEmployees} />}
      {activeTab === 'schedule' && <ScheduleTab employees={employees} />}
      {activeTab === 'tickets' && <TicketsTab employees={filteredEmployees} />}
      {activeTab === 'departure' && <DepartureTab employees={employees} />}
      {activeTab === 'preparation' && <PreparationTab employees={filteredEmployees} />}
      {activeTab === 'arrival' && <ArrivalTab employees={employees} />}
    </div>
  );
}

// Booking Tab - Agency Ticket Booking & Payment
function BookingTab({ bookings, setBookings, isBookingModalOpen, setIsBookingModalOpen, bookingForm, setBookingForm, handleCreateBooking, employees }: { bookings: TicketBooking[], setBookings: (b: TicketBooking[]) => void, isBookingModalOpen: boolean, setIsBookingModalOpen: (v: boolean) => void, bookingForm: any, setBookingForm: (f: any) => void, handleCreateBooking: () => void, employees: TravelEmployee[] }) {
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
      used: 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getPaymentColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      refunded: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* Agency Payment Responsibility Banner */}
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

      {/* Stats */}
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

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or booking reference..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
        >
          <option value="all">All Status</option>
          <option value="booked">Booked</option>
          <option value="issued">Issued</option>
          <option value="cancelled">Cancelled</option>
          <option value="used">Used</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-ink">All Ticket Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
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
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <p className="font-mono font-bold text-blue-600">{booking.bookingReference}</p>
                    <p className="text-xs text-slate-500">Booked: {booking.bookedDate}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.employeeName}</p>
                    <p className="text-xs text-slate-500">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.airline}</p>
                    <p className="text-xs text-slate-500">{booking.flightNumber} ({booking.class})</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium">{booking.departureDate}</p>
                    <p className="text-xs text-slate-500">{booking.departureTime} - {booking.arrivalTime}</p>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
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
                      <button className="p-1.5 rounded hover:bg-slate-100">
                        <Printer className="h-4 w-4 text-slate-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink">Book New Flight Ticket</h3>
              <button onClick={() => setIsBookingModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-500" />
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employee *</label>
                  <select 
                    value={bookingForm.employeeId}
                    onChange={(e) => setBookingForm({...bookingForm, employeeId: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.employeeId || emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
                  <select 
                    value={bookingForm.destination}
                    onChange={(e) => setBookingForm({...bookingForm, destination: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Airline *</label>
                  <select 
                    value={bookingForm.airline}
                    onChange={(e) => setBookingForm({...bookingForm, airline: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Flight Number *</label>
                  <input 
                    type="text" 
                    value={bookingForm.flightNumber}
                    onChange={(e) => setBookingForm({...bookingForm, flightNumber: e.target.value})}
                    placeholder="e.g., SV414" 
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Departure Date *</label>
                  <input 
                    type="date" 
                    value={bookingForm.departureDate}
                    onChange={(e) => setBookingForm({...bookingForm, departureDate: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Departure Time *</label>
                  <input 
                    type="time" 
                    value={bookingForm.departureTime}
                    onChange={(e) => setBookingForm({...bookingForm, departureTime: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Arrival Time *</label>
                  <input 
                    type="time" 
                    value={bookingForm.arrivalTime}
                    onChange={(e) => setBookingForm({...bookingForm, arrivalTime: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                  <select 
                    value={bookingForm.class}
                    onChange={(e) => setBookingForm({...bookingForm, class: e.target.value as any})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Terminal</label>
                  <select 
                    value={bookingForm.terminal}
                    onChange={(e) => setBookingForm({...bookingForm, terminal: e.target.value})}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm"
                  >
                    <option value="T1">Terminal 1</option>
                    <option value="T2">Terminal 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Cost *</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={bookingForm.ticketCost}
                      onChange={(e) => setBookingForm({...bookingForm, ticketCost: Number(e.target.value)})}
                      placeholder="0.00" 
                      className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm" 
                    />
                    <select 
                      value={bookingForm.currency}
                      onChange={(e) => setBookingForm({...bookingForm, currency: e.target.value})}
                      className="w-24 rounded-xl border border-slate-300 px-2 py-2.5 text-sm"
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
            <div className="sticky bottom-0 border-t border-slate-200 bg-white px-6 py-4 flex justify-end gap-3">
              <button onClick={() => setIsBookingModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
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

// Overview Tab with Readiness Funnel
// ===== Overview – Digital Command Center =====
function OverviewTab({ employees }: { employees: TravelEmployee[] }) {
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
      {/* 72-Hour Automated Alert Banner */}
      {urgent72 > 0 && (
        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-xl bg-red-100"><BellRing className="h-6 w-6 text-red-600" /></div>
            <div className="flex-1">
              <p className="font-bold text-red-800 text-lg">72-hour Departure Alert – Action Required</p>
              <p className="text-sm text-red-700 mt-1">{urgent72} employee{urgent72 > 1 ? 's' : ''} reaching the 72-hour departure mark need confirmation.</p>
            </div>
            <button className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-sm">View Tasks</button>
          </div>
        </div>
      )}

      {/* Department Bridge – Visa & Medical Clearance View */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
        <h3 className="font-bold text-ink flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-600" />
          Department Bridge – Clearance Status
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white border border-blue-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-800 flex items-center gap-2"><FileText className="h-4 w-4" /> Visa Department</span>
              <span className="text-sm font-bold text-blue-700">{visaCleared}/{total}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-blue-100">
              <div className="h-2.5 rounded-full bg-blue-500 transition-all" style={{ width: `${total ? (visaCleared / total) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-blue-600 mt-2">{total - visaCleared} employee{total - visaCleared !== 1 ? 's' : ''} pending visa issuance</p>
          </div>
          <div className="rounded-xl bg-white border border-green-200 p-4">
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

      {/* Data Summary – Visual Pipeline */}
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

      {/* Traffic Light Pipeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-ink mb-4">Travel Pipeline Overview</h3>
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
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {[{ label: 'Rural', count: inRural }, { label: 'Transit', count: inTransit }, { label: 'Hostel', count: atHostel }, { label: 'Ready', count: ready }, { label: 'Departed', count: departed }, { label: 'Arrived', count: arrived }].map(s => (
            <span key={s.label}>{s.label}: <strong>{s.count}</strong></span>
          ))}
        </div>
      </div>

      {/* Recent Travelers List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-ink">Recent Travelers</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {employees.slice(0, 8).map(emp => (
            <div key={emp.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-ink text-sm">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.destination} • {emp.flightNumber || 'No flight'}</p>
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
          {employees.length === 0 && <p className="text-center text-slate-500 py-8">No travelers found.</p>}
        </div>
      </div>

      {/* Role Task Matrix */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Users className="h-5 w-5 text-brand-600" /> Digital Roles &amp; Tasks</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { role: 'Visa Staff', task: 'Switches status to "Visa Issued" → auto-moves employee to Tickets section', icon: FileText, color: 'bg-blue-50 text-blue-700' },
            { role: 'Ticket Staff', task: 'Uses Country/Airline filters to purchase group tickets and upload PDF', icon: Ticket, color: 'bg-green-50 text-green-700' },
            { role: 'Airport Staff', task: 'Uses tablet at Bole Airport to check names off departure list', icon: Smartphone, color: 'bg-purple-50 text-purple-700' },
            { role: 'In-Country Staff', task: 'Clicks "Confirmed Arrival" once employee lands at destination', icon: PlaneLanding, color: 'bg-amber-50 text-amber-700' },
          ].map(r => (
            <div key={r.role} className="rounded-xl border border-slate-100 p-4 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center mb-3`}><r.icon className="h-5 w-5" /></div>
              <h4 className="font-bold text-ink text-sm">{r.role}</h4>
              <p className="text-xs text-slate-500 mt-1">{r.task}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Schedule Tab
// ===== Schedule – Logistics Planner =====
function ScheduleTab({ employees }: { employees: TravelEmployee[] }) {
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
      {/* Sync & Calendar */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white shadow-sm"><Calendar className="h-6 w-6 text-blue-600" /></div>
            <div>
              <h3 className="font-bold text-ink text-lg">Logistics Planner</h3>
              <p className="text-sm text-slate-600 mt-1">Airline schedules, itinerary batches, and hostel slot management.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-sm">
            <Plus className="h-4 w-4" />
            Import Itinerary
          </button>
        </div>
      </div>

      {/* Filter by Route */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500">Route:</span>
        <button onClick={() => setSelectedRoute('all')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedRoute === 'all' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>All Routes</button>
        {routes.slice(0, 5).map(r => (
          <button key={r} onClick={() => setSelectedRoute(r)} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${selectedRoute === r ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{r}</button>
        ))}
      </div>

      {/* Flights by Date */}
      {Object.entries(groupedByDate).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime()).map(([date, emps]) => {
        const isSoon = Math.abs(new Date(date).getTime() - Date.now()) < 3 * 86400000;
        return (
          <div key={date} className={`rounded-2xl border ${isSoon ? 'border-red-200 bg-red-50/30' : 'border-slate-200 bg-white'} shadow-sm overflow-hidden`}>
            <div className={`px-6 py-3 flex items-center justify-between border-b ${isSoon ? 'border-red-100 bg-red-50' : 'border-slate-100 bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <Calendar className={`h-5 w-5 ${isSoon ? 'text-red-600' : 'text-slate-500'}`} />
                <span className="font-bold text-ink">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                {isSoon && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">72-Hour Window</span>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">{emps.length} employee{emps.length > 1 ? 's' : ''}</span>
                <span className="text-slate-400">Max: 12</span>
                <button className="text-blue-600 text-xs font-semibold hover:underline">Sync Calendar</button>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {emps.map(emp => {
                const days = Math.ceil((new Date(emp.departureDate).getTime() - Date.now()) / 86400000);
                return (
                  <div key={emp.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${days <= 3 && days > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
                        <Plane className={`h-5 w-5 ${days <= 3 && days > 0 ? 'text-red-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-ink text-sm">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.flightNumber || 'Flight TBD'} • {emp.departureTime || 'TBD'} • {emp.terminal || 'T2'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">{emp.destination}</span>
                      {days > 0 && days <= 3 && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">{days}d left</span>}
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">Assign</button>
                        <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50">Slot</button>
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
        <div className="text-center text-slate-500 py-12">No scheduled flights for this route.</div>
      )}
    </div>
  );
}

// Tickets Tab – Complete Ticket Booking & Buying Workflow
function TicketsTab({ employees }: { employees: TravelEmployee[] }) {
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
      {/* ===== Summary Dashboard Bar ===== */}
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

      {/* ===== Global Filter Bar ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Country</label>
            <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All Countries</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All Status</option>
              <option value="ready_to_book">Ready to Book</option>
              <option value="booked">Booking in Progress</option>
              <option value="issued">Ticketed</option>
            </select>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Airline</label>
            <select value={airlineFilter} onChange={e => setAirlineFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm">
              <option value="all">All Airlines</option>
              {airlines.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Booking Reference</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or PNR..."
                className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2 items-end pb-0.5">
            <button onClick={() => { setCountryFilter('all'); setStatusFilter('all'); setAirlineFilter('all'); setSearchQuery(''); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ===== Activity Panel: Today's Booking & Buying ===== */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <h3 className="font-bold text-ink flex items-center gap-2 mb-3">
          <ClipboardList className="h-5 w-5 text-blue-600" />
          Today&apos;s Booking & Buying
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100"><Search className="h-4 w-4 text-blue-600" /></div>
              <span className="font-semibold text-sm">Check Availability</span>
            </div>
            <p className="text-xs text-slate-500">Verify seats for a specific group</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-100"><BookOpen className="h-4 w-4 text-purple-600" /></div>
              <span className="font-semibold text-sm">Reserve / Book</span>
            </div>
            <p className="text-xs text-slate-500">Create PNR without payment</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100"><CreditCard className="h-4 w-4 text-green-600" /></div>
              <span className="font-semibold text-sm">Final Buy</span>
            </div>
            <p className="text-xs text-slate-500">Issue ticket after verification</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm cursor-pointer">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-amber-100"><Receipt className="h-4 w-4 text-amber-600" /></div>
              <span className="font-semibold text-sm">Upload Receipt</span>
            </div>
            <p className="text-xs text-slate-500">Attach payment receipt</p>
          </div>
        </div>
      </div>

      {/* ===== Batch Actions Bar ===== */}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-300 bg-brand-50 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <p className="text-sm font-bold text-brand-800 flex items-center gap-2">
            <CheckSquare2 className="h-5 w-5" />
            {selectedIds.length} employee{selectedIds.length > 1 ? 's' : ''} selected
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleBulkAction('Reserve')} className="rounded-xl border border-brand-300 bg-white px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">
              Bulk Reserve
            </button>
            <button onClick={() => handleBulkAction('Buy Tickets')} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 shadow-sm">
              <CreditCard className="h-4 w-4 inline-block mr-1.5" />Bulk Buy Tickets
            </button>
            <button onClick={() => setSelectedIds([])} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ===== Employee Ticket Checklist Table ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-ink">Employee Ticket Checklist</h3>
          <span className="text-xs font-medium text-slate-500">{filtered.length} employees</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAll} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
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
                    <tr key={emp.id} className={`hover:bg-slate-50 transition-colors ${flightIn48 ? 'bg-red-50/50' : ''}`}>
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleSelect(emp.id)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpandedId(isExpanded ? null : emp.id)} className="flex items-center gap-2 font-medium text-ink hover:text-brand-600">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          {emp.name}
                        </button>
                        {emp.bookingRef && <p className="text-xs text-slate-400 ml-6">Ref: {emp.bookingRef}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{emp.destination}</td>
                      <td className="px-4 py-3 text-slate-600">{emp.airline}</td>
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
                            <button className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200">
                              <Printer className="h-3.5 w-3.5 inline-block mr-1" />Print/View
                            </button>
                          )}
                          {flightIn48 && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold animate-pulse">URGENT</span>}
                        </div>
                      </td>
                    </tr>
                    {/* ===== Expandable Detail Card ===== */}
                    {isExpanded && (
                      <tr key={`${emp.id}-detail`}>
                        <td colSpan={6} className="px-6 py-5 bg-slate-50 border-b border-slate-200">
                          <div className="grid gap-5 md:grid-cols-3">
                            {/* Flight Info */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Plane className="h-4 w-4 text-blue-600" /> Flight Info</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500">Flight:</span><span className="font-medium">{emp.flightNumber}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Date:</span><span className="font-medium">{emp.departureDate}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Time:</span><span className="font-medium">{emp.departureTime || 'TBD'} - {emp.arrivalTime || 'TBD'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Airline:</span><span className="font-medium">{emp.airline}</span></div>
                                {emp.bookingRef && <div className="flex justify-between"><span className="text-slate-500">PNR:</span><span className="font-bold text-blue-600">{emp.bookingRef}</span></div>}
                              </div>
                            </div>
                            {/* Price Summary */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600" /> Price Summary</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500">Base Fare:</span><span className="font-medium">{emp.baseFare.toLocaleString()} ETB</span></div>
                                <div className="flex justify-between"><span className="text-slate-500">Tax:</span><span className="font-medium">+ {emp.tax.toLocaleString()} ETB</span></div>
                                <div className="flex justify-between border-t border-slate-100 pt-2"><span className="font-bold text-slate-700">Total:</span><span className="font-bold">{(emp.baseFare + emp.tax).toLocaleString()} ETB</span></div>
                                <div className="flex justify-between text-emerald-600"><span className="font-medium">Agency Commission:</span><span className="font-medium">+ {emp.commission.toLocaleString()} ETB</span></div>
                              </div>
                            </div>
                            {/* Document Check + Rural Trigger */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                              <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Document Check</h4>
                              <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2"><span className={emp.passportValid ? 'text-green-600' : 'text-red-500'}>{emp.passportValid ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Passport Valid ({'>'}6 Months)</span></div>
                                <div className="flex items-center gap-2"><span className={emp.visaIssued ? 'text-green-600' : 'text-red-500'}>{emp.visaIssued ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Visa Issued</span></div>
                                <div className="flex items-center gap-2"><span className={emp.medicalScanned ? 'text-green-600' : 'text-red-500'}>{emp.medicalScanned ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Medical/Yellow Card Scanned</span></div>
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                  <h5 className="font-semibold text-slate-700 text-xs mb-2 flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-orange-500" /> Rural Trigger Info</h5>
                                  <div className="space-y-1.5">
                                    <div className="flex justify-between"><span className="text-slate-500">Location:</span><span className="font-medium">{emp.ruralLocation}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Travel to Addis:</span><span className="font-medium">{emp.travelTime}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Contact:</span>
                                      <span className={`font-medium ${emp.contactConfirmed ? 'text-green-600' : 'text-red-500'}`}>
                                        {emp.contactConfirmed ? 'Confirmed' : 'Unreachable'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Action buttons inside detail */}
                          <div className="mt-4 flex flex-wrap gap-3">
                            {emp.ticketStatus === 'ready_to_book' && (
                              <>
                                <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"><BookOpen className="h-3.5 w-3.5 inline-block mr-1.5" />Check Availability</button>
                                <button className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Send className="h-3.5 w-3.5 inline-block mr-1.5" />Notify Agent</button>
                              </>
                            )}
                            {emp.ticketStatus === 'booked' && (
                              <>
                                <button className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"><CreditCard className="h-3.5 w-3.5 inline-block mr-1.5" />Buy & Issue Ticket</button>
                                <button className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Receipt className="h-3.5 w-3.5 inline-block mr-1.5" />Upload Receipt</button>
                              </>
                            )}
                            {emp.ticketStatus === 'issued' && (
                              <>
                                <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"><Printer className="h-3.5 w-3.5 inline-block mr-1.5" />Print Travel Pack</button>
                                <button className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Send className="h-3.5 w-3.5 inline-block mr-1.5" />Send SMS Notification</button>
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
          <div className="px-6 py-12 text-center text-slate-500 font-medium">No employees found matching the selected filters.</div>
        )}
      </div>

      {/* ===== Airline Update & Sync Panel ===== */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
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

// Departure Prep Tab with 72-Hour Checklist
// ===== Departure Prep – Checklist & Orientation =====
function PreparationTab({ employees }: { employees: TravelEmployee[] }) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, string[]>>({
    call72: [], documents: [], orientation: [], baggage: [], family: []
  });

  const toggle = (section: string, id: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [section]: prev[section].includes(id) ? prev[section].filter(x => x !== id) : [...prev[section], id]
    }));
  };

  const totalEmployees = employees.length;
  const docVerified = employees.filter(e => e.documents.passport && e.documents.visa && e.documents.yellowCard).length;
  const orientationDone = employees.filter(e => e.documents.orientationComplete).length;

  return (
    <div className="space-y-6">
      {/* Safety Gates Header */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Shield className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="font-bold text-ink text-lg">Safety Gates – 100% Readiness Checklist</h3>
            <p className="text-sm text-slate-600 mt-1">Every employee must pass all gates before reaching Bole International Airport.</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">72-Hour Call</p>
          <p className="text-2xl font-bold text-ink mt-1">{completedSteps.call72.length}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${totalEmployees ? (completedSteps.call72.length / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Documents Verified</p>
          <p className="text-2xl font-bold text-ink mt-1">{docVerified}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-purple-500 transition-all" style={{ width: `${totalEmployees ? (docVerified / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Orientation Watched</p>
          <p className="text-2xl font-bold text-ink mt-1">{orientationDone}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-green-500 transition-all" style={{ width: `${totalEmployees ? (orientationDone / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Baggage Checked</p>
          <p className="text-2xl font-bold text-ink mt-1">{completedSteps.baggage.length}/{totalEmployees}</p>
          <div className="h-2 mt-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${totalEmployees ? (completedSteps.baggage.length / totalEmployees) * 100 : 0}%` }} /></div>
        </div>
      </div>

      {/* Interactive Checklists */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* 72-Hour Call */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-blue-100"><Phone className="h-5 w-5 text-blue-600" /></div>
            <h4 className="font-bold text-ink">72-Hour Call – Confirm departure from village</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.call72.includes(emp.id) ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 hover:bg-slate-100 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.call72.includes(emp.id)} onChange={() => toggle('call72', emp.id)} className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.destination} • Agent: {emp.localAgentName || '-'}</p>
                </div>
                {completedSteps.call72.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />}
              </label>
            ))}
          </div>
        </div>

        {/* Document Handover */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-purple-100"><FileText className="h-5 w-5 text-purple-600" /></div>
            <h4 className="font-bold text-ink">Document Handover – Passport, Visa, Contract verified</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => {
              const allDocs = emp.documents.passport && emp.documents.visa && emp.documents.yellowCard;
              return (
                <div key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl ${allDocs ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink">{emp.name}</p>
                    <div className="flex gap-2 mt-1 text-xs">
                      <span className={emp.documents.passport ? 'text-green-600' : 'text-red-500'}>Passport {emp.documents.passport ? '✓' : '✗'}</span>
                      <span className={emp.documents.visa ? 'text-green-600' : 'text-red-500'}>Visa {emp.documents.visa ? '✓' : '✗'}</span>
                      <span className={emp.documents.yellowCard ? 'text-green-600' : 'text-red-500'}>Medical {emp.documents.yellowCard ? '✓' : '✗'}</span>
                    </div>
                  </div>
                  {allDocs ? <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" /> : <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Orientation Video */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-green-100"><Video className="h-5 w-5 text-green-600" /></div>
            <h4 className="font-bold text-ink">Orientation Video – "How to Navigate the Airport"</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.orientation.includes(emp.id) ? 'bg-green-50 border border-green-200' : 'bg-slate-50 hover:bg-slate-100 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.orientation.includes(emp.id)} onChange={() => toggle('orientation', emp.id)} className="h-4 w-4 rounded border-slate-300 text-green-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{emp.name}</p>
                  <p className="text-xs text-slate-500">{emp.localAgentName ? `Confirmed by ${emp.localAgentName}` : 'Not assigned'}</p>
                </div>
                {completedSteps.orientation.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
              </label>
            ))}
          </div>
          <button className="mt-3 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700 shadow-sm">
            <Video className="h-4 w-4 inline-block mr-2" />Watch Airport Guide Video
          </button>
        </div>

        {/* Baggage Weight Check */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-amber-100"><Luggage className="h-5 w-5 text-amber-600" /></div>
            <h4 className="font-bold text-ink">Baggage Weight Check – Avoid extra fees</h4>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto">
            {employees.map(emp => (
              <label key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${completedSteps.baggage.includes(emp.id) ? 'bg-amber-50 border border-amber-200' : 'bg-slate-50 hover:bg-slate-100 border border-transparent'}`}>
                <input type="checkbox" checked={completedSteps.baggage.includes(emp.id)} onChange={() => toggle('baggage', emp.id)} className="h-4 w-4 rounded border-slate-300 text-amber-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{emp.name}</p>
                  <p className="text-xs text-slate-500">Rural area: {['Jimma', 'Wolkite', 'Nekemte', 'Arba Minch'][Math.floor(Math.random() * 4)]} • Expected: 20-30kg</p>
                </div>
                {completedSteps.baggage.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />}
              </label>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700">
            <Luggage className="h-4 w-4 inline-block mr-1" />
            Reminder: Rural workers often carry heavy luggage. Advise 20kg max to avoid extra fees.
          </div>
        </div>
      </div>

      {/* Family Emergency Contact – Rural Connectivity */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-red-100"><Home className="h-5 w-5 text-red-600" /></div>
          <h4 className="font-bold text-ink">Rural Connectivity – Family Emergency Contact</h4>
        </div>
        <p className="text-sm text-slate-500 mb-4">Log the family emergency contact status so agency staff can reach the family once the employee arrives safely abroad.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {employees.slice(0, 6).map(emp => (
            <label key={emp.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${completedSteps.family.includes(emp.id) ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
              <input type="checkbox" checked={completedSteps.family.includes(emp.id)} onChange={() => toggle('family', emp.id)} className="h-4 w-4 rounded border-slate-300 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{emp.name}</p>
                <p className="text-xs text-slate-500">{emp.destination} • {emp.phone}</p>
              </div>
              {completedSteps.family.includes(emp.id) && <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Today's Departure (Fly List) Tab
// ===== Today's Departures – Live Operations =====
function DepartureTab({ employees }: { employees: TravelEmployee[] }) {
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
      {/* Live Ops Summary */}
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

      {/* Live Manifest */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-ink flex items-center gap-2"><PlaneTakeoff className="h-5 w-5 text-brand-600" /> Live Departure Manifest</h3>
          <span className="text-xs text-slate-500">Bole International Airport</span>
        </div>
        <div className="divide-y divide-slate-100">
          {today.map(emp => {
            const isChecked = checkedIn.includes(emp.id);
            const isBoarded = boarded.includes(emp.id);
            const isMissing = noShow.includes(emp.id);
            return (
              <div key={emp.id} className={`px-6 py-4 transition-all ${isBoarded ? 'bg-green-50' : isMissing ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-ink truncate">{emp.name}</p>
                      <p className="text-xs text-slate-500 truncate">{emp.flightNumber || 'Flight TBD'} • {emp.departureTime || 'TBD'} • Terminal {emp.terminal}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{emp.destination}</p>
                    <p className="text-xs text-slate-500">Agent: {emp.assignedStaffName || '-'}</p>
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
                {/* Inline trigger: when Boarded clicked, SMS notification note */}
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
          {today.length === 0 && <p className="text-center text-slate-500 py-12">No departures scheduled for today.</p>}
        </div>
      </div>

      {/* Airport Staff Tablet Interface */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Smartphone className="h-6 w-6 text-blue-600" />
          <h3 className="font-bold text-ink">Airport Staff Tablet – Bole International</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm">
            <QrCode className="h-8 w-8 text-brand-600 mb-2" />
            <h4 className="font-semibold text-sm">Scan Boarding Pass</h4>
            <p className="text-xs text-slate-500 mt-1">Use camera to scan employee QR code and auto-check-in.</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm">
            <Bell className="h-8 w-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-sm">Push Notification to Office</h4>
            <p className="text-xs text-slate-500 mt-1">Alert operations manager when group has passed security.</p>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 hover:shadow-sm">
            <MessageSquare className="h-8 w-8 text-amber-600 mb-2" />
            <h4 className="font-semibold text-sm">Flag Delayed Departure</h4>
            <p className="text-xs text-slate-500 mt-1">Notify agents in rural areas if employee is missing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Arrival Tab
// ===== Arrival – In-Country Arrival Confirmation =====
function ArrivalTab({ employees }: { employees: TravelEmployee[] }) {
  const [confirmedArrivals, setConfirmedArrivals] = useState<string[]>([]);
  const arrived = employees.filter(e => e.status === 'arrived');
  const departed = employees.filter(e => e.status === 'departed');
  const inTransit = departed.filter(e => !confirmedArrivals.includes(e.id));

  const handleConfirmArrival = (id: string) => {
    setConfirmedArrivals(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Summary Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5 shadow-sm">
          <PlaneLanding className="h-6 w-6 text-emerald-600 mb-3" />
          <p className="text-3xl font-bold text-emerald-800">{arrived.length + confirmedArrivals.length}</p>
          <p className="text-sm font-medium text-emerald-700">Confirmed Arrivals</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5 shadow-sm">
          <Plane className="h-6 w-6 text-amber-600 mb-3" />
          <p className="text-3xl font-bold text-amber-800">{inTransit.length}</p>
          <p className="text-sm font-medium text-amber-700">In Transit</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5 shadow-sm">
          <Users className="h-6 w-6 text-blue-600 mb-3" />
          <p className="text-3xl font-bold text-blue-800">{employees.filter(e => e.inCountryStaff).length}</p>
          <p className="text-sm font-medium text-blue-700">In-Country Staff</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5 shadow-sm">
          <Bell className="h-6 w-6 text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-purple-800">{inTransit.length > 0 ? 1 : 0}</p>
          <p className="text-sm font-medium text-purple-700">Pending Notifications</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* In-Transit Workers – Waiting for Confirmation */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-ink flex items-center gap-2"><PlaneLanding className="h-5 w-5 text-emerald-600" /> Pending Arrival Confirmation</h3>
            <span className="text-xs text-slate-500">{inTransit.length} to confirm</span>
          </div>
          <div className="divide-y divide-slate-100">
            {inTransit.map(emp => (
              <div key={emp.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-ink text-sm">{emp.name}</p>
                    <p className="text-xs text-slate-500">{emp.destination} • {emp.flightNumber} • In-country: {emp.inCountryStaff || 'Unassigned'}</p>
                  </div>
                </div>
                <button onClick={() => handleConfirmArrival(emp.id)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Arrival
                </button>
              </div>
            ))}
            {inTransit.length === 0 && (
              <p className="text-center text-slate-500 py-12">All departed employees have confirmed arrivals.</p>
            )}
          </div>
        </div>

        {/* In-Country Staff Panel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Handshake className="h-5 w-5 text-brand-600" /> In-Country Staff Actions</h3>
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

      {/* Confirmed Arrivals Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-ink">Confirmed Arrivals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
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
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{emp.name}</td>
                  <td className="px-6 py-3 text-slate-600">{emp.destination}</td>
                  <td className="px-6 py-3">{emp.flightNumber || '-'}</td>
                  <td className="px-6 py-3 text-slate-600">{emp.inCountryStaff || '-'}</td>
                  <td className="px-6 py-3 text-slate-500">{emp.departureDate}</td>
                  <td className="px-6 py-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Arrived Safely</span>
                  </td>
                </tr>
              ))}
              {arrived.length === 0 && confirmedArrivals.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No arrivals recorded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}