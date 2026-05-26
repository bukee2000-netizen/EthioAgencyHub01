'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, Users, FileText, Activity, Wallet, Globe, GraduationCap,
  Search, X, Plus, Filter, Calendar, ChevronDown, ChevronRight, CheckCircle2, AlertCircle,
  Clock, ArrowRight, MapPin, Phone, Mail, Ticket, CreditCard, Plane, Home, Building2,
  UserCheck, UserPlus, DollarSign, MessageSquare, BookOpen, RefreshCw, TrendingUp,
  Briefcase, Award, Send, Eye, Edit, Trash2, Download, Upload, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// Types
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

// Mock Data
const mockAgents: Agent[] = [
  { id: '1', name: 'Gulf Recruitment Co.', country: 'Kuwait', city: 'Kuwait City', phone: '+965 12345678', email: 'info@gulfrecruit.com', status: 'active', type: 'master', quotaTotal: 100, quotaUsed: 78, commissionRate: 15, costCoverage: ['ticket', 'visa', 'medical', 'transport'], jobCategories: ['Household', 'Driver', 'Security'], contractStartDate: '2024-01-01', contractEndDate: '2025-12-31', totalDeployments: 234, totalRevenue: 8200000, subAgents: [{ id: '1a', name: 'Ahmed Hassan', role: 'Coordinator', status: 'active', deployments: 45 }, { id: '1b', name: 'Fatima Ali', role: 'Field Officer', status: 'active', deployments: 33 }], inCountryStaff: [{ id: 'ic1', name: 'Mahmoud D.', role: 'coordinator', tasks: ['arrivals', 'welfare'], phone: '+965 123456', country: 'Kuwait' }, { id: 'ic2', name: 'Sara K.', role: 'support', tasks: ['embassy', 'documentation'], phone: '+965 234567', country: 'Kuwait' }], createdAt: '2024-01-01' },
  { id: '2', name: 'Saudi Manpower Solutions', country: 'Saudi Arabia', city: 'Riyadh', phone: '+966 12345678', email: 'contact@sms-saudi.com', status: 'active', type: 'master', quotaTotal: 150, quotaUsed: 112, commissionRate: 12, costCoverage: ['ticket', 'visa', 'medical', 'housing'], jobCategories: ['Nurse', 'Technician', 'Engineer'], contractStartDate: '2024-03-01', contractEndDate: '2026-02-28', totalDeployments: 198, totalRevenue: 7100000, subAgents: [{ id: '2a', name: 'Omar Ibrahim', role: 'Regional Lead', status: 'active', deployments: 89 }], inCountryStaff: [{ id: 'ic3', name: 'Khalid M.', role: 'coordinator', tasks: ['arrivals', 'welfare', 'crisis', 'embassy'], phone: '+966 123456', country: 'Saudi Arabia' }, { id: 'ic4', name: 'Reem S.', role: 'field', tasks: ['documentation', 'welfare'], phone: '+966 234567', country: 'Saudi Arabia' }], createdAt: '2024-03-01' },
  { id: '3', name: 'Emirates Staffing LLC', country: 'UAE', city: 'Dubai', phone: '+971 12345678', email: 'hr@emiratesstaff.ae', status: 'active', type: 'master', quotaTotal: 80, quotaUsed: 45, commissionRate: 18, costCoverage: ['ticket', 'visa', 'medical'], jobCategories: ['Household', 'Nurse', 'Accountant'], contractStartDate: '2024-06-01', contractEndDate: '2025-05-31', totalDeployments: 156, totalRevenue: 5800000, subAgents: [{ id: '3a', name: 'Ahmed R.', role: 'Manager', status: 'active', deployments: 78 }], inCountryStaff: [{ id: 'ic6', name: 'Mariam H.', role: 'coordinator', tasks: ['arrivals', 'welfare'], phone: '+971 123456', country: 'UAE' }, { id: 'ic7', name: 'Khalid B.', role: 'support', tasks: ['documentation'], phone: '+971 234567', country: 'UAE' }], createdAt: '2024-06-01' },
  { id: '4', name: 'Qatar Career Hub', country: 'Qatar', city: 'Doha', phone: '+974 12345678', email: 'jobs@qatarcareer.qa', status: 'expiring', type: 'master', quotaTotal: 60, quotaUsed: 52, commissionRate: 14, costCoverage: ['ticket', 'visa', 'medical', 'transport'], jobCategories: ['Household', 'Security', 'Cook'], contractStartDate: '2024-01-01', contractEndDate: '2024-12-31', totalDeployments: 89, totalRevenue: 3200000, subAgents: [], inCountryStaff: [{ id: 'ic8', name: 'Ali K.', role: 'coordinator', tasks: ['arrivals', 'crisis', 'welfare'], phone: '+974 123456', country: 'Qatar' }], createdAt: '2024-01-01' },
  { id: '5', name: 'Bahrain Employment Agency', country: 'Bahrain', city: 'Manama', phone: '+973 12345678', email: 'careers@bea.bh', status: 'active', type: 'master', quotaTotal: 40, quotaUsed: 12, commissionRate: 16, costCoverage: ['ticket', 'visa', 'medical'], jobCategories: ['Household', 'Driver'], contractStartDate: '2024-09-01', contractEndDate: '2025-08-31', totalDeployments: 12, totalRevenue: 450000, subAgents: [], inCountryStaff: [], createdAt: '2024-09-01' },
];

