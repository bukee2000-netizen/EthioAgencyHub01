// Helper utilities for registration data lookups

import { ethiopianRegions, jobRoles, countries, languages, genders, maritalStatus, educationLevels, experienceLevels, visaTypes, documentTypes, employmentStatus } from '@/config/registration-data';

/**
 * Get zones for a specific Ethiopian region
 */
export function getZonesByRegion(region: string): { name: string; woredas: string[] }[] {
  const regionData = ethiopianRegions.find((r) => r.region === region);
  return regionData?.zones || [];
}

/**
 * Get all available regions
 */
export function getAllRegions(): string[] {
  return ethiopianRegions.map((r) => r.region);
}

/**
 * Format employee data for display
 */
export function formatEmployeeData(data: any) {
  return {
    name: `${data.personal?.firstName} ${data.personal?.lastName}`.trim(),
    email: data.personal?.email,
    phone: data.personal?.contactPhone,
    role: data.skills?.role,
    destination: data.skills?.destination,
    languages: data.skills?.languages?.join(', '),
    region: data.personal?.region,
    zone: data.personal?.zone
  };
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.personal?.firstName?.trim()) errors.push('First name is required');
  if (!data.personal?.lastName?.trim()) errors.push('Last name is required');
  if (!data.personal?.email?.trim()) errors.push('Email is required');
  if (!data.personal?.contactPhone?.trim()) errors.push('Contact phone is required');
  if (!data.personal?.emergencyContact?.trim()) errors.push('Emergency contact name is required');
  if (!data.personal?.emergencyPhone?.trim()) errors.push('Emergency contact phone is required');

  if (data.personal?.email && !data.personal.email.includes('@')) {
    errors.push('Email must be valid');
  }

  if (data.personal?.region && !getAllRegions().includes(data.personal.region)) {
    errors.push('Invalid region selected');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Export registration data as JSON
 */
export function exportRegistrationData(data: any): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Get label for experience level
 */
export function getExperienceLabel(level: string): string {
  const mapping: Record<string, string> = {
    'No experience': '0 years',
    '0-1 year': '0-1 year',
    '1-3 years': '1-3 years',
    '3-5 years': '3-5 years',
    '5-10 years': '5-10 years',
    '10+ years': '10+ years'
  };
  return mapping[level] || level;
}
