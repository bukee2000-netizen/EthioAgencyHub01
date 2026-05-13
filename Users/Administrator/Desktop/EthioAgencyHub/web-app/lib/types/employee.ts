// Shared Prisma-derived types for employee data
// Single source of truth - eliminates duplicate interfaces across components

export interface EmployeeBasic {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  jobRole?: string;
  destination?: string;
  country?: string;
  status: string;
  createdAt: string;
  contactPhone?: string;
  email?: string;
  region?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  additionalSkills?: string;
  passportNumber?: string;
  photoUrl?: string;
  fullPhotoUrl?: string;
  _count?: { documents: number; travels: number };
}

// Status color mapping - single source of truth
export const EMPLOYEE_STATUS_COLORS: Record<string, string> = {
  REGISTERED: 'bg-blue-50 text-blue-700 border-blue-200',
  DOCUMENT_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  MOLS_PENDING: 'bg-orange-50 text-orange-700 border-orange-200',
  INTERVIEW_UPLOADED: 'bg-purple-50 text-purple-700 border-purple-200',
  TRAVEL_READY: 'bg-green-50 text-green-700 border-green-200',
  DEPLOYED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ARCHIVED: 'bg-red-50 text-red-700 border-red-200',
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  INACTIVE: 'bg-slate-100 text-slate-700',
};

export const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  REGISTERED: 'Registered',
  DOCUMENT_REVIEW: 'Doc Review',
  MOLS_PENDING: 'MOLS Pending',
  INTERVIEW_UPLOADED: 'Interview',
  TRAVEL_READY: 'Travel Ready',
  DEPLOYED: 'Deployed',
  ARCHIVED: 'Archived',
};

export function getStatusColor(status: string): string {
  return EMPLOYEE_STATUS_COLORS[status] || 'bg-slate-50 text-slate-700 border-slate-200';
}

export function getStatusLabel(status: string): string {
  return EMPLOYEE_STATUS_LABELS[status] || status.replace(/_/g, ' ');
}

// Language parsing utility
export function parseLanguages(languages: string | string[] | null | undefined): string[] {
  if (!languages) return [];
  if (Array.isArray(languages)) return languages;
  try {
    const parsed = JSON.parse(languages);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return languages.split(',').map(s => s.trim()).filter(Boolean);
  }
}

// Photo URL utility
export function getPhotoUrl(fileId: string | null | undefined): string | null {
  if (!fileId) return null;
  if (fileId.startsWith('http') || fileId.startsWith('/')) return fileId;
  return `/api/telegram/photo/${fileId}`;
}

// Name formatting
export function getFullName(employee: { firstName?: string; lastName?: string; name?: string }): string {
  return employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Unknown';
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
}
