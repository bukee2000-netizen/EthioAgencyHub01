'use client';

import { useState, useEffect } from 'react';
import { Landmark, Search, CheckCircle2, AlertCircle, Clock, Upload, Download, FileText, Plus, X, Eye, RefreshCw, Link2, Shield, CheckSquare, Send, ChevronDown, ChevronUp, Building2, Globe, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

interface MolsEmployee {
  id: string;
  name: string;
  passportNumber: string;
  destination: string;
  contractLinked: boolean;
  mofaAuth: boolean;
  embassyLegalization: boolean;
  molsSubmitted: boolean;
  molsApproved: boolean;
  stage: number;
  healthCert: boolean;
  insurance: boolean;
  coc: boolean;
  createdAt: string;
}

const STAGES = [
  { key: 'contract', label: 'Contract Sync', icon: Link2 },
  { key: 'mofa', label: 'MOFA Authentication', icon: Shield },
  { key: 'embassy', label: 'Embassy Legalization', icon: Globe },
  { key: 'mols_submit', label: 'MOLS Submission', icon: Send },
  { key: 'approved', label: 'Approved', icon: CheckCircle2 },
];

export function DocumentsMols() {
  const { addToast } = useToast();
  const [employees, setEmployees] = useState<MolsEmployee[]>([]);
  const [molsRecords, setMolsRecords] = useState<MolsEmployee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [empSearch, setEmpSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/employees?limit=100');
        const data = await res.json();
        if (data.success && data.data) {
          const mapped = data.data.map((e: any, i: number) => ({
            id: e.id,
            name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Unknown',
            passportNumber: e.passportNumber || '',
            destination: e.destination || e.country || 'Open',
            contractLinked: false,
            mofaAuth: false,
            embassyLegalization: false,
            molsSubmitted: false,
            molsApproved: false,
            stage: 0,
            healthCert: false,
            insurance: false,
            coc: false,
            createdAt: e.createdAt || new Date().toISOString(),
          }));
          setEmployees(mapped);
        }
      } catch (err) { console.error(err); addToast({ title: 'Error', description: 'Failed to fetch employee data.', type: 'error' }); }
      finally { setLoading(false); }
    };
    load();
  }, [addToast]);

  const stage = (rec: MolsEmployee) => {
    if (rec.molsApproved) return 4;
    if (rec.molsSubmitted) return 3;
    if (rec.embassyLegalization) return 2;
    if (rec.mofaAuth) return 1;
    if (rec.contractLinked) return 0;
    return 0;
  };

  const filteredEmployees = employees.filter(e =>
    !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filtered = molsRecords.filter(r => {
    if (stageFilter !== 'all' && stage(r).toString() !== stageFilter) return false;
    if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.passportNumber.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const progress = molsRecords.length > 0
    ? Math.round((molsRecords.filter(r => r.molsApproved).length / molsRecords.length) * 100)
    : 0;

  const advance = (id: string, field: keyof MolsEmployee) => {
    setMolsRecords(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: true };
      if (field === 'mofaAuth') updated.stage = 1;
      if (field === 'embassyLegalization') updated.stage = 2;
      if (field === 'molsSubmitted') updated.stage = 3;
      if (field === 'molsApproved') { updated.stage = 4; updated.molsSubmitted = true; updated.embassyLegalization = true; updated.mofaAuth = true; updated.contractLinked = true; }
      return updated;
    }));
  };

  const linkContract = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    if (!emp) return;
    setMolsRecords(prev => [...prev, { ...emp, contractLinked: true, stage: 0 }]);
    setShowLinkModal(false);
    setEmpSearch('');
    setStatusMsg({ ok: true, text: `Contract linked to ${emp.name}. Documents auto-pulled from registration.` });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const generateMolsFolder = (rec: MolsEmployee) => {
    alert(`MOLS Folder generated for ${rec.name}:\n- Passport: ${rec.passportNumber}\n- Certificate of Competency (COC)\n- Health Certificate\n- Insurance Certificate\n\nClick OK to download combined PDF.`);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-orange-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">MOLS Processing</h1>
        </div>
        <button onClick={() => setShowLinkModal(true)} className="flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-700 shadow-sm dark:shadow-soft-dark">
          <Link2 className="h-4 w-4" />Link Contract
        </button>
      </div>

      {statusMsg && (
        <div className={`rounded-2xl border p-4 shadow-sm dark:shadow-soft-dark ${statusMsg.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">{statusMsg.text}</span></div>
        </div>
      )}

      {/* Stats & Progress */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Linked to MOLS', value: molsRecords.length, icon: Link2, color: 'from-blue-50 to-blue-100/50 text-blue-800 text-blue-700' },
          { label: 'MOFA Authenticated', value: molsRecords.filter(r => r.mofaAuth).length, icon: Shield, color: 'from-purple-50 to-purple-100/50 text-purple-800 text-purple-700' },
          { label: 'Approved', value: molsRecords.filter(r => r.molsApproved).length, icon: CheckCircle2, color: 'from-emerald-50 to-emerald-100/50 text-emerald-800 text-emerald-700' },
          { label: 'Unlocked for Visa', value: molsRecords.filter(r => r.molsApproved).length, icon: Lock, color: 'from-green-50 to-green-100/50 text-green-800 text-green-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br border ${s.color} p-4 shadow-sm dark:shadow-soft-dark`}>
            <s.icon className="h-5 w-5 mb-2" />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-ink dark:text-ink-dark">MOLS Status: {progress}% Complete</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">{molsRecords.filter(r => r.molsApproved).length}/{molsRecords.length} approved</span>
        </div>
        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-700/50 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-500 via-purple-500 to-emerald-500 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Once MOLS approves, the employee is automatically unlocked for the Visa and Ticket sections.</p>
      </div>

      {/* Link Contract Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-ink dark:text-ink-dark">Link Contract to Employee</h3>
              <button onClick={() => setShowLinkModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Select an employee to link the abroad agent's digital contract. The system will pull their ID, Passport, and registration data instantly.</p>
              <input type="text" value={empSearch} onChange={e => setEmpSearch(e.target.value)} placeholder="Search employee..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm mb-3 focus:border-orange-500 focus:outline-none" />
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredEmployees.filter(e => !molsRecords.find(r => r.id === e.id)).slice(0, 10).map(emp => (
                  <button key={emp.id} onClick={() => linkContract(emp.id)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-left">
                    <div className="h-9 w-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">{emp.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{emp.name}</p>
                      <p className="text-xs text-slate-400">Passport: {emp.passportNumber || 'N/A'} â€¢ {emp.destination}</p>
                    </div>
                    <Link2 className="h-4 w-4 text-orange-500" />
                  </button>
                ))}
                {filteredEmployees.filter(e => !molsRecords.find(r => r.id === e.id)).length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">All employees linked. Register new employees first.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or passport..." className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2 pl-9 pr-4 text-sm focus:border-orange-500 focus:outline-none" />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
          <option value="all">All Stages</option>
          {STAGES.map((s, i) => <option key={s.key} value={i}>{s.label}</option>)}
        </select>
      </div>

      {/* MOLS Records */}
      {molsRecords.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-16 text-center shadow-sm dark:shadow-soft-dark">
          <Landmark className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-500 dark:text-slate-400">No contracts linked yet</p>
          <p className="text-sm text-slate-400 mt-1">Click "Link Contract" to pull employee data from registration and start the MOLS process.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(rec => {
            const s = stage(rec);
            const isExpanded = expandedId === rec.id;
            return (
              <div key={rec.id} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : rec.id)} className="text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">{rec.name.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink dark:text-ink-dark">{rec.name}</p>
                      <p className="text-xs text-slate-400">Passport: {rec.passportNumber || 'N/A'} â€¢ {rec.destination}</p>
                    </div>
                  </div>
                  {/* Stage Progress Bar */}
                  <div className="mx-6 flex-1 max-w-sm">
                    <div className="flex items-center gap-1">
                      {STAGES.map((st, i) => (
                        <div key={st.key} className="flex items-center flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${s > i ? 'bg-emerald-500' : s === i ? 'bg-orange-500 animate-pulse' : 'bg-slate-200'}`}>
                            {s > i ? 'âœ“' : i + 1}
                          </div>
                          {i < STAGES.length - 1 && <div className={`flex-1 h-1 ${s > i ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 text-center">{STAGES[s]?.label || 'Pending'}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!rec.contractLinked && <button onClick={() => advance(rec.id, 'contractLinked')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">Link</button>}
                    {rec.contractLinked && !rec.mofaAuth && <button onClick={() => advance(rec.id, 'mofaAuth')} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700">MOFA Auth</button>}
                    {rec.mofaAuth && !rec.embassyLegalization && <button onClick={() => advance(rec.id, 'embassyLegalization')} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">Embassy Legalize</button>}
                    {rec.embassyLegalization && !rec.molsSubmitted && <button onClick={() => advance(rec.id, 'molsSubmitted')} className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold hover:bg-orange-700">Submit to MOLS</button>}
                    {rec.molsSubmitted && !rec.molsApproved && <button onClick={() => advance(rec.id, 'molsApproved')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700">Mark Approved</button>}
                    {rec.molsApproved && <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Unlocked</span>}
                    <button onClick={() => generateMolsFolder(rec)} className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50"><Download className="h-3.5 w-3.5 inline-block mr-1" />Export</button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-orange-600" /> Employee Data</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Name:</span><span className="font-medium">{rec.name}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Passport:</span><span className="font-medium">{rec.passportNumber || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Destination:</span><span className="font-medium">{rec.destination}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Registered:</span><span className="font-medium">{new Date(rec.createdAt).toLocaleDateString()}</span></div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><CheckSquare className="h-4 w-4 text-purple-600" /> Authentication Tracker</h4>
                        <div className="space-y-2">
                          {[
                            { label: 'Contract Linked', done: rec.contractLinked },
                            { label: 'MOFA (Foreign Affairs) Authenticated', done: rec.mofaAuth },
                            { label: 'Embassy Legalization', done: rec.embassyLegalization },
                            { label: 'MOLS Submission', done: rec.molsSubmitted },
                            { label: 'MOLS Approved', done: rec.molsApproved },
                          ].map((item, i) => (
                            <label key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer ${item.done ? 'bg-emerald-50' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                              <input type="checkbox" checked={item.done} readOnly className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600 text-emerald-600" />
                              <span className={item.done ? 'text-emerald-700 font-medium' : 'text-slate-600 dark:text-slate-300'}>{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Upload className="h-4 w-4 text-green-600" /> MOLS Folder Package</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /><span>Passport ({rec.passportNumber || 'N/A'})</span></div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /><span>Certificate of Competency (COC)</span></div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /><span>Health Certificate</span></div>
                          <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-green-600" /><span>Insurance Certificate</span></div>
                          <button onClick={() => generateMolsFolder(rec)} className="mt-3 w-full rounded-xl bg-orange-600 py-2 text-xs font-bold text-white hover:bg-orange-700">
                            <Download className="h-3.5 w-3.5 inline-block mr-1" />Generate MOLS Folder (PDF)
                          </button>
                        </div>
                      </div>
                    </div>
                    {rec.molsApproved && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <strong>Visa & Ticket Unlocked:</strong> MOLS approved. This employee is now eligible for visa processing and ticket booking.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
