export const roleHierarchy = {
  SUPER_ADMIN: 4,
  AGENCY_ADMIN: 3,
  AGENT: 2,
  VIEWER: 1
} as const;

export const modulePermissions = {
  dashboard: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'VIEWER'],
  employees: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT'],
  documents: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT'],
  travel: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT'],
  hajjUmrah: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT'],
  institutions: ['SUPER_ADMIN', 'AGENCY_ADMIN'],
  agents: ['SUPER_ADMIN', 'AGENCY_ADMIN'],
  administration: ['SUPER_ADMIN', 'AGENCY_ADMIN'],
  reporting: ['SUPER_ADMIN', 'AGENCY_ADMIN'],
  settings: ['SUPER_ADMIN', 'AGENCY_ADMIN', 'AGENT', 'VIEWER'],
  billing: ['SUPER_ADMIN', 'AGENCY_ADMIN']
} as const;
