'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, Mail, Phone, MapPin, Users, FileText, Plus, Search, 
  Edit, Trash2, X, Save, CheckCircle2, AlertCircle, Clock, ChevronRight,
  Briefcase, Globe, Banknote, Shield, Calendar, Activity, ChevronDown,
  ChevronUp, Download, Upload, Star, TrendingUp, Link2, Hospital, 
  Landmark, Award, UserCheck, Smartphone, MessageSquare, BarChart3,
  LayoutDashboard, Send
} from 'lucide-react';

interface Institution {
  id: string; name: string; type: string; category: string; country: string; city: string;
  contactPerson: string; email: string; phone: string; address: string; website?: string;
  gpsLocation?: string; collaborationStatus: string; collaborationStartDate: string;
  collaborationEndDate?: string; licenseExpiry?: string; documents: number; totalEmployees: number;
  employeesAtInstitution?: number; pendingPayments?: number; insurancePremiums?: number;
  performanceRating?: number; quotaTotal?: number; quotaUsed?: number; notes?: string;
  digitalSignature?: string; createdAt: string; updatedAt: string;
}

export function InstitutionManagementModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filtered, setFiltered] = useState<Institution[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchInstitutions(); }, []);

  const fetchInstitutions = async () => {
    try {
      const mock: Institution[] = [
        { id: 'INS-001', name: 'Saudi Ministry of Labor', type: 'government', category: 'Governmental', country: 'Saudi Arabia', city: 'Riyadh', contactPerson: 'Dr. Ahmed bin Ali', email: 'mols@mol.gov.sa', phone: '+966-11-2345678', address: 'Riyadh, Saudi Arabia', gpsLocation: '24.7136° N, 46.6753° E', collaborationStatus: 'active', collaborationStartDate: '2023-06-15', licenseExpiry: '2025-06-15', documents: 12, totalEmployees: 500, employeesAtInstitution: 120, pendingPayments: 0, performanceRating: 4.8, quotaTotal: 1000, quotaUsed: 480, notes: 'Primary labor authority for Saudi deployments', createdAt: '2023-06-15', updatedAt: '2024-01-10' },
        { id: 'INS-002', name: 'UAE Embassy, Addis', type: 'embassy', category: 'Governmental', country: 'UAE', city: 'Addis Ababa', contactPerson: 'Mr. Hassan Mohamed', email: 'visa@uae-embassy.et', phone: '+251-11-5558889', address: 'Embassy Road, Addis Ababa', collaborationStatus: 'active', collaborationStartDate: '2023-07-20', documents: 8, totalEmployees: 25, performanceRating: 4.5, createdAt: '2023-07-20', updatedAt: '2024-02-15' },
        { id: 'INS-003', name: 'Addis General Hospital', type: 'medical', category: 'Health', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Dr. Getachew Worku', email: 'info@addisgh.com', phone: '+251-11-5530300', address: 'Bole, Addis Ababa', gpsLocation: '9.0222° N, 38.7468° E', collaborationStatus: 'active', collaborationStartDate: '2023-08-01', documents: 6, totalEmployees: 200, employeesAtInstitution: 45, performanceRating: 4.2, notes: 'GAMCA approved medical center', createdAt: '2023-08-01', updatedAt: '2024-03-01' },
        { id: 'INS-004', name: 'Commercial Bank of Ethiopia', type: 'bank', category: 'Financial', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Mr. Tadesse Ayalew', email: 'corporate@cbe.com.et', phone: '+251-11-5513100', address: 'Churchill Avenue, Addis Ababa', collaborationStatus: 'active', collaborationStartDate: '2023-09-01', documents: 10, totalEmployees: 50, pendingPayments: 250000, insurancePremiums: 12000, performanceRating: 4.0, createdAt: '2023-09-01', updatedAt: '2024-03-01' },
        { id: 'INS-005', name: 'EthioLife Insurance', type: 'other', category: 'Financial', country: 'Ethiopia', city: 'Addis Ababa', contactPerson: 'Ms. Sara Tekle', email: 'claims@ethiolife.com', phone: '+251-11-5540400', address: 'Kazanchis, Addis Ababa', collaborationStatus: 'active', collaborationStartDate: '2023-10-01', documents: 5, totalEmployees: 30, pendingPayments: 85000, insurancePremiums: 85000, createdAt: '2023-10-01', updatedAt: '2024-02-01' },
        { id: 'INS-006', name: 'Al-Futtaim Manpower', type: 'partner', category: 'Private', country: 'UAE', city: 'Dubai', contactPerson: 'Mr. Khalid Al-Futtaim', email: 'recruit@alfuttaim.ae', phone: '+971-4-1234567', address: 'Dubai, UAE', collaborationStatus: 'pending', collaborationStartDate: '2024-01-15', documents: 3, totalEmployees: 15, performanceRating: 3.8, quotaTotal: 200, quotaUsed: 45, createdAt: '2024-01-15', updatedAt: '2024-03-15' },
      ];
      setInstitutions(mock);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    let f = [...institutions];
    if (searchQuery) f = f.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.country.toLowerCase().includes(searchQuery.toLowerCase()) || i.city.toLowerCase().includes(searchQuery.toLowerCase()));
    if (typeFilter !== 'all') f = f.filter(i => i.type === typeFilter);
    if (statusFilter !== 'all') f = f.filter(i => i.collaborationStatus === statusFilter);
    setFiltered(f);
  }, [institutions, typeFilter, statusFilter, searchQuery]);

  const getStatusColor = (s: string) => ({ active: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700', suspended: 'bg-red-100 text-red-700', inactive: 'bg-slate-100 text-slate-700' }[s] || 'bg-slate-100 text-slate-700');

  const tabs = [
    { id: 'overview', label: 'Network Dashboard', icon: LayoutDashboard },
    { id: 'details', label: 'Institution Details', icon: Building2 },
    { id: 'partners', label: 'Partners', icon: Award },
    { id: 'collaboration', label: 'Collaboration', icon: Link2 },
  ];

  const stats = {
    total: institutions.length,
    active: institutions.filter(i => i.collaborationStatus === 'active').length,
    medical: institutions.filter(i => i.type === 'medical').length,
    financial: institutions.filter(i => i.type === 'bank' || i.category === 'Financial').length,
    employeesInCare: institutions.reduce((s, i) => s + (i.employeesAtInstitution || 0), 0),
    pendingPayments: institutions.reduce((s, i) => s + (i.pendingPayments || 0), 0),
    expiringSoon: institutions.filter(i => i.licenseExpiry && Math.abs(new Date(i.licenseExpiry).getTime() - Date.now()) < 90 * 86400000).length,
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-ink">Institutions Network</h1>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
            <tab.icon className="h-5 w-5" />{tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB 1: NETWORK DASHBOARD ===== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total Partners', value: stats.total, icon: Building2, color: 'text-brand-600', bg: 'bg-brand-50' },
              { label: 'Active Agreements', value: stats.active, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Employees in Care', value: stats.employeesInCare, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Pending Payments', value: stats.pendingPayments.toLocaleString() + ' ETB', icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border border-slate-200 ${s.bg} p-5 shadow-sm`}>
                <s.icon className={`h-6 w-6 ${s.color} mb-3`} />
                <p className="text-3xl font-bold text-ink">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Expiry Alerts */}
          {stats.expiringSoon > 0 && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="font-bold text-red-800">{stats.expiringSoon} agreement{stats.expiringSoon > 1 ? 's' : ''} expiring within 90 days. Review and renew to maintain compliance.</p>
              </div>
            </div>
          )}

          {/* Live Institution Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-brand-600" /> Live Institution Network</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {institutions.map(inst => (
                <div key={inst.id} className={`rounded-xl border p-4 transition-shadow hover:shadow-md ${inst.collaborationStatus === 'active' ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white ${inst.type === 'government' ? 'bg-blue-600' : inst.type === 'embassy' ? 'bg-purple-600' : inst.type === 'medical' ? 'bg-green-600' : inst.type === 'bank' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                      {inst.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink text-sm truncate">{inst.name}</p>
                      <p className="text-xs text-slate-500">{inst.category || inst.type} • {inst.country}</p>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${inst.collaborationStatus === 'active' ? 'bg-green-500' : inst.collaborationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} title={inst.collaborationStatus} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {inst.employeesAtInstitution && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{inst.employeesAtInstitution}</span>}
                    {inst.performanceRating && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />{inst.performanceRating}</span>}
                    {inst.pendingPayments ? <span className="flex items-center gap-1 text-amber-600"><Banknote className="h-3.5 w-3.5" />{inst.pendingPayments.toLocaleString()}</span> : <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Active</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Snapshot */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><Banknote className="h-5 w-5 text-brand-600" /> Financial Snapshot</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {institutions.filter(i => i.pendingPayments).slice(0, 6).map(inst => (
                <div key={inst.id} className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="font-semibold text-sm text-amber-800">{inst.name}</p>
                  <p className="text-lg font-bold text-amber-900 mt-1">{inst.pendingPayments?.toLocaleString()} ETB</p>
                  <p className="text-xs text-amber-700">{inst.type === 'bank' ? 'Bank Guarantee' : 'Insurance Premium'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 2: INSTITUTION DETAILS ===== */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, country, city..." className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-4 text-sm" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
              <option value="all">All Types</option>
              <option value="government">Governmental</option>
              <option value="embassy">Embassy</option>
              <option value="partner">Private</option>
              <option value="medical">Health</option>
              <option value="bank">Financial</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Institution Cards */}
          <div className="space-y-4">
            {filtered.map(inst => (
              <div key={inst.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white text-lg ${inst.type === 'government' ? 'bg-blue-600' : inst.type === 'embassy' ? 'bg-purple-600' : inst.type === 'medical' ? 'bg-green-600' : inst.type === 'bank' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                      {inst.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink">{inst.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-medium">{inst.category || inst.type}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3 inline" />{inst.city}, {inst.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(inst.collaborationStatus)}`}>{inst.collaborationStatus}</span>
                    {expandedId === inst.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                  </div>
                </div>
                {expandedId === inst.id && (
                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-600" /> Contact Directory</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500">Contact:</span><span className="font-medium">{inst.contactPerson}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Email:</span><span className="font-medium">{inst.email}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-medium">{inst.phone}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Address:</span><span className="font-medium">{inst.address}</span></div>
                          {inst.gpsLocation && <div className="flex justify-between"><span className="text-slate-500">GPS:</span><span className="font-medium text-blue-600">{inst.gpsLocation}</span></div>}
                          {inst.website && <div className="flex justify-between"><span className="text-slate-500">Website:</span><span className="font-medium text-blue-600">{inst.website}</span></div>}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Compliance & Documents</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500">License Expiry:</span><span className={`font-medium ${inst.licenseExpiry && Math.abs(new Date(inst.licenseExpiry).getTime() - Date.now()) < 90 * 86400000 ? 'text-red-600' : 'text-green-600'}`}>{inst.licenseExpiry || 'N/A'}{inst.licenseExpiry && Math.abs(new Date(inst.licenseExpiry).getTime() - Date.now()) < 90 * 86400000 ? ' (Expiring Soon)' : ''}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Documents on File:</span><span className="font-medium">{inst.documents}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Total Employees:</span><span className="font-medium">{inst.totalEmployees}</span></div>
                          {inst.digitalSignature && <div className="flex justify-between"><span className="text-slate-500">Digital Signature:</span><span className="font-medium text-green-600">On File</span></div>}
                          <button className="mt-3 w-full rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-700"><Upload className="h-3.5 w-3.5 inline-block mr-1" />Upload License</button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-green-600" /> Capacity & Performance</h4>
                        <div className="space-y-3 text-xs">
                          {inst.employeesAtInstitution !== undefined && (
                            <div><div className="flex justify-between mb-1"><span>Capacity Utilization</span><span className="font-bold">{inst.employeesAtInstitution}/{inst.totalEmployees}</span></div>
                            <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${(inst.employeesAtInstitution / Math.max(inst.totalEmployees, 1)) * 100}%` }} /></div></div>
                          )}
                          {inst.performanceRating && <div className="flex justify-between"><span>Performance Rating</span><span className="flex items-center gap-1 font-bold">{inst.performanceRating} <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /></span></div>}
                          {inst.notes && <div className="p-2 rounded-lg bg-slate-50 text-slate-600"><span className="font-semibold">Notes:</span> {inst.notes}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"><Edit className="h-3.5 w-3.5 inline-block mr-1" />Edit Details</button>
                      <button className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><Download className="h-3.5 w-3.5 inline-block mr-1" />Download Contract</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-500 py-12">No institutions found matching filters.</div>}
          </div>
        </div>
      )}

      {/* ===== TAB 3: PARTNERS ===== */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-sm">
            <h3 className="font-bold text-ink flex items-center gap-2 mb-4"><Award className="h-5 w-5 text-amber-600" /> Direct Partner Management</h3>
            <p className="text-sm text-slate-600 mb-4">Manage abroad agents and high-priority partners. Track quotas, performance ratings, and receive contract documents directly.</p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-ink">{institutions.filter(i => i.type === 'partner' || i.type === 'embassy').length}</p>
                <p className="text-xs text-slate-500">Active Partners</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-ink">{institutions.reduce((s, i) => s + (i.quotaUsed || 0), 0)}</p>
                <p className="text-xs text-slate-500">Quota Used</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-ink">{institutions.reduce((s, i) => s + ((i.quotaTotal || 0) - (i.quotaUsed || 0)), 0)}</p>
                <p className="text-xs text-slate-500">Remaining Quota</p>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 p-4">
                <p className="text-2xl font-bold text-ink">{institutions.filter(i => i.performanceRating && i.performanceRating >= 4).length}</p>
                <p className="text-xs text-slate-500">Top Rated (4+)</p>
              </div>
            </div>
          </div>

          {/* Partner Cards */}
          <div className="space-y-4">
            {institutions.filter(i => i.type === 'partner' || i.type === 'embassy' || i.type === 'agency').map(partner => (
              <div key={partner.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">{partner.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-bold text-ink text-lg">{partner.name}</h4>
                      <p className="text-sm text-slate-500">{partner.country} • {partner.city}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {partner.performanceRating && <span className="flex items-center gap-1 text-xs font-bold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(partner.performanceRating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-slate-200'}`} />)}<span className="ml-1">{partner.performanceRating}</span></span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {partner.quotaTotal && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Quota: {partner.quotaUsed || 0}/{partner.quotaTotal}</p>
                          <div className="w-32 h-1.5 rounded-full bg-slate-100 mt-1">
                            <div className="h-1.5 rounded-full bg-amber-500" style={{ width: `${((partner.quotaUsed || 0) / (partner.quotaTotal || 1)) * 100}%` }} />
                        </div>
                      </div>
                    )}
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusColor(partner.collaborationStatus)}`}>{partner.collaborationStatus}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-slate-600"><Mail className="h-4 w-4" />{partner.email}</span>
                  <span className="flex items-center gap-1 text-slate-600"><Phone className="h-4 w-4" />{partner.phone}</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <button className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"><FileText className="h-3.5 w-3.5 inline-block mr-1" />View Contracts</button>
                  <button className="rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"><Upload className="h-3.5 w-3.5 inline-block mr-1" />Upload Agreement</button>
                  <button className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"><MessageSquare className="h-3.5 w-3.5 inline-block mr-1" />Send Notification</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== TAB 4: COLLABORATION ===== */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-sm">
            <h3 className="font-bold text-ink flex items-center gap-2 mb-4"><Link2 className="h-5 w-5 text-blue-600" /> Collaboration Board</h3>
            <p className="text-sm text-slate-600 mb-4">Automated data sharing with Banks, Hospitals, and Insurance providers. Request services and track real-time status.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Medical Integration */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-green-100"><Hospital className="h-6 w-6 text-green-600" /></div>
                <h4 className="font-bold text-ink">Medical Integration</h4>
              </div>
              <p className="text-sm text-slate-500 mb-4">Hospitals can log in to mark employees as "Fit" or "Unfit". Results instantly update the Visa department dashboard.</p>
              <div className="space-y-3">
                {institutions.filter(i => i.type === 'medical').map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{h.name}</p>
                      <p className="text-xs text-slate-500">{h.employeesAtInstitution} employees checked</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">Active</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-xl bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700">
                <Link2 className="h-4 w-4 inline-block mr-1.5" />Sync Medical Results
              </button>
            </div>

            {/* Bank/Insurance Sync */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-100"><Banknote className="h-6 w-6 text-amber-600" /></div>
                <h4 className="font-bold text-ink">Bank & Insurance Sync</h4>
              </div>
              <p className="text-sm text-slate-500 mb-4">Auto-send employee National ID and Passport data to Banks for account opening or to Insurance for policy issuance.</p>
              <div className="space-y-3">
                {institutions.filter(i => i.type === 'bank' || i.category === 'Financial').slice(0, 3).map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                    <div>
                      <p className="font-medium text-sm">{f.name}</p>
                      <p className="text-xs text-slate-500">{f.pendingPayments?.toLocaleString()} ETB pending</p>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">Send Data</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full rounded-xl bg-amber-600 py-2.5 text-sm font-bold text-white hover:bg-amber-700">
                <Send className="h-4 w-4 inline-block mr-1.5" />Request Insurance Policy
              </button>
            </div>

            {/* Service Logs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-purple-100"><Activity className="h-6 w-6 text-purple-600" /></div>
                <h4 className="font-bold text-ink">Service Logs & Audit Trail</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Institution</th>
                      <th className="px-4 py-3 text-left">Service</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { date: '2026-05-10', inst: 'Addis General Hospital', service: 'Medical Check Request', status: 'Completed' },
                      { date: '2026-05-09', inst: 'CBE', service: 'Account Opening', status: 'In Progress' },
                      { date: '2026-05-08', inst: 'EthioLife Insurance', service: 'Policy Issuance', status: 'Pending' },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-500">{log.date}</td>
                        <td className="px-4 py-3 font-medium">{log.inst}</td>
                        <td className="px-4 py-3">{log.service}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${log.status === 'Completed' ? 'bg-green-100 text-green-700' : log.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
