'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Filter, CheckCircle } from 'lucide-react';
import { z } from 'zod';

interface CVProfile {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  destination: string;
  template: string;
  language: string;
  status: string;
  skills: string[];
  experience: string;
  education: string;
  languages: string[];
  createdAt: string;
  matchScore?: number;
}

interface CVSearchCriteria {
  role?: string;
  destination?: string;
  skills?: string[];
  language?: string;
  experienceLevel?: string;
}

interface CVDatabaseProps {
  onSelectProfile?: (profile: CVProfile) => void;
  selectable?: boolean;
}

// Mock data for development
const MOCK_CVS: CVProfile[] = [
  {
    id: 'cv-1', employeeId: 'emp-1', employeeName: 'Abebe Kebede',
    role: 'Nurse', destination: 'Saudi Arabia', template: 'professional',
    language: 'EN', status: 'generated', skills: ['Patient Care', 'IV Therapy', 'Emergency Response'],
    experience: '5-10 years', education: 'BSc Nursing', languages: ['English', 'Amharic'],
    createdAt: '2026-05-10', matchScore: 95
  },
  {
    id: 'cv-2', employeeId: 'emp-2', employeeName: 'Mulugeta Tadesse',
    role: 'Engineer', destination: 'UAE', template: 'modern',
    language: 'EN', status: 'generated', skills: ['AutoCAD', 'Project Management', 'Structural Analysis'],
    experience: '3-5 years', education: 'MSc Civil Engineering', languages: ['English', 'Amharic'],
    createdAt: '2026-05-09', matchScore: 88
  },
  {
    id: 'cv-3', employeeId: 'emp-3', employeeName: 'Fikirte Bekele',
    role: 'Teacher', destination: 'Saudi Arabia', template: 'standard',
    language: 'AR', status: 'generated', skills: ['Curriculum Development', 'Arabic', 'Classroom Management'],
    experience: '1-3 years', education: 'BA Education', languages: ['Arabic', 'Amharic'],
    createdAt: '2026-05-08', matchScore: 82
  },
];

const SKILLS_LIST = [
  'Patient Care', 'IV Therapy', 'Emergency Response', 'Surgical Assistance',
  'AutoCAD', 'Project Management', 'Structural Analysis', 'Electrical',
  'Curriculum Development', 'Arabic', 'English', 'Amharic', 'Oromo',
  'Childcare', 'Elderly Care', 'Driving', 'Cooking', 'Cleaning',
  'Customer Service', 'Data Entry', 'Sales', 'Marketing'
];

export function CVDatabaseModule({ onSelectProfile, selectable = false }: CVDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<CVSearchCriteria>({});
  const [cvs, setCvs] = useState<CVProfile[]>(MOCK_CVS);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDest, setSelectedDest] = useState('all');
  const [skillMatchMode, setSkillMatchMode] = useState(false);

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    setLoading(true);
    try {
      // Production: fetch from API
      const res = await fetch('/api/cvs');
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCvs(data.data);
      }
    } catch {
      // Use mock data if API unavailable
      setCvs(MOCK_CVS);
    } finally {
      setLoading(false);
    }
  };

  const filteredCVs = cvs.filter(cv => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        (cv.employeeName || '').toLowerCase().includes(q) ||
        (cv.role || '').toLowerCase().includes(q) ||
        (cv.employeeId || '').toLowerCase().includes(q) ||
        (cv.skills && cv.skills.some(s => s.toLowerCase().includes(q)));
      if (!matches) return false;
    }

    if (selectedRole !== 'all' && cv.role !== selectedRole) return false;
    if (selectedDest !== 'all' && cv.destination !== selectedDest) return false;

    if (filters.skills && filters.skills.length > 0) {
      const hasAllSkills = filters.skills.every(s => cv.skills?.includes(s));
      if (!hasAllSkills) return false;
    }

    if (filters.language && cv.language !== filters.language) return false;

    return true;
  });

  const uniqueRoles = Array.from(new Set(cvs.map(c => c.role).filter(Boolean)));
  const uniqueDests = Array.from(new Set(cvs.map(c => c.destination).filter(Boolean)));

  const getMatchScoreColor = (score?: number) => {
    if (!score) return 'bg-slate-100 text-slate-600';
    if (score >= 90) return 'bg-green-100 text-green-700';
    if (score >= 75) return 'bg-blue-100 text-blue-700';
    if (score >= 60) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-ink">CV Database</h3>
          <p className="text-sm text-slate-500 mt-1">
            {cvs.length} profiles available{filteredCVs.length !== cvs.length && ` • ${filteredCVs.length} matching filters`}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setSkillMatchMode(!skillMatchMode)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium border transition-all ${
              skillMatchMode
                ? 'bg-purple-600 text-white border-purple-600'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-4 w-4" />
            {skillMatchMode ? 'Skill Matching ON' : 'Skill Matching'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, role, employee ID, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2">
        {skillMatchMode && cvs.length > 0 && (
          <>
            <span className="text-xs font-medium text-slate-500 my-1">Quick Skills:</span>
            {SKILLS_LIST.slice(0, 12).map(skill => (
              <button
                key={skill}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  skills: prev.skills?.includes(skill)
                    ? prev.skills.filter(s => s !== skill)
                    : [...(prev.skills || []), skill]
                }))}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  filters.skills?.includes(skill)
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Destination</label>
              <select
                value={selectedDest}
                onChange={(e) => setSelectedDest(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="all">All Destinations</option>
                {uniqueDests.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Language</label>
              <select
                value={filters.language || 'all'}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value === 'all' ? undefined : e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="all">All Languages</option>
                <option value="EN">English</option>
                <option value="AM">Amharic</option>
                <option value="OM">Oromo</option>
                <option value="AR">Arabic</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-slate-500">
        Showing <span className="font-bold">{filteredCVs.length}</span> of{' '}
        <span className="font-bold">{cvs.length}</span> profiles
      </p>

      {/* CV Cards */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
        </div>
      ) : filteredCVs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <UserPlus className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No CV profiles found</p>
          <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCVs.map(cv => (
            <div
              key={cv.id}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                cv.matchScore && cv.matchScore >= 90 ? 'ring-2 ring-green-200' : ''
              }`}
              onClick={() => onSelectProfile?.(cv)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    cv.matchScore && cv.matchScore >= 90 ? 'bg-green-600' :
                    cv.matchScore && cv.matchScore >= 75 ? 'bg-blue-600' :
                    'bg-brand-600'
                  }`}>
                    {(cv.employeeName || '?').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-ink text-sm">{cv.employeeName}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{cv.role}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{cv.destination}</span>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{cv.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {cv.matchScore !== undefined && (
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${getMatchScoreColor(cv.matchScore)}`}>
                      {cv.matchScore}% Match
                    </span>
                  )}
                  <p className="text-xs text-slate-400 mt-1">{cv.language} • {cv.template}</p>
                  <p className="text-xs text-slate-400">{new Date(cv.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Skills */}
              {cv.skills && cv.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {cv.skills.map(skill => (
                    <span
                      key={skill}
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        filters.skills?.includes(skill)
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                {cv.status === 'generated' && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Generated
                  </span>
                )}
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-slate-500">Education: {cv.education || 'N/A'}</span>
                <span className="text-slate-400 mx-2">•</span>
                <span className="text-slate-500">Languages: {cv.languages?.join(', ') || 'N/A'}</span>
                {selectable && (
                  <button className="ml-auto text-brand-600 hover:text-brand-800 text-sm font-medium">
                    Select →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}