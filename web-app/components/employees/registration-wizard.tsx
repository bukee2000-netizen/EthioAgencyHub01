'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Save, RefreshCw, Clock, Video, Upload, X, Loader2, MessageCircle, Search, Plus, AlertTriangle, User, Briefcase, Brain, FileText, CheckSquare, Camera, ChevronsDown, Building2, MapPin, Phone, Mail, Lock, ScanLine } from 'lucide-react';
import { SelectField, TextField } from '@/components/employees/form-fields';
import { PassportScanner } from '@/components/employees/passport-scanner';
import {
  ethiopianRegions,
  jobRoles,
  countries,
  languages,
  genders,
  maritalStatus,
  educationLevels,
  experienceLevels
} from '@/config/registration-data';
import type { PersonalData, SkillsData, DocumentsData, PsychologyData, Draft } from './registration/types';
import { PSYCH_QUESTIONS, LANGUAGE_ASSESSMENT, DOMESTIC_WORK_ASSESSMENT, APPLIANCE_ASSESSMENT, CULTURE_ASSESSMENT, RETURN_RISK_ASSESSMENT, INTERVIEW_PSYCH_QUESTIONS, MEDICAL_HISTORY_SECTION, steps } from './registration/types';
import { PersonalStep } from './registration/personal-step';
import { SkillsStep } from './registration/skills-step';
import { BankStep } from './registration/bank-step';
import { AssessmentStep } from './registration/assessment-step';
import { DocumentsStep } from './registration/documents-step';
import { ReviewStep } from './registration/review-step';

type RegistrationWizardProps = {
  initialStep?: number;
};

export function RegistrationWizard({ initialStep = 0 }: RegistrationWizardProps) {
  const [step, setStep] = useState(Math.max(0, Math.min(initialStep, steps.length - 1)));

  const [personal, setPersonal] = useState<PersonalData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    region: '',
    zone: '',
    woreda: '',
    kebele: '',
    contactPhone: '',
    alternatePhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
    nationalId: '',
    laborId: '',
    passportNumber: '',
    passportExpiryDate: '',
    passportIssuingDate: '',
    passportPlaceOfIssue: '',
    fatherName: '',
    motherName: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranch: '',
    medicalHistory: '',
    religion: ''
  });

  const [skills, setSkills] = useState<SkillsData>({
    education: '',
    role: '',
    experience: '',
    destination: '',
    languages: [],
    additionalSkills: ''
  });

  const [psychology, setPsychology] = useState<PsychologyData>({});
  const [psychInterview, setPsychInterview] = useState({
    interviewerName: '',
    interviewerRole: '',
    interviewDate: '',
    observations: '',
    emotionalStability: 0,
    socialAdaptability: 0,
    communicationSkills: 0,
    workMotivation: 0,
    selfAwareness: 0,
    problemSolving: 0,
    overallAssessment: '',
    recommendations: '',
  });
  const [docs, setDocs] = useState<DocumentsData>({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '', pdfDocuments: [] });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPassport, setUploadingPassport] = useState(false);
  const [uploadingBody, setUploadingBody] = useState(false);
  const [uploadingPDF, setUploadingPDF] = useState(false);
  const uploadingFiles = uploadingPassport || uploadingBody || uploadingPDF;
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showDraftSelector, setShowDraftSelector] = useState(false);
  const [existingDrafts, setExistingDrafts] = useState<Draft[]>([]);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewUploading, setInterviewUploading] = useState(false);
  const [draftSearchQuery, setDraftSearchQuery] = useState('');
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [searchedEmployees, setSearchedEmployees] = useState<any[]>([]);
  const [searchingEmployees, setSearchingEmployees] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      setLoadingDrafts(true);
      try {
        const res = await fetch('/api/employees/drafts');
        const data = await res.json();
        if (data.success) setExistingDrafts(data.data || []);
      } catch { setUploadError('Failed to load drafts'); } finally { setLoadingDrafts(false); }
    };
    fetchDrafts();
  }, []);

