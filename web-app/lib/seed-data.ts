/* ============================================
   SEED / TEST DATA - EthioAgencyHub
   Sample data for teaching, testing, and demo purposes.
   All data is fictional and for training use only.
   ============================================ */

  // ─── AGENCIES ───
  export const seedAgencies = [
    { id: 'agency-001', name: 'EthioCare Agency PLC', shortName: 'EthioCare', license: 'MOLS-2024-0015', city: 'Addis Ababa', phone: '+251-11-5550101', email: 'info@ethiocare.et', status: 'active', subscriptionPlan: 'professional', subscriptionBillingCycle: 'monthly', createdAt: '2024-01-01' },
  { id: 'agency-002', name: 'Green Horizon Employment', shortName: 'Green Horizon', license: 'MOLS-2024-0023', city: 'Addis Ababa', phone: '+251-11-5550202', email: 'info@greenhorizon.et', status: 'active', subscriptionPlan: 'starter', subscriptionBillingCycle: 'quarterly', createdAt: '2024-02-15' },
  { id: 'agency-003', name: 'Tadesse Global Manpower', shortName: 'Tadesse Global', license: 'MOLS-2023-0089', city: 'Addis Ababa', phone: '+251-11-5550303', email: 'info@tadesseglobal.et', status: 'active', subscriptionPlan: 'enterprise', subscriptionBillingCycle: 'yearly', createdAt: '2023-06-01' },
  { id: 'agency-004', name: 'Zemen Overseas Recruitment', shortName: 'Zemen', license: 'MOLS-2024-0047', city: 'Addis Ababa', phone: '+251-11-5550404', email: 'info@zemenrecruit.et', status: 'pending', subscriptionPlan: 'starter', subscriptionBillingCycle: 'monthly', createdAt: '2024-05-01' },
  { id: 'agency-005', name: 'Unity International Hire', shortName: 'Unity Hire', license: 'MOLS-2022-0125', city: 'Addis Ababa', phone: '+251-11-5550505', email: 'info@unityhire.et', status: 'suspended', subscriptionPlan: 'professional', subscriptionBillingCycle: 'monthly', createdAt: '2022-03-15' },
];

// ─── AGENTS (Sub-agents working under agencies) ───
export const seedAgents = [
  { id: 'agent-001', agencyId: 'agency-001', name: 'Abebech Tadesse', phone: '+251-91-1234567', email: 'abebech@ethiocare.et', region: 'Addis Ababa', specialization: 'Saudi Arabia', status: 'active', rating: 4.8, contractSigned: '2024-01-15', commission: 2500 },
  { id: 'agent-002', agencyId: 'agency-001', name: 'Getachew Worku', phone: '+251-92-2345678', email: 'getachew@ethiocare.et', region: 'Oromia', specialization: 'UAE', status: 'active', rating: 4.5, contractSigned: '2024-02-01', commission: 2200 },
  { id: 'agent-003', agencyId: 'agency-002', name: 'Birtukan Alemu', phone: '+251-93-3456789', email: 'birtukan@greenhorizon.et', region: 'SNNPR', specialization: 'Qatar', status: 'active', rating: 4.2, contractSigned: '2024-03-01', commission: 2000 },
  { id: 'agent-004', agencyId: 'agency-003', name: 'Kebede Lemma', phone: '+251-94-4567890', email: 'kebede@tadesseglobal.et', region: 'Amhara', specialization: 'Kuwait', status: 'inactive', rating: 3.8, contractSigned: '2023-08-01', commission: 1800 },
];

