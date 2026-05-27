export interface TravelEmployee {
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

export interface TicketBooking {
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

export interface FlightSchedule {
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

export interface TravelModuleProps { initialTab?: string }

export interface BookingFormData {
  employeeId: string;
  destination: string;
  airline: string;
  flightNumber: string;
  class: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  terminal: string;
  ticketCost: number;
  currency: string;
  bookingReference: string;
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200',
    transit_to_addis: 'bg-blue-100 text-blue-700',
    hostel_checkin: 'bg-indigo-100 text-indigo-700',
    orientation_done: 'bg-purple-100 text-purple-700',
    ready: 'bg-green-100 text-green-700',
    departed: 'bg-amber-100 text-amber-700',
    arrived: 'bg-emerald-100 text-emerald-700',
  };
  return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
}

export function getStatusLabel(status: string) {
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
}
