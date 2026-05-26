'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Globe, User, Calendar, Briefcase, ChevronLeft, ChevronRight, X, CheckCircle2, FileText, Users, FileCheck, StickyNote, Phone, Mail, MapPin, Award, Languages } from 'lucide-react';
import Link from 'next/link';
import type { EmployeeBasic } from '@/lib/types/employee';
import { getStatusColor, getStatusLabel, getFullName, getInitials, parseLanguages } from '@/lib/types/employee';

export function EmployeeProfilesComponent() {
  const [employees, setEmployees] = useState<EmployeeBasic[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeBasic[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeBasic | null>(null);
  const [profileTab, setProfileTab] = useState<'personal' | 'skills' | 'documents' | 'notes'>('personal');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchQuery, statusFilter, destinationFilter]);

  const fetchEmployees = async () => {
    try {
      setError(null);
      const res = await fetch('/api/employees?limit=100');
      const data = await res.json();
      if (data.success && data.data) {
        setEmployees(data.data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch employees');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch employees';
      setError(errorMessage);
      console.error('Failed to fetch employees:', error);
      
      // Fallback mock data
      const mockEmployees: EmployeeBasic[] = [
        { id: '1', name: 'Yohannes Tefera', email: 'yohannes@example.com', role: 'Nurse', destination: 'Saudi Arabia', status: 'TRAVEL_READY', createdAt: new Date().toISOString() },
        { id: '2', name: 'Senait Assefa', email: 'senait@example.com', role: 'Driver', destination: 'UAE', status: 'INTERVIEW_UPLOADED', createdAt: new Date().toISOString() },
      ];
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchQuery) {
      filtered = filtered.filter((emp) =>
        (emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         emp.role?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.status === statusFilter);
    }

    if (destinationFilter !== 'all') {
      filtered = filtered.filter((emp) => emp.destination === destinationFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DOCUMENT_REVIEW': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INTERVIEW_UPLOADED': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'TRAVEL_READY': return 'bg-green-50 text-green-700 border-green-200';
      case 'DEPLOYED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'REGISTERED', label: 'Registered' },
    { value: 'DOCUMENT_REVIEW', label: 'Document Review' },
    { value: 'INTERVIEW_UPLOADED', label: 'Interview Uploaded' },
    { value: 'TRAVEL_READY', label: 'Travel Ready' },
    { value: 'DEPLOYED', label: 'Deployed' }
  ];

  const destinationOptions = [
    'all',
    ...Array.from(new Set(employees.map((emp) => emp.destination).filter(Boolean))) as string[]
  ];

  const exportEmployees = () => {
    if (filteredEmployees.length === 0) return;
    const lines = [
      'Name,Email,Role,Destination,Status,Registered Date',
      ...filteredEmployees.map((emp) =>
        [
          `"${(emp.name || '').replace(/"/g, '""')}"`,
          `"${(emp.email || '').replace(/"/g, '""')}"`,
          `"${(emp.role || '').replace(/"/g, '""')}"`,
          `"${(emp.destination || '').replace(/"/g, '""')}"`,
          `"${emp.status}"`,
          `"${new Date(emp.createdAt).toISOString()}"`
        ].join(',')
      )
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setMessage('Employee profiles exported successfully.');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">Employee Profiles</h2>
            <p className="mt-2 text-slate-600">
              Browse and manage <span className="font-bold text-brand-600">{filteredEmployees.length}</span> active profiles.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportEmployees}
              disabled={filteredEmployees.length === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3 text-sm font-medium focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-brand-500 focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-brand-500 focus:outline-none"
          >
            {destinationOptions.map((opt) => (
              <option key={opt} value={opt}>{opt === 'all' ? 'All Destinations' : opt}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-1">
          <button
            onClick={() => {
              setStatusFilter('all');
              setDestinationFilter('all');
              setSearchQuery('');
            }}
            className="w-full h-full flex items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-400 hover:text-red-500"
            title="Reset Filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4" /> {message}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                </th>
                <th className="px-6 py-4 font-bold text-slate-700">Employee</th>
                <th className="px-6 py-4 font-bold text-slate-700">Role</th>
                <th className="px-6 py-4 font-bold text-slate-700">Destination</th>
                <th className="px-6 py-4 font-bold text-slate-700">Status</th>
                <th className="px-6 py-4 font-bold text-slate-700">Registered</th>
                <th className="px-6 py-4 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                      <p className="text-slate-500 font-medium">Loading profiles...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-500 font-medium">
                    No employees found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => handleSelectEmployee(emp.id)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs">
                          {getInitials(emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim())}
                        </div>
                        <div>
                          <p className="font-bold text-ink">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                        {emp.role || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-brand-500" />
                        {emp.destination || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold border ${getStatusColor(emp.status)}`}>
                        {emp.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => { setSelectedEmployee(emp); setProfileTab('personal'); }}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Profile Modal - Tabbed Folder Style */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                  {getInitials(selectedEmployee.name || `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim())}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-ink">{selectedEmployee.name || `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim()}</h3>
                  <p className="text-sm text-slate-500">{selectedEmployee.role || selectedEmployee.jobRole || 'Employee'} • {selectedEmployee.destination || selectedEmployee.country || 'Open'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedEmployee(null)} className="rounded-full p-2 hover:bg-slate-200">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Tabbed Folder Style Tabs */}
            <div className="border-b border-slate-200 bg-slate-100 px-6 pt-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setProfileTab('personal')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
                    profileTab === 'personal'
                      ? 'bg-white text-brand-700 shadow-sm border-t border-x border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <User className="h-4 w-4 inline-block mr-2" />
                  Personal
                </button>
                <button
                  onClick={() => setProfileTab('skills')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
                    profileTab === 'skills'
                      ? 'bg-white text-brand-700 shadow-sm border-t border-x border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Briefcase className="h-4 w-4 inline-block mr-2" />
                  Skills
                </button>
                <button
                  onClick={() => setProfileTab('documents')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
                    profileTab === 'documents'
                      ? 'bg-white text-brand-700 shadow-sm border-t border-x border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileCheck className="h-4 w-4 inline-block mr-2" />
                  Documents
                </button>
                <button
                  onClick={() => setProfileTab('notes')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
                    profileTab === 'notes'
                      ? 'bg-white text-brand-700 shadow-sm border-t border-x border-slate-200'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <StickyNote className="h-4 w-4 inline-block mr-2" />
                  Notes
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {profileTab === 'personal' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><User className="h-5 w-5 text-brand-600" /> Personal Information</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="font-medium">{getFullName(selectedEmployee)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Email:</span><span className="font-medium">{selectedEmployee.email || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Phone:</span><span className="font-medium">{selectedEmployee.contactPhone || selectedEmployee.phone || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Gender:</span><span className="font-medium">{selectedEmployee.gender || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">DOB:</span><span className="font-medium">{selectedEmployee.dateOfBirth || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-medium">{getStatusLabel(selectedEmployee.status)}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-600" /> Location & Emergency</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Region:</span><span className="font-medium">{selectedEmployee.region || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Nationality:</span><span className="font-medium">{selectedEmployee.nationality || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Emergency:</span><span className="font-medium">{selectedEmployee.emergencyContact || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">E-Phone:</span><span className="font-medium">{selectedEmployee.emergencyPhone || '-'}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" /> Identity Documents</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">National ID:</span><span className="font-medium">{selectedEmployee.nationalId || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Passport:</span><span className="font-medium">{selectedEmployee.passportNumber || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Expiry:</span><span className="font-medium">{selectedEmployee.passportExpiryDate || '-'}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-brand-600" /> Registration</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Created:</span><span className="font-medium">{new Date(selectedEmployee.createdAt).toLocaleDateString()}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Destination:</span><span className="font-medium">{selectedEmployee.destination || selectedEmployee.country || 'Open'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Role:</span><span className="font-medium">{selectedEmployee.role || selectedEmployee.jobRole || '-'}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {profileTab === 'skills' && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-brand-600" /> Education & Experience</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Education:</span><span className="font-medium">{selectedEmployee.education || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Experience:</span><span className="font-medium">{selectedEmployee.experience || '-'}</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Job Role:</span><span className="font-medium">{selectedEmployee.role || '-'}</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                      <Languages className="h-5 w-5 text-brand-600" />
                      Languages
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Amharic:</span><span className="font-medium">Native</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">English:</span><span className="font-medium">-</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">Arabic:</span><span className="font-medium">-</span></div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-5 md:col-span-2">
                    <h4 className="font-bold text-ink mb-4">Additional Skills</h4>
                    <p className="text-sm text-slate-500">-</p>
                  </div>
                </div>
              )}

              {profileTab === 'documents' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-brand-600" />
                      Document Status
                    </h4>
                    <div className="space-y-3">
                      {['Passport', 'Visa', 'Health Certificate', 'Insurance', 'Photo', 'Consent Form'].map((doc) => (
                        <div key={doc} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium text-sm">{doc}</span>
                          <span className="px-2 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Pending</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                      Upload Documents
                    </button>
                  </div>
                </div>
              )}

              {profileTab === 'notes' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-bold text-ink mb-4 flex items-center gap-2">
                      <StickyNote className="h-5 w-5 text-brand-600" />
                      Internal Notes
                    </h4>
                    <textarea 
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm" 
                      rows={6} 
                      placeholder="Add notes about this employee..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                      Save Note
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button onClick={() => setSelectedEmployee(null)} className="px-5 py-2.5 text-sm font-bold text-slate-600">
                Close
              </button>
              <div className="flex gap-3">
                <button className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">
                  <Download className="h-4 w-4 inline-block mr-2" />
                  Download CV
                </button>
                <button className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-600">
          Showing <span className="font-bold text-ink">{filteredEmployees.length}</span> of <span className="font-bold text-ink">{employees.length}</span> profiles
        </p>
        <div className="flex gap-2">
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4 inline-block mr-1" />
            Prev
          </button>
          <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            Next
            <ChevronRight className="h-4 w-4 inline-block ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
