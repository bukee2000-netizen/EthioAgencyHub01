import { 
  Activity, 
  BadgeCheck, 
  BookOpen,
  BriefcaseBusiness, 
  Building2, 
  CalendarClock, 
  FileCheck2, 
  Plane, 
  PlaneLanding,
  UsersRound,
  TrendingUp,
  CheckCircle2,
  Clock,
  Settings,
  FileText,
  Landmark,
  Users,
  LogOut,
  Bell,
  Lock,
  CreditCard,
  AlertCircle,
  BarChart3,
  GraduationCap
} from 'lucide-react';

export const demoUsers = [
  { id: 'admin-001', email: 'admin@ethioagency.com', password: 'admin123', name: 'Admin User', role: 'AGENCY_ADMIN', agencyId: 'agency-001' },
  { id: 'agent-001', email: 'agent@ethioagency.com', password: 'agent123', name: 'Demo Agent', role: 'AGENT', agencyId: 'agency-001' },
  { id: 'viewer-001', email: 'viewer@ethioagency.com', password: 'viewer123', name: 'Viewer User', role: 'VIEWER', agencyId: 'agency-001' }
];

export const kpis = [
  { label: 'Active Employees', value: '2,486', change: '+18.4%', icon: UsersRound, color: 'bg-blue-500' },
  { label: 'Documents In Pipeline', value: '742', change: '+9.2%', icon: FileCheck2, color: 'bg-green-500' },
  { label: "Today's Departures", value: '38', change: '12 ready', icon: Plane, color: 'bg-orange-500' },
  { label: 'Partner Agencies', value: '56', change: '+4 this month', icon: Building2, color: 'bg-purple-500' }
];

