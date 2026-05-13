'use client';

import { useState } from 'react';
import { User, MapPin, Briefcase, Calendar, Check, Lock, Eye, FileText, Star, Bookmark, MoreHorizontal, ShieldCheck, X, Globe, Phone, Award, Languages, Download } from 'lucide-react';
import Link from 'next/link';

interface Employee {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  jobRole?: string;
  destination?: string;
  country?: string;
  status: string;
  selectedByAgent?: string | null;
  selectedAt?: string | null;
  createdAt: string;
  contactPhone?: string;
  email?: string;
  region?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  additionalSkills?: string;
  passportNumber?: string;
  photoUrl?: string;
  fullPhotoUrl?: string;
  _count?: { documents: number; travels: number };
}

interface EmployeeCardProps {
  employee: Employee;
  agentId: string;
  onSelect?: (employeeId: string) => void;
  viewOnly?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  REGISTERED: 'bg-blue-100 text-blue-700',
  DOCUMENT_REVIEW: 'bg-amber-100 text-amber-700',
  MOLS_PENDING: 'bg-orange-100 text-orange-700',
  INTERVIEW_UPLOADED: 'bg-purple-100 text-purple-700',
  TRAVEL_READY: 'bg-emerald-100 text-emerald-700',
  DEPLOYED: 'bg-slate-100 text-slate-700',
  ARCHIVED: 'bg-red-100 text-red-700'
};

