'use client';

import { DocumentsUpload } from '@/components/documents/documents-upload';
import { ArrowUp } from 'lucide-react';

export default function UploadDocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-brand-50/30 to-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-ink">Document Upload</h1>
        <p className="mt-2 text-slate-600 max-w-xl">Upload employee documents into the Teledrive-backed archive. Video files route automatically to Telegram.</p>
      </div>
      <DocumentsUpload />
    </div>
  );
}