// ─── EMPLOYEES (Sample registered workers) ───
export const seedEmployees = [
  {
    id: 'emp-001', agencyId: 'agency-001', agentId: 'agent-001',
    firstName: 'Yohannes', lastName: 'Tefera', email: 'yohannes@email.com',
    contactPhone: '+251-91-1111111', dateOfBirth: '1992-05-15', gender: 'Male',
    maritalStatus: 'Married', nationality: 'Ethiopian', region: 'Oromia', zone: 'Jimma', woreda: 'Jimma',
    passportNumber: 'ET1234567', passportExpiryDate: '2028-05-14',
    nationalId: 'NID-2023-001234', fatherName: 'Tefera Lemma', motherName: 'Alemitu Bekele',
    education: 'Diploma', role: 'Driver', experience: '3-5 years', destination: 'Saudi Arabia',
    languages: ['Amharic', 'Oromo', 'Arabic (Basic)'], additionalSkills: 'Defensive driving, Basic mechanic',
    bankName: 'Commercial Bank of Ethiopia', bankAccountNumber: '1000234567890', bankBranch: 'Jimma Branch',
    emergencyContact: 'Tefera Lemma', emergencyPhone: '+251-91-2222222', emergencyRelation: 'Father',
    status: 'TRAVEL_READY', createdAt: '2024-06-15',
    photoUrl: '', fullPhotoUrl: '',
  },
  {
    id: 'emp-002', agencyId: 'agency-001', agentId: 'agent-001',
    firstName: 'Senait', lastName: 'Assefa', email: 'senait@email.com',
    contactPhone: '+251-92-2222222', dateOfBirth: '1995-09-20', gender: 'Female',
maritalStatus: 'Single', nationality: 'Ethiopian', region: 'Addis Ababa', zone: 'Bole', woreda: 'Bole',
     passportNumber: 'ET2345678', passportExpiryDate: '2029-09-19',
    nationalId: 'NID-2023-002345', fatherName: 'Assefa Hailu', motherName: 'Meseret Desta',
    education: 'High School', role: 'Housemaid', experience: '2-3 years', destination: 'UAE',
    languages: ['Amharic', 'English (Basic)'], additionalSkills: 'Cooking, Childcare',
    bankName: 'Awash Bank', bankAccountNumber: '1000345678901', bankBranch: 'Bole Branch',
    emergencyContact: 'Assefa Hailu', emergencyPhone: '+251-92-3333333', emergencyRelation: 'Father',
    status: 'INTERVIEW_UPLOADED', createdAt: '2024-07-20',
    photoUrl: '', fullPhotoUrl: '',
  },
  {
    id: 'emp-003', agencyId: 'agency-002', agentId: 'agent-003',
    firstName: 'Getnet', lastName: 'Kebede', email: 'getnet@email.com',
    contactPhone: '+251-93-3333333', dateOfBirth: '1988-12-10', gender: 'Male',
maritalStatus: 'Married', nationality: 'Ethiopian', region: 'SNNPR', zone: 'Hawassa', woreda: 'Hawassa Zuria',
     passportNumber: 'ET3456789', passportExpiryDate: '2027-12-09',
    nationalId: 'NID-2022-003456', fatherName: 'Kebede Ayele', motherName: 'Tigist Worku',
    education: 'Certificate', role: 'Security Guard', experience: '5+ years', destination: 'Qatar',
    languages: ['Amharic', 'Wolayita'], additionalSkills: 'First aid, CCTV operation',
    bankName: 'Dashen Bank', bankAccountNumber: '1000456789012', bankBranch: 'Hawassa Branch',
    emergencyContact: 'Kebede Ayele', emergencyPhone: '+251-93-4444444', emergencyRelation: 'Father',
    status: 'DOCUMENT_REVIEW', createdAt: '2024-08-10',
    photoUrl: '', fullPhotoUrl: '',
  },
  {
    id: 'emp-004', agencyId: 'agency-001', agentId: 'agent-002',
    firstName: 'Meron', lastName: 'Alemu', email: 'meron@email.com',
    contactPhone: '+251-94-4444444', dateOfBirth: '1997-04-05', gender: 'Female',
maritalStatus: 'Single', nationality: 'Ethiopian', region: 'Addis Ababa', zone: 'Kirkos', woreda: 'Kirkos',
     passportNumber: 'ET4567890', passportExpiryDate: '2030-04-04',
    nationalId: 'NID-2024-004567', fatherName: 'Alemu Girma', motherName: 'Eyetu Tesfaye',
    education: 'Diploma', role: 'Nurse', experience: '2-3 years', destination: 'UAE',
    languages: ['Amharic', 'English', 'Arabic (Basic)'], additionalSkills: 'Patient care, IV therapy',
    bankName: 'Bank of Abyssinia', bankAccountNumber: '1000567890123', bankBranch: 'Kirkos Branch',
    emergencyContact: 'Alemu Girma', emergencyPhone: '+251-94-5555555', emergencyRelation: 'Father',
    status: 'DEPLOYED', createdAt: '2024-04-20',
    photoUrl: '', fullPhotoUrl: '',
  },
  {
    id: 'emp-005', agencyId: 'agency-003', agentId: 'agent-004',
    firstName: 'Bereket', lastName: 'Haile', email: 'bereket@email.com',
    contactPhone: '+251-95-5555555', dateOfBirth: '1990-08-30', gender: 'Male',
maritalStatus: 'Married', nationality: 'Ethiopian', region: 'Amhara', zone: 'Bahir Dar', woreda: 'Bahir Dar Zuria',
     passportNumber: 'ET5678901', passportExpiryDate: '2026-08-29',
    nationalId: 'NID-2022-005678', fatherName: 'Haile Gebre', motherName: 'Worknesh Tadele',
    education: 'Degree', role: 'Accountant', experience: '5+ years', destination: 'Kuwait',
    languages: ['Amharic', 'English'], additionalSkills: 'QuickBooks, Excel, Payroll',
    bankName: 'Commercial Bank of Ethiopia', bankAccountNumber: '1000678901234', bankBranch: 'Bahir Dar Branch',
    emergencyContact: 'Haile Gebre', emergencyPhone: '+251-95-6666666', emergencyRelation: 'Father',
    status: 'REGISTERED', createdAt: '2024-09-01',
    photoUrl: '', fullPhotoUrl: '',
  },
  {
    id: 'emp-006', agencyId: 'agency-001', agentId: 'agent-001',
    firstName: 'Tigist', lastName: 'Mekonnen', email: 'tigist@email.com',
    contactPhone: '+251-96-6666666', dateOfBirth: '1993-11-18', gender: 'Female',
maritalStatus: 'Divorced', nationality: 'Ethiopian', region: 'Oromia', zone: 'Adama', woreda: 'Adama',
     passportNumber: 'ET6789012', passportExpiryDate: '2029-11-17',
    nationalId: 'NID-2023-006789', fatherName: 'Mekonnen Tadesse', motherName: 'Azeb Wondimu',
    education: 'High School', role: 'Cleaner', experience: '2-3 years', destination: 'Saudi Arabia',
    languages: ['Amharic', 'Oromo'], additionalSkills: 'Industrial cleaning',
    bankName: 'Oromia Cooperative Bank', bankAccountNumber: '1000789012345', bankBranch: 'Adama Branch',
    emergencyContact: 'Mekonnen Tadesse', emergencyPhone: '+251-96-7777777', emergencyRelation: 'Father',
    status: 'MOLS_PENDING', createdAt: '2024-09-15',
    photoUrl: '', fullPhotoUrl: '',
  },
];