const handlePassportAutoFill = (data: any) => {
  setPersonal((prev) => ({
    ...prev,
    firstName: data.firstName || prev.firstName,
    lastName: data.lastName || prev.lastName,
    dateOfBirth: data.dateOfBirth || prev.dateOfBirth,
    gender: data.gender || prev.gender,
    nationality: data.nationality || prev.nationality,
    passportNumber: data.passportNumber || prev.passportNumber,
    passportExpiryDate: data.passportExpiryDate || prev.passportExpiryDate,
    passportIssuingDate: data.passportIssuingDate || prev.passportIssuingDate,
    passportPlaceOfIssue: data.passportPlaceOfIssue || prev.passportPlaceOfIssue,
    fatherName: data.fatherName || prev.fatherName,
    motherName: data.motherName || prev.motherName
  }));
};

  const resetForm = useCallback(() => {
    setDraftId(null);
    setStep(0);
    setPersonal({
      firstName: '', lastName: '', email: '', dateOfBirth: '', gender: '',
      maritalStatus: '', nationality: '', region: '', zone: '', woreda: '', kebele: '',
      contactPhone: '', alternatePhone: '', emergencyContact: '', emergencyPhone: '',
      emergencyRelation: '', nationalId: '', laborId: '', passportNumber: '', passportExpiryDate: '',
      passportIssuingDate: '', passportPlaceOfIssue: '', fatherName: '', motherName: '', religion: '',
      bankName: '', bankAccountNumber: '', bankBranch: '', medicalHistory: ''
    });
    setSkills({ education: '', role: '', experience: '', destination: '', languages: [], additionalSkills: '' });
    setDocs({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '', pdfDocuments: [] });
    setPsychology({});
    setPsychInterview({
      interviewerName: '', interviewerRole: '', interviewDate: '', observations: '',
      emotionalStability: 0, socialAdaptability: 0, communicationSkills: 0,
      workMotivation: 0, selfAwareness: 0, problemSolving: 0,
      overallAssessment: '', recommendations: '',
    });
    setResult(null);
  }, []);

  const draftIdRef = useRef(draftId);
  draftIdRef.current = draftId;
  const personalRef = useRef(personal);
  personalRef.current = personal;
  const skillsRef = useRef(skills);
  skillsRef.current = skills;
  const docsRef = useRef(docs);
  docsRef.current = docs;
  const psychologyRef = useRef(psychology);
  psychologyRef.current = psychology;
  const stepRef = useRef(step);
  stepRef.current = step;

  const autoSave = useCallback(async (showFeedback = false) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        const refDraftId = draftIdRef.current;
        const draftData = {
          personal: personalRef.current,
          skills: skillsRef.current,
          documents: docsRef.current,
          psychology: psychologyRef.current,
          psychInterview,
          step: stepRef.current,
          createdAt: new Date().toISOString()
        };
        let url = '/api/employees/drafts';
        let method = 'POST';
        if (refDraftId && !refDraftId.startsWith('mock-')) {
          url = `/api/employees/drafts/${refDraftId}`;
          method = 'PUT';
        }
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draftData)
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setDraftId(data.data.id);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
        setResult({ ok: false, message: 'Auto-save failed. Your changes may not be saved.' });
      } finally {
        setIsAutoSaving(false);
      }
    }, 1000);
  }, [psychInterview]);

  const saveDraft = async (showFeedback = true) => {
    try {
      const draftData = {
        personal,
        skills,
        documents: docs,
        psychology,
        psychInterview,
        step,
        createdAt: new Date().toISOString()
      };
      let response;
      let url = '/api/employees/drafts';
      let method = 'POST';
      if (draftId && !draftId.startsWith('mock-')) {
        url = `/api/employees/drafts/${draftId}`;
        method = 'PUT';
      }
      response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDraftId(data.data.id);
        if (showFeedback) {
          setDraftSaved(true);
          setTimeout(() => setDraftSaved(false), 3000);
        }
        return data.data.id;
      } else {
        throw new Error(data.error?.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Failed to save draft:', error);
      setResult({ ok: false, message: 'Failed to save draft. Please try again.' });
      throw error;
    }
  };

  const loadDraft = async (draftIdToLoad: string) => {
    try {
      const response = await fetch(`/api/employees/drafts/${draftIdToLoad}`);
      const data = await response.json();
      if (response.ok && data.success) {
        const draft = data.data;
        setPersonal(draft.personal || personal);
        setSkills(draft.skills || skills);
        setDocs(draft.documents || docs);
        setPsychology(draft.psychology || {});
        setPsychInterview(draft.psychInterview || {
          interviewerName: '', interviewerRole: '', interviewDate: '', observations: '',
          emotionalStability: 0, socialAdaptability: 0, communicationSkills: 0,
          workMotivation: 0, selfAwareness: 0, problemSolving: 0,
          overallAssessment: '', recommendations: '',
        });
        setStep(draft.step || 0);
        setDraftId(draftIdToLoad);
        setShowDraftSelector(false);
        return true;
      } else {
        throw new Error(data.error?.message || 'Failed to load draft');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      setResult({ ok: false, message: 'Failed to load draft. Please try again.' });
      throw error;
    }
  };

  const deleteDraft = async (draftIdToDelete: string) => {
    try {
      const response = await fetch(`/api/employees/drafts/${draftIdToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        setExistingDrafts(existingDrafts.filter(d => d.id !== draftIdToDelete));
        if (draftId === draftIdToDelete) {
          resetForm();
        }
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
      setResult({ ok: false, message: 'Failed to delete draft. Please try again.' });
    }
  };

  const startNewRegistration = () => {
    resetForm();
    setShowDraftSelector(false);
  };

  const searchEmployees = async (query: string) => {
    if (!query.trim()) {
      setSearchedEmployees([]);
      return;
    }
    setSearchingEmployees(true);
    try {
      const response = await fetch(`/api/employees/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchedEmployees(data.data || []);
      } else {
        setSearchedEmployees([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResult({ ok: false, message: 'Search failed. Please try again.' });
      setSearchedEmployees([]);
    } finally {
      setSearchingEmployees(false);
    }
  };

  const loadEmployeeForEdit = (employee: any) => {
    setPersonal({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      dateOfBirth: employee.dateOfBirth || '',
      gender: employee.gender || '',
      maritalStatus: employee.maritalStatus || '',
      nationality: employee.nationality || '',
      region: employee.region || '',
      zone: employee.zone || '',
      woreda: employee.woreda || '',
      kebele: employee.kebele || '',
      contactPhone: employee.contactPhone || '',
      alternatePhone: employee.alternatePhone || '',
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      emergencyRelation: employee.emergencyRelation || '',
      nationalId: employee.nationalId || '',
      laborId: employee.laborId || '',
      passportNumber: employee.passportNumber || '',
      passportExpiryDate: employee.passportExpiryDate || '',
      passportIssuingDate: employee.passportIssuingDate || '',
      passportPlaceOfIssue: employee.passportPlaceOfIssue || '',
      fatherName: employee.fatherName || '',
      motherName: employee.motherName || '',
      bankName: employee.bankName || '',
      bankAccountNumber: employee.bankAccountNumber || '',
      bankBranch: employee.bankBranch || '',
      medicalHistory: employee.medicalHistory || '',
      religion: employee.religion || '',
    } as PersonalData);
  setShowEmployeeSearch(false);
  setEmployeeSearchQuery('');
  setSearchedEmployees([]);
  };

  const onSubmit = async () => {
    if (uploadingFiles) return;
    setSubmitting(true);
    setResult(null);
    try {
      await saveDraft();
      const response = await fetch('/api/employees/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal: {
            firstName: personal.firstName,
            lastName: personal.lastName,
            email: personal.email,
            dateOfBirth: personal.dateOfBirth,
            gender: personal.gender || undefined,
            maritalStatus: personal.maritalStatus || undefined,
            nationality: personal.nationality || undefined,
            region: personal.region || undefined,
            zone: personal.zone || undefined,
            woreda: personal.woreda || undefined,
            kebele: personal.kebele || undefined,
            contactPhone: personal.contactPhone,
            alternatePhone: personal.alternatePhone || undefined,
            emergencyContact: personal.emergencyContact,
            emergencyPhone: personal.emergencyPhone || undefined,
            nationalId: personal.nationalId || undefined,
            laborId: personal.laborId || undefined,
            passportNumber: personal.passportNumber || undefined,
            passportExpiryDate: personal.passportExpiryDate || undefined,
            passportIssuingDate: personal.passportIssuingDate || undefined,
            passportPlaceOfIssue: personal.passportPlaceOfIssue || undefined,
            fatherName: personal.fatherName || undefined,
            motherName: personal.motherName || undefined,
            religion: personal.religion || undefined,
            bankName: personal.bankName || undefined,
            bankAccountNumber: personal.bankAccountNumber || undefined,

            bankBranch: personal.bankBranch || undefined
          },
          skills: {
            education: skills.education || undefined,
            role: skills.role || undefined,
            experience: skills.experience || undefined,
            destination: skills.destination || undefined,
            languages: skills.languages.length > 0 ? skills.languages : undefined,
            additionalSkills: skills.additionalSkills || undefined
          },
          documents: {
            docPath: docs.docPath || undefined,
            tgVideoId: docs.tgVideoId || undefined,
            passportSizePhoto: docs.passportSizePhoto || undefined,
            fullBodyPhoto: docs.fullBodyPhoto || undefined,
            pdfDocuments: docs.pdfDocuments || undefined
          },
          psychology: {
            score: PSYCH_QUESTIONS.length > 0 ? Math.round((Object.values(psychology).reduce((a: number, b: number | string[]) => a + (typeof b === 'number' ? b : 0), 0) / (PSYCH_QUESTIONS.length * 3)) * 100) : 0,
            answers: Object.entries(psychology).map(([qId, answerIndex]) => ({ questionId: qId, answerIndex: typeof answerIndex === 'number' ? answerIndex : 0, score: typeof answerIndex === 'number' ? answerIndex : 0 })),
            notes: '',
            interview: psychInterview.interviewerName ? {
              interviewerName: psychInterview.interviewerName,
              interviewerRole: psychInterview.interviewerRole,
              interviewDate: psychInterview.interviewDate,
              observations: psychInterview.observations,
              emotionalStability: psychInterview.emotionalStability,
              socialAdaptability: psychInterview.socialAdaptability,
              communicationSkills: psychInterview.communicationSkills,
              workMotivation: psychInterview.workMotivation,
              selfAwareness: psychInterview.selfAwareness,
              problemSolving: psychInterview.problemSolving,
              overallAssessment: psychInterview.overallAssessment,
              recommendations: psychInterview.recommendations,
            } : undefined
          }
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message ?? 'Registration failed');
      }
      setResult({ ok: true, message: `Employee registered (${data.data.id ?? 'new'})` });
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : 'Registration failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStepCompletionStatus = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Personal
        return personal.firstName && personal.lastName;
      case 1: // Skills
        return skills.role;
      case 2: // Bank
        return personal.bankName;

              case 3: // Assessment
        return Object.keys(psychology).length >= PSYCH_QUESTIONS.length + LANGUAGE_ASSESSMENT.length + DOMESTIC_WORK_ASSESSMENT.length + APPLIANCE_ASSESSMENT.length + CULTURE_ASSESSMENT.length + RETURN_RISK_ASSESSMENT.length + INTERVIEW_PSYCH_QUESTIONS.length;
      case 4: // Documents
        return docs.passportSizePhoto && docs.fullBodyPhoto;
      case 5: // Review
        return true; // Always show as complete since it's the final step
      default:
        return false;
    }
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPDF(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pdf-document');
      formData.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim() || 'Unknown');

      const response = await fetch('/api/telegram/document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDocs(prev => ({
          ...prev,
          pdfDocuments: [...prev.pdfDocuments, data.data.fileId]
        }));
      } else {
        throw new Error(data.error?.message || 'PDF upload failed');
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'PDF upload failed');
    } finally {
      setUploadingPDF(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-soft-dark mt-0">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink dark:text-ink-dark">Register New Employee</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Fill in all sections below — Personal, Skills, Assessment, Documents — then review and submit.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-1">
            <button
              type="button"
              onClick={() => { setShowEmployeeSearch(false); setShowDraftSelector(true); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                !showEmployeeSearch ? 'bg-white dark:bg-slate-800 text-brand-700 shadow-sm dark:shadow-soft-dark' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              Search Drafts
            </button>
            <button
              type="button"
              onClick={() => { setShowEmployeeSearch(true); setShowDraftSelector(false); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                showEmployeeSearch ? 'bg-white dark:bg-slate-800 text-brand-700 shadow-sm dark:shadow-soft-dark' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              Search Employees
            </button>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Registration
          </button>
        </div>
      </div>

      {/* Employee Search Bar */}
      {showEmployeeSearch && (
        <div className="mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, passport number, or phone..."
                value={employeeSearchQuery}
                onChange={(e) => { setEmployeeSearchQuery(e.target.value); searchEmployees(e.target.value); }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <button type="button" onClick={() => setShowEmployeeSearch(false)} className="rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Close</button>
          </div>
          {searchingEmployees && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Searching...</p>}
          {!searchingEmployees && searchedEmployees.length > 0 && (
            <div className="mt-3 max-h-60 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              {searchedEmployees.map((emp) => (
                <button key={emp.id} type="button" onClick={() => loadEmployeeForEdit(emp)} className="flex w-full items-center justify-between border-b border-slate-100 dark:border-slate-700 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <div>
                    <p className="font-semibold text-ink dark:text-ink-dark">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{emp.passportNumber && `Passport: ${emp.passportNumber} `}{emp.contactPhone && `• Phone: ${emp.contactPhone}`}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    emp.status === 'REGISTERED' ? 'bg-blue-50 text-blue-700' :
                    emp.status === 'INTERVIEW_UPLOADED' ? 'bg-purple-50 text-purple-700' :
                    emp.status === 'PROCESSING' ? 'bg-yellow-50 text-yellow-700' :
                    emp.status === 'DEPLOYED' ? 'bg-green-50 text-green-700' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300'
                  }`}>{emp.status || 'Registered'}</span>
                </button>
              ))}
            </div>
          )}
          {!searchingEmployees && employeeSearchQuery && searchedEmployees.length === 0 && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No employees found matching "{employeeSearchQuery}"</p>
          )}
        </div>
      )}

      {/* Tabbed Folder Wizard */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {steps.map((stepName, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`relative px-6 py-4 text-sm font-medium transition-colors min-w-[120px] ${
                step === index
                  ? 'text-brand-700 bg-white dark:bg-slate-800 border-b-2 border-brand-600 font-semibold z-10'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  step === index
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-600/50 text-slate-600 dark:text-slate-300'
                }`}>
                  {index + 1}
                </span>
                {stepName}
                {getStepCompletionStatus(index) && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              {index === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"></div>
              )}
              {index === steps.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content - Only active tab is rendered for performance */}
        <div className="p-6">
          {step === 0 && (
            <PersonalStep
              personal={personal}
              setPersonal={setPersonal}
              handlePassportAutoFill={handlePassportAutoFill}
            />
          )}
          {step === 1 && (
            <SkillsStep
              skills={skills}
              setSkills={setSkills}
            />
          )}
          {step === 2 && (
            <BankStep
              personal={personal}
              setPersonal={setPersonal}
            />
          )}
          {step === 3 && (
            <AssessmentStep
              psychology={psychology}
              setPsychology={setPsychology}
              psychInterview={psychInterview}
              setPsychInterview={setPsychInterview}
            />
          )}
          {step === 4 && (
            <DocumentsStep
              docs={docs}
              setDocs={setDocs}
              personal={personal}
              uploadingPassport={uploadingPassport}
              setUploadingPassport={setUploadingPassport}
              uploadingBody={uploadingBody}
              setUploadingBody={setUploadingBody}
              uploadingPDF={uploadingPDF}
              uploadError={uploadError}
              setUploadError={setUploadError}
              handlePDFUpload={handlePDFUpload}
              showInterviewModal={showInterviewModal}
              setShowInterviewModal={setShowInterviewModal}
              interviewUploading={interviewUploading}
              setInterviewUploading={setInterviewUploading}
            />
          )}
          {step === 5 && (
            <ReviewStep
              personal={personal}
              skills={skills}
              docs={docs}
              psychology={psychology}
              psychInterview={psychInterview}
            />
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDraftSelector(true)}
              className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100"
            >
              <Clock className="h-4 w-4" />
              {draftId ? 'Continue Draft' : 'Saved Drafts'}
              {existingDrafts.length > 0 && (
                <span className="ml-1 rounded-full bg-amber-200 px-2 py-0.5 text-xs">{existingDrafts.length}</span>
              )}
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => saveDraft(true)}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={
                !personal.firstName.trim() ||
                !personal.lastName.trim() ||
                !personal.contactPhone.trim() ||
                !personal.emergencyContact.trim() ||

                !personal.emergencyPhone.trim() ||
                Object.keys(psychology).length < PSYCH_QUESTIONS.length + LANGUAGE_ASSESSMENT.length + DOMESTIC_WORK_ASSESSMENT.length + APPLIANCE_ASSESSMENT.length + CULTURE_ASSESSMENT.length + RETURN_RISK_ASSESSMENT.length + INTERVIEW_PSYCH_QUESTIONS.length ||
                submitting ||
                uploadingFiles
              }
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : uploadingFiles ? 'Uploading...' : 'Submit Registration'}
            </button>
          </div>
        </div>
      </div>

      {/* Autosave indicator */}
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500 dark:text-slate-400">
        {isAutoSaving ? (
          <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Auto-saving...</span>
        ) : draftId ? (
          <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Draft auto-saved</span>
        ) : null}
      </div>

      {/* Draft Saved Toast */}
      {draftSaved && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Draft saved successfully
        </div>
      )}

      {/* Result Message */}
      {result && (
        <div className="mt-4 space-y-3">
          <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${result.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </p>
          {result.ok && (
            <div className="flex gap-3">
              <button type="button"
                onClick={() => { resetForm(); setResult(null); }}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              ><span>+</span> Register New Employee</button>
              <button type="button"
                onClick={() => setShowDraftSelector(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
              >Search & Edit Draft</button>
            </div>
          )}
        </div>
      )}

      {/* Draft Selector Modal */}
      {showDraftSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">Saved Drafts</h3>
              <button type="button" onClick={() => setShowDraftSelector(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700">✕</button>
            </div>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search by name, passport, or phone..."
                value={draftSearchQuery}
                onChange={(e) => setDraftSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none"
              />
              {draftSearchQuery && (
                <button type="button" onClick={() => setDraftSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300">✕</button>
              )}
            </div>
            {existingDrafts.filter(d => {
              const q = draftSearchQuery.toLowerCase();
              if (!q) return true;
              const name = `${d.personal?.firstName || ''} ${d.personal?.lastName || ''}`.toLowerCase();
              const passport = d.personal?.passportNumber?.toLowerCase() || '';
              const phone = d.personal?.contactPhone?.toLowerCase() || '';
              return name.includes(q) || passport.includes(q) || phone.includes(q);
            }).length > 0 ? (
              <div className="space-y-3">
                {existingDrafts.filter(d => {
                  const q = draftSearchQuery.toLowerCase();
                  if (!q) return true;
                  const name = `${d.personal?.firstName || ''} ${d.personal?.lastName || ''}`.toLowerCase();
                  const passport = d.personal?.passportNumber?.toLowerCase() || '';
                  const phone = d.personal?.contactPhone?.toLowerCase() || '';
                  return name.includes(q) || passport.includes(q) || phone.includes(q);
                }).map((draft) => (
                  <div key={draft.id} className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 p-4 hover:border-brand-300">
                    <div className="flex-1">
                      <p className="font-semibold text-ink dark:text-ink-dark">{draft.personal?.firstName || 'Unnamed'} {draft.personal?.lastName || ''}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Step {draft.step + 1}: {steps[draft.step]} • {new Date(draft.createdAt).toLocaleDateString()}</p>
                      {(draft.personal?.passportNumber || draft.personal?.contactPhone) && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {draft.personal?.passportNumber && <span>Passport: {draft.personal.passportNumber} </span>}
                          {draft.personal?.contactPhone && <span>Phone: {draft.personal.contactPhone}</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => loadDraft(draft.id)} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Continue</button>
                      <button type="button" onClick={() => deleteDraft(draft.id)} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">{draftSearchQuery ? 'No drafts match your search.' : 'No saved drafts found.'}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Click "Start New Registration" to begin.</p>
              </div>
            )}
            <button type="button" onClick={startNewRegistration} className="mt-4 w-full rounded-2xl border border-slate-300 dark:border-slate-600 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Start New Registration</button>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-800 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink dark:text-ink-dark flex items-center gap-2">
                <Video className="h-6 w-6 text-purple-600" />
                Record Interview
              </h3>
              <button type="button" onClick={() => setShowInterviewModal(false)} className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Via Telegram</span>
              </div>
              <p className="text-sm text-purple-700">Videos are sent to your private Telegram channel for secure storage and streaming to international partners.</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Employee Name</label>
              <input type="text" value={`${personal.firstName} ${personal.lastName}`.trim()} readOnly className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">Select Video File</label>
              <input type="file" accept="video/*" className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setInterviewUploading(true);
                try {
                  const fd = new FormData();
                  fd.append('video', file);
                  fd.append('employeeName', `${personal.firstName} ${personal.lastName}`);
                  const res = await fetch('/api/telegram/interview', { method: 'POST', body: fd });
                  const data = await res.json();
                  if (data.success && data.data?.fileId) { setDocs(d => ({ ...d, tgVideoId: data.data.fileId })); setShowInterviewModal(false); }
                } catch { setUploadError('Failed to upload interview video'); } finally { setInterviewUploading(false); }
              }} />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowInterviewModal(false)} className="flex-1 rounded-2xl border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
