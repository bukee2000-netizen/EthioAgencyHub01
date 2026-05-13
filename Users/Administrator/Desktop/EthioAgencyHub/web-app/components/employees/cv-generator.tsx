'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Download, Share2, ChevronDown, ChevronUp, Printer, Eye, Copy } from 'lucide-react';
import type { Employee, GeneratedCv } from '@prisma/client';

interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const CV_TEMPLATES: CVTemplate[] = [
  { id: 'standard', name: 'Standard', description: 'Clean, professional layout', preview: 'standard-preview' },
  { id: 'professional', name: 'Professional', description: 'Executive-style format', preview: 'professional-preview' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design', preview: 'modern-preview' },
  { id: 'classic', name: 'Classic', description: 'Traditional format', preview: 'classic-preview' },
];

const CV_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'om', name: 'Oromiffa' },
  { code: 'ar', name: 'العربية' },
];

interface CVGeneratorProps {
  employeeId?: string;
  onGenerate?: (cvId: string) => void;
}

export const CvGenerator = CVGeneratorModule;

export function CVGeneratorModule({ employeeId, onGenerate }: CVGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<GeneratedCv | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  const loadEmployeeData = async () => {
    try {
      const res = await fetch(`/api/employees/${employeeId}`);
      const data = await res.json();
      if (data.success) setEmployeeData(data.data);
    } catch (error) {
      console.error('Failed to load employee:', error);
    }
  };

  const generatePreview = () => {
    if (!employeeData) return null;

    const name = `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim() || employeeData.name;
    const dob = employeeData.dateOfBirth
      ? new Date(employeeData.dateOfBirth).toLocaleDateString(selectedLanguage === 'am' ? 'am-ET' : 'en-US')
      : 'N/A';

    const passportPhotoUrl = employeeData.passportSizePhotoPath
      ? `/api/telegram/photo/${employeeData.passportSizePhotoPath}`
      : null;
    const fullBodyPhotoUrl = employeeData.fullBodyPhotoPath
      ? `/api/telegram/photo/${employeeData.fullBodyPhotoPath}`
      : null;

    return (
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-2xl mx-auto" ref={previewRef}>
        <div className="border-b-4 border-brand-600 pb-4 mb-6 flex items-start gap-6">
          {passportPhotoUrl && (
            <img
              src={passportPhotoUrl}
              alt="Passport"
              className="h-24 w-24 rounded-full border-2 border-brand-200 object-cover flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ink tracking-tight">{name}</h1>
            <p className="text-slate-500 text-sm mt-1">
              {employeeData.role || employeeData.destination
                ? `${employeeData.role || ''}${employeeData.destination ? ` → ${employeeData.destination}` : ''}`
                : 'Professional CV'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <section>
            <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
              {selectedLanguage === 'am' ? 'የግል መግለጫ' :
                selectedLanguage === 'om' ? 'Gosoota Biyyee' :
                selectedLanguage === 'ar' ? 'البيانات الشخصية' : 'Personal Information'}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'ስም' : 'Name'}:</span> {name}</p>
              <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'የምዝራኝ ቀን' : 'DOB'}:</span> {dob}</p>
              {employeeData.gender && <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'ጾታ' : 'Gender'}:</span> {employeeData.gender}</p>}
              {employeeData.nationality && <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'ሕዝብ' : 'Nationality'}:</span> {employeeData.nationality}</p>}
              {employeeData.region && <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'ክልል' : 'Region'}:</span> {employeeData.region}</p>}
              {employeeData.contactPhone && <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'ስልክ' : 'Phone'}:</span> {employeeData.contactPhone}</p>}
              {employeeData.passportNumber && <p><span className="text-slate-500">{selectedLanguage === 'am' ? 'የፀሐው ቁጥር' : 'Passport'}:</span> {employeeData.passportNumber}</p>}
            </div>
          </section>

          {employeeData.education && (
            <section>
              <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
                {selectedLanguage === 'am' ? 'ልምምድ' :
                  selectedLanguage === 'om' ? 'Barreessaa' :
                  selectedLanguage === 'ar' ? 'التعليم' : 'Education'}
              </h2>
              <p className="text-sm">{employeeData.education}</p>
            </section>
          )}

          {employeeData.role && (
            <section>
              <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
                {selectedLanguage === 'am' ? 'ብሔራዊ ባለመድረክ' :
                  selectedLanguage === 'om' ? 'Kajjii' :
                  selectedLanguage === 'ar' ? 'الخبرة' : 'Experience & Role'}
              </h2>
              <p className="text-sm">{employeeData.role}</p>
              {employeeData.experience && <p className="text-sm text-slate-600">{employeeData.experience}</p>}
              {employeeData.destination && <p className="text-sm text-slate-600">{selectedLanguage === 'am' ? 'መወለኝ' : 'Destination'}: {employeeData.destination}</p>}
            </section>
          )}

          {employeeData.languages && (
            <section>
              <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
                {selectedLanguage === 'am' ? 'ቋንቋዎች' :
                  selectedLanguage === 'om' ? 'Afaanolee' :
                  selectedLanguage === 'ar' ? 'اللغات' : 'Languages'}
              </h2>
              <p className="text-sm">
                {(() => { try { return JSON.parse(employeeData.languages).join(', '); } catch { return employeeData.languages; } })()}
              </p>
            </section>
          )}

          {employeeData.emergencyContact && (
            <section>
              <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
                {selectedLanguage === 'am' ? 'የእርስዎ ተቃራኒ' :
                  selectedLanguage === 'om' ? 'Hanga Isinii' :
                  selectedLanguage === 'ar' ? 'طوارئ' : 'Emergency Contact'}
              </h2>
              <p className="text-sm">{employeeData.emergencyContact} - {employeeData.emergencyPhone || 'N/A'}</p>
            </section>
          )}

          {fullBodyPhotoUrl && (
            <section>
              <h2 className="text-lg font-bold text-brand-700 border-b border-slate-200 pb-1 mb-2">
                {selectedLanguage === 'am' ? 'ሙሉ ፎቶ' :
                  selectedLanguage === 'om' ? 'Fakkura Guutuu' :
                  selectedLanguage === 'ar' ? 'صورة كاملة' : 'Full Photo'}
              </h2>
              <div className="flex justify-center">
                <img
                  src={fullBodyPhotoUrl}
                  alt="Full body"
                  className="h-48 w-auto rounded-lg border border-slate-200 object-cover shadow-sm"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </section>
          )}
        </div>

        <div className="mt-8 pt-4 border-t text-xs text-slate-400 flex justify-between">
          <span>Generated by Ethio Agency Hub</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>
    );
  };

  const handleGenerate = async () => {
    if (!employeeId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          template: selectedTemplate,
          language: selectedLanguage,
          htmlContent: previewRef.current?.innerHTML || ''
        })
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedCV(data.data);
        onGenerate?.(data.data.id);
      }
    } catch (error) {
      console.error('Failed to generate CV:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!previewRef.current) return;

    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF();
      const html = previewRef.current;
      if (!html) return;

      doc.html(html, {
        callback: (docInstance: any) => {
          docInstance.save(`CV-${employeeData?.name || 'unknown'}.pdf`);
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 800
      });
    });
  };

  const handleShare = async () => {
    if (!generatedCV) return;

    try {
      await fetch(`/api/cvs`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: generatedCV.id, sharedWith: 'all' })
      });
    } catch (error) {
      console.error('Failed to share CV:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Template & Language Selector */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">CV Template</label>
            <div className="grid grid-cols-2 gap-3">
              {CV_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id as any)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    selectedTemplate === t.id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-slate-200 hover:border-brand-300'
                  }`}
                >
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
            <div className="flex gap-2 flex-wrap">
              {CV_LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setSelectedLanguage(l.code as any)}
                  className={`rounded-xl px-4 py-2 border-2 text-sm font-medium transition-all ${
                    selectedLanguage === l.code
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 text-slate-600 hover:border-brand-300'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-ink">CV Preview</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium border border-slate-200 hover:bg-slate-50"
            >
              {showPreview ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              {showPreview ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <Download className="h-4 w-4" />
              PDF
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {showPreview && (
          <div className="p-6 bg-slate-50 min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
                <span className="ml-4 text-slate-600">Generating CV...</span>
              </div>
            ) : !employeeData ? (
              <p className="text-center text-slate-500 py-20">Select an employee to preview their CV</p>
            ) : (
              generatePreview()
            )}
          </div>
        )}
      </div>

      {/* Generate Action */}
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={loading || !employeeId}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          <FileText className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate & Save CV'}
        </button>
      </div>

      {/* Generated CVs History */}
      {generatedCV && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-ink">Recently Generated</h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-600" />
                <div>
                  <p className="font-medium text-sm">CV - {selectedTemplate} ({selectedLanguage.toUpperCase()})</p>
                  <p className="text-xs text-slate-500">{new Date(generatedCV.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-slate-100">
                  <Eye className="h-4 w-4 text-slate-500" />
                </button>
                <button className="p-2 rounded-lg hover:bg-slate-100">
                  <Download className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}