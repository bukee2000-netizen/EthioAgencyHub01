export interface Agent {
  id: string;
  name: string;
  country: string;
  city: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'expiring';
  type: 'master' | 'sub';
  quotaTotal: number;
  quotaUsed: number;
  commissionRate: number;
  costCoverage: string[];
  jobCategories: string[];
  contractStartDate: string;
  contractEndDate: string;
  totalDeployments: number;
  totalRevenue: number;
  subAgents: SubAgent[];
  inCountryStaff: InCountryStaff[];
  createdAt: string;
}

export interface SubAgent {
  id: string;
  name: string;
  role: string;
  status: string;
  deployments: number;
  phone?: string;
}

export interface InCountryStaff {
  id: string;
  name: string;
  role: 'coordinator' | 'support' | 'field';
  tasks: string[];
  phone: string;
  country: string;
}

export interface AgentContract {
  id: string;
  agentId: string;
  agentName: string;
  country: string;
  type: 'master' | 'individual';
  value: number;
  quota: number;
  used: number;
  commissionRate: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expiring' | 'expired' | 'renewed';
  terms?: string;
}

export interface CVSelection {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  agentId: string;
  agentName: string;
  country: string;
  stage: 'browsing' | 'selected' | 'contract_sent' | 'contract_signed' | 'paid' | 'deployed';
  contractDate?: string;
  paymentDate?: string;
  ticketCost: number;
  visaCost: number;
  medicalCost: number;
  transportCost: number;
  totalCost: number;
  commissionAmount: number;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  agentId: string;
  agentName: string;
  country: string;
  type: 'ticket' | 'visa' | 'medical' | 'transport' | 'commission' | 'fee';
  amount: number;
  status: 'pending' | 'paid' | 'confirmed';
  date: string;
  reference?: string;
}

export interface TrainingSession {
  id: string;
  title: string;
  type: 'orientation' | 'induction' | 'refresher' | 'support' | 'meeting';
  status: 'scheduled' | 'completed' | 'pending' | 'cancelled';
  date: string;
  participants: number;
  assignedRole: string;
  description?: string;
}

export interface SupportTicket {
  id: string;
  agentId: string;
  agentName: string;
  query: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}
