'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Briefcase, FileText, StickyNote, Plane, Phone, Mail, MapPin, Calendar, Award, Languages, CheckCircle2, Globe, Download, ChevronRight } from 'lucide-react';

interface EmployeeFull {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  contactPhone?: string;
  role?: string;
  jobRole?: string;
  destination?: string;
  country?: string;
  status: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  region?: string;
  zone?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  nationalId?: string;
  laborId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
  fatherName?: string;
  motherName?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  additionalSkills?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
  createdAt: string;
  updatedAt?: string;
  psychologyScore?: number;
  _count?: { documents: number; travels: number };
}

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<EmployeeFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'personal' | 'documents' | 'travel' | 'notes'>('overview');

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await fetch(`/api/employees/${params.id}`);
        const payload = await res.json();
        if (!res.ok || !payload?.success || !payload.data) {
          throw new Error(payload?.error?.message ?? 'Failed to load employee profile');
        }
        setEmployee(payload.data as EmployeeFull);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load employee profile');
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [params.id]);

  const getName = () => employee?.name || `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim() || 'Unknown';
  const getInitials = () => getName().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getStatusColor = (s?: string) => {
    switch (s) {
      case 'DEPLOYED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'TRAVEL_READY': return 'bg-green-50 text-green-700 border-green-200';
      case 'INTERVIEW_UPLOADED': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DOCUMENT_REVIEW': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
        <p className="font-semibold text-red-700">{error}</p>
        <Link href="/employee-management" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-600 underline">Back to Dashboard</Link>
      </div>
    );
  }

  if (!employee) return null;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'personal' as const, label: 'Personal Info', icon: Briefcase },
    { id: 'documents' as const, label: 'Documents', icon: FileText },
    { id: 'travel' as const, label: 'Travel', icon: Plane },
    { id: 'notes' as const, label: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/employee-management/profiles" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm dark:shadow-soft-dark">
          <ArrowLeft className="h-4 w-4" />
          Back to Profiles
        </Link>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm dark:shadow-soft-dark">
            <Download className="h-4 w-4" />
            Download CV
          </button>
          <Link href={`/employee-management/registration?edit=${employee.id}`} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 shadow-sm dark:shadow-soft-dark">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-brand-50/30 to-white p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex flex-wrap items-center gap-6">
          <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xl shadow-inner">
            {getInitials()}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-ink dark:text-ink-dark">{getName()}</h1>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(employee.status)}`}>
                {employee.status?.replace(/_/g, ' ') || 'Unknown'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
              {employee.role && <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-brand-500" /> {employee.role}</span>}
              {employee.destination && <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-brand-500" /> {employee.destination}</span>}
              {employee.contactPhone && <span className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-brand-500" /> {employee.contactPhone}</span>}
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand-500" /> Registered {new Date(employee.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed Folder Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700/50 rounded-t-2xl px-6 pt-4">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-t-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-brand-700 shadow-sm dark:shadow-soft-dark border-t border-x border-slate-200 dark:border-slate-700 -mb-px'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-b-2xl rounded-tr-2xl border border-t-0 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><User className="h-5 w-5 text-brand-600" /> Basic Info</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['Full Name', getName()],
                  ['Email', employee.email || '-'],
                  ['Phone', employee.contactPhone || '-'],
                  ['Gender', employee.gender || '-'],
                  ['Date of Birth', employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'],
                  ['Nationality', employee.nationality || 'Ethiopian'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{label}</span><span className="font-medium text-right">{value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-brand-600" /> Location & Emergency</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['Region', employee.region || '-'],
                  ['Zone', employee.zone || '-'],
                  ['Emergency Contact', employee.emergencyContact || '-'],
                  ['Emergency Phone', employee.emergencyPhone || '-'],
                  ['Relation', employee.emergencyRelation || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{label}</span><span className="font-medium text-right">{value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" /> Professional</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['Job Role', employee.role || employee.jobRole || '-'],
                  ['Destination', employee.destination || employee.country || '-'],
                  ['Education', employee.education || '-'],
                  ['Experience', employee.experience || '-'],
                  ['Languages', employee.languages?.join(', ') || '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{label}</span><span className="font-medium text-right">{value}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-brand-600" /> Quick Actions</h4>
              <div className="space-y-3">
                <Link href={`/employee-management/cv-generator?employeeId=${params.id}`} className="flex items-center justify-between p-3 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors">
                  <span className="font-semibold text-sm flex items-center gap-2"><FileText className="h-4 w-4" /> Generate CV</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link href="/travel" className="flex items-center justify-between p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                  <span className="font-semibold text-sm flex items-center gap-2"><Plane className="h-4 w-4" /> Book Travel</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Registered {new Date(employee.createdAt).toLocaleDateString()}</span>
                </div>
                {employee.updatedAt && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-sm flex items-center gap-2"><Calendar className="h-4 w-4" /> Last Updated {new Date(employee.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL INFO TAB */}
        {activeTab === 'personal' && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4">Identity & Contact</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['First Name', employee.firstName || '-'],
                  ['Last Name', employee.lastName || '-'],
                  ['Father Name', employee.fatherName || '-'],
                  ['Mother Name', employee.motherName || '-'],
                  ['Email', employee.email || '-'],
                  ['Phone', employee.contactPhone || '-'],
                  ['Alternate Phone', employee.contactPhone || '-'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{l}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4">Demographics</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['Gender', employee.gender || '-'],
                  ['Marital Status', employee.maritalStatus || '-'],
                  ['Date of Birth', employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : '-'],
                  ['Nationality', employee.nationality || 'Ethiopian'],
                  ['Region', employee.region || '-'],
                  ['Zone', employee.zone || '-'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{l}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4">ID Documents</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['National ID', employee.nationalId || '-'],
                  ['Labor ID', employee.laborId || '-'],
                  ['Passport Number', employee.passportNumber || '-'],
                  ['Passport Expiry', employee.passportExpiryDate ? new Date(employee.passportExpiryDate).toLocaleDateString() : '-'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{l}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4">Bank Details</h4>
              <div className="space-y-3 text-sm">
                {[
                  ['Bank Name', employee.bankName || '-'],
                  ['Account Number', employee.bankAccountNumber || '-'],
                  ['Branch', employee.bankBranch || '-'],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{l}</span><span className="font-medium">{v}</span></div>
                ))}
              </div>
              <p className="mt-3 text-xs text-emerald-600 font-medium">Used for salary remittance from abroad</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 md:col-span-2">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-brand-600" /> Skills & Qualifications</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3 text-sm">
                  {[
                    ['Education', employee.education || '-'],
                    ['Experience', employee.experience || '-'],
                    ['Job Role', employee.role || employee.jobRole || '-'],
                    ['Destination', employee.destination || employee.country || '-'],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">{l}</span><span className="font-medium">{v}</span></div>
                  ))}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-50"><span className="text-slate-500 dark:text-slate-400">Languages</span><span className="font-medium">{employee.languages?.length ? employee.languages.join(', ') : '-'}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400 text-sm">Additional Skills</span><p className="mt-1 text-sm font-medium">{employee.additionalSkills || '-'}</p></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-brand-600" /> Documents ({employee._count?.documents || 0})</h4>
              <div className="space-y-3">
                {[
                  { label: 'Passport', exists: !!employee.passportNumber },
                  { label: 'National ID', exists: !!employee.nationalId },
                  { label: 'Labor ID', exists: !!employee.laborId },
                ].map(doc => (
                  <div key={doc.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="font-medium text-sm">{doc.label}</span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${doc.exists ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {doc.exists ? 'Uploaded' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Link href="/employee-management/registration" className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Upload Documents</Link>
              <button className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Request Documents</button>
            </div>
          </div>
        )}

        {/* TRAVEL TAB */}
        {activeTab === 'travel' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><Plane className="h-5 w-5 text-brand-600" /> Travel History ({employee._count?.travels || 0})</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Travel records will appear here once bookings are made.</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 bg-blue-50">
              <h4 className="font-bold text-blue-800 mb-2">Quick Actions</h4>
              <div className="flex gap-3">
                <Link href="/travel" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">Book Flight</Link>
                <Link href="/travel" className="rounded-xl border border-blue-300 px-5 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100">View Travel Module</Link>
              </div>
            </div>
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
              <h4 className="font-bold text-ink dark:text-ink-dark mb-4 flex items-center gap-2"><StickyNote className="h-5 w-5 text-brand-600" /> Internal Notes</h4>
              <textarea className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-4 text-sm" rows={6} placeholder="Add internal notes about this employee..." />
            </div>
            <div className="flex justify-end gap-3">
              <button className="rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Cancel</button>
              <button className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">Save Note</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