const mockContracts: AgentContract[] = [
  { id: 'c1', agentId: '1', agentName: 'Gulf Recruitment Co.', country: 'Kuwait', type: 'master', value: 1500000, quota: 100, used: 78, commissionRate: 15, startDate: '2024-01-01', endDate: '2025-12-31', status: 'active' },
  { id: 'c2', agentId: '2', agentName: 'Saudi Manpower Solutions', country: 'Saudi Arabia', type: 'master', value: 2200000, quota: 150, used: 112, commissionRate: 12, startDate: '2024-03-01', endDate: '2026-02-28', status: 'active' },
  { id: 'c3', agentId: '3', agentName: 'Emirates Staffing LLC', country: 'UAE', type: 'master', value: 900000, quota: 80, used: 45, commissionRate: 18, startDate: '2024-06-01', endDate: '2025-05-31', status: 'active' },
  { id: 'c4', agentId: '4', agentName: 'Qatar Career Hub', country: 'Qatar', type: 'master', value: 480000, quota: 60, used: 52, commissionRate: 14, startDate: '2024-01-01', endDate: '2024-12-31', status: 'expiring' },
];

const mockSelections: CVSelection[] = [
  { id: 's1', employeeId: 'e1', employeeName: 'Mekdes Tesfaye', role: 'Nurse', agentId: '2', agentName: 'Saudi Manpower Solutions', country: 'Saudi Arabia', stage: 'contract_sent', ticketCost: 8500, visaCost: 2200, medicalCost: 800, transportCost: 500, totalCost: 12000, commissionAmount: 1800, createdAt: '2024-12-01' },
  { id: 's2', employeeId: 'e2', employeeName: 'Hana Bekele', role: 'Household', agentId: '1', agentName: 'Gulf Recruitment Co.', country: 'Kuwait', stage: 'selected', ticketCost: 0, visaCost: 0, medicalCost: 0, transportCost: 0, totalCost: 0, commissionAmount: 0, createdAt: '2024-12-05' },
  { id: 's3', employeeId: 'e3', employeeName: 'Selamawit Alemu', role: 'Driver', agentId: '3', agentName: 'Emirates Staffing LLC', country: 'UAE', stage: 'paid', contractDate: '2024-11-28', paymentDate: '2024-12-01', ticketCost: 9200, visaCost: 1800, medicalCost: 600, transportCost: 400, totalCost: 12000, commissionAmount: 2160, createdAt: '2024-11-15' },
  { id: 's4', employeeId: 'e4', employeeName: 'Rahel Tadesse', role: 'Technician', agentId: '2', agentName: 'Saudi Manpower Solutions', country: 'Saudi Arabia', stage: 'deployed', contractDate: '2024-11-15', paymentDate: '2024-11-20', ticketCost: 8800, visaCost: 2500, medicalCost: 700, transportCost: 300, totalCost: 12300, commissionAmount: 1476, createdAt: '2024-10-20' },
];

