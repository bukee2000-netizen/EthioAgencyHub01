'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, CheckCircle2, AlertCircle, Clock, Upload, Search,
  Filter, ChevronRight, Download, Eye, X, Plus
} from 'lucide-react';

interface Document {
  id: string;
  pilgrimId: string;
  pilgrimName: string;
  type: 'passport' | 'visa' | 'health_certificate' | 'vaccination' | 'insurance' | 'consent' | 'photo' | 'other';
  fileName: string;
  status: 'uploaded' | 'pending' | 'under_review' | 'verified' | 'rejected';
  uploadDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  expiryDate?: string;
  notes?: string;
  fileSize?: string;
}

export function HajjUmrahDocumentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const documents: Document[] = [
    { id: 'DOC-001', pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', type: 'passport', fileName: 'passport_ahmed_hassan.pdf', status: 'verified', uploadDate: '2024-01-15', verifiedDate: '2024-01-16', verifiedBy: 'Admin User', expiryDate: '2028-12-15', fileSize: '2.4 MB' },
    { id: 'DOC-002', pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', type: 'visa', fileName: 'visa_ahmed_hassan.pdf', status: 'verified', uploadDate: '2024-02-01', verifiedDate: '2024-02-02', verifiedBy: 'Admin User', fileSize: '1.8 MB' },
    { id: 'DOC-003', pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', type: 'health_certificate', fileName: 'health_ahmed_hassan.pdf', status: 'verified', uploadDate: '2024-02-10', verifiedDate: '2024-02-11', verifiedBy: 'Dr. Mekonnen', fileSize: '1.2 MB' },
    { id: 'DOC-004', pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', type: 'vaccination', fileName: 'vaccine_ahmed_hassan.pdf', status: 'verified', uploadDate: '2024-01-20', verifiedDate: '2024-01-21', verifiedBy: 'Nurse', fileSize: '0.8 MB' },
    { id: 'DOC-005', pilgrimId: 'P001', pilgrimName: 'Ahmed Hassan Mohammed', type: 'insurance', fileName: 'insurance_ahmed_hassan.pdf', status: 'verified', uploadDate: '2024-01-25', verifiedDate: '2024-01-26', verifiedBy: 'Admin User', fileSize: '0.5 MB' },
    { id: 'DOC-006', pilgrimId: 'P002', pilgrimName: 'Fatima Ibrahim Ali', type: 'passport', fileName: 'passport_fatima_ibrahim.pdf', status: 'verified', uploadDate: '2024-01-20', verifiedDate: '2024-01-21', verifiedBy: 'Admin User', expiryDate: '2029-03-20', fileSize: '2.1 MB' },
    { id: 'DOC-007', pilgrimId: 'P002', pilgrimName: 'Fatima Ibrahim Ali', type: 'visa', fileName: 'visa_fatima_ibrahim.pdf', status: 'under_review', uploadDate: '2024-02-15', fileSize: '1.5 MB' },
    { id: 'DOC-008', pilgrimId: 'P002', pilgrimName: 'Fatima Ibrahim Ali', type: 'health_certificate', fileName: 'health_fatima_ibrahim.pdf', status: 'verified', uploadDate: '2024-02-20', verifiedDate: '2024-02-21', verifiedBy: 'Dr. Tigist', fileSize: '1.1 MB' },
    { id: 'DOC-009', pilgrimId: 'P003', pilgrimName: 'Ibrahim Mohamed Tessema', type: 'passport', fileName: 'passport_ibrahim_mohamed.pdf', status: 'verified', uploadDate: '2024-01-25', verifiedDate: '2024-01-26', verifiedBy: 'Admin User', expiryDate: '2027-11-10', fileSize: '2.3 MB' },
    { id: 'DOC-010', pilgrimId: 'P003', pilgrimName: 'Ibrahim Mohamed Tessema', type: 'visa', fileName: 'visa_ibrahim_mohamed.pdf', status: 'pending', uploadDate: '', fileSize: '' },
    { id: 'DOC-011', pilgrimId: 'P003', pilgrimName: 'Ibrahim Mohamed Tessema', type: 'health_certificate', fileName: 'health_ibrahim_mohamed.pdf', status: 'verified', uploadDate: '2024-01-30', verifiedDate: '2024-01-31', verifiedBy: 'Dr. Solomon', fileSize: '1.0 MB' },
    { id: 'DOC-012', pilgrimId: 'P004', pilgrimName: 'Amina Ahmed Seid', type: 'passport', fileName: 'passport_amina_ahmed.pdf', status: 'verified', uploadDate: '2024-02-01', verifiedDate: '2024-02-02', verifiedBy: 'Admin User', expiryDate: '2028-08-05', fileSize: '2.0 MB' },
    { id: 'DOC-013', pilgrimId: 'P004', pilgrimName: 'Amina Ahmed Seid', type: 'health_certificate', fileName: 'health_amina_ahmed.pdf', status: 'rejected', uploadDate: '2024-02-20', verifiedDate: '2024-02-21', verifiedBy: 'Dr. Genet', notes: 'Missing doctor signature', fileSize: '0.9 MB' },
  ];

  const filteredDocuments = documents.filter(doc => {
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false;
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false;
    if (searchQuery && !doc.pilgrimName.toLowerCase().includes(searchQuery.toLowerCase()) && !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      uploaded: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      under_review: 'bg-purple-100 text-purple-700',
      verified: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      passport: 'Passport',
      visa: 'Visa',
      health_certificate: 'Health Certificate',
      vaccination: 'Vaccination',
      insurance: 'Insurance',
      consent: 'Consent Form',
      photo: 'Photo',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      passport: 'ðŸ“˜',
      visa: 'ðŸ›‚',
      health_certificate: 'ðŸ¥',
      vaccination: 'ðŸ’‰',
      insurance: 'ðŸ›¡ï¸',
      consent: 'ðŸ“',
      photo: 'ðŸ“¸',
      other: 'ðŸ“„',
    };
    return icons[type] || 'ðŸ“„';
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending' || d.status === 'uploaded').length;
  const reviewCount = documents.filter(d => d.status === 'under_review').length;
  const rejectedCount = documents.filter(d => d.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ink dark:text-ink-dark flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-600" />
              Documentation Tracking
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/hajj-umrah" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-800">{verifiedCount}</p>
          <p className="text-sm font-medium text-green-700 mt-1">Verified</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-800">{pendingCount}</p>
          <p className="text-sm font-medium text-yellow-700 mt-1">Pending</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-800">{reviewCount}</p>
          <p className="text-sm font-medium text-purple-700 mt-1">Under Review</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-800">{rejectedCount}</p>
          <p className="text-sm font-medium text-red-700 mt-1">Rejected</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Upload className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-800">{documents.length}</p>
          <p className="text-sm font-medium text-blue-700 mt-1">Total Docs</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
        <button className="flex items-center gap-2 rounded-xl border border-blue-200 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="passport">Passport</option>
          <option value="visa">Visa</option>
          <option value="health_certificate">Health Certificate</option>
          <option value="vaccination">Vaccination</option>
          <option value="insurance">Insurance</option>
          <option value="consent">Consent Form</option>
          <option value="photo">Photo</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="uploaded">Uploaded</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Documents Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink dark:text-ink-dark">All Documents</h3>
          <span className="text-sm text-slate-500 dark:text-slate-400">{filteredDocuments.length} documents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Document</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Pilgrim</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">File</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Upload Date</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-3">
                    <span className="text-lg">{getTypeIcon(doc.type)}</span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-ink dark:text-ink-dark">{doc.pilgrimName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{doc.pilgrimId}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span className="text-slate-600 dark:text-slate-300">{getTypeLabel(doc.type)}</span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-mono text-xs text-slate-600 dark:text-slate-300 max-w-[150px] truncate">{doc.fileName}</p>
                    {doc.fileSize && <p className="text-xs text-slate-400">{doc.fileSize}</p>}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(doc.status)}`}>
                      {doc.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="text-slate-600 dark:text-slate-300">{doc.uploadDate || '-'}</p>
                    {doc.verifiedDate && (
                      <p className="text-xs text-green-600">Verified: {doc.verifiedDate}</p>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="View">
                        <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" title="Download">
                        <Download className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      </button>
                      {doc.status === 'rejected' && doc.notes && (
                        <span className="text-xs text-red-600 ml-2" title={doc.notes}>!</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document by Type Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">ðŸ“˜</span>
            <div>
              <p className="font-semibold text-ink dark:text-ink-dark">Passport</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{documents.filter(d => d.type === 'passport').length} documents</p>
            </div>
          </div>
          <div className="text-sm text-green-600">
            {documents.filter(d => d.type === 'passport' && d.status === 'verified').length} verified
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">ðŸ›‚</span>
            <div>
              <p className="font-semibold text-ink dark:text-ink-dark">Visa</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{documents.filter(d => d.type === 'visa').length} documents</p>
            </div>
          </div>
          <div className="text-sm text-yellow-600">
            {documents.filter(d => d.type === 'visa' && (d.status === 'pending' || d.status === 'under_review')).length} pending
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">ðŸ¥</span>
            <div>
              <p className="font-semibold text-ink dark:text-ink-dark">Health Cert</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{documents.filter(d => d.type === 'health_certificate').length} documents</p>
            </div>
          </div>
          <div className="text-sm text-green-600">
            {documents.filter(d => d.type === 'health_certificate' && d.status === 'verified').length} verified
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">ðŸ’‰</span>
            <div>
              <p className="font-semibold text-ink dark:text-ink-dark">Vaccination</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{documents.filter(d => d.type === 'vaccination').length} documents</p>
            </div>
          </div>
          <div className="text-sm text-green-600">
            {documents.filter(d => d.type === 'vaccination' && d.status === 'verified').length} verified
          </div>
        </div>
      </div>
    </div>
  );
}