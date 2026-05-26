'use client';

import { useState, useEffect } from 'react';
import { FileCheck2, Upload, Eye, Download, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface Document {
  id: string;
  employeeId: string;
  type: string;
  filePath: string;
  status: string;
  expiresAt?: string;
  createdAt: string;
}

export function DocumentManagementModule() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, statusFilter, typeFilter]);

  const fetchDocuments = async () => {
    const mockDocs: Document[] = [
      {
        id: '1',
        employeeId: 'emp1',
        type: 'PASSPORT',
        filePath: '/docs/passport-1.pdf',
        status: 'VERIFIED',
        expiresAt: '2028-12-31',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        employeeId: 'emp2',
        type: 'VISA',
        filePath: '/docs/visa-2.pdf',
        status: 'PENDING',
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        employeeId: 'emp3',
        type: 'MEDICAL',
        filePath: '/docs/medical-3.pdf',
        status: 'VERIFIED',
        createdAt: '2024-01-25'
      }
    ];

    try {
      const res = await fetch('/api/documents');
      const payload = await res.json();

      if (res.ok && payload?.success && Array.isArray(payload.data)) {
        setDocuments(
          payload.data.map((doc: any) => ({
            id: String(doc.id),
            employeeId: String(doc.employeeId ?? ''),
            type: String(doc.type ?? 'OTHER'),
            filePath: String(doc.filePath ?? doc.file_path ?? ''),
            status: String(doc.status ?? 'PENDING'),
            expiresAt: doc.expiresAt ?? undefined,
            createdAt: doc.createdAt ?? new Date().toISOString()
          }))
        );
        return;
      }

      setDocuments(mockDocs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments(mockDocs);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }

    setFilteredDocuments(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileCheck2 className="h-5 w-5 text-slate-500" />;
    }
  };

  const documentTypes = ['PASSPORT', 'VISA', 'MOLS', 'MEDICAL', 'PHOTO', 'CONTRACT', 'OTHER'];
  const documentStatuses = ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-ink">Document Management</h2>
        <p className="mt-2 text-slate-600">
          Manage {filteredDocuments.length} documents. Track visa, MOLS, passport, medical records, and verify completeness.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Documents</p>
          <p className="mt-2 text-2xl font-bold text-ink">{documents.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Verified</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {documents.filter((d) => d.status === 'VERIFIED').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {documents.filter((d) => d.status === 'PENDING').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {documents.filter((d) => d.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Types</option>
          {documentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          {documentStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <button className="flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-ink">Document Type</th>
              <th className="px-6 py-3 font-semibold text-ink">File Path</th>
              <th className="px-6 py-3 font-semibold text-ink">Status</th>
              <th className="px-6 py-3 font-semibold text-ink">Expires</th>
              <th className="px-6 py-3 font-semibold text-ink">Uploaded</th>
              <th className="px-6 py-3 font-semibold text-ink">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Loading documents...
                </td>
              </tr>
            ) : filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No documents found
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium text-ink">{doc.type}</td>
                  <td className="px-6 py-3 text-slate-600">{doc.filePath}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm font-medium">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-slate-100 rounded" title="View">
                        <Eye className="h-4 w-4 text-slate-600" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded" title="Download">
                        <Download className="h-4 w-4 text-slate-600" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 rounded" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