const mockFinancials: FinancialRecord[] = [
  { id: 'f1', employeeId: 'e3', employeeName: 'Selamawit Alemu', agentId: '3', agentName: 'Emirates Staffing LLC', country: 'UAE', type: 'ticket', amount: 9200, status: 'confirmed', date: '2024-12-01', reference: 'TKT-UAE-001' },
  { id: 'f2', employeeId: 'e4', employeeName: 'Rahel Tadesse', agentId: '2', agentName: 'Saudi Manpower Solutions', country: 'Saudi Arabia', type: 'commission', amount: 15000, status: 'paid', date: '2024-11-28', reference: 'COM-SA-456' },
  { id: 'f3', employeeId: 'e1', employeeName: 'Mekdes Tesfaye', agentId: '2', agentName: 'Saudi Manpower Solutions', country: 'Saudi Arabia', type: 'visa', amount: 2500, status: 'pending', date: '2024-12-10' },
];

const mockTraining: TrainingSession[] = [
  { id: 't1', title: 'New Agent Orientation - Qatar Career Hub', type: 'orientation', status: 'scheduled', date: '2024-12-15', participants: 3, assignedRole: 'manager', description: 'CV database training, contract process, cost coverage obligations' },
  { id: 't2', title: 'In-Country Staff Induction - UAE', type: 'induction', status: 'completed', date: '2024-11-28', participants: 2, assignedRole: 'in_country', description: 'Arrival protocols, embassy registration, welfare case management' },
  { id: 't3', title: 'Annual Refresher Training - All Agents', type: 'refresher', status: 'scheduled', date: '2025-01-10', participants: 24, assignedRole: 'manager', description: 'MOLSA updates, immigration law changes, case handling review' },
  { id: 't4', title: 'Quarterly Agent Update Meeting', type: 'meeting', status: 'pending', date: '2025-01-05', participants: 18, assignedRole: 'officer', description: 'Feedback session, new job categories, policy updates' },
];

const mockSupport: SupportTicket[] = [
  { id: 'sup1', agentId: '1', agentName: 'Gulf Recruitment Co.', query: 'Ticket booking confirmation for Kuwait deployment', status: 'resolved', priority: 'medium', createdAt: '2024-12-06T10:00:00Z', resolvedAt: '2024-12-06T11:30:00Z', response: 'Confirmed - Flight WY 702 on Dec 15' },
  { id: 'sup2', agentId: '3', agentName: 'Emirates Staffing LLC', query: 'MOLSA documentation template request', status: 'resolved', priority: 'low', createdAt: '2024-12-05T14:00:00Z', resolvedAt: '2024-12-05T15:00:00Z', response: 'Templates sent via email' },
  { id: 'sup3', agentId: '4', agentName: 'Qatar Career Hub', query: 'Visa processing delay clarification', status: 'pending', priority: 'high', createdAt: '2024-12-07T09:00:00Z' },
];

