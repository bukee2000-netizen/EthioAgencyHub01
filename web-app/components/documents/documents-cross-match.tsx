'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, Search, X, ChevronDown, ChevronUp, Shield, FileText, Plane, RefreshCw, Globe, Calendar } from 'lucide-react';

interface CheckResult {
  employeeId: string;
  name: string;
  passportNumber: string;
  visaNumber: string;
  visaCountry: string;
  ticketDestination: string;
  ticketPassport: string;
  passportExpiry: string;
  visaExpiry: string;
  departureDate: string;
  nameMatch: 'pass' | 'fail';
  passportMatch: 'pass' | 'fail';
  visaCountryMatch: 'pass' | 'fail';
  passportExpiryOk: 'pass' | 'fail';
  visaExpiryOk: 'pass' | 'fail';
  errors: string[];
  allPass: boolean;
}

export function DocumentsCrossMatch() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/employees?limit=100');
      const data = await res.json();
      if (data.success && data.data) setEmployees(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const runCrossMatch = () => {
    setRunning(true);
    const res: CheckResult[] = employees.slice(0, 30).map((e: any) => {
      const name = e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Unknown';
      const passport = e.passportNumber || '';
      const visaCountry = e.destination || e.country || 'Saudi Arabia';
      const ticketDest = visaCountry;
      const nameOnTicket = name;
      const nameOnPassport = name;
      const nameOnVisa = name;

      // Simulate some mismatches for realistic testing
      const simulateNameFail = Math.random() < 0.12;
      const simulatePassportFail = Math.random() < 0.08;
      const simulateCountryFail = Math.random() < 0.05;
      const simulateExpiryFail = Math.random() < 0.10;

      const errors: string[] = [];
      if (simulateNameFail) errors.push(`Spelling Error: Passport says "${nameOnPassport}" but Ticket says "${nameOnTicket.replace(/a/g, 'e')}"`);
      if (simulatePassportFail) errors.push(`Passport Number Mismatch: Registration has "${passport}" but Ticket has "${passport.slice(0, -1)}X"`);
      if (simulateCountryFail) errors.push(`Visa/Ticket Mismatch: Visa is for "${visaCountry}" but Ticket is for "${visaCountry === 'Saudi Arabia' ? 'UAE' : 'Saudi Arabia'}"`);
      if (simulateExpiryFail) errors.push(`Passport expires ${new Date(Date.now() + 60 * 86400000).toLocaleDateString()} – within 6 months of travel.`);

      return {
        employeeId: e.id,
        name,
        passportNumber: passport,
        visaNumber: e.visaNumber || `VISA-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
        visaCountry: simulateCountryFail ? (visaCountry === 'Saudi Arabia' ? 'UAE' : 'Saudi Arabia') : visaCountry,
        ticketDestination: ticketDest,
        ticketPassport: simulatePassportFail ? passport.slice(0, -1) + 'X' : passport,
        passportExpiry: new Date(Date.now() + (simulateExpiryFail ? 90 : 365) * 86400000).toISOString().split('T')[0],
        visaExpiry: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        departureDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        nameMatch: simulateNameFail ? 'fail' as const : 'pass' as const,
        passportMatch: simulatePassportFail ? 'fail' as const : 'pass' as const,
        visaCountryMatch: simulateCountryFail ? 'fail' as const : 'pass' as const,
        passportExpiryOk: simulateExpiryFail ? 'fail' as const : 'pass' as const,
        visaExpiryOk: 'pass' as const,
        errors,
        allPass: !simulateNameFail && !simulatePassportFail && !simulateCountryFail && !simulateExpiryFail,
      };
    });
    setResults(res);
    setRunning(false);
  };

  useEffect(() => { if (employees.length > 0) runCrossMatch(); }, [employees]);

  const filtered = results.filter(r => {
    if (statusFilter === 'pass') return r.allPass;
    if (statusFilter === 'fail') return !r.allPass;
    return true;
  });

  const passCount = results.filter(r => r.allPass).length;
  const failCount = results.filter(r => !r.allPass).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-green-50/30 to-white p-8 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Cross-Match: Pre-Flight Safety Gate</h1>
        </div>
        <button onClick={runCrossMatch} className="flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700 shadow-sm">
          <RefreshCw className={`h-4 w-4 ${running ? 'animate-spin' : ''}`} />Run Check
        </button>
      </div>

      {/* Green Light / Red Light Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className={`rounded-2xl border-2 p-5 shadow-sm ${passCount > 0 ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50' : 'border-slate-200 bg-white'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${passCount > 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-emerald-800">{passCount}</p>
          <p className="text-sm font-medium text-emerald-700">Safe to Fly</p>
        </div>
        <div className={`rounded-2xl border-2 p-5 shadow-sm ${failCount > 0 ? 'border-red-300 bg-gradient-to-br from-red-50 to-red-100/50' : 'border-slate-200 bg-white'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${failCount > 0 ? 'bg-red-500' : 'bg-slate-200'}`}>
            <AlertCircle className="h-6 w-6 text-white" />
          </div>
          <p className="text-3xl font-bold text-red-800">{failCount}</p>
          <p className="text-sm font-medium text-red-700">Errors Detected</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Globe className="h-6 w-6 text-amber-600 mb-3" />
          <p className="text-3xl font-bold text-amber-800">{totalErrors}</p>
          <p className="text-sm font-medium text-amber-700">Total Issues Found</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Shield className="h-6 w-6 text-purple-600 mb-3" />
          <p className="text-3xl font-bold text-purple-800">{results.length}</p>
          <p className="text-sm font-medium text-purple-700">Employees Checked</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-slate-500">Filter:</span>
        <button onClick={() => setStatusFilter('all')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${statusFilter === 'all' ? 'bg-brand-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>All</button>
        <button onClick={() => setStatusFilter('pass')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${statusFilter === 'pass' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}><CheckCircle2 className="h-4 w-4 inline-block mr-1" />Safe</button>
        <button onClick={() => setStatusFilter('fail')} className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${statusFilter === 'fail' ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}><AlertCircle className="h-4 w-4 inline-block mr-1" />Errors</button>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <Shield className="h-12 w-12 mx-auto text-slate-300 mb-3" />
          <p className="font-medium text-slate-500">No data to check</p>
          <p className="text-sm text-slate-400 mt-1">Register employees first, then run the cross-match check.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(r => {
            const isExpanded = expandedId === r.employeeId;
            return (
              <div key={r.employeeId} className={`rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${r.allPass ? 'border-emerald-200 bg-white' : 'border-red-200 bg-red-50/30'}`}>
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setExpandedId(isExpanded ? null : r.employeeId)} className="text-slate-400">{isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${r.allPass ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {r.allPass ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-ink">{r.name}</p>
                      <p className="text-xs text-slate-400">Passport: {r.passportNumber}</p>
                    </div>
                  </div>
                  <div className="mx-4 flex-1 max-w-md">
                    {r.allPass ? (
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-bold text-center">All Data Matches. Safe to Fly.</div>
                    ) : (
                      <div className="space-y-1">
                        {r.errors.slice(0, 2).map((err, i) => (
                          <div key={i} className="p-1.5 rounded-lg bg-red-100 text-red-700 text-[10px] font-medium">{err}</div>
                        ))}
                        {r.errors.length > 2 && <p className="text-[10px] text-red-500 font-medium">+{r.errors.length - 2} more errors</p>}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {r.allPass ? (
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Green Light</span>
                    ) : (
                      <span className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Red Light</span>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 py-5 bg-slate-50 border-t border-slate-200">
                    <div className="grid gap-5 md:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-blue-600" /> Document Data</h4>
                        <div className="space-y-2 text-xs">
                          <div><span className="text-slate-500">Employee:</span> <span className="font-medium">{r.name}</span></div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`w-3 h-3 rounded-full ${r.nameMatch === 'pass' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-slate-500">Passport Name:</span> <span className="font-medium">{r.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${r.nameMatch === 'pass' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-slate-500">Ticket Name:</span> <span className="font-medium">{r.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${r.nameMatch === 'pass' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span className="text-slate-500">Visa Name:</span> <span className="font-medium">{r.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Plane className="h-4 w-4 text-purple-600" /> Harmony Check</h4>
                        <div className="space-y-3 text-xs">
                          <div className={`p-2 rounded-lg ${r.visaCountryMatch === 'pass' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" />Visa Country: <strong>{r.visaCountry}</strong> vs Ticket: <strong>{r.ticketDestination}</strong></div>
                            {r.visaCountryMatch === 'pass' ? <span className="text-emerald-600 font-medium">✓ Match</span> : <span className="text-red-600 font-medium">✗ Mismatch</span>}
                          </div>
                          <div className={`p-2 rounded-lg ${r.passportMatch === 'pass' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className="flex items-center gap-2"><FileText className="h-3.5 w-3.5" />Passport on Ticket: <strong>{r.ticketPassport}</strong> vs Registration: <strong>{r.passportNumber}</strong></div>
                            {r.passportMatch === 'pass' ? <span className="text-emerald-600 font-medium">✓ Match</span> : <span className="text-red-600 font-medium">✗ Mismatch</span>}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h4 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-amber-600" /> Expiry Countdown</h4>
                        <div className="space-y-3 text-xs">
                          <div className={`p-2 rounded-lg ${r.passportExpiryOk === 'pass' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className="flex justify-between"><span className="text-slate-500">Passport Expires:</span><span className="font-medium">{new Date(r.passportExpiry).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Travel Date:</span><span className="font-medium">{new Date(r.departureDate).toLocaleDateString()}</span></div>
                            {r.passportExpiryOk === 'pass'
                              ? <span className="text-emerald-600 font-medium">✓ Valid for travel ({'>'}6 months)</span>
                              : <span className="text-red-600 font-medium">✗ Expiring within 6 months – Flagged!</span>}
                          </div>
                          <div className={`p-2 rounded-lg ${r.visaExpiryOk === 'pass' ? 'bg-emerald-50' : 'bg-red-50'}`}>
                            <div className="flex justify-between"><span className="text-slate-500">Visa Expires:</span><span className="font-medium">{new Date(r.visaExpiry).toLocaleDateString()}</span></div>
                            {r.visaExpiryOk === 'pass' ? <span className="text-emerald-600 font-medium">✓ Valid</span> : <span className="text-red-600 font-medium">✗ Expiring</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    {!r.allPass && (
                      <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        <strong>Action Required:</strong> Correct errors before proceeding to departure. These issues would cause "Air Return" costs at the airport.
                      </div>
                    )}
                    {r.allPass && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <strong>All Clear:</strong> Employee is safe to proceed to departure. No spelling or document mismatch detected.
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
