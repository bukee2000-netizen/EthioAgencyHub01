'use client';

import { useState, useEffect } from 'react';
import { 
  UsersRound, 
  Plus, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Search, 
  Globe, 
  Briefcase, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  Users, 
  Eye,
  UserRound,
  X,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';

interface EmployeeStats {
  total: number;
  registered: number;
  documentReview: number;
  interviewUploaded: number;
  travelReady: number;
  deployed: number;
}

interface RecentEmployee {
  id: string;
  name: string;
  role?: string;
  destination?: string;
  status: string;
  registeredAt: string;
  region?: string;
  zone?: string;
  woreda?: string;
}

export function EmployeeManagementModule() {
  const [stats, setStats] = useState<EmployeeStats>({
    total: 0,
    registered: 0,
    documentReview: 0,
    interviewUploaded: 0,
    travelReady: 0,
    deployed: 0
  });
  const [recentEmployees, setRecentEmployees] = useState<RecentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<RecentEmployee[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setError(null);
      const [statsRes, recentRes] = await Promise.all([
        fetch('/api/employees/stats'),
        fetch('/api/employees?limit=10&sortBy=createdAt&order=desc')
      ]);

      const statsData = await statsRes.json();
      const recentData = await recentRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      } else {
        throw new Error(statsData.error?.message || 'Failed to fetch stats');
      }

      if (recentData.success) {
        setRecentEmployees(recentData.data || []);
      } else {
        throw new Error(recentData.error?.message || 'Failed to fetch recent employees');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Failed to fetch stats:', error);
      
      // Keep mock data as fallback
      const mockStats: EmployeeStats = {
        total: 156,
        registered: 45,
        documentReview: 28,
        interviewUploaded: 32,
        travelReady: 38,
        deployed: 13
      };

      const mockRecent: RecentEmployee[] = [
        { id: '1', name: 'Yohannes Tefera', role: 'Nurse', destination: 'Saudi Arabia', status: 'TRAVEL_READY', registeredAt: '2024-01-28' },
        { id: '2', name: 'Senait Assefa', role: 'Driver', destination: 'UAE', status: 'INTERVIEW_UPLOADED', registeredAt: '2024-01-25' },
        { id: '3', name: 'Getnet Kabede', role: 'Security Officer', destination: 'Kuwait', status: 'DOCUMENT_REVIEW', registeredAt: '2024-01-20' },
        { id: '4', name: 'Meron Alemu', role: 'Housemaid', destination: 'Qatar', status: 'REGISTERED', registeredAt: '2024-01-18' },
        { id: '5', name: 'Bereket Haile', role: 'Cook', destination: 'Saudi Arabia', status: 'DEPLOYED', registeredAt: '2024-01-10' },
      ];

      setStats(mockStats);
      setRecentEmployees(mockRecent);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }
    setSearching(true);
    setShowSearch(true);
    try {
      const res = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.data) {
        setSearchResults(data.data.map((e: any) => ({
          id: e.id,
          name: `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Unknown',
          role: e.role || e.jobRole || '-',
          destination: e.destination || '-',
          status: e.status || 'REGISTERED',
          registeredAt: e.createdAt || new Date().toISOString()
        })));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'REGISTERED':
        return { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Registered' };
      case 'DOCUMENT_REVIEW':
        return { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Doc Review' };
      case 'INTERVIEW_UPLOADED':
        return { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Interview' };
      case 'TRAVEL_READY':
        return { color: 'bg-green-50 text-green-700 border-green-200', label: 'Travel Ready' };
      case 'DEPLOYED':
        return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Deployed' };
      default:
        return { color: 'bg-slate-50 text-slate-700 border-slate-200', label: status || 'Unknown' };
    }
  };

  const deploymentRate = stats.total > 0 
    ? Math.round((stats.deployed / stats.total) * 100)
    : 0;

  const readinessRate = stats.total > 0
    ? Math.round(((stats.travelReady + stats.deployed) / stats.total) * 100)
    : 0;

  const inProcessRate = stats.total > 0
    ? Math.round(((stats.documentReview + stats.interviewUploaded) / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Header */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Employee Management</h2>
          </div>
          
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-9 pr-8 text-sm focus:border-brand-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearch(false); setSearchResults([]); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <Link
              href="/employee-management/registration"
              className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 shadow-md shadow-brand-600/20 transition-all hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Register New
            </Link>
          </div>
        </div>
        
        {/* Search Results Dropdown */}
        {showSearch && (
          <div className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {searching ? (
              <div className="p-4 text-center text-slate-500">Searching...</div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {searchResults.map((emp) => (
                  <Link
                    key={emp.id}
                    href={`/employee-management/${emp.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-semibold text-ink">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role} • {emp.destination}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      emp.status === 'DEPLOYED' ? 'bg-green-50 text-green-700' :
                      emp.status === 'TRAVEL_READY' ? 'bg-emerald-50 text-emerald-700' :
                      emp.status === 'INTERVIEW_UPLOADED' ? 'bg-purple-50 text-purple-700' :
                      emp.status === 'DOCUMENT_REVIEW' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {emp.status}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-500">
                No employees found matching "{searchQuery}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pipeline Status Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Employee Pipeline</h3>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {[
            { label: 'Total', value: stats.total, bg: 'bg-slate-50 border-slate-200', text: 'text-slate-800', icon: Users },
            { label: 'Registered', value: stats.registered, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: UserRound },
            { label: 'Doc Review', value: stats.documentReview, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: FileText },
            { label: 'Interview', value: stats.interviewUploaded, bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', icon: Briefcase },
            { label: 'Travel Ready', value: stats.travelReady, bg: 'bg-green-50 border-green-200', text: 'text-green-700', icon: CheckCircle2 },
            { label: 'Deployed', value: stats.deployed, bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: Globe },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border p-5 text-center ${item.bg} shadow-sm hover:shadow-md transition-shadow`}
            >
              <item.icon className={`h-5 w-5 mx-auto mb-2 ${item.text} opacity-60`} />
              <p className={`text-3xl font-extrabold ${item.text}`}>{item.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Deployment Rate</p>
            <div className="p-2 rounded-lg bg-emerald-50"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
          </div>
          <p className="text-4xl font-extrabold text-ink">{deploymentRate}%</p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {stats.deployed} of {stats.total} successfully deployed abroad
          </p>
          <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${deploymentRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">Readiness Rate</p>
            <div className="p-2 rounded-lg bg-blue-50"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
          </div>
          <p className="text-4xl font-extrabold text-ink">{readinessRate}%</p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {stats.travelReady + stats.deployed} ready or deployed
          </p>
          <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700"
              style={{ width: `${readinessRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-slate-700">In Process</p>
            <div className="p-2 rounded-lg bg-amber-50"><Clock className="h-5 w-5 text-amber-600" /></div>
          </div>
          <p className="text-4xl font-extrabold text-ink">{stats.documentReview + stats.interviewUploaded}</p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Under document review or interview stage
          </p>
          <div className="mt-4 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: `${inProcessRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/employee-management/registration"
            className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors">
                <Plus className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h4 className="mt-4 font-bold text-ink text-lg">New Registration</h4>
            <p className="mt-1 text-sm text-slate-500">Start the employee registration wizard</p>
          </Link>

          <Link
            href="/employee-management/profiles"
            className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                <UsersRound className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h4 className="mt-4 font-bold text-ink text-lg">View All Profiles</h4>
            <p className="mt-1 text-sm text-slate-500">Browse and filter all employees</p>
          </Link>

          <Link
            href="/employee-management/cv-generator"
            className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h4 className="mt-4 font-bold text-ink text-lg">Generate CV</h4>
            <p className="mt-1 text-sm text-slate-500">Create professional CVs for employees</p>
          </Link>

          <Link
            href="/employee-management/cv-database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 hover:border-brand-300 hover:bg-brand-50/40 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                <Search className="h-6 w-6" />
              </div>
              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 transition-colors" />
            </div>
            <h4 className="mt-4 font-bold text-ink text-lg">CV Database</h4>
            <p className="mt-1 text-sm text-slate-500">Search, filter, and match CVs</p>
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="font-bold">Connection Error</span>
          </div>
          <p className="mt-2 text-sm text-red-600">{error}. Showing cached demo data instead.</p>
          <button
            onClick={fetchStats}
            className="mt-3 text-sm font-bold text-red-700 hover:text-red-900 underline underline-offset-2"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Recent Registrations */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Recent Registrations</h3>
          <Link href="/employee-management/profiles" className="text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
            View All →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : recentEmployees.length === 0 ? (
            <p className="text-center text-slate-500 py-12 font-medium">No recent employees found.</p>
          ) : (
            recentEmployees.map((emp) => {
              const statusCfg = getStatusConfig(emp.status);
              return (
                <div
                  key={emp.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {emp.name ? emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-ink">{emp.name || 'Unknown'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
{emp.role && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {emp.role}</span>}
                         {emp.destination && <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-brand-500" /> {emp.destination}</span>}
                         {emp.region && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {emp.region}{emp.zone ? ` / ${emp.zone}` : ''}{emp.woreda ? ` / ${emp.woreda}` : ''}</span>}
                         <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {emp.registeredAt ? new Date(emp.registeredAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                    <Link href={`/employee-management/${emp.id}`} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-brand-600 transition-colors">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
