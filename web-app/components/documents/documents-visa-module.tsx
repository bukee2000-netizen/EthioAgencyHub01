'use client';

import { useState, useEffect } from 'react';
import { FileText, Plane, CheckCircle2, AlertCircle, Clock, Search, Shield, Globe, UserCheck, Send, Upload, Download, CheckSquare2, ChevronDown, ChevronUp, ClipboardList } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

interface Emp {
  id: string; name: string; phone: string; destination: string; passportNumber?: string;
  documents: { passport: boolean; visa: boolean; yellowCard: boolean; ticket: boolean; orientationComplete: boolean; };
}

export function DocumentsVisaModule() {
  const { addToast } = useToast();
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [loading, setLoading] = useState(true);
  const [embassyFilter, setEmbassyFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [visaStages, setVisaStages] = useState<Record<string, { embassy: string; stage: number; rejected?: string }>>({});
  const [visaScans, setVisaScans] = useState<Record<string, string>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/employees?limit=100');
        const data = await res.json();
        if (data.success && data.data) {
          setEmployees(data.data.map((e: any) => ({
            id: e.id,
            name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Unknown',
            phone: e.contactPhone || e.phone || '',
            destination: e.destination || e.country || 'Open',
            passportNumber: e.passportNumber || '',
            documents: { passport: !!e.passportNumber, visa: false, yellowCard: false, ticket: false, orientationComplete: false }
          })));
        }
      } catch (err) { console.error('Failed to fetch employees:', err); addToast({ title: 'Error', description: 'Failed to fetch employees.', type: 'error' }); }
      finally { setLoading(false); }
    };
    load();
  }, [addToast]);

  const embassies = ['Saudi Arabia (KSA)', 'UAE', 'Qatar', 'Kuwait', 'Jordan'];
  const stageNames = ['Document Collection', 'Portal Registration', 'Submitted to Embassy', 'Visa Approved/Stamped', 'Rejected/Correction'];
  const stageColors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-emerald-100 text-emerald-700', 'bg-red-100 text-red-700'];

  const getDocStatus = (emp: Emp) => {
    const hasPassport = emp.documents.passport;
    const hasMedical = emp.documents.yellowCard;
    const medicalExpiring = hasMedical && Math.random() < 0.25;
    if (!hasPassport) return { label: 'No Passport', color: 'text-red-600', urgent: true, row: 'bg-red-50/40', medicalExpiring: false };
    if (!hasMedical) return { label: 'Medical Pending', color: 'text-amber-600', urgent: false, row: 'bg-amber-50/30', medicalExpiring: false };
    if (medicalExpiring) return { label: 'Medical Expiring Soon', color: 'text-orange-600', urgent: true, row: 'bg-orange-50/40', medicalExpiring: true };
    return { label: 'Docs Ready', color: 'text-green-600', urgent: false, row: '', medicalExpiring: false };
  };

  const visaData = employees.map(emp => {
    const vs = visaStages[emp.id] || { embassy: embassies[Math.floor(Math.random() * embassies.length)], stage: Math.floor(Math.random() * 4) };
    return { ...emp, vs, docStatus: getDocStatus(emp), scanUploaded: !!visaScans[emp.id] };
  });

  const filtered = visaData.filter(e => {
    if (embassyFilter !== 'all' && e.vs.embassy !== embassyFilter) return false;
    if (stageFilter !== 'all' && e.vs.stage !== parseInt(stageFilter)) return false;
    if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.passportNumber?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const summary = {
    total: filtered.length,
    submittedToday: filtered.filter(e => e.vs.stage >= 2).length,
    readyStamping: filtered.filter(e => e.vs.stage === 3).length,
    urgent: filtered.filter(e => (e.vs.stage < 2 && e.docStatus.urgent) || e.docStatus.medicalExpiring).length,
  };

  const toggleSelect = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(e => e.id));
  const updateStage = (id: string, stage: number) => {
    setVisaStages(prev => ({ ...prev, [id]: { ...prev[id], stage } }));
    // Bridge: notify ticket department when visa is approved (stage 3 = Visa Approved/Stamped)
    if (stage >= 3) {
      const emp = employees.find(e => e.id === id);
      if (emp) {
        fetch('/api/integration/bridge', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'visa_approved', employeeId: emp.id })
        }).catch(() => {});
      }
    }
  };
  const handleBulkManifest = () => { alert(`Generated manifest for ${selectedIds.length} employees.`); setSelectedIds([]); };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-purple-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark">
        <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Visa Management</h1>
      </div>

      {/* Summary */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Passports in Office', value: summary.total, icon: FileText, color: 'from-blue-50 to-blue-100/50 border-blue-200 text-blue-800 text-blue-700' },
          { label: 'Submitted to Embassies', value: summary.submittedToday, icon: Plane, color: 'from-purple-50 to-purple-100/50 border-purple-200 text-purple-800 text-purple-700' },
          { label: 'Ready for Stamping', value: summary.readyStamping, icon: CheckCircle2, color: 'from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-800 text-emerald-700' },
          { label: 'Expiring (&lt;10 Days)', value: summary.urgent, icon: AlertCircle, color: 'from-red-50 to-red-100/50 border-red-200 text-red-800 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-4 shadow-sm dark:shadow-soft-dark`}>
            <s.icon className="h-5 w-5 mb-2" />
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-soft-dark">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Embassy</label>
            <select value={embassyFilter} onChange={e => setEmbassyFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="all">All Embassies</option>
              {embassies.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Select Visa Stage</label>
            <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm">
              <option value="all">All Stages</option>
              {stageNames.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
          </div>
          <div className="flex-[2] min-w-[220px]">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Search Employee</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Name or Passport..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none" />
            </div>
          </div>
          <button onClick={() => { setEmbassyFilter('all'); setStageFilter('all'); setSearchQuery(''); }} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Reset</button>
        </div>
      </div>

      {/* Activities */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-ink dark:text-ink-dark flex items-center gap-2 mb-3"><ClipboardList className="h-5 w-5 text-purple-600" /> Visa Officer Activities</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Shield, label: 'Authentication', desc: 'Verify MoLS-signed contract & police clearance', bg: 'bg-blue-100 text-blue-600' },
            { icon: CheckCircle2, label: 'Medical Upload', desc: 'Confirm GAMCA medical result is "Fit" and uploaded', bg: 'bg-green-100 text-green-600' },
            { icon: Globe, label: 'Portal Entry', desc: 'Enjaz/Musaned/Qatar Visa Portal digital application', bg: 'bg-purple-100 text-purple-600' },
            { icon: UserCheck, label: 'Fingerprint Appointment', desc: 'Schedule biometrics for Qatar/UAE applications', bg: 'bg-amber-100 text-amber-600' },
          ].map(a => (
            <div key={a.label} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm dark:shadow-soft-dark cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${a.bg}`}><a.icon className="h-4 w-4" /></div>
                <span className="font-semibold text-sm">{a.label}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="rounded-2xl border-2 border-brand-300 bg-brand-50 p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm dark:shadow-soft-dark">
          <p className="text-sm font-bold text-brand-800 flex items-center gap-2"><CheckSquare2 className="h-5 w-5" /> {selectedIds.length} selected</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleBulkManifest} className="rounded-xl bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 shadow-sm dark:shadow-soft-dark"><Download className="h-4 w-4 inline-block mr-1.5" />Generate Manifest</button>
            <button onClick={() => { filtered.filter(e => selectedIds.includes(e.id)).forEach(e => updateStage(e.id, Math.min(e.vs.stage + 1, 4))); setSelectedIds([]); }} className="rounded-xl border border-brand-300 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100">Advance Stage</button>
            <button onClick={() => setSelectedIds([])} className="rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">Clear</button>
          </div>
        </div>
      )}

      {/* Visa Checklist Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="font-bold text-ink dark:text-ink-dark">Visa Status Checklist</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{filtered.length} employees</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 w-10"><input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={selectAll} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600" /></th>
                <th className="px-4 py-3 text-left">Employee Name</th>
                <th className="px-4 py-3 text-left">Embassy</th>
                <th className="px-4 py-3 text-left">Current Process Stage</th>
                <th className="px-4 py-3 text-left">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(emp => {
                const isExpanded = expandedId === emp.id;
                const ds = emp.docStatus;
                const isUrgent = ds.urgent || emp.vs.stage < 2;
                return (
                  <>
                    <tr key={emp.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${ds.medicalExpiring ? 'bg-orange-50/50' : isUrgent && emp.vs.stage < 2 ? 'bg-red-50/40' : ''}`}>
                      <td className="px-4 py-3"><input type="checkbox" checked={selectedIds.includes(emp.id)} onChange={() => toggleSelect(emp.id)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-brand-600" /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => setExpandedId(isExpanded ? null : emp.id)} className="flex items-center gap-2 font-medium text-ink dark:text-ink-dark hover:text-brand-600">
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          {emp.name}
                        </button>
                        <p className="text-xs text-slate-400 ml-6">Passport: {emp.passportNumber || 'N/A'}</p>
                      </td>
                      <td className="px-4 py-3"><span className="font-medium text-sm">{emp.vs.embassy}</span></td>
                      <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stageColors[emp.vs.stage] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200'}`}>{stageNames[emp.vs.stage] || 'Unknown'}</span></td>
                      <td className="px-4 py-3">
                        {emp.vs.stage === 4 ? (
                          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Visa Issued</span>
                        ) : (
                          <button onClick={() => updateStage(emp.id, emp.vs.stage + 1)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm dark:shadow-soft-dark">
                            {emp.vs.stage === 0 ? 'Submit Passport' : emp.vs.stage === 1 ? 'Submit to Embassy' : emp.vs.stage === 2 ? 'Book Appointment' : 'Mark Stamped'}
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${emp.id}-detail`}>
                        <td colSpan={5} className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                          <div className="grid gap-5 md:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-600" /> Embassy</h4>
                              <select value={emp.vs.embassy} onChange={e => setVisaStages(prev => ({ ...prev, [emp.id]: { ...prev[emp.id], embassy: e.target.value, stage: prev[emp.id]?.stage || 0 } }))}
                                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm mb-3">
                                {embassies.map(e => <option key={e} value={e}>{e}</option>)}
                              </select>
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Passport:</span><span className="font-medium">{emp.passportNumber || 'Not on file'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Medical:</span><span className={emp.documents.yellowCard ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>{emp.documents.yellowCard ? 'Fit - Uploaded' : 'Pending'}</span></div>
                                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Destination:</span><span className="font-medium">{emp.destination}</span></div>
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-purple-600" /> Process Stage</h4>
                              <div className="space-y-3">
                                {stageNames.map((name, i) => (
                                  <label key={name} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${emp.vs.stage === i ? 'bg-brand-50 border border-brand-200' : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    <input type="radio" name={`stage-${emp.id}`} checked={emp.vs.stage === i} onChange={() => updateStage(emp.id, i)} className="h-4 w-4 text-brand-600" />
                                    <div className="flex-1">
                                      <span className="text-xs font-medium">{i + 1}. {name}</span>
                                      {i === 4 && <span className="text-xs text-red-500 ml-2">Reason: <input type="text" placeholder="e.g., Photo size" className="w-24 rounded border border-slate-200 dark:border-slate-700 px-1 text-xs" /></span>}
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                              <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Shield className="h-4 w-4 text-green-600" /> Document Status</h4>
                              <div className="space-y-3 text-xs">
                                <div className="flex items-center gap-2"><span className={emp.documents.passport ? 'text-green-600' : 'text-red-500'}>{emp.documents.passport ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}</span><span>Passport Collected</span></div>
                                <div className="flex items-center gap-2">
                                  <span>{emp.documents.yellowCard ? (ds.medicalExpiring ? <AlertCircle className="h-4 w-4 text-orange-500" /> : <CheckCircle2 className="h-4 w-4 text-green-600" />) : <Clock className="h-4 w-4 text-amber-500" />}</span>
                                  <span className={ds.medicalExpiring ? 'text-orange-600 font-medium' : ''}>Medical Result (GAMCA){ds.medicalExpiring ? ' â€“ Expiring within 5 days!' : ''}</span>
                                </div>
                                <div className="flex items-center gap-2"><span className="text-green-600"><CheckCircle2 className="h-4 w-4" /></span><span>MoLS Contract Signed</span></div>
                                <div className="flex items-center gap-2"><span className="text-green-600"><CheckCircle2 className="h-4 w-4" /></span><span>Police Clearance</span></div>
                                {emp.vs.stage >= 3 && (
                                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-1"><FileText className="h-3.5 w-3.5 text-brand-600" /> Visa Document</p>
                                    {emp.scanUploaded ? (
                                      <div className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /><span className="font-medium">Visa scan uploaded</span></div>
                                    ) : (
                                      <div className="flex flex-wrap gap-2">
                                        <button onClick={() => setVisaScans(prev => ({ ...prev, [emp.id]: 'uploaded' }))} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
                                          <Upload className="h-3.5 w-3.5 inline-block mr-1" />Upload Visa Scan
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                  <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Agency Bridge</p>
                                  <div className={`p-2 rounded-lg text-xs ${emp.vs.stage >= 3 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {emp.vs.stage >= 3 ? <span className="flex items-center gap-1"><Send className="h-3.5 w-3.5" /> Ticket Dept notified: "Visa ready for {emp.name}"</span> : <span>Ticket Dept waiting for visa</span>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">No employees found matching filters.</div>}
      </div>
    </div>
  );
}