// Main modules for the sidebar menu
export const modules = [
  { 
    title: 'Employee Management', 
    href: '/employee-management', 
    icon: UsersRound, 
    summary: 'Registration, CV generation, skill matching, and lifecycle tracking.',
    submenu: [
      { title: 'Overview', href: '/employee-management', icon: UsersRound },
      { title: 'Registration', href: '/employee-management/registration', icon: FileText },
      { title: 'CV Generator', href: '/employee-management/cv-generator', icon: FileText },
      { title: 'CV Database', href: '/employee-management/cv-database', icon: FileText },
      { title: 'Profiles', href: '/employee-management/cv-database/employee-profiles', icon: UsersRound }
    ]
  },
  { 
    title: 'Documents', 
    href: '/documents', 
    icon: FileCheck2, 
    summary: 'Visa, MOLS, passport, medical, upload, and cross-match workflows.',
    submenu: [
      { title: 'Overview', href: '/documents', icon: FileCheck2 },
      { title: 'Upload', href: '/documents/upload', icon: FileText },
      { title: 'Visa Management', href: '/documents/visa', icon: FileText },
      { title: 'MOLS Processing', href: '/documents/mols', icon: Landmark },
      { title: 'Missing Reports', href: '/documents/missing-report', icon: AlertCircle },
      { title: 'Cross-Match', href: '/documents/cross-match', icon: CheckCircle2 }
    ]
  },
  { 
    title: 'Travel', 
    href: '/travel', 
    icon: Plane, 
    summary: 'Command center, schedule, ticket booking, departures, prep checklist, arrival.',
    submenu: [
      { title: 'Command Center', href: '/travel', icon: Plane },
      { title: 'Schedule', href: '/travel?tab=schedule', icon: Clock },
      { title: 'Tickets', href: '/travel?tab=tickets', icon: FileText },
      { title: "Today's Departures", href: '/travel?tab=departure', icon: TrendingUp },
      { title: 'Departure Prep', href: '/travel?tab=preparation', icon: CheckCircle2 },
      { title: 'Arrival', href: '/travel?tab=arrival', icon: PlaneLanding }
    ]
  },
  { 
    title: 'Hajj & Umrah', 
    href: '/hajj-umrah', 
    icon: CalendarClock, 
    summary: 'Pilgrim registration, requirements, groups, and religious travel docs.',
    submenu: [
      { title: 'Overview', href: '/hajj-umrah', icon: CalendarClock },
      { title: 'Pilgrim Details', href: '/hajj-umrah/pilgrim-detail', icon: UsersRound },
      { title: 'Requirements', href: '/hajj-umrah/requirements', icon: CheckCircle2 },
      { title: 'Documentation', href: '/hajj-umrah/documentation', icon: FileText }
    ]
  },
  { 
    title: 'Institutions', 
    href: '/institutions', 
    icon: Building2, 
    summary: 'Partner institution records, collaboration, and document exchange.',
    submenu: [
      { title: 'Overview', href: '/institutions', icon: Building2 },
      { title: 'Institution Details', href: '/institutions/institution-detail', icon: Landmark },
      { title: 'Partners', href: '/institutions/partners', icon: Users },
      { title: 'Collaboration', href: '/institutions/collaboration', icon: Users }
    ]
  },
  { 
    title: 'Agents', 
    href: '/agents', 
    icon: BriefcaseBusiness, 
    summary: 'Agent onboarding, contracts, CV pipeline, financials, in-country staff, training & support.',
    submenu: [
      { title: 'Overview', href: '/agents', icon: BriefcaseBusiness },
      { title: 'Agent Details', href: '/agents?tab=agent-details', icon: Users },
      { title: 'Contracts', href: '/agents?tab=contracts', icon: FileText },
      { title: 'CV Pipeline', href: '/agents?tab=cv-pipeline', icon: BarChart3 },
      { title: 'Financials', href: '/agents?tab=financials', icon: Landmark },
      { title: 'In-Country Staff', href: '/agents?tab=in-country', icon: UsersRound },
      { title: 'Training & Support', href: '/agents?tab=training-support', icon: GraduationCap }
    ]
  },
  { 
    title: 'Administration', 
    href: '/administration', 
    icon: BadgeCheck, 
    summary: 'Users, roles, permissions, settings, billing, logs, and audit trail.',
    submenu: [
      { title: 'Overview', href: '/administration', icon: BadgeCheck },
      { title: 'Users', href: '/administration/users', icon: Users },
      { title: 'Roles & Permissions', href: '/administration/roles-permissions', icon: Lock },
      { title: 'Settings', href: '/administration/settings', icon: Settings },
      { title: 'Logs', href: '/administration/logs', icon: FileText },
      { title: 'Audit Trail', href: '/administration/audit', icon: Activity }
    ]
  },
  { 
    title: 'Reporting & Analytics', 
    href: '/reporting-analytics', 
    icon: Activity, 
    summary: 'Operational reports, financial reporting, analytics, and exports.',
    submenu: [
      { title: 'Dashboard', href: '/reporting-analytics', icon: Activity },
      { title: 'Overview', href: '/reporting-analytics/overview', icon: BarChart3 },
      { title: 'Employee Reports', href: '/reporting-analytics/employee-reports', icon: UsersRound },
      { title: 'Document Reports', href: '/reporting-analytics/document-reports', icon: FileCheck2 },
      { title: 'Financial Reports', href: '/reporting-analytics/financial-reports', icon: CreditCard },
      { title: 'Export', href: '/reporting-analytics/export', icon: FileText }
    ]
  },
  { 
    title: 'User Settings', 
    href: '/user-settings', 
    icon: Settings, 
    summary: 'Profile, security, and notification settings.',
    submenu: [
      { title: 'Profile', href: '/user-settings/profile', icon: Users },
      { title: 'Security', href: '/user-settings/security', icon: Lock },
      { title: 'Notifications', href: '/user-settings/notifications', icon: Bell }
    ]
  },
  { 
    title: 'Teaching / Demo', 
    href: '/teaching', 
    icon: BookOpen, 
    summary: 'Sample data & records for training and testing.',
  },
];

  export const employees = [
    { id: 'EAH-1024', name: 'Mekdes Tesfaye', role: 'Domestic Worker', status: 'Document Review', destination: 'Saudi Arabia', agencyId: 'agency-001' },
    { id: 'EAH-1025', name: 'Hana Bekele', role: 'Caregiver', status: 'Interview Uploaded', destination: 'UAE', agencyId: 'agency-001' },
    { id: 'EAH-1026', name: 'Selamawit Alemu', role: 'Hospitality Staff', status: 'Travel Ready', destination: 'Qatar', agencyId: 'agency-001' },
    { id: 'EAH-1027', name: 'Rahel Tadesse', role: 'Cleaner', status: 'MOLS Pending', destination: 'Kuwait', agencyId: 'agency-001' }
  ];

export const activities = [
  'Telegram interview video saved for Hana Bekele',
  'Passport PDF routed to Teledrive sync folder',
  'MOLS cross-match completed for 23 employees',
  'Flight manifest prepared for Addis Ababa departures',
  'Payment received for Professional plan subscription'
];

export const storageRoutes = [
  { type: 'Photos, Passports, PDFs', destination: 'Local FS → Teledrive Desktop Sync', cost: '~300 ETB/month', purpose: 'Low-cost unlimited document archive' },
  { type: 'Interview Videos', destination: 'Telegram Bot → Private Channel', cost: 'Free', purpose: 'Global CDN streaming for partners' }
];
