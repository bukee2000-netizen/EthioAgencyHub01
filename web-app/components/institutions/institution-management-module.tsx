'use client';

import { useState, useEffect, FormEvent } from 'react';
import { 
  Building2, Mail, Phone, MapPin, Users, FileText, Plus, Search, 
  Edit, Trash2, X, Save, CheckCircle2, AlertCircle, Clock, ChevronRight,
  Briefcase, Globe, Banknote, Shield, Calendar, Activity, ChevronDown,
  ChevronUp, Download, Upload, Star, TrendingUp, Link2, Hospital, 
  Landmark, Award, UserCheck, Smartphone, MessageSquare, BarChart3,
  LayoutDashboard, Send
} from 'lucide-react';
import { getStatusColor } from '@/lib/utils/status';
import { Card } from '@/components/ui/card';

interface Institution {
  id: string; name: string; type: string; category: string; country: string; city: string;
  contactPerson: string; email: string; phone: string; address: string; website?: string;
  gpsLocation?: string; collaborationStatus: string; collaborationStartDate: string;
  collaborationEndDate?: string; licenseExpiry?: string; documents: number; totalEmployees: number;
  employeesAtInstitution?: number; pendingPayments?: number; insurancePremiums?: number;
  performanceRating?: number; quotaTotal?: number; quotaUsed?: number; notes?: string;
  digitalSignature?: string; createdAt: string; updatedAt: string;
}

interface Partner {
  id: string; name: string; institution: string; role: string; email: string; phone: string; status: string;
  createdAt: string; notes?: string;
}

