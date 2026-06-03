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

import { getStatusColor, getStatusLabel } from '@/lib/utils/status';

// Re-export for backward compatibility
export { getStatusColor, getStatusLabel };
