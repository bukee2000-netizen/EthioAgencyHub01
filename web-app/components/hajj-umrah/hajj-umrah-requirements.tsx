'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, CheckCircle2, AlertCircle, FileText, Users, Calendar,
  Activity, Heart, ChevronRight, Search, Filter, Clock, X
} from 'lucide-react';

interface Requirement {
  id: string;
  name: string;
  category: 'document' | 'medical' | 'financial' | 'training';
  mandatory: boolean;
  description: string;
  deadline?: string;
  compliance: {
    hajj: number;
    umrah: number;
    total: number;
  };
  notes?: string;
}

interface PilgrimRequirement {
  pilgrimId: string;
  pilgrimName: string;
  requirements: {
    requirementId: string;
    status: 'complete' | 'pending' | 'missing';
    verifiedAt?: string;
    verifiedBy?: string;
    notes?: string;
  }[];
}

export function HajjUmrahRequirements() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const requirements: Requirement[] = [
    { id: 'REQ-001', name: 'Valid Passport', category: 'document', mandatory: true, description: 'Must be valid for at least 6 months from travel date', deadline: '2026-06-01', compliance: { hajj: 98, umrah: 96, total: 342 } },
    { id: 'REQ-002', name: 'Visa Permit', category: 'document', mandatory: true, description: 'Saudi Arabia visa for Hajj or Umrah', deadline: '2026-06-15', compliance: { hajj: 85, umrah: 78, total: 278 } },
    { id: 'REQ-003', name: 'Health Certificate', category: 'medical', mandatory: true, description: 'Official health clearance from Ministry of Health', deadline: '2026-06-10', compliance: { hajj: 92, umrah: 88, total: 312 } },
    { id: 'REQ-004', name: 'Meningitis Vaccination', category: 'medical', mandatory: true, description: 'Meningococcal vaccination certificate (within last 3 years)', deadline: '2026-05-20', compliance: { hajj: 89, umrah: 91, total: 298 } },
    { id: 'REQ-005', name: 'COVID-19 Vaccination', category: 'medical', mandatory: false, description: 'Complete COVID-19 vaccination recommended', deadline: '2026-05-15', compliance: { hajj: 75, umrah: 82, total: 265 } },
    { id: 'REQ-006', name: 'Travel Insurance', category: 'document', mandatory: true, description: 'International travel and health insurance', deadline: '2026-06-01', compliance: { hajj: 92, umrah: 90, total: 308 } },
    { id: 'REQ-007', name: 'Financial Clearance', category: 'financial', mandatory: true, description: 'Proof of payment for all fees', deadline: '2026-06-01', compliance: { hajj: 88, umrah: 85, total: 286 } },
    { id: 'REQ-008', name: 'Consent Form', category: 'document', mandatory: true, description: 'Signed pilgrimage consent and waiver', deadline: '2026-05-25', compliance: { hajj: 95, umrah: 92, total: 318 } },
    { id: 'REQ-009', name: 'Religious Training', category: 'training', mandatory: false, description: 'Basic Hajj/Umrah training certification', deadline: '2026-05-30', compliance: { hajj: 68, umrah: 72, total: 234 } },
    { id: 'REQ-010', name: 'Group Registration', category: 'document', mandatory: true, description: 'Must be registered with authorized travel group', deadline: '2026-04-30', compliance: { hajj: 100, umrah: 100, total: 342 } },
  ];

  const pilgrimRequirements: PilgrimRequirement[] = [
    { pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', requirements: [{ requirementId: 'REQ-001', status: 'complete', verifiedAt: '2024-01-15', verifiedBy: 'Admin' }, { requirementId: 'REQ-002', status: 'complete', verifiedAt: '2024-02-01', verifiedBy: 'Admin' }, { requirementId: 'REQ-003', status: 'complete', verifiedAt: '2024-02-10', verifiedBy: 'Dr. Mekonnen' }, { requirementId: 'REQ-004', status: 'complete', verifiedAt: '2024-01-20', verifiedBy: 'Nurse' }] },
    { pilgrimId: 'P002', pilgrimName: 'Fatima Ibrahim Ali', requirements: [{ requirementId: 'REQ-001', status: 'complete', verifiedAt: '2024-01-20', verifiedBy: 'Admin' }, { requirementId: 'REQ-002', status: 'pending' }, { requirementId: 'REQ-003', status: 'complete', verifiedAt: '2024-02-15', verifiedBy: 'Dr. Tigist' }, { requirementId: 'REQ-004', status: 'complete', verifiedAt: '2024-01-25', verifiedBy: 'Nurse' }] },
    { pilgrimId: 'P003', pilgrimName: 'Ibrahim Mohamed Tessema', requirements: [{ requirementId: 'REQ-001', status: 'complete', verifiedAt: '2024-01-25', verifiedBy: 'Admin' }, { requirementId: 'REQ-002', status: 'missing' }, { requirementId: 'REQ-003', status: 'complete', verifiedAt: '2024-02-05', verifiedBy: 'Dr. Solomon' }, { requirementId: 'REQ-004', status: 'complete', verifiedAt: '2024-01-30', verifiedBy: 'Nurse' }] },
  ];

  const filteredRequirements = requirements.filter(req => {
    if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;
    if (searchQuery && !req.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'document': return FileText;
      case 'medical': return Activity;
      case 'financial': return Shield;
      case 'training': return Heart;
      default: return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'document': return 'bg-blue-100 text-blue-600';
      case 'medical': return 'bg-green-100 text-green-600';
      case 'financial': return 'bg-amber-100 text-amber-600';
      case 'training': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const mandatoryCount = requirements.filter(r => r.mandatory).length;
  const optionalCount = requirements.filter(r => !r.mandatory).length;
  const avgCompliance = Math.round(requirements.reduce((sum, r) => sum + r.compliance.hajj, 0) / requirements.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              Requirements & Eligibility
            </h1>
            <p className="mt-2 text-slate-600">Check eligibility, health requirements, and documentation checklist for pilgrims</p>
          </div>
          <Link href="/hajj-umrah" className="flex items-center gap-2 text-green-600 hover:text-green-800">
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to Overview
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">{avgCompliance}%</p>
          <p className="text-sm font-medium text-green-700 mt-1">Avg Compliance</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-800">{mandatoryCount}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Mandatory</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Heart className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-800">{optionalCount}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Optional</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-800">15</p>
          <p className="text-sm font-medium text-amber-700 mt-1">Pending</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-800">3</p>
          <p className="text-sm font-medium text-red-700 mt-1">Missing</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search requirements..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-green-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="document">Documents</option>
          <option value="medical">Medical</option>
          <option value="financial">Financial</option>
          <option value="training">Training</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Requirements List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-ink">Requirements Checklist</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredRequirements.map((req) => {
              const Icon = getCategoryIcon(req.category);
              return (
                <div 
                  key={req.id} 
                  className={`p-4 hover:bg-slate-50 cursor-pointer ${selectedRequirement?.id === req.id ? 'bg-green-50' : ''}`}
                  onClick={() => setSelectedRequirement(req)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(req.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-ink">{req.name}</p>
                          {req.mandatory ? (
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">Mandatory</span>
                          ) : (
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{req.description}</p>
                        {req.deadline && (
                          <p className="text-xs text-slate-400 mt-1">Deadline: {req.deadline}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{req.compliance.total}</p>
                      <p className="text-xs text-slate-500">pilgrims</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-500">Hajj</span>
                        <span className="font-medium text-amber-700">{req.compliance.hajj}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${req.compliance.hajj}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-500">Umrah</span>
                        <span className="font-medium text-blue-700">{req.compliance.umrah}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${req.compliance.umrah}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requirement Details / Pilgrims with Issues */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-ink">Pilgrim Status</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {pilgrimRequirements.map((pr) => (
              <div key={pr.pilgrimId} className="p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-ink">{pr.pilgrimName}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    pr.requirements.some(r => r.status === 'missing') ? 'bg-red-100 text-red-700' :
                    pr.requirements.some(r => r.status === 'pending') ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {pr.requirements.some(r => r.status === 'missing') ? 'Missing' :
                     pr.requirements.some(r => r.status === 'pending') ? 'Pending' : 'Complete'}
                  </span>
                </div>
                <div className="flex gap-1 mt-2">
                  {pr.requirements.map((r, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 flex-1 rounded-full ${
                        r.status === 'complete' ? 'bg-green-500' :
                        r.status === 'pending' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      title={`${r.requirementId}: ${r.status}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-400 mt-1">{pr.requirements.length} requirements</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}