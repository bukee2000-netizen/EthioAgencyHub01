'use client';

import { useState, useEffect } from 'react';
import { FileCheck2, Upload, Eye, Download, Trash2, CheckCircle2, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

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
  const { addToast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
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

        setDocuments([]);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
        addToast({ title: 'Error', description: 'Failed to fetch documents. Please try again.', type: 'error' });
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [addToast]);

  useEffect(() => {
    let filtered = documents;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter((doc) => doc.type === typeFilter);
    }
    setFilteredDocuments(filtered);
  }, [documents, statusFilter, typeFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileCheck2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />;
    }
  };

  const documentTypes = ['PASSPORT', 'VISA', 'MOLS', 'MEDICAL', 'PHOTO', 'CONTRACT', 'OTHER'];
  const documentStatuses = ['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED'];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Document Management</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Total Documents</p>
          <p className="mt-2 text-2xl font-bold text-ink dark:text-ink-dark">{documents.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Verified</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {documents.filter((d) => d.status === 'VERIFIED').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Pending Review</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {documents.filter((d) => d.status === 'PENDING').length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {documents.filter((d) => d.status === 'REJECTED').length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:border-brand-600 focus:outline-none"
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
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:border-brand-600 focus:outline-none"
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

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">Document Type</th>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">File Path</th>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">Status</th>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">Expires</th>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">Uploaded</th>
              <th className="px-6 py-3 font-semibold text-ink dark:text-ink-dark">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" />Loading documents...
                </td>
              </tr>
            ) : filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No documents found
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-6 py-3 font-medium text-ink dark:text-ink-dark">{doc.type}</td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{doc.filePath}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm font-medium">{doc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-600 dark:text-slate-300">
                    {doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="View">
                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Download">
                        <Download className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Delete">
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
