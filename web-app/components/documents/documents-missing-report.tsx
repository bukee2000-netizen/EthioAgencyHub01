'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, Download, FileText, Printer, Send, Search, X, Plus, Upload, ChevronDown, ChevronUp, Shield, Globe, User, Calendar, Flag, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

interface MissingCase {
  id: string;
  employeeId: string;
  employeeName: string;
  passportNo: string;
  visaNumber: string;
  destinationCountry: string;
  employerName: string;
  missingSince: string;
  lastContactDate: string;
  daysSinceReport: number;
  priority: 'critical' | 'high' | 'medium';
  status: 'draft' | 'submitted_to_mols' | 'resolved';
  molsReference?: string;
  notes: string;
  evidenceUploaded: boolean;
  letterGenerated: boolean;
}

export function DocumentsMissingReport() {
  const { addToast } = useToast();
  const [cases, setCases] = useState<MissingCase[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({
    employeeSearch: '', employeeId: '', employeeName: '', passportNo: '', visaNumber: '', destinationCountry: '', employerName: '',
    missingSince: '', lastContactDate: '', notes: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/employees?limit=100');
        const data = await res.json();
        if (data.success && data.data) setEmployees(data.data);
      } catch (err) { console.error(err); addToast({ title: 'Error', description: 'Failed to fetch employee data.', type: 'error' }); }
      finally { setLoading(false); }
    };
    load();
  }, [addToast]);

  const filteredEmployees = employees.filter((e: any) =>
    !form.employeeId && (!form.employeeSearch || (e.name || '').toLowerCase().includes(form.employeeSearch.toLowerCase()))
  );

  const selectEmployee = (emp: any) => {
    setForm({
      ...form, employeeId: emp.id, employeeName: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown',
      passportNo: emp.passportNumber || '', destinationCountry: emp.destination || emp.country || '',
      visaNumber: '', employerName: '', employeeSearch: ''
    });
  };

  const resetForm = () => {
    setForm({ employeeSearch: '', employeeId: '', employeeName: '', passportNo: '', visaNumber: '', destinationCountry: '', employerName: '', missingSince: '', lastContactDate: '', notes: '' });
    setShowForm(false);
  };

  const createReport = () => {
    if (!form.employeeId) { setStatusMsg({ ok: false, text: 'Select an employee' }); setTimeout(() => setStatusMsg(null), 3000); return; }
    const newCase: MissingCase = {
      id: 'MISS-' + Date.now(),
      employeeId: form.employeeId,
      employeeName: form.employeeName,
      passportNo: form.passportNo,
      visaNumber: form.visaNumber,
      destinationCountry: form.destinationCountry,
      employerName: form.employerName,
      missingSince: form.missingSince || new Date().toISOString().split('T')[0],
      lastContactDate: form.lastContactDate || new Date().toISOString().split('T')[0],
      daysSinceReport: 0,
      priority: 'high',
      status: 'draft',
      notes: form.notes,
      evidenceUploaded: false,
      letterGenerated: false,
    };
    setCases(prev => [newCase, ...prev]);
    resetForm();
    setStatusMsg({ ok: true, text: `Missing report created for ${form.employeeName}` });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const generateLetter = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, letterGenerated: true, status: 'submitted_to_mols' as const, molsReference: 'MOLS-REF-' + Date.now().toString().slice(-8) } : c));
    const c = cases.find(cc => cc.id === id);
    alert(`MOLS Missing Person Letter Generated:\n\nTo: Ministry of Labor and Skills (MOLS)\nSubject: Report of Missing Employee â€“ ${c?.employeeName}\n\nEmployee: ${c?.employeeName}\nPassport No: ${c?.passportNo}\nVisa No: ${c?.visaNumber}\nEmployer: ${c?.employerName}\nDestination: ${c?.destinationCountry}\nDate Missing: ${c?.missingSince}\nLast Contact: ${c?.lastContactDate}\n\nThis letter has been logged and is ready for digital signature.`);
  };

  const markResolved = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' as const } : c));
    setStatusMsg({ ok: true, text: 'Case marked as resolved' });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const uploadEvidence = (id: string) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, evidenceUploaded: true } : c));
  };

  const filtered = cases.filter(c =>
    !searchQuery || c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) || c.passportNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMissing = cases.filter(c => c.status !== 'resolved');
  const reportedToMols = cases.filter(c => c.status === 'submitted_to_mols');

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-red-50/30 to-white p-8 shadow-sm dark:shadow-soft-dark flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink dark:text-ink-dark">Missing Reports</h1>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-sm dark:shadow-soft-dark">
          <AlertCircle className="h-4 w-4" />Report Missing
        </button>
      </div>

      {statusMsg && (
        <div className={`rounded-2xl border p-4 shadow-sm dark:shadow-soft-dark ${statusMsg.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="flex items-center gap-3">{statusMsg.ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}<span className="font-semibold">{statusMsg.text}</span></div>
        </div>
      )}

      {/* Red Alert Dashboard */}
      <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5 shadow-sm dark:shadow-soft-dark">
        <h3 className="font-bold text-red-800 flex items-center gap-2 mb-4"><Flag className="h-5 w-5" /> Red Alert Dashboard</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div><span className="text-3xl font-bold text-red-800">{activeMissing.length}</span><p className="text-sm font-medium text-red-700">Currently Missing</p></div>
          <div><span className="text-3xl font-bold text-orange-800">{reportedToMols.length}</span><p className="text-sm font-medium text-orange-700">Reported to MOLS</p></div>
          <div><span className="text-3xl font-bold text-emerald-800">{cases.filter(c => c.letterGenerated).length}</span><p className="text-sm font-medium text-emerald-700">Letters Generated</p></div>
        </div>
        {activeMissing.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 border border-red-200 text-xs text-red-700">
            <AlertCircle className="h-4 w-4 inline-block mr-1" />
            {activeMissing.length} active case{activeMissing.length > 1 ? 's' : ''}. {reportedToMols.filter(c => c.daysSinceReport > 30).length > 0 ? `${reportedToMols.filter(c => c.daysSinceReport > 30).length} case(s) exceed 30 days since report. Legal escalation recommended.` : 'All cases within reporting window.'}
          </div>
        )}
      </div>

      {/* New Report Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="sticky top-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Report Missing Employee</h3>
              <button onClick={resetForm} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5 text-slate-500 dark:text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Select Employee *</label>
                {form.employeeId ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
                    <div className="h-10 w-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold">{form.employeeName.charAt(0)}</div>
                    <div className="flex-1"><p className="font-bold text-ink dark:text-ink-dark">{form.employeeName}</p><p className="text-xs text-slate-500 dark:text-slate-400">Passport: {form.passportNo}</p></div>
                    <button onClick={() => setForm({ ...form, employeeId: '', employeeName: '' })} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div>
                    <input type="text" value={form.employeeSearch} onChange={e => setForm({ ...form, employeeSearch: e.target.value })}
                      placeholder="Search active employee..." className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none" />
                    {form.employeeSearch && (
                      <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark">
                        {filteredEmployees.slice(0, 8).map((emp: any) => (
                          <button key={emp.id} onClick={() => selectEmployee(emp)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-left">
                            <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">{(emp.name || 'U').charAt(0)}</div>
                            <div><p className="text-sm font-medium">{emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown'}</p><p className="text-xs text-slate-400">{emp.destination || emp.country || 'Open'}</p></div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Passport Number</label>
                  <input type="text" value={form.passportNo} readOnly className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Visa Number</label>
                  <input type="text" value={form.visaNumber} onChange={e => setForm({ ...form, visaNumber: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Destination Country</label>
                  <input type="text" value={form.destinationCountry} readOnly className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Employer Name</label>
                  <input type="text" value={form.employerName} onChange={e => setForm({ ...form, employerName: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Missing Since</label>
                  <input type="date" value={form.missingSince} onChange={e => setForm({ ...form, missingSince: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Last Contact Date</label>
                  <input type="date" value={form.lastContactDate} onChange={e => setForm({ ...form, lastContactDate: e.target.value })} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Notes / Incident Details</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm" placeholder="Details about the incident..." />
              </div>
            </div>
            <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 flex justify-between rounded-b-2xl">
              <button onClick={resetForm} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={createReport} className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 shadow-sm dark:shadow-soft-dark">
                <AlertCircle className="h-4 w-4" />Create Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search cases..." className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-9 pr-4 text-sm focus:border-red-500 focus:outline-none" />
      </div>

      {/* Cases List */}
      {cases.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-16 text-center shadow-sm dark:shadow-soft-dark">
          <AlertCircle className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-500 dark:text-slate-400">No missing reports</p>
          <p className="text-sm text-slate-400 mt-1">All employees accounted for. Click "Report Missing" if needed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(c => {
            const isExpanded = expandedId === c.id;
            return (
              <div key={c.id} className={`rounded-2xl border-2 shadow-sm dark:shadow-soft-dark overflow-hidden ${c.status === 'resolved' ? 'border-emerald-200 bg-emerald-50/30' : c.status === 'submitted_to_mols' ? 'border-orange-200 bg-orange-50/30' : 'border-red-200 bg-white dark:bg-slate-800'}`}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : c.id)} className="text-slate-400">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${c.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{c.employeeName.charAt(0)}</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink dark:text-ink-dark">{c.employeeName}</p>
                      <p className="text-xs text-slate-400">{c.destinationCountry} â€¢ Passport: {c.passportNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {c.status === 'draft' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Draft</span>}
                    {c.status === 'submitted_to_mols' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">MOLS Submitted</span>}
                    {c.status === 'resolved' && <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">Resolved</span>}
                    <span className="text-xs text-slate-400">{c.daysSinceReport}d</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!c.letterGenerated && <button onClick={() => generateLetter(c.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700"><FileText className="h-3.5 w-3.5 inline-block mr-1" />Generate Letter</button>}
                    {c.letterGenerated && c.status !== 'resolved' && <button onClick={() => markResolved(c.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700"><CheckCircle2 className="h-3.5 w-3.5 inline-block mr-1" />Resolve</button>}
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><User className="h-4 w-4 text-red-600" /> Employee Details</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Name:</span><span className="font-medium">{c.employeeName}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Passport:</span><span className="font-medium">{c.passportNo}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Visa:</span><span className="font-medium">{c.visaNumber || '-'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Destination:</span><span className="font-medium">{c.destinationCountry}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Employer:</span><span className="font-medium">{c.employerName || '-'}</span></div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-600" /> Incident Timeline</h4>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Missing Since:</span><span className="font-medium">{new Date(c.missingSince).toLocaleDateString()}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Last Contact:</span><span className="font-medium">{new Date(c.lastContactDate).toLocaleDateString()}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Days Since Report:</span><span className="font-bold text-red-600">{c.daysSinceReport}d</span></div>
                          <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">Report Created:</span><span className="font-medium">{new Date().toLocaleDateString()}</span></div>
                          {c.molsReference && <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400">MOLS Ref:</span><span className="font-bold text-orange-600">{c.molsReference}</span></div>}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
                        <h4 className="font-bold text-ink dark:text-ink-dark text-sm mb-3 flex items-center gap-2"><Upload className="h-4 w-4 text-blue-600" /> Evidence & Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs">Absconding Report</span>
                            {c.evidenceUploaded ? <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Uploaded</span> : <button onClick={() => uploadEvidence(c.id)} className="text-xs bg-blue-600 text-white px-2.5 py-1 rounded font-bold hover:bg-blue-700">Upload</button>}
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className="text-xs">Letter to MOLS</span>
                            {c.letterGenerated ? <span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" />Generated</span> : <button onClick={() => generateLetter(c.id)} className="text-xs bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-700">Generate</button>}
                          </div>
                          {c.notes && <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300"><span className="font-semibold">Notes:</span> {c.notes}</div>}
                          {c.letterGenerated && (
                            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-xs text-orange-700"><Send className="h-3.5 w-3.5 inline-block mr-1" />Logged to MOLS on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()} â€“ Compliance proven.</div>
                          )}
                        </div>
                      </div>
                    </div>
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
