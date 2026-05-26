import { z } from 'zod';

export const travelCreateSchema = z.object({
  employeeId: z.string().min(1),
  destination: z.string().min(1),
  departureAt: z.coerce.date(),
  ticket: z.string().optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  origin: z.string().optional(),
  terminal: z.string().optional(),
  class: z.enum(['economy', 'business', 'first']).optional(),
  ticketCost: z.number().optional(),
  currency: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  bookingReference: z.string().optional(),
  status: z.enum(['SCHEDULED', 'TICKETED', 'READY', 'DEPARTED', 'ARRIVED', 'CANCELLED']).optional()
});

export const travelUpdateSchema = z.object({
  destination: z.string().min(1).optional(),
  departureAt: z.coerce.date().optional(),
  ticket: z.string().optional(),
  airline: z.string().optional(),
  flightNumber: z.string().optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  origin: z.string().optional(),
  terminal: z.string().optional(),
  class: z.enum(['economy', 'business', 'first']).optional(),
  ticketCost: z.number().optional(),
  currency: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  bookingReference: z.string().optional(),
  status: z.enum(['SCHEDULED', 'TICKETED', 'READY', 'DEPARTED', 'ARRIVED', 'CANCELLED']).optional()
});

export const bookingCreateSchema = z.object({
  employeeId: z.string().min(1),
  destination: z.string().min(1),
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  class: z.enum(['economy', 'business', 'first']),
  departureDate: z.string().min(1),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  origin: z.string().min(1),
  terminal: z.string().optional(),
  ticketCost: z.number().min(0),
  currency: z.string().min(1),
  bookingReference: z.string().optional()
});