export function EmployeeCard({ employee, agentId, onSelect, viewOnly = false }: EmployeeCardProps) {
  const [selecting, setSelecting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isBlocked = employee.selectedByAgent !== null && employee.selectedByAgent !== undefined && employee.selectedByAgent !== agentId;

  const getName = () => employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Unknown';
  const getInitials = () => getName().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const getRole = () => employee.role || employee.jobRole || 'Semi-Skilled';
  const getDestination = () => employee.destination || employee.country || 'Open';
  const getStatus = () => employee.status || 'REGISTERED';
  const getAge = () => {
    if (!employee.dateOfBirth) return null;
    const birth = new Date(employee.dateOfBirth);
    const age = Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  };
  const getLanguages = (): string[] => {
    if (Array.isArray(employee.languages)) return employee.languages;
    if (typeof employee.languages === 'string') return (employee.languages as string).split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };
  const getSkills = () => (employee.additionalSkills || '').split(',').map(s => s.trim()).filter(Boolean);

  const handleSelect = async () => {
    if (isBlocked || viewOnly) return;
    setSelecting(true);
    try {
      await fetch('/api/agents/select-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: employee.id, agentId })
      });
      onSelect?.(employee.id);
    } catch (error) {
      console.error('Error selecting employee:', error);
    } finally {
      setSelecting(false);
    }
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${isBlocked ? 'border-red-200 opacity-75' : 'border-slate-200 hover:border-brand-300 hover:shadow-md'}`}>
        <div className="relative h-28 w-full bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-end p-4">
          {employee.photoUrl ? (
            <img src={employee.photoUrl} alt="Passport" className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md" />
          ) : (
            <div className="h-20 w-20 rounded-full border-4 border-white bg-white/30 flex items-center justify-center font-bold text-2xl text-white shadow-md">
              {getInitials()}
            </div>
          )}
          <div className="ml-3 pb-1">
            <p className="font-bold text-white text-lg drop-shadow-sm">{getName()}</p>
            <p className="text-xs text-white/80">{getRole()}</p>
          </div>
          <div className="absolute right-3 top-3 flex gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-white/90 ${STATUS_COLORS[getStatus()] || 'text-slate-700'}`}>
              {getStatus().replace(/_/g, ' ')}
            </span>
            {isBlocked && (
              <span className="rounded-full bg-red-500/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1">
                <Lock className="h-3 w-3" /> Reserved
              </span>
            )}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <Briefcase className="h-4 w-4 text-brand-500 shrink-0" />
              <span className="truncate">{getRole()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Globe className="h-4 w-4 text-brand-500 shrink-0" />
              <span className="truncate">{getDestination()}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-brand-500 shrink-0" />
              <span>{new Date(employee.createdAt).toLocaleDateString()}</span>
            </div>
            {employee._count && (
              <div className="flex gap-3 text-xs text-slate-500">
                <span>{employee._count.documents || 0} docs</span>
                <span>{employee._count.travels || 0} travels</span>
              </div>
            )}
          </div>

          {getLanguages().length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {getLanguages().slice(0, 3).map(lang => (
                <span key={lang} className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{lang}</span>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowDetails(true)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" /> View
            </button>
            <Link
              href={`/employee-management/${employee.id}`}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Detailed Profile Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div className="flex items-center gap-3">
                {employee.photoUrl ? (
                  <img src={employee.photoUrl} alt="Passport" className="h-14 w-14 rounded-full object-cover border-2 border-brand-200" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg">
                    {getInitials()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{getName()}</h2>
                  <p className="text-sm text-slate-500">{getRole()} • {getDestination()}</p>
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 space-y-5">
                {/* Passport Photo */}
                {employee.photoUrl && (
                  <div className="flex flex-col items-center p-3 rounded-xl bg-white border border-slate-200">
                    <img src={employee.photoUrl} alt="Passport" className="h-24 w-24 rounded-full object-cover border-2 border-brand-200 shadow-sm" />
                    <p className="text-xs text-slate-500 mt-2 font-medium">Passport Photo</p>
                  </div>
                )}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Briefcase className="h-4 w-4 text-brand-500" />
                    Occupation
                  </h4>
                  <p className="text-slate-800 font-medium pl-6">{getRole()}</p>
                  {employee.experience && <p className="text-sm text-slate-500 pl-6">{employee.experience}</p>}
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <User className="h-4 w-4 text-brand-500" />
                    Personal Info
                  </h4>
                  <p className="text-slate-800 pl-6 text-sm">{getAge() ? `${getAge()} years` : ''}{employee.gender ? `, ${employee.gender}` : ''}</p>
                  <p className="text-slate-500 pl-6 text-sm">{employee.region || 'Ethiopia'}</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Phone className="h-4 w-4 text-brand-500" />
                    Contact
                  </h4>
                  <p className="text-slate-800 pl-6 text-sm">{employee.contactPhone || '-'}</p>
                  <p className="text-slate-500 pl-6 text-sm">{employee.email || '-'}</p>
                </div>
                {getLanguages().length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Languages className="h-4 w-4 text-brand-500" />
                      Languages
                    </h4>
                    <ul className="text-sm text-slate-800 pl-6 space-y-1">
                      {getLanguages().map(l => <li key={l}>{l}</li>)}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <ShieldCheck className="h-4 w-4 text-brand-500" />
                    Documents
                  </h4>
                  <ul className="text-sm pl-6 space-y-1">
                    <li className="flex justify-between text-slate-600">Passport: <span className={employee.passportNumber ? 'text-emerald-600 font-medium' : 'text-amber-600 font-medium'}>{employee.passportNumber ? 'Valid' : 'Missing'}</span></li>
                    <li className="flex justify-between text-slate-600">Status: <span className="font-medium">{getStatus().replace(/_/g, ' ')}</span></li>
                    <li className="flex justify-between text-slate-600">Docs: <span className="font-medium">{employee._count?.documents || 0}</span></li>
                  </ul>
                </div>
                <div className="pt-4 space-y-3">
                  <Link href={`/employee-management/${employee.id}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm">
                    <Eye className="h-4 w-4" /> Full Profile
                  </Link>
                  <Link href={`/employee-management/cv-generator`} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-brand-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <Download className="h-4 w-4" /> Generate CV
                  </Link>
                </div>
              </div>

              <div className="w-full md:w-2/3 p-6 md:p-8">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">
                  <Briefcase className="h-5 w-5 text-brand-600" />
                  Professional Summary
                </h3>
                <div className="space-y-3 text-sm">
                  {employee.education && (
                    <div className="flex items-start gap-2"><span className="font-semibold text-slate-700 min-w-24">Education:</span><span className="text-slate-600">{employee.education}</span></div>
                  )}
                  {employee.experience && (
                    <div className="flex items-start gap-2"><span className="font-semibold text-slate-700 min-w-24">Experience:</span><span className="text-slate-600">{employee.experience}</span></div>
                  )}
                  {getSkills().length > 0 && (
                    <div>
                      <p className="font-semibold text-slate-700 mb-2">Key Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSkills().map(s => (
                          <span key={s} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {employee.destination && (
                    <div className="flex items-start gap-2"><span className="font-semibold text-slate-700 min-w-24">Destination:</span><span className="text-slate-600">{getDestination()}</span></div>
                  )}
                  {employee.passportNumber && (
                    <div className="flex items-start gap-2"><span className="font-semibold text-slate-700 min-w-24">Passport:</span><span className="text-slate-600">{employee.passportNumber}</span></div>
                  )}
                </div>
                {/* Full Body Photo */}
                {employee.fullPhotoUrl && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">Full Body Photo</h4>
                    <div className="rounded-xl border border-slate-200 overflow-hidden">
                      <img src={employee.fullPhotoUrl} alt="Full body" className="w-full max-h-80 object-contain bg-slate-50" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface EmployeeCardGridProps {
  employees: Employee[];
  agentId: string;
  onSelect?: (employeeId: string) => void;
  viewOnly?: boolean;
}

export function EmployeeCardGrid({ employees, agentId, onSelect, viewOnly = false }: EmployeeCardGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {employees.map(employee => (
        <EmployeeCard 
          key={employee.id} 
          employee={employee} 
          agentId={agentId}
          onSelect={onSelect}
          viewOnly={viewOnly}
        />
      ))}
    </div>
  );
}
