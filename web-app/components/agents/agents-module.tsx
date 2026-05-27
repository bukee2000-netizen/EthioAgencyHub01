'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3, Users, FileText, Activity, Wallet, Globe, GraduationCap,
  Search, X, Plus, Calendar, Phone, Mail, Edit
} from 'lucide-react';
import type { Agent, SubAgent, InCountryStaff, AgentContract, CVSelection, FinancialRecord, TrainingSession, SupportTicket } from './tabs/types';
import { OverviewTab } from './tabs/overview-tab';
import { ContractsTab } from './tabs/contracts-tab';
import { CVPipelineTab } from './tabs/cv-pipeline-tab';
import { FinancialsTab } from './tabs/financials-tab';
import { InCountryStaffTab } from './tabs/in-country-staff-tab';
import { TrainingSupportTab } from './tabs/training-tab';

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
      {isEditing && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Edit Agent Record</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Agent Name</label>
                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Country</label>
                <input type="text" value={editForm.country || ''} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">City</label>
                <input type="text" value={editForm.city || ''} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                <input type="text" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <input type="email" value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Commission Rate (%)</label>
                <input type="number" value={editForm.commissionRate || 0} onChange={(e) => setEditForm({ ...editForm, commissionRate: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Quota Total</label>
                <input type="number" value={editForm.quotaTotal || 0} onChange={(e) => setEditForm({ ...editForm, quotaTotal: parseInt(e.target.value) })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Status</label>
                <select value={editForm.status || 'active'} onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                  <option value="expiring">Expiring</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800">Cancel</button>
              <button onClick={handleSave} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search agents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-10 text-sm focus:border-brand-500 focus:outline-none" />
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
            <div key={country} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">{country}</p>
              <p className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{countryAgents.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Quota: {usedQuota}/{totalQuota}</p>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${totalQuota ? (usedQuota/totalQuota)*100 : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">All Agents by Country</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">{agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink dark:text-ink-dark">{agent.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${agent.status === 'active' ? 'bg-green-100 text-green-700' : agent.status === 'expiring' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200'}`}>{agent.status}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{agent.city}, {agent.country}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Quota: {agent.quotaUsed}/{agent.quotaTotal}</span>
                      <span>Commission: {agent.commissionRate}%</span>
                      <span>Deployments: {agent.totalDeployments}</span>
                    </div>
                    <div className="mt-2 h-1.5 w-32 rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
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
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-3">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" /> {agent.phone}</p>
                      <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-slate-400" /> {agent.email}</p>
                      <p className="flex items-center gap-2"><Calendar className="h-4 w-4 text-slate-400" /> {agent.contractStartDate} - {agent.contractEndDate}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink dark:text-ink-dark mb-3">Cost Coverage & Job Categories</h4>
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
                      <h4 className="font-semibold text-ink dark:text-ink-dark mb-3">Sub-Agents ({agent.subAgents.length})</h4>
                      <div className="grid gap-2 md:grid-cols-2">
                        {agent.subAgents.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            <div><p className="font-medium text-sm">{sub.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{sub.role}</p></div>
                            <span className="text-sm font-semibold text-amber-600">{sub.deployments} deploy.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {agent.inCountryStaff.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-ink dark:text-ink-dark mb-3">In-Country Staff ({agent.inCountryStaff.length})</h4>
                      <div className="grid gap-2 md:grid-cols-3">
                        {agent.inCountryStaff.map(staff => (
                          <div key={staff.id} className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium text-sm">{staff.name}</p>
                            <p className="text-xs text-blue-600 capitalize">{staff.role}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{staff.tasks.join(', ')}</p>
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
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Agent Management</h1>
      </div>
      {renderTab()}
    </div>

    {showAddAgent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Register New Agent</h3>
            <button onClick={() => setShowAddAgent(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500 dark:text-slate-400" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Full Name *</label>
                <input type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Abebech Tadesse" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Phone</label>
                <input type="text" value={newAgent.phone} onChange={e => setNewAgent({...newAgent, phone: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="+251-91-1234567" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Email</label>
                <input type="email" value={newAgent.email} onChange={e => setNewAgent({...newAgent, email: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="agent@email.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Region</label>
                <select value={newAgent.region} onChange={e => setNewAgent({...newAgent, region: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                  <option value="">Select Region</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Oromia">Oromia</option>
                  <option value="Amhara">Amhara</option>
                  <option value="SNNPR">SNNPR</option>
                  <option value="Tigray">Tigray</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Specialization</label>
                <select value={newAgent.specialization} onChange={e => setNewAgent({...newAgent, specialization: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                  <option value="">Select Country</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="UAE">UAE</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Kuwait">Kuwait</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">Commission (ETB)</label>
                <input type="number" value={newAgent.commission} onChange={e => setNewAgent({...newAgent, commission: e.target.value})} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., 2500" />
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button onClick={() => setShowAddAgent(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
            <button onClick={handleAddAgent} className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 shadow-sm dark:shadow-soft-dark">
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