interface Collaboration {
  id: string; institutionId: string; institution: string; type: string; startDate: string; endDate?: string;
  status: string; mou: string; description?: string; createdAt: string;
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

export function InstitutionManagementModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [filtered, setFiltered] = useState<Institution[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showInstForm, setShowInstForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => { fetchInstitutions(); }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
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

      setPartners([
        { id: 'PTN-001', name: 'Ahmed Al-Mansouri', institution: 'Saudi Medical Group', role: 'Director', email: 'ahmed@saudi.com', phone: '+966-12-3456789', status: 'active', createdAt: '2024-01-15' },
        { id: 'PTN-002', name: 'Fatima Al-Mazrouei', institution: 'Gulf Staffing Solutions', role: 'Manager', email: 'fatima@gulf.com', phone: '+971-50-1234567', status: 'active', createdAt: '2024-03-20' },
        { id: 'PTN-003', name: 'Mohammed Al-Qahtani', institution: 'Qatar Development', role: 'Coordinator', email: 'mohammed@qatar.com', phone: '+974-30-123456', status: 'inactive', createdAt: '2024-06-01' },
      ]);

      setCollaborations([
        { id: 'COLL-001', institutionId: 'INS-001', institution: 'Saudi Ministry of Labor', type: 'Employment', startDate: '2024-01-15', status: 'active', mou: 'Signed', createdAt: '2024-01-15' },
        { id: 'COLL-002', institutionId: 'INS-003', institution: 'Addis General Hospital', type: 'Medical', startDate: '2024-03-20', status: 'active', mou: 'Signed', createdAt: '2024-03-20' },
        { id: 'COLL-003', institutionId: 'INS-006', institution: 'Al-Futtaim Manpower', type: 'Joint Venture', startDate: '2024-06-01', status: 'negotiation', mou: 'Pending', createdAt: '2024-06-01' },
      ]);
    } finally { setLoading(false); }
  };

  const handleRegisterInstitution = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const type = fd.get('type') as string;
    const category = fd.get('category') as string;
    const country = fd.get('country') as string;
    const city = fd.get('city') as string;
    const contactPerson = fd.get('contactPerson') as string;
    const email = fd.get('email') as string;
    const phone = fd.get('phone') as string;
    const address = fd.get('address') as string;
    const collaborationStatus = fd.get('collaborationStatus') as string || 'active';
    const now = new Date().toISOString().split('T')[0];
    const newInst: Institution = {
      id: `INS-${Date.now().toString(36).toUpperCase()}`,
      name, type, category: category || type, country, city, contactPerson, email, phone, address,
      collaborationStatus, collaborationStartDate: now, documents: 0, totalEmployees: 0,
      createdAt: now, updatedAt: now,
    };
    try {
      const res = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type, contact: email, country, active: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.id) newInst.id = data.data.id;
      }
    } catch { /* fallback to local */ }
    setInstitutions(prev => [...prev, newInst]);
    setShowInstForm(false);
    setFormMessage(`"${name}" registered successfully.`);
    setTimeout(() => setFormMessage(null), 3000);
  };

  const handleRegisterPartner = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const institution = fd.get('institution') as string;
    const role = fd.get('role') as string;
    const email = fd.get('email') as string;
    const phone = fd.get('phone') as string;
    const status = fd.get('status') as string || 'active';
    const now = new Date().toISOString().split('T')[0];
    const newPartner: Partner = {
      id: `PTN-${Date.now().toString(36).toUpperCase()}`, name, institution, role, email, phone, status,
      createdAt: now,
    };
    setPartners(prev => [...prev, newPartner]);
    setShowPartnerForm(false);
    setFormMessage(`Partner "${name}" registered successfully.`);
    setTimeout(() => setFormMessage(null), 3000);
  };

  const handleRegisterCollaboration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const institutionId = fd.get('institutionId') as string;
    const type = fd.get('type') as string;
    const description = fd.get('description') as string;
    const startDate = fd.get('startDate') as string;
    const status = fd.get('status') as string || 'active';
    const mou = fd.get('mou') as string || 'Pending';
    const inst = institutions.find(i => i.id === institutionId);
    const now = new Date().toISOString().split('T')[0];
    const newCollab: Collaboration = {
      id: `COLL-${Date.now().toString(36).toUpperCase()}`,
      institutionId, institution: inst?.name || institutionId,
      type, startDate: startDate || now, status, mou, description, createdAt: now,
    };
    setCollaborations(prev => [...prev, newCollab]);
    setShowCollabForm(false);
    setFormMessage(`${type} collaboration registered with "${inst?.name || institutionId}".`);
    setTimeout(() => setFormMessage(null), 3000);
  };

  useEffect(() => {
    let f = [...institutions];
    if (searchQuery) f = f.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.country.toLowerCase().includes(searchQuery.toLowerCase()) || i.city.toLowerCase().includes(searchQuery.toLowerCase()));
    if (typeFilter !== 'all') f = f.filter(i => i.type === typeFilter);
    if (statusFilter !== 'all') f = f.filter(i => i.collaborationStatus === statusFilter);
    setFiltered(f);
  }, [institutions, typeFilter, statusFilter, searchQuery]);



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
     expiringSoon: institutions.filter(i => i.licenseExpiry && Math.abs(new Date(i.licenseExpiry).getTime() - Date.now()) < 90 * 86400000).length
   };

   if (loading) {
     return (
       <div className="flex items-center justify-center py-20">
         <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
       </div>
     );
   }

   return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark">
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Institutions Network</h1>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-sm dark:shadow-soft-dark flex gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-brand-600 text-white shadow-sm dark:shadow-soft-dark' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
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
               <Card key={s.label} variant="outlined" className="p-5">
                 <s.icon className={`h-6 w-6 ${s.color} mb-3`} />
                 <p className="text-3xl font-bold text-ink dark:text-ink-dark">{s.value}</p>
                 <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{s.label}</p>
               </Card>
             ))}
           </div>

          {/* Expiry Alerts */}
          {stats.expiringSoon > 0 && (
            <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 shadow-sm dark:shadow-soft-dark">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="font-bold text-red-800">{stats.expiringSoon} agreement{stats.expiringSoon > 1 ? 's' : ''} expiring within 90 days. Review and renew to maintain compliance.</p>
              </div>
            </div>
          )}

           {/* Live Institution Grid */}
           <Card className="p-6">
             <h3 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Globe className="h-5 w-5 text-brand-600" /> Live Institution Network</h3>
             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
               {institutions.map(inst => (
                 <Card key={inst.id} variant={inst.collaborationStatus === 'active' ? 'outlined' : undefined} className={`transition-shadow hover:shadow-md ${inst.collaborationStatus === 'active' ? 'border-green-200 bg-green-50/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                   <div className="flex items-center gap-3 mb-3">
                     <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-white ${inst.type === 'government' ? 'bg-blue-600' : inst.type === 'embassy' ? 'bg-purple-600' : inst.type === 'medical' ? 'bg-green-600' : inst.type === 'bank' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                       {inst.name.charAt(0)}
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-ink dark:text-ink-dark text-sm truncate">{inst.name}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">{inst.category || inst.type} â€¢ {inst.country}</p>
                     </div>
                     <span className={`w-2.5 h-2.5 rounded-full ${inst.collaborationStatus === 'active' ? 'bg-green-500' : inst.collaborationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`} title={inst.collaborationStatus} />
                   </div>
                   <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                     {inst.employeesAtInstitution && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{inst.employeesAtInstitution}</span>}
                     {inst.performanceRating && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />{inst.performanceRating}</span>}
                     {inst.pendingPayments ? <span className="flex items-center gap-1 text-amber-600"><Banknote className="h-3.5 w-3.5" />{inst.pendingPayments.toLocaleString()}</span> : <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Active</span>}
                   </div>
                 </Card>
               ))}
             </div>
            </Card>

            {/* Financial Snapshot */}
           <Card className="p-6">
             <h3 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Banknote className="h-5 w-5 text-brand-600" /> Financial Snapshot</h3>
             <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
               {institutions.filter(i => i.pendingPayments).slice(0, 6).map(inst => (
                 <Card key={inst.id} variant="outlined" className="p-4">
                   <p className="font-semibold text-sm text-amber-800">{inst.name}</p>
                   <p className="text-lg font-bold text-amber-900 mt-1">{inst.pendingPayments?.toLocaleString()} ETB</p>
                   <p className="text-xs text-amber-700">{inst.type === 'bank' ? 'Bank Guarantee' : 'Insurance Premium'}</p>
                 </Card>
               ))}
             </div>
           </Card>
        </div>
      )}

      {/* ===== TAB 2: INSTITUTION DETAILS ===== */}
      {activeTab === 'details' && (
        <div className="space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name, country, city..." className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-9 pr-4 text-sm" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
              <option value="all">All Types</option>
              <option value="government">Governmental</option>
              <option value="embassy">Embassy</option>
              <option value="partner">Private</option>
              <option value="medical">Health</option>
              <option value="bank">Financial</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button onClick={() => setShowInstForm(true)} className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 flex items-center gap-2"><Plus className="h-4 w-4" />Register Institution</button>
          </div>

          {/* Institution Cards */}
          <div className="space-y-4">
            {filtered.map(inst => (
              <div key={inst.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => setExpandedId(expandedId === inst.id ? null : inst.id)}>
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white text-lg ${inst.type === 'government' ? 'bg-blue-600' : inst.type === 'embassy' ? 'bg-purple-600' : inst.type === 'medical' ? 'bg-green-600' : inst.type === 'bank' ? 'bg-amber-600' : 'bg-slate-600'}`}>
                      {inst.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink dark:text-ink-dark">{inst.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-medium">{inst.category || inst.type}</span>
                        <span>â€¢</span>
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
                  <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-brand-600" /> Contact Directory</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Contact:</span><span className="font-medium">{inst.contactPerson}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Email:</span><span className="font-medium">{inst.email}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Phone:</span><span className="font-medium">{inst.phone}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Address:</span><span className="font-medium">{inst.address}</span></div>
                          {inst.gpsLocation && <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">GPS:</span><span className="font-medium text-blue-600">{inst.gpsLocation}</span></div>}
                          {inst.website && <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Website:</span><span className="font-medium text-blue-600">{inst.website}</span></div>}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Compliance & Documents</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">License Expiry:</span><span className={`font-medium ${inst.licenseExpiry && Math.abs(new Date(inst.licenseExpiry).getTime() - Date.now()) < 90 * 86400000 ? 'text-red-600' : 'text-green-600'}`}>{inst.licenseExpiry || 'N/A'}{inst.licenseExpiry && Math.abs(new Date(inst.licenseExpiry).getTime() - Date.now()) < 90 * 86400000 ? ' (Expiring Soon)' : ''}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Documents on File:</span><span className="font-medium">{inst.documents}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Total Employees:</span><span className="font-medium">{inst.totalEmployees}</span></div>
                          {inst.digitalSignature && <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Digital Signature:</span><span className="font-medium text-green-600">On File</span></div>}
                          <button className="mt-3 w-full rounded-xl bg-purple-600 py-2 text-xs font-bold text-white hover:bg-purple-700"><Upload className="h-3.5 w-3.5 inline-block mr-1" />Upload License</button>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-green-600" /> Capacity & Performance</h4>
                        <div className="space-y-3 text-xs">
                          {inst.employeesAtInstitution !== undefined && (
                            <div><div className="flex justify-between mb-1"><span>Capacity Utilization</span><span className="font-bold">{inst.employeesAtInstitution}/{inst.totalEmployees}</span></div>
                            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700/50"><div className="h-2 rounded-full bg-brand-500" style={{ width: `${(inst.employeesAtInstitution / Math.max(inst.totalEmployees, 1)) * 100}%` }} /></div></div>
                          )}
                          {inst.performanceRating && <div className="flex justify-between"><span>Performance Rating</span><span className="flex items-center gap-1 font-bold">{inst.performanceRating} <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /></span></div>}
                          {inst.notes && <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300"><span className="font-semibold">Notes:</span> {inst.notes}</div>}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"><Edit className="h-3.5 w-3.5 inline-block mr-1" />Edit Details</button>
                      <button className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"><Download className="h-3.5 w-3.5 inline-block mr-1" />Download Contract</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && <div className="text-center text-slate-500 dark:text-slate-400 py-12">No institutions found matching filters.</div>}
          </div>
        </div>
      )}

      {/* ===== TAB 3: PARTNERS ===== */}
      {activeTab === 'partners' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2"><Award className="h-5 w-5 text-amber-600" /> Partner Contacts ({partners.length})</h3>
            <button onClick={() => setShowPartnerForm(true)} className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 flex items-center gap-2"><Plus className="h-4 w-4" />Register Partner</button>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-ink dark:text-ink-dark">{partners.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Contacts</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-green-600">{partners.filter(p => p.status === 'active').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-blue-600">{partners.filter(p => p.role === 'Director' || p.role === 'Manager').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Key Contacts</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-yellow-600">{partners.filter(p => p.status === 'inactive').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inactive</p>
            </div>
          </div>

          {/* Partners Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Institution</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.map(partner => (
                    <tr key={partner.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{partner.name}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{partner.institution}</td>
                      <td className="px-6 py-4">{partner.role}</td>
                      <td className="px-6 py-4 text-blue-600">{partner.email}</td>
                      <td className="px-6 py-4">
                        {partner.status === 'active' ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400">Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No partners registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== TAB 4: COLLABORATION ===== */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2"><Link2 className="h-5 w-5 text-blue-600" /> Collaboration Agreements ({collaborations.length})</h3>
            <button onClick={() => setShowCollabForm(true)} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 flex items-center gap-2"><Plus className="h-4 w-4" />Register Collaboration</button>
          </div>

          {/* Stats */}
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-cyan-50 to-cyan-100/50">
              <p className="text-2xl font-bold text-cyan-600">{collaborations.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Agreements</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-green-50 to-green-100/50">
              <p className="text-2xl font-bold text-green-600">{collaborations.filter(c => c.status === 'active').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
              <p className="text-2xl font-bold text-yellow-600">{collaborations.filter(c => c.status === 'negotiation').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">In Negotiation</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-red-50 to-red-100/50">
              <p className="text-2xl font-bold text-red-600">{collaborations.filter(c => c.mou === 'Pending').length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">MOU Pending</p>
            </div>
          </div>

          {/* Collaborations Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Institution</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Start Date</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">MOU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {collaborations.map(coll => (
                    <tr key={coll.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">{coll.institution}</td>
                      <td className="px-6 py-4">{coll.type}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{coll.startDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          coll.status === 'active' ? 'bg-green-100 text-green-700' :
                          coll.status === 'negotiation' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {coll.status.charAt(0).toUpperCase() + coll.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          coll.mou === 'Signed' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {coll.mou}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {collaborations.length === 0 && (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-400">No collaborations registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Messages */}
      {formMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-green-600 text-white px-6 py-4 shadow-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />{formMessage}
        </div>
      )}

      {/* Register Institution Modal */}
      <Modal open={showInstForm} onClose={() => setShowInstForm(false)} title="Register Institution">
        <form onSubmit={handleRegisterInstitution} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Institution Name *</label>
              <input name="name" required className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Saudi Ministry of Labor" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Type</label>
              <select name="type" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                <option value="government">Government</option>
                <option value="embassy">Embassy</option>
                <option value="medical">Medical</option>
                <option value="bank">Bank</option>
                <option value="partner">Private</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Category</label>
              <input name="category" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Governmental" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Country</label>
              <input name="country" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Saudi Arabia" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">City</label>
              <input name="city" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Riyadh" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Contact Person</label>
              <input name="contactPerson" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Email</label>
              <input name="email" type="email" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="email@domain.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Phone</label>
              <input name="phone" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="+251-XX-XXXXXXX" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Address</label>
              <input name="address" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="Street, city, country" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowInstForm(false)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 flex items-center gap-2"><Save className="h-4 w-4" />Register</button>
          </div>
        </form>
      </Modal>

      {/* Register Partner Modal */}
      <Modal open={showPartnerForm} onClose={() => setShowPartnerForm(false)} title="Register Partner">
        <form onSubmit={handleRegisterPartner} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Partner Name *</label>
              <input name="name" required className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="Full name" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Institution</label>
              <input name="institution" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Saudi Medical Group" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Role</label>
              <input name="role" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="e.g., Director" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Status</label>
              <select name="status" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Email</label>
              <input name="email" type="email" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="email@domain.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Phone</label>
              <input name="phone" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="+971-XX-XXXXXXX" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowPartnerForm(false)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-700 flex items-center gap-2"><Save className="h-4 w-4" />Register</button>
          </div>
        </form>
      </Modal>

      {/* Register Collaboration Modal */}
      <Modal open={showCollabForm} onClose={() => setShowCollabForm(false)} title="Register Collaboration">
        <form onSubmit={handleRegisterCollaboration} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Institution *</label>
            <select name="institutionId" required className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
              <option value="">Select institution...</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Type</label>
              <select name="type" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                <option value="Employment">Employment</option>
                <option value="Medical">Medical</option>
                <option value="Training">Training</option>
                <option value="Joint Venture">Joint Venture</option>
                <option value="Financial">Financial</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Status</label>
              <select name="status" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                <option value="active">Active</option>
                <option value="negotiation">Negotiation</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Start Date</label>
              <input name="startDate" type="date" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">MOU</label>
              <select name="mou" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm">
                <option value="Signed">Signed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-ink dark:text-ink-dark mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="Collaboration details..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCollabForm(false)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50">Cancel</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 flex items-center gap-2"><Save className="h-4 w-4" />Register</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