// ─── TRAVEL RECORDS ───
export const seedTravels = [
  { id: 'trv-001', employeeId: 'emp-004', destination: 'Dubai, UAE', airline: 'Emirates', flightNumber: 'EK-724', departureDate: '2026-05-20', departureTime: '14:20', arrivalTime: '19:30', terminal: 'T1', status: 'TICKETED', ticketCost: 8500, currency: 'AED', bookingReference: 'EK-890123456' },
  { id: 'trv-002', employeeId: 'emp-001', destination: 'Riyadh, Saudi Arabia', airline: 'Saudi Arabian Airlines', flightNumber: 'SV-414', departureDate: '2026-06-01', departureTime: '08:30', arrivalTime: '11:45', terminal: 'T2', status: 'SCHEDULED', ticketCost: 12500, currency: 'SAR', bookingReference: 'SV-234567890' },
];

// ─── INSTITUTIONS ───
export const seedInstitutions = [
  { id: 'inst-001', name: 'Saudi Ministry of Labor', type: 'government', country: 'Saudi Arabia', city: 'Riyadh', contactPerson: 'Dr. Ahmed Al-Ghamdi', email: 'contact@mol.gov.sa', phone: '+966-11-2345678', status: 'active' },
  { id: 'inst-002', name: 'UAE Embassy, Addis Ababa', type: 'embassy', country: 'UAE', city: 'Addis Ababa', contactPerson: 'Mr. Hassan Al-Mansoori', email: 'visa@uaeembassy.et', phone: '+251-11-5558889', status: 'active' },
  { id: 'inst-003', name: 'Addis General Hospital', type: 'medical', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Dr. Derartu Tulu', email: 'info@addisgeneral.com', phone: '+251-11-5530300', status: 'active' },
  { id: 'inst-004', name: 'Commercial Bank of Ethiopia', type: 'bank', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Mr. Tadesse Ayele', email: 'corporate@cbe.com.et', phone: '+251-11-5513100', status: 'active' },
  { id: 'inst-005', name: 'Al-Futtaim Manpower', type: 'partner', country: 'UAE', city: 'Dubai', contactPerson: 'Mr. Khalid Al-Futtaim', email: 'hr@alfuttaim.ae', phone: '+971-4-1234567', status: 'active' },
  { id: 'inst-006', name: 'Mekane Hiwot Medical Center', type: 'medical', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Dr. Sisay Worku', email: 'info@mekanehiwot.com', phone: '+251-11-5540400', status: 'active' },
];

// ─── DOCUMENTS ───
export const seedDocuments = [
  { id: 'doc-001', employeeId: 'emp-001', type: 'PASSPORT', fileName: 'yohannes_passport.pdf', status: 'VERIFIED', expiryDate: '2028-05-14' },
  { id: 'doc-002', employeeId: 'emp-001', type: 'MEDICAL', fileName: 'yohannes_medical.pdf', status: 'VERIFIED' },
  { id: 'doc-003', employeeId: 'emp-001', type: 'CONTRACT', fileName: 'yohannes_contract_saudi.pdf', status: 'VERIFIED' },
  { id: 'doc-004', employeeId: 'emp-004', type: 'PASSPORT', fileName: 'meron_passport.pdf', status: 'VERIFIED', expiryDate: '2030-04-04' },
  { id: 'doc-005', employeeId: 'emp-004', type: 'VISA', fileName: 'meron_visa_uae.pdf', status: 'VERIFIED' },
  { id: 'doc-006', employeeId: 'emp-002', type: 'PASSPORT', fileName: 'senait_passport.pdf', status: 'VERIFIED', expiryDate: '2029-09-19' },
  { id: 'doc-007', employeeId: 'emp-002', type: 'INTERVIEW', fileName: 'senait_interview.mp4', status: 'VERIFIED' },
  { id: 'doc-008', employeeId: 'emp-006', type: 'PASSPORT', fileName: 'tigist_passport.pdf', status: 'VERIFIED', expiryDate: '2029-11-17' },
  { id: 'doc-009', employeeId: 'emp-006', type: 'MEDICAL', fileName: 'tigist_medical.pdf', status: 'PENDING' },
];

// ─── VISA APPLICATIONS ───
export const seedVisaApplications = [
  { id: 'visa-001', employeeId: 'emp-001', embassy: 'Saudi Arabia (KSA)', visaType: 'Work', stage: 3, status: 'visa_approved' },
  { id: 'visa-002', employeeId: 'emp-004', embassy: 'UAE', visaType: 'Work', stage: 4, status: 'visa_issued' },
  { id: 'visa-003', employeeId: 'emp-002', embassy: 'UAE', visaType: 'Domestic Worker', stage: 2, status: 'submitted' },
  { id: 'visa-004', employeeId: 'emp-003', embassy: 'Qatar', visaType: 'Work', stage: 1, status: 'document_collection' },
  { id: 'visa-005', employeeId: 'emp-005', embassy: 'Kuwait', visaType: 'Work', stage: 0, status: 'pending' },
];

// ─── MOLS RECORDS ───
export const seedMolsRecords = [
  { id: 'mols-001', employeeId: 'emp-001', stage: 'APPROVED', visaUnlocked: true },
  { id: 'mols-002', employeeId: 'emp-004', stage: 'APPROVED', visaUnlocked: true },
  { id: 'mols-003', employeeId: 'emp-002', stage: 'MOLS_SUBMITTED', visaUnlocked: false },
  { id: 'mols-004', employeeId: 'emp-006', stage: 'MOFA_AUTHENTICATED', visaUnlocked: false },
];

// ─── CROSS-MATCH RESULTS ───
export const seedCrossMatchResults = [
  { id: 'cm-001', employeeId: 'emp-004', allPass: true, nameMatch: true, passportMatch: true, visaCountryMatch: true, passportExpiryOk: true, visaExpiryOk: true },
  { id: 'cm-002', employeeId: 'emp-001', allPass: true, nameMatch: true, passportMatch: true, visaCountryMatch: true, passportExpiryOk: true, visaExpiryOk: true },
];

// ─── PILGRIMS (Hajj/Umrah) ───
export const seedPilgrims = [
  { id: 'pil-001', firstName: 'Ahmed', lastName: 'Hassan Mohammed', gender: 'male', nationality: 'Ethiopian', passportNumber: 'EP123456', destination: 'Hajj', season: '2026', groupName: 'Hajj 2026 - Group A', status: 'ready' },
  { id: 'pil-002', firstName: 'Fatima', lastName: 'Ibrahim Ali', gender: 'female', nationality: 'Ethiopian', passportNumber: 'EP234567', destination: 'Umrah', season: '2026', groupName: 'Ramadan Umrah 2026', status: 'visa_approved' },
  { id: 'pil-003', firstName: 'Ibrahim', lastName: 'Mohamed Tessema', gender: 'male', nationality: 'Ethiopian', passportNumber: 'EP345678', destination: 'Hajj', season: '2026', groupName: 'Hajj 2026 - Group B', status: 'requirements_met' },
];
