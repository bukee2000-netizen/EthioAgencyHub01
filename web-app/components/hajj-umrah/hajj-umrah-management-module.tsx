'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, MapPin, Calendar, CheckCircle2, AlertCircle, Landmark, 
  FileText, Plane, Heart, Sun, Moon, Star, Plus, Search, Filter,
  Clock, Shield, Activity, TrendingUp
} from 'lucide-react';
import { HajjUmrahPilgrimRegister } from './hajj-umrah-pilgrim-register';

interface Pilgrim {
  id: string;
  name: string;
  passportNumber: string;
  season: string;
  destination: 'Hajj' | 'Umrah';
  groupId?: string;
  groupName?: string;
  status: 'registered' | 'documents_pending' | 'requirements_met' | 'medical_clearance' | 'visa_approved' | 'ready_for_travel' | 'deployed';
  documents: number;
  totalDocuments: number;
  registeredAt: string;
  phone?: string;
  age?: number;
  gender?: string;
}

interface Group {
  id: string;
  name: string;
  type: 'Hajj' | 'Umrah';
  season: string;
  pilgrims: number;
  departureDate: string;
  status: 'planning' | 'registered' | 'approved' | 'ready' | 'completed';
  leader?: string;
}

export function HajjUmrahManagementModule() {
  const [activeView, setActiveView] = useState<'dashboard' | 'register'>('dashboard');
  const [pilgrims, setPilgrims] = useState<Pilgrim[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredPilgrims, setFilteredPilgrims] = useState<Pilgrim[]>([]);
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterPilgrims();
  }, [pilgrims, destinationFilter, statusFilter, searchQuery]);

  const fetchData = async () => {
    try {
      const mockPilgrims: Pilgrim[] = [
        { id: 'P001', name: 'Ahmed Hassan Mohammed', passportNumber: 'EP123456', season: '2026 Hajj', destination: 'Hajj', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'ready_for_travel', documents: 5, totalDocuments: 5, registeredAt: '2024-01-10', phone: '+251911234567', age: 45, gender: 'male' },
        { id: 'P002', name: 'Fatima Ibrahim Ali', passportNumber: 'EP234567', season: '2026 Umrah', destination: 'Umrah', groupId: 'GRP-002', groupName: 'Ramadan Umrah 2026', status: 'visa_approved', documents: 5, totalDocuments: 5, registeredAt: '2024-01-15', phone: '+251912345678', age: 38, gender: 'female' },
        { id: 'P003', name: 'Ibrahim Mohamed Tessema', passportNumber: 'EP345678', season: '2026 Hajj', destination: 'Hajj', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'requirements_met', documents: 4, totalDocuments: 5, registeredAt: '2024-01-20', phone: '+251913456789', age: 52, gender: 'male' },
        { id: 'P004', name: 'Amina Ahmed Seid', passportNumber: 'EP456789', season: '2026 Umrah', destination: 'Umrah', groupId: 'GRP-003', groupName: 'Umrah Business Group', status: 'medical_clearance', documents: 4, totalDocuments: 5, registeredAt: '2024-02-01', phone: '+251914567890', age: 35, gender: 'female' },
        { id: 'P005', name: 'Mohammed Osman Ahmed', passportNumber: 'EP567890', season: '2026 Hajj', destination: 'Hajj', groupId: 'GRP-004', groupName: 'Hajj 2026 - Group B', status: 'documents_pending', documents: 2, totalDocuments: 5, registeredAt: '2024-02-05', phone: '+251915678901', age: 48, gender: 'male' },
        { id: 'P006', name: 'Zainab Abebe Demissie', passportNumber: 'EP678901', season: '2026 Umrah', destination: 'Umrah', groupId: 'GRP-002', groupName: 'Ramadan Umrah 2026', status: 'requirements_met', documents: 4, totalDocuments: 5, registeredAt: '2024-02-10', phone: '+251916789012', age: 42, gender: 'female' },
        { id: 'P007', name: 'Abebe Tekle Kebede', passportNumber: 'EP789012', season: '2026 Hajj', destination: 'Hajj', groupId: 'GRP-001', groupName: 'Hajj 2026 - Group A', status: 'registered', documents: 1, totalDocuments: 5, registeredAt: '2024-02-15', phone: '+251917890123', age: 55, gender: 'male' },
        { id: 'P008', name: 'Sara Mohammed Yassin', passportNumber: 'EP890123', season: '2026 Umrah', destination: 'Umrah', groupId: 'GRP-003', groupName: 'Umrah Business Group', status: 'deployed', documents: 5, totalDocuments: 5, registeredAt: '2024-01-05', phone: '+251918901234', age: 40, gender: 'female' },
      ];

      const mockGroups: Group[] = [
        { id: 'GRP-001', name: 'Hajj 2026 - Group A', type: 'Hajj', season: '2026', pilgrims: 45, departureDate: '2026-07-14', status: 'ready', leader: 'Ahmed Hassan' },
        { id: 'GRP-002', name: 'Ramadan Umrah 2026', type: 'Umrah', season: '2026', pilgrims: 32, departureDate: '2026-03-15', status: 'approved', leader: 'Fatima Ibrahim' },
        { id: 'GRP-003', name: 'Umrah Business Group', type: 'Umrah', season: '2026', pilgrims: 18, departureDate: '2026-04-20', status: 'registered' },
        { id: 'GRP-004', name: 'Hajj 2026 - Group B', type: 'Hajj', season: '2026', pilgrims: 28, departureDate: '2026-07-15', status: 'planning' },
        { id: 'GRP-005', name: 'Ramadan Umrah 2027', type: 'Umrah', season: '2027', pilgrims: 0, departureDate: '2027-02-20', status: 'planning' },
      ];

      setPilgrims(mockPilgrims);
      setGroups(mockGroups);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPilgrims = () => {
    let filtered = [...pilgrims];

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.passportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (destinationFilter !== 'all') {
      filtered = filtered.filter((p) => p.destination === destinationFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredPilgrims(filtered);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      registered: 'bg-slate-100 text-slate-700',
      documents_pending: 'bg-yellow-100 text-yellow-800',
      requirements_met: 'bg-blue-100 text-blue-800',
      medical_clearance: 'bg-indigo-100 text-indigo-800',
      visa_approved: 'bg-purple-100 text-purple-800',
      ready_for_travel: 'bg-emerald-100 text-emerald-800',
      deployed: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      registered: 'Registered',
      documents_pending: 'Documents Pending',
      requirements_met: 'Requirements Met',
      medical_clearance: 'Medical Clearance',
      visa_approved: 'Visa Approved',
      ready_for_travel: 'Ready for Travel',
      deployed: 'Deployed',
    };
    return labels[status] || status;
  };

  const hajjCount = pilgrims.filter((p) => p.destination === 'Hajj').length;
  const umrahCount = pilgrims.filter((p) => p.destination === 'Umrah').length;
  const readyCount = pilgrims.filter((p) => p.status === 'ready_for_travel').length;
  const deployedCount = pilgrims.filter((p) => p.status === 'deployed').length;
  const pendingDocsCount = pilgrims.filter((p) => p.documents < p.totalDocuments).length;

  return (
    <div className="space-y-6">
      {activeView === 'register' ? (
        <HajjUmrahPilgrimRegister openNewRegistration={true} />
      ) : (
        <>
      {/* Header */}
      <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink flex items-center gap-3">
              <Heart className="h-8 w-8 text-purple-600" />
              Hajj & Umrah Management
            </h2>
            <p className="mt-2 text-slate-600">
              Manage {pilgrims.length} pilgrims across {groups.length} groups. Register pilgrims, organize groups, verify requirements, and track religious travel documents.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveView('register')}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              Register Pilgrim
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-50">
              <Calendar className="h-4 w-4" />
              Create Group
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats with Icons */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="h-6 w-6 text-purple-600" />
            <span className="text-xs font-medium text-green-600">+12 this month</span>
          </div>
          <p className="text-3xl font-bold text-purple-800">{pilgrims.length}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Total Pilgrims</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Sun className="h-6 w-6 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">Season 2026</span>
          </div>
          <p className="text-3xl font-bold text-amber-800">{hajjCount}</p>
          <p className="text-sm font-medium text-amber-700 mt-1">Hajj Pilgrims</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Moon className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">Year-round</span>
          </div>
          <p className="text-3xl font-bold text-blue-800">{umrahCount}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Umrah Pilgrims</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Plane className="h-6 w-6 text-emerald-600" />
            <span className="text-xs font-medium text-green-600">Ready</span>
          </div>
          <p className="text-3xl font-bold text-emerald-800">{readyCount}</p>
          <p className="text-sm font-medium text-emerald-700 mt-1">Ready for Travel</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Deployed</p>
              <p className="mt-2 text-2xl font-bold text-teal-600">{deployedCount}</p>
            </div>
            <Plane className="h-8 w-8 text-teal-600 opacity-20" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Groups</p>
              <p className="mt-2 text-2xl font-bold text-indigo-600">{groups.length}</p>
            </div>
            <Star className="h-8 w-8 text-indigo-600 opacity-20" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending Docs</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{pendingDocsCount}</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-600 opacity-20" />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Approval Rate</p>
              <p className="mt-2 text-2xl font-bold text-green-600">94%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Quick Links to Sub-Sections */}
      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/hajj-umrah/pilgrim-detail" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-purple-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-ink">Pilgrim Details</h3>
          </div>
          <p className="text-sm text-slate-500">View and manage individual pilgrim information, profiles, and status</p>
        </Link>
        <Link href="/hajj-umrah/requirements" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-purple-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-ink">Requirements</h3>
          </div>
          <p className="text-sm text-slate-500">Check eligibility, health requirements, and documentation checklist</p>
        </Link>
        <Link href="/hajj-umrah/documentation" className="rounded-2xl border border-slate-200 bg-white p-5 hover:border-purple-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-ink">Documentation</h3>
          </div>
          <p className="text-sm text-slate-500">Track visa processing, document verification, and approvals</p>
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-ink">Groups</h3>
          </div>
          <p className="text-sm text-slate-500">Organize pilgrim groups, manage leaders, and track departures</p>
        </div>
      </div>

      {/* Groups Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">Active Groups</h3>
          <span className="text-sm text-slate-500">{groups.length} groups</span>
        </div>
        <div className="divide-y divide-slate-100">
          {groups.map((group) => (
            <div key={group.id} className="p-6 hover:bg-slate-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    group.type === 'Hajj' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {group.type === 'Hajj' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{group.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span>{group.pilgrims} pilgrims</span>
                      <span>•</span>
                      <span>Departure: {group.departureDate}</span>
                      {group.leader && (
                        <>
                          <span>•</span>
                          <span>Leader: {group.leader}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  group.status === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                  group.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  group.status === 'registered' ? 'bg-purple-100 text-purple-700' :
                  group.status === 'planning' ? 'bg-slate-100 text-slate-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search pilgrims..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>
        <select
          value={destinationFilter}
          onChange={(e) => setDestinationFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="Hajj">Hajj</option>
          <option value="Umrah">Umrah</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="registered">Registered</option>
          <option value="documents_pending">Documents Pending</option>
          <option value="requirements_met">Requirements Met</option>
          <option value="medical_clearance">Medical Clearance</option>
          <option value="visa_approved">Visa Approved</option>
          <option value="ready_for_travel">Ready for Travel</option>
          <option value="deployed">Deployed</option>
        </select>
      </div>

      {/* Pilgrim Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-ink">Pilgrim</th>
              <th className="px-6 py-3 font-semibold text-ink">Passport</th>
              <th className="px-6 py-3 font-semibold text-ink">Type</th>
              <th className="px-6 py-3 font-semibold text-ink">Group</th>
              <th className="px-6 py-3 font-semibold text-ink">Status</th>
              <th className="px-6 py-3 font-semibold text-ink">Documents</th>
              <th className="px-6 py-3 font-semibold text-ink">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  Loading pilgrims...
                </td>
              </tr>
            ) : filteredPilgrims.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                  No pilgrims found
                </td>
              </tr>
            ) : (
              filteredPilgrims.map((pilgrim) => (
                <tr key={pilgrim.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium text-ink">{pilgrim.name}</p>
                      <p className="text-xs text-slate-500">{pilgrim.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-slate-600">{pilgrim.passportNumber}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      pilgrim.destination === 'Hajj'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {pilgrim.destination}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600">{pilgrim.groupName || '-'}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(pilgrim.status)}`}>
                      {getStatusLabel(pilgrim.status)}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${(pilgrim.documents/pilgrim.totalDocuments)*100}%` }} 
                        />
                      </div>
                      <span className="text-xs text-slate-500">{pilgrim.documents}/{pilgrim.totalDocuments}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {new Date(pilgrim.registeredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}