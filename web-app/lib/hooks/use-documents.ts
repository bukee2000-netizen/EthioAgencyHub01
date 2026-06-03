'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DocumentRecord {
  id: string;
  employeeId: string;
  type: string;
  filePath: string;
  status: string;
  expiresAt?: string;
  createdAt: string;
}

export interface DocumentStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  processing: number;
}

interface UseDocumentsReturn {
  documents: DocumentRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setDocuments(data.data.map((doc: any) => ({
          id: String(doc.id),
          employeeId: String(doc.employeeId ?? ''),
          type: String(doc.type ?? 'OTHER'),
          filePath: String(doc.filePath ?? doc.file_path ?? ''),
          status: String(doc.status ?? 'PENDING'),
          expiresAt: doc.expiresAt ?? undefined,
          createdAt: doc.createdAt ?? new Date().toISOString()
        })));
      } else {
        setDocuments([]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(msg);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  return { documents, loading, error, refetch: fetchDocuments };
}

export function useDocumentStats(): { stats: DocumentStats; loading: boolean } {
  const { documents, loading } = useDocuments();

  const stats: DocumentStats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'PENDING').length,
    verified: documents.filter(d => d.status === 'VERIFIED' || d.status === 'APPROVED').length,
    rejected: documents.filter(d => d.status === 'REJECTED').length,
    processing: documents.filter(d => d.status === 'PROCESSING' || d.status === 'REVIEW').length,
  };

  return { stats, loading };
}