// Tab Components
function OverviewTab({ agents, contracts, selections, onAddAgent }: { agents: Agent[], contracts: AgentContract[], selections: CVSelection[], onAddAgent?: () => void }) {
  const [role, setRole] = useState<'manager' | 'officer' | 'in_country'>('manager');

  const totalDeployments = agents.reduce((sum, a) => sum + a.totalDeployments, 0);
  const totalRevenue = agents.reduce((sum, a) => sum + a.totalRevenue, 0);
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const pendingSelections = selections.filter(s => s.stage !== 'deployed').length;

  const cycleSteps = [
    { step: 1, title: 'Master Contract', desc: 'Signed with foreign agent', icon: FileText },
    { step: 2, title: 'CV Database', desc: 'Agent browses available candidates', icon: Search },
    { step: 3, title: 'Selection', desc: 'Agent selects employee', icon: UserCheck },
    { step: 4, title: 'Individual Contract', desc: 'Sent to employee', icon: Send },
    { step: 5, title: 'Agent Payment', desc: 'Agent pays all costs', icon: CreditCard },
    { step: 6, title: 'Deployment', desc: 'Employee departs - zero cost', icon: Plane },
  ];

  const topAgents = [...agents].sort((a, b) => b.totalDeployments - a.totalDeployments).slice(0, 3);

  const recentActivity = [
    { action: 'Contract renewed', agent: 'Gulf Recruitment Co.', time: '2 hours ago', type: 'contract' },
    { action: 'Employee deployed', agent: 'Saudi Manpower Solutions', time: '5 hours ago', type: 'deployment' },
    { action: 'Payment received', agent: 'Emirates Staffing LLC', time: '1 day ago', type: 'payment' },
    { action: 'CV selected', agent: 'Qatar Career Hub', time: '1 day ago', type: 'cv' },
  ];

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">View as:</span>
        <div className="flex rounded-xl border border-slate-200 bg-white p-1">
          {(['manager', 'officer', 'in_country'] as const).map((r) => (
            <button key={r} onClick={() => setRole(r)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${role === r ? 'bg-amber-100 text-amber-700' : 'text-slate-500 hover:text-slate-700'}`}>
              {r === 'manager' ? 'Manager' : r === 'officer' ? 'Officer' : 'In-Country'}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-amber-600" />
            <span className="text-xs font-medium text-green-600">+3 this month</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">{agents.length}</p>
          <p className="text-sm font-medium text-amber-700 mt-1">Active Agents</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Plane className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-green-600">+156 this quarter</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{totalDeployments.toLocaleString()}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Total Deployments</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Globe className="h-6 w-6 text-green-600" />
            <span className="text-xs font-medium text-green-600">All operational</span>
          </div>
          <p className="text-3xl font-bold text-green-800">{new Set(agents.map(a => a.country)).size}</p>
          <p className="text-sm font-medium text-green-700 mt-1">Countries Active</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <span className="text-xs font-medium text-green-600">+12% YoY</span>
          </div>
          <p className="text-3xl font-bold text-purple-800">{(totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Revenue (ETB)</p>
        </div>
      </div>

      {/* Cycle Flow */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Complete Deployment Cycle</h3>
        <div className="flex flex-wrap items-center gap-2">
          {cycleSteps.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100">
                <span className="h-6 w-6 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
              {idx < cycleSteps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Employee Departure: Zero cost to employee — All costs covered by agent
          </p>
        </div>
      </div>

      {/* Top Agents & Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-ink mb-4">Top Performing Agents</h3>
          <div className="space-y-3">
            {topAgents.map((agent, idx) => (
              <div key={agent.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">{idx + 1}</div>
                  <div>
                    <p className="font-semibold text-ink">{agent.name}</p>
                    <p className="text-xs text-slate-500">{agent.country}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">{agent.totalDeployments}</p>
                  <p className="text-xs text-slate-500">deployments</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold text-ink mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                <div className={`h-2 w-2 rounded-full ${
                  activity.type === 'contract' ? 'bg-blue-500' :
                  activity.type === 'deployment' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-purple-500' : 'bg-amber-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{activity.action}</p>
                  <p className="text-xs text-slate-500">{activity.agent}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentDetailsTab({ agents, onUpdateAgent }: { agents: Agent[], onUpdateAgent?: (agent: Agent) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Agent>>({});

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.country.toLowerCase().includes(searchQuery.toLowerCase()));

  const countries = Array.from(new Set(agents.map(a => a.country)));

  const handleEdit = (agent: Agent) => {
    setEditForm({ ...agent });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onUpdateAgent && editForm.id) {
      const updated = agents.map(a => a.id === editForm.id ? { ...a, ...editForm } as Agent : a);
      onUpdateAgent(updated.find(a => a.id === editForm.id)!);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Edit Modal */}
      {isEditing && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ink">Edit Agent Record</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Agent Name</label>
                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <input type="text" value={editForm.country || ''} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <input type="text" value={editForm.city || ''} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Commission Rate (%)</label>
                <input type="number" value={editForm.commissionRate || 0} onChange={(e) => setEditForm({ ...editForm, commissionRate: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quota Total</label>
                <input type="number" value={editForm.quotaTotal || 0} onChange={(e) => setEditForm({ ...editForm, quotaTotal: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={editForm.status || 'active'} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })} className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="expiring">Expiring</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
              <button onClick={handleSave} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search agents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-10 text-sm focus:border-brand-500 focus:outline-none" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><X className="h-4 w-4" /></button>}
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">
          <Plus className="h-4 w-4" /> Add Agent
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {countries.map(country => {
          const countryAgents = agents.filter(a => a.country === country);
          const totalQuota = countryAgents.reduce((sum, a) => sum + a.quotaTotal, 0);
          const usedQuota = countryAgents.reduce((sum, a) => sum + a.quotaUsed, 0);
          return (
            <div key={country} className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-600">{country}</p>
              <p className="text-2xl font-bold text-ink mt-1">{countryAgents.length}</p>
              <p className="text-xs text-slate-500 mt-2">Quota: {usedQuota}/{totalQuota}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalQuota ? (usedQuota/totalQuota)*100 : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-ink">All Agents by Country</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">{agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink">{agent.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${agent.status === 'active' ? 'bg-green-100 text-green-700' : agent.status === 'expiring' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{agent.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{agent.city}, {agent.country}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>Quota: {agent.quotaUsed}/{agent.quotaTotal}</span>
                      <span>Commission: {agent.commissionRate}%</span>
                      <span>Deployments: {agent.totalDeployments}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(agent.quotaUsed/agent.quotaTotal)*100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)} className="text-sm font-medium text-amber-600 hover:text-amber-800">
                    {selectedAgent?.id === agent.id ? 'Close Details' : 'View Details'}
                  </button>
                  <button onClick={() => handleEdit(agent)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {selectedAgent?.id === agent.id && (
                <div className="mt-6 pt-6 border-t border-slate-200 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {agent.phone}</p>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {agent.email}</p>
                      <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {agent.contractStartDate} - {agent.contractEndDate}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-3">Cost Coverage & Job Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.costCoverage.map(cost => (
                        <span key={cost} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium capitalize">{cost}</span>
                      ))}
                      {agent.jobCategories.map(cat => (
                        <span key={cat} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">{cat}</span>
                      ))}
                    </div>
                  </div>
                  {agent.subAgents.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-ink mb-3">Sub-Agents ({agent.subAgents.length})</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {agent.subAgents.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div><p className="font-medium text-sm">{sub.name}</p><p className="text-xs text-slate-500">{sub.role}</p></div>
                            <span className="text-sm font-semibold text-amber-600">{sub.deployments} deploy.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {agent.inCountryStaff.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-ink mb-3">In-Country Staff ({agent.inCountryStaff.length})</h4>
                      <div className="grid gap-2 md:grid-cols-3">
                        {agent.inCountryStaff.map(staff => (
                          <div key={staff.id} className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium text-sm">{staff.name}</p>
                            <p className="text-xs text-blue-600 capitalize">{staff.role}</p>
                            <p className="text-xs text-slate-500 mt-1">{staff.tasks.join(', ')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContractsTab({ contracts }: { contracts: AgentContract[] }) {
  const processSteps = [
    { step: 1, title: 'Master Contract', desc: 'Sign agreement with foreign agent' },
    { step: 2, title: 'CV Database Access', desc: 'Grant agent access to CV database' },
    { step: 3, title: 'Employee Selection', desc: 'Agent browses & selects candidate' },
    { step: 4, title: 'Individual Contract', desc: 'Generate contract for selected employee' },
    { step: 5, title: 'Agent Payment', desc: 'Agent pays all costs to agency' },
    { step: 6, title: 'Deployment', desc: 'Employee travels - zero cost to employee' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-ink mb-4">Two-Level Contract System</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h4 className="font-bold text-blue-800 mb-2">Master Contract Agreement</h4>
            <p className="text-sm text-blue-700">Agency ↔ Foreign Agent</p>
            <p className="text-xs text-blue-600 mt-2">Annual agreement covering quota, commission rate, cost coverage, terms.</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h4 className="font-bold text-green-800 mb-2">Individual Employee Contract</h4>
            <p className="text-sm text-green-700">Foreign Agent → Selected Employee</p>
            <p className="text-xs text-green-600 mt-2">Generated per employee after selection. Includes job details, salary, benefits.</p>
          </div>
        </div>
        <h4 className="font-semibold text-ink mt-6 mb-4">6-Step Process Flow</h4>
        <div className="flex flex-wrap gap-3">
          {processSteps.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
                <span className="h-5 w-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center font-bold">{item.step}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {idx < processSteps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Active Master Contracts</h3>
          <button className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-800"><Plus className="h-4 w-4" /> New Contract</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Country</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Value (ETB)</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Quota</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Commission</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Expiry</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-ink">{contract.agentName}</td>
                  <td className="px-6 py-4">{contract.country}</td>
                  <td className="px-6 py-4">{contract.value.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(contract.used/contract.quota)*100}%` }} />
                      </div>
                      <span className="text-xs">{contract.used}/{contract.quota}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{contract.commissionRate}%</td>
                  <td className="px-6 py-4">{contract.endDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      contract.status === 'active' ? 'bg-green-100 text-green-700' :
                      contract.status === 'expiring' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>{contract.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CVPipelineTab({ selections, agents, onSelectEmployee }: { selections: CVSelection[], agents: Agent[], onSelectEmployee?: (employee: any, agentId: string) => void }) {
  const stageColors: Record<string, string> = {
    browsing: 'bg-slate-100 text-slate-600',
    selected: 'bg-blue-100 text-blue-700',
    contract_sent: 'bg-amber-100 text-amber-700',
    contract_signed: 'bg-purple-100 text-purple-700',
    paid: 'bg-green-100 text-green-700',
    deployed: 'bg-emerald-100 text-emerald-700',
  };

  const stageLabels: Record<string, string> = {
    browsing: 'CV Browsing',
    selected: 'Employee Selected',
    contract_sent: 'Contract Sent',
    contract_signed: 'Contract Signed',
    paid: 'Agent Paid',
    deployed: 'Deployed',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink">CV Database Sharing Model</h3>
          <Link href="/employee-management/cv-database" className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-800">
            <ExternalLink className="h-4 w-4" />
            Browse CV Database
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <Search className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="font-semibold text-blue-800">Agent Browses</p>
            <p className="text-xs text-blue-600 mt-1">Access CV database & filter by job category</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <UserCheck className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="font-semibold text-purple-800">Agent Selects</p>
            <p className="text-xs text-purple-600 mt-1">Choose candidate & issue contract</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
            <CreditCard className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="font-semibold text-green-800">Agent Pays All Costs</p>
            <p className="text-xs text-green-600 mt-1">Zero cost to employee</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">Select Employee for Agent</p>
            <p className="text-sm text-amber-700">Browse CV database and assign employee to agent</p>
          </div>
          <Link href="/employee-management/cv-database/search?mode=select" className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700">
            <UserPlus className="h-4 w-4" />
            Select Employee
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-ink">CV Selection Pipeline</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Employee</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Country</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Stage</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selections.map((sel) => (
                <tr key={sel.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4"><p className="font-medium text-ink">{sel.employeeName}</p><p className="text-xs text-slate-500">{sel.role}</p></td>
                  <td className="px-6 py-4 text-slate-600">{sel.agentName}</td>
                  <td className="px-6 py-4 text-slate-600">{sel.country}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stageColors[sel.stage]}`}>{stageLabels[sel.stage]}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-amber-700">{sel.totalCost.toLocaleString()} ETB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FinancialsTab({ financials }: { financials: FinancialRecord[] }) {
  const totalReceivables = financials.filter(f => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = financials.filter(f => f.status !== 'pending').reduce((sum, f) => sum + f.amount, 0);

  const typeColors: Record<string, string> = {
    ticket: 'bg-blue-100 text-blue-700',
    visa: 'bg-purple-100 text-purple-700',
    medical: 'bg-green-100 text-green-700',
    transport: 'bg-orange-100 text-orange-700',
    commission: 'bg-amber-100 text-amber-700',
    fee: 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
        <h3 className="text-lg font-bold text-green-800 mb-4">✓ Zero-Cost Employee Model</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <CreditCard className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-semibold text-ink">Agent Pays</p>
            <p className="text-xs text-slate-500 mt-1">Tickets, visa, medical, transport</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <DollarSign className="h-6 w-6 text-amber-600 mb-2" />
            <p className="font-semibold text-ink">Agency Earns</p>
            <p className="text-xs text-slate-500 mt-1">Commission + processing fees</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-green-200">
            <Users className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-semibold text-ink">Employee Pays</p>
            <p className="text-xs text-slate-500 mt-1">ZERO - Fully covered</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Receivables</p>
          <p className="text-2xl font-bold text-amber-700">{totalReceivables.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">ETB outstanding</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Received</p>
          <p className="text-2xl font-bold text-green-700">{totalPaid.toLocaleString()} ETB</p>
          <p className="text-xs text-slate-500 mt-1">ETB confirmed</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-ink">Per-Employee Financial Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Employee</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Agent</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {financials.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-ink">{rec.employeeName}</td>
                  <td className="px-6 py-4 text-slate-600">{rec.agentName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize ${typeColors[rec.type]}`}>{rec.type}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{rec.amount.toLocaleString()} ETB</td>
                  <td className="px-6 py-4 text-slate-500">{rec.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rec.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      rec.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                    }`}>{rec.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InCountryStaffTab({ agents }: { agents: Agent[] }) {
  const staffByCountry: Record<string, InCountryStaff[]> = {};
  agents.forEach(agent => {
    agent.inCountryStaff.forEach(staff => {
      if (!staffByCountry[staff.country]) staffByCountry[staff.country] = [];
      staffByCountry[staff.country].push(staff);
    });
  });

  const countryFlags: Record<string, string> = {
    Kuwait: '🇰🇼', 'Saudi Arabia': '🇸🇦', UAE: '🇦🇪', Qatar: '🇶🇦', Bahrain: '🇧🇭'
  };

  const taskMatrix = [
    { task: 'Airport Arrival', manager: 'Oversight', coordinator: 'Lead', field: 'Assist' },
    { task: 'Embassy Registration', manager: 'Policy', coordinator: 'Process', field: 'Submit' },
    { task: 'Worker Welfare', manager: 'Review', coordinator: 'Monitor', field: 'Report' },
    { task: 'Crisis Response', manager: 'Authorize', coordinator: 'Execute', field: 'Escalate' },
    { task: 'Documentation', manager: 'Audit', coordinator: 'Verify', field: 'Collect' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(staffByCountry).map(([country, staff]) => (
          <div key={country} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                <span>{countryFlags[country] || '🌍'}</span> {country}
              </h3>
              <span className="text-sm font-semibold text-slate-500">{staff.length} staff</span>
            </div>
            <div className="divide-y divide-slate-100">
              {staff.map((person, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-ink">{person.name}</p>
                      <p className="text-sm text-slate-500 capitalize">{person.role}</p>
                      <p className="text-xs text-slate-400 mt-1">{person.phone}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {person.tasks.map(task => (
                        <span key={task} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{task}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-ink">Task Assignment Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Task</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Manager</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">In-Country Coordinator</th>
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Field Support Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {taskMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-ink">{row.task}</td>
                  <td className="px-6 py-4 text-slate-600">{row.manager}</td>
                  <td className="px-6 py-4 text-blue-600 font-medium">{row.coordinator}</td>
                  <td className="px-6 py-4 text-slate-600">{row.field}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TrainingSupportTab({ training, support }: { training: TrainingSession[], support: SupportTicket[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <UserPlus className="h-6 w-6 text-blue-600 mb-2" />
          <p className="font-bold text-blue-800">New Agent Orientation</p>
          <p className="text-xs text-blue-600 mt-1">CV database, contract process, cost coverage</p>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <Users className="h-6 w-6 text-purple-600 mb-2" />
          <p className="font-bold text-purple-800">In-Country Staff Induction</p>
          <p className="text-xs text-purple-600 mt-1">Arrival protocols, embassy registration, welfare</p>
        </div>
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <RefreshCw className="h-6 w-6 text-green-600 mb-2" />
          <p className="font-bold text-green-800">Annual Refresher</p>
          <p className="text-xs text-green-600 mt-1">MOLSA updates, immigration law changes</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <MessageSquare className="h-6 w-6 text-amber-600 mb-2" />
          <p className="font-bold text-amber-800">Ongoing Support</p>
          <p className="text-xs text-amber-600 mt-1">2-hour response SLA, monthly bulletins</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-bold text-ink">Training Schedule</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {training.map((item) => (
            <div key={item.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink">{item.title}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {item.date} • {item.participants} participants • Role: {item.assignedRole}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === 'completed' ? 'bg-green-100 text-green-700' :
                  item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-ink">Agent Support Desk</h3>
          <span className="text-sm text-slate-500">SLA: Response within 2 hours</span>
        </div>
        <div className="space-y-3">
          {support.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50">
              <div>
                <p className="font-medium text-ink">{ticket.query}</p>
                <p className="text-xs text-slate-500 mt-1">{ticket.agentName} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                ticket.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>{ticket.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main Component
interface AgentsModuleProps {
  initialTab?: string;
}

export function AgentsModule({ initialTab = 'overview' }: AgentsModuleProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [contracts, setContracts] = useState<AgentContract[]>(mockContracts);
  const [selections, setSelections] = useState<CVSelection[]>(mockSelections);
  const [financials, setFinancials] = useState<FinancialRecord[]>(mockFinancials);
  const [training, setTraining] = useState<TrainingSession[]>(mockTraining);
  const [support, setSupport] = useState<SupportTicket[]>(mockSupport);
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: '', phone: '', email: '', region: '', specialization: '', commission: '' });

  const handleAddAgent = () => {
    if (!newAgent.name.trim()) return;
    const agent: Agent = {
      id: 'AGT-' + Date.now().toString().slice(-6),
      name: newAgent.name,
      country: newAgent.specialization || 'Ethiopia',
      city: newAgent.region || 'Addis Ababa',
      phone: newAgent.phone || '',
      email: newAgent.email || '',
      status: 'active',
      type: 'sub',
      quotaTotal: 100, quotaUsed: 0, commissionRate: Number(newAgent.commission) || 0,
      costCoverage: [], jobCategories: [],
      contractStartDate: new Date().toISOString().split('T')[0],
      contractEndDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      totalDeployments: 0, totalRevenue: 0,
      subAgents: [], inCountryStaff: [],
      createdAt: new Date().toISOString()
    };
    setAgents(prev => [agent, ...prev]);
    setNewAgent({ name: '', phone: '', email: '', region: '', specialization: '', commission: '' });
    setShowAddAgent(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'details', label: 'Agent Details', icon: Users },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'pipeline', label: 'CV Pipeline', icon: Activity },
    { id: 'financials', label: 'Financials', icon: Wallet },
    { id: 'staff', label: 'In-Country Staff', icon: Globe },
    { id: 'training', label: 'Training & Support', icon: GraduationCap },
  ];

  const handleUpdateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab agents={agents} contracts={contracts} selections={selections} />;
      case 'contracts': return <ContractsTab contracts={contracts} />;
      case 'pipeline': return <CVPipelineTab selections={selections} agents={agents} />;
      case 'financials': return <FinancialsTab financials={financials} />;
      case 'staff': return <InCountryStaffTab agents={agents} />;
      case 'training': return <TrainingSupportTab training={training} support={support} />;
      default: return <OverviewTab agents={agents} contracts={contracts} selections={selections} />;
    }
  };

  return (
    <>
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Agent Management</h1>
        <p className="mt-2 text-slate-500">Complete lifecycle of foreign agent relationships, contracts, and deployments</p>
      </div>
      {renderTab()}
    </div>

    {showAddAgent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink">Register New Agent</h3>
            <button onClick={() => setShowAddAgent(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="h-5 w-5 text-slate-500" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                <input type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="e.g., Abebech Tadesse" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                <input type="text" value={newAgent.phone} onChange={e => setNewAgent({...newAgent, phone: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="+251-91-1234567" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input type="email" value={newAgent.email} onChange={e => setNewAgent({...newAgent, email: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="agent@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Region</label>
                <select value={newAgent.region} onChange={e => setNewAgent({...newAgent, region: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
                  <option value="">Select Region</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Oromia">Oromia</option>
                  <option value="Amhara">Amhara</option>
                  <option value="SNNPR">SNNPR</option>
                  <option value="Tigray">Tigray</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Specialization</label>
                <select value={newAgent.specialization} onChange={e => setNewAgent({...newAgent, specialization: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
                  <option value="">Select Country</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Kuwait">Kuwait</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Commission (ETB)</label>
                <input type="number" value={newAgent.commission} onChange={e => setNewAgent({...newAgent, commission: e.target.value})} className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm" placeholder="e.g., 2500" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
            <button onClick={() => setShowAddAgent(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600">Cancel</button>
            <button onClick={handleAddAgent} className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 shadow-sm">
              <Plus className="h-4 w-4 inline-block mr-1.5" />Register Agent
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default AgentsModule;