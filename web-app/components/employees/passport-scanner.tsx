'use client';

import { useState, useCallback, useRef } from 'react';
import {
  ScanLine, ChevronDown, ChevronUp, Upload, X, Check,
  Loader2, AlertTriangle, Camera, Zap, FileImage, Copy, Edit2, RefreshCw
} from 'lucide-react';
import { parsePassportData, mapPassportToFormFields } from '@/lib/utils/passport-parser';
import Tesseract from 'tesseract.js';
import { useToast } from '@/components/ui/toast-provider';

interface PassportScannerProps {
  onAutoFill: (data: {
    firstName: string; lastName: string; dateOfBirth: string;
    gender: string; nationality: string; passportNumber: string;
    passportExpiryDate: string; passportIssuingDate: string;
    passportPlaceOfIssue: string; fatherName: string; motherName: string;
  }) => void;
}

type ScanState = 'idle' | 'scanning' | 'success' | 'error';

export function PassportScanner({ onAutoFill }: PassportScannerProps) {
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [filledFields, setFilledFields] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [manualText, setManualText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAutoFill = useCallback((text: string) => {
    try {
      const passportData = parsePassportData(text);
      const formData = mapPassportToFormFields(passportData);

      onAutoFill(formData);

      const found: string[] = [];
      if (formData.firstName) found.push('First Name');
      if (formData.lastName) found.push('Last Name');
      if (formData.dateOfBirth) found.push('Date of Birth');
      if (formData.gender) found.push('Gender');
      if (formData.nationality) found.push('Nationality');
      if (formData.passportNumber) found.push('Passport No.');
      if (formData.passportExpiryDate) found.push('Expiry Date');
      if (formData.passportIssuingDate) found.push('Issuing Date');
      if (formData.passportPlaceOfIssue) found.push('Place of Issue');
      if (formData.fatherName) found.push("Father's Name");
      if (formData.motherName) found.push("Mother's Name");
      setFilledFields(found);

      if (found.length === 0) {
        setErrorMsg('Could not extract fields. Paste the passport text below manually.');
        setScanState('error');
      } else {
        setScanState('success');
        setErrorMsg('');
        setTimeout(() => setExpanded(false), 2500);
      }
    } catch (err) {
      setErrorMsg('Parsing failed. Paste the text manually below.');
      setScanState('error');
    }
  }, [onAutoFill]);

  const performOCR = useCallback(async (file: File) => {
    setScanState('scanning');
    setProgress(0);
    setExtractedText('');
    setFilledFields([]);
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target?.result as string);
    reader.readAsDataURL(file);
    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m: any) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)); }
      });
      const text = result.data.text.trim();
      if (!text || text.length < 10) {
        setErrorMsg('No readable text found. Paste text manually below.');
        setScanState('error');
        return;
      }
      setExtractedText(text);
      runAutoFill(text);
    } catch (err) {
      console.error('OCR failed:', err);
      addToast({ title: 'Error', description: 'OCR failed. Please paste passport text manually.', type: 'error' });
      setErrorMsg('OCR failed. Paste the passport text manually below.');
      setScanState('error');
    }
  }, [runAutoFill, addToast]);

  const handleFile = useCallback((file: File) => {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) { setErrorMsg('Image too large (max 10MB).'); setScanState('error'); return; }
    if (!file.type.startsWith('image/')) { setErrorMsg('Please upload an image file.'); setScanState('error'); return; }
    performOCR(file);
  }, [performOCR]);

  const handleManualSubmit = () => {
    if (!manualText.trim()) { setErrorMsg('Please paste the passport text first.'); return; }
    setScanState('scanning');
    setTimeout(() => {
      runAutoFill(manualText);
      setManualText('');
    }, 300);
  };

  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]); };
  const reset = () => { setScanState('idle'); setProgress(0); setExtractedText(''); setFilledFields([]); setErrorMsg(''); setImageSrc(null); setManualText(''); };

  return (
    <div className={`rounded-2xl border-2 transition-all ${expanded ? 'border-brand-300 bg-brand-50/30' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:border-slate-600'}`}>
      <button onClick={() => { if (scanState !== 'scanning') setExpanded(!expanded); }} type="button" className="flex w-full items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${scanState === 'success' ? 'bg-green-100' : 'bg-brand-100'}`}>
            {scanState === 'success' ? <Check className="h-5 w-5 text-green-600" /> : <ScanLine className="h-5 w-5 text-brand-600" />}
          </div>
          <div className="text-left">
            <p className="font-bold text-ink dark:text-ink-dark text-sm">Passport Scanner</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Upload image or paste text to auto-fill form</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {scanState === 'success' && <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{filledFields.length} fields filled</span>}
          {expanded ? <ChevronUp className="h-5 w-5 text-slate-400 dark:text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-400 dark:text-slate-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          {/* Progress Bar */}
          {scanState === 'scanning' && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-brand-700 font-medium"><Loader2 className="h-4 w-4 animate-spin" />Scanning passport... {progress}%</div>
              <div className="h-2 w-full rounded-full bg-slate-200"><div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {/* Image Preview */}
          {imageSrc && <img src={imageSrc} alt="Passport" className="max-h-40 rounded-xl border border-slate-200 dark:border-slate-700 object-contain mx-auto" />}

          {/* Upload Area */}
          {scanState !== 'scanning' && (
            <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors ${dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <Camera className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Click or drop passport image here</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Supports JPG, PNG (max 10MB)</p>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>
          )}

          {/* Fields Filled Summary */}
          {filledFields.length > 0 && (
            <div className="rounded-xl bg-green-50 border border-green-200 p-3">
              <p className="text-sm font-bold text-green-800 flex items-center gap-2 mb-2"><Check className="h-4 w-4" /> Auto-Filled Fields</p>
              <div className="flex flex-wrap gap-1.5">
                {filledFields.map(f => <span key={f} className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-xs font-medium text-green-700 border border-green-200">{f}</span>)}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* Manual Text Paste */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Or Paste Passport Text Manually</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManualText(`Surname: TADESSE\nGiven Names: ABEBE BERHANE\nNationality: ETHIOPIAN\nDate of Birth: 15/05/1990\nSex: M\nPassport No: ET1234567\nDate of Issue: 20/03/2020\nDate of Expiry: 19/03/2030\nPlace of Issue: ADDIS ABABA\nFather: TADESSE KEBEDE\nMother: YESHI ABEBE`)}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1"
                >
                  <FileImage className="h-3 w-3" />Load Sample
                </button>
                {scanState === 'error' && <button onClick={reset} className="text-xs text-brand-600 hover:underline flex items-center gap-1"><RefreshCw className="h-3 w-3" />Reset</button>}
              </div>
            </div>
            <textarea value={manualText} onChange={e => setManualText(e.target.value)} placeholder={`Paste passport text here...\nExample:\nSurname: TADESSE\nGiven Names: ABEBE\nNationality: ETHIOPIAN\nPassport No: ET1234567\nDate of Birth: 15/05/1990\nDate of Issue: 10/01/2018\nDate of Expiry: 09/01/2028\nPlace of Issue: ADDIS ABABA\nFather: KEBEDE ALEMU\nMother: TIGIST HAILE`}
              rows={5} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 p-3 text-sm font-mono text-xs" />
            <div className="flex gap-2">
              <button onClick={handleManualSubmit} disabled={!manualText.trim()} className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50">
                <Zap className="h-3.5 w-3.5" />Parse & Auto-Fill
              </button>
              <button onClick={reset} className="rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Clear</button>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">Tip: Click &quot;Load Sample&quot; to test auto-fill with demo Ethiopian passport data</p>
          </div>
        </div>
      )}
    </div>
  );
}
