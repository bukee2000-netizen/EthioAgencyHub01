// Shared status utility functions - single source of truth for status colors and labels
// Eliminates duplicate implementations across components

import { EMPLOYEE_STATUS_COLORS, EMPLOYEE_STATUS_LABELS } from '@/lib/types/employee';

/**
 * Get CSS class for status badge based on employee lifecycle status
 * @param status - The employee lifecycle status
 * @returns Tailwind CSS classes for status badge styling
 */
export function getStatusColor(status: string): string {
  return EMPLOYEE_STATUS_COLORS[status] || 'bg-slate-50 text-slate-700 border-slate-200';
}

/**
 * Get human-readable label for status
 * @param status - The employee lifecycle status
 * @returns Formatted status label
 */
export function getStatusLabel(status: string): string {
  return EMPLOYEE_STATUS_LABELS[status] || status.replace(/_/g, ' ');
}