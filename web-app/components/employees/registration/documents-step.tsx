'use client';

import { Upload, Camera, FileText, CheckCircle2, Video, X, Loader2, AlertTriangle } from 'lucide-react';
import type { DocumentsData, PersonalData } from './types';

type DocumentsStepProps = {
  docs: DocumentsData;
  setDocs: React.Dispatch<React.SetStateAction<DocumentsData>>;
  personal: PersonalData;
  uploadingPassport: boolean;
  setUploadingPassport: React.Dispatch<React.SetStateAction<boolean>>;
  uploadingBody: boolean;
  setUploadingBody: React.Dispatch<React.SetStateAction<boolean>>;
  uploadingPDF: boolean;
  uploadError: string | null;
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>;
  handlePDFUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  showInterviewModal: boolean;
  setShowInterviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  interviewUploading: boolean;
  setInterviewUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function DocumentsStep({
  docs,
  setDocs,
  personal,
  uploadingPassport,
  setUploadingPassport,
  uploadingBody,
  setUploadingBody,
  uploadingPDF,
  uploadError,
  setUploadError,
  handlePDFUpload,
  showInterviewModal,
  setShowInterviewModal,
  interviewUploading,
  setInterviewUploading,
}: DocumentsStepProps) {
  const uploadingFiles = uploadingPassport || uploadingBody || uploadingPDF;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 mb-4">
        <p className="text-xs text-brand-700 flex items-center gap-2">
          <Upload className="h-3.5 w-3.5" />
          Photos and documents are stored securely via Telegram bot. JPG, PNG, PDF accepted.
        </p>
      </div>

      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Passport Size Photo</h5>
        {docs.passportSizePhoto ? (
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white dark:bg-slate-800">
              <img src={`/api/telegram/photo/${docs.passportSizePhoto}`} alt="Passport size" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800">Uploaded</p>
              <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
            </div>
            <button type="button" onClick={() => setDocs({ ...docs, passportSizePhoto: '' })} className="flex-shrink-0 text-slate-400 dark:text-slate-500 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-brand-50/30'}`}>
            {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{uploadingFiles ? 'Uploading...' : 'Upload Passport Size Photo'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Click to select or drag & drop</p>
            </div>
            <input type="file" className="hidden" accept="image/*" disabled={uploadingFiles} onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              setUploadingPassport(true); setUploadError(null);
              try {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('photoType', 'passport-size');
                fd.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim() || 'Unknown');
                const res = await fetch('/api/telegram/photo', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success && data.data?.fileId) setDocs(d => ({ ...d, passportSizePhoto: data.data.fileId }));
                else setUploadError(data.error?.message || 'Upload failed');
              } catch { setUploadError('Upload failed'); }
              finally { setUploadingPassport(false); }
            }} />
          </label>
        )}
      </div>

      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Body Photo</h5>
        {docs.fullBodyPhoto ? (
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white dark:bg-slate-800">
              <img src={`/api/telegram/photo/${docs.fullBodyPhoto}`} alt="Full body" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-800">Uploaded</p>
              <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
            </div>
            <button type="button" onClick={() => setDocs({ ...docs, fullBodyPhoto: '' })} className="flex-shrink-0 text-slate-400 dark:text-slate-500 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-brand-50/30'}`}>
            {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{uploadingFiles ? 'Uploading...' : 'Upload Full Body Photo'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Click to select or drag & drop</p>
            </div>
            <input type="file" className="hidden" accept="image/*" disabled={uploadingFiles} onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              setUploadingBody(true); setUploadError(null);
              try {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('photoType', 'full-body');
                fd.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim() || 'Unknown');
                const res = await fetch('/api/telegram/photo', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.success && data.data?.fileId) setDocs(d => ({ ...d, fullBodyPhoto: data.data.fileId }));
                else setUploadError(data.error?.message || 'Upload failed');
              } catch { setUploadError('Upload failed'); }
              finally { setUploadingBody(false); }
            }} />
          </label>
        )}
      </div>

      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Documents & Certificates</h5>
        {docs.pdfDocuments.length > 0 && (
          <div className="space-y-2 mb-3">
            {docs.pdfDocuments.map((docId, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-800">Document {index + 1}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setDocs(prev => ({ 
                    ...prev, 
                    pdfDocuments: prev.pdfDocuments.filter(id => id !== docId)
                  }))}
                  className="text-slate-400 dark:text-slate-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-brand-50/30'}`}>
          {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{uploadingFiles ? 'Uploading...' : 'Upload PDF/Documents'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Click to select or drag & drop (PDF, DOC, DOCX)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.doc,.docx" 
            disabled={uploadingFiles}
            onChange={handlePDFUpload}
          />
        </label>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Interview Video</h5>
        {docs.tgVideoId ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
            <div className="flex-1"><p className="text-sm font-semibold text-emerald-800">Uploaded</p><p className="text-xs text-emerald-700">Stored via Telegram</p></div>
            <button onClick={() => setDocs({ ...docs, tgVideoId: '' })} className="text-slate-400 dark:text-slate-500 hover:text-red-500"><X className="h-4 w-4" /></button>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => setShowInterviewModal(true)} className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 bg-white dark:bg-slate-800 p-3 hover:bg-purple-50">
              <Video className="h-5 w-5 text-purple-500" /><span className="text-sm font-semibold text-purple-700">Record via Telegram</span>
            </button>
            <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
              <Upload className="h-5 w-5 text-slate-400 dark:text-slate-500" /><span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Upload Video</span>
              <input type="file" className="hidden" accept="video/*" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setInterviewUploading(true);
                try {
                  const fd = new FormData();
                  fd.append('video', file);
                  fd.append('employeeName', `${personal.firstName} ${personal.lastName}`);
                  const res = await fetch('/api/telegram/interview', { method: 'POST', body: fd });
                  const data = await res.json();
                  if (data.success && data.data?.fileId) setDocs(d => ({ ...d, tgVideoId: data.data.fileId }));
                } catch { setUploadError('Failed to upload interview video'); } finally { setInterviewUploading(false); }
              }} />
            </label>
          </div>
        )}
        {interviewUploading && <div className="flex items-center gap-2 text-sm text-purple-700 mt-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading to Telegram...</div>}
      </div>

      {uploadError && <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"><AlertTriangle className="h-4 w-4" />{uploadError}<button onClick={() => setUploadError(null)} className="ml-auto text-red-400"><X className="h-4 w-4" /></button></div>}
    </div>
  );
}
