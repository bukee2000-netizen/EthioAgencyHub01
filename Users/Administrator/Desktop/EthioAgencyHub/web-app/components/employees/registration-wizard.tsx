'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Save, RefreshCw, Clock, Video, Upload, X, Loader2, MessageCircle, Search, Plus, AlertTriangle, User, Briefcase, Brain, FileText, CheckSquare, Camera } from 'lucide-react';
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

type PersonalData = {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  region: string;
  zone: string;
  contactPhone: string;
  alternatePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  nationalId: string;
  laborId: string;
  passportNumber: string;
  passportExpiryDate: string;
  fatherName: string;
  motherName: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
};

type SkillsData = {
  education: string;
  role: string;
  experience: string;
  destination: string;
  languages: string[];
  additionalSkills: string;
};

type DocumentsData = { docPath: string; tgVideoId: string; passportSizePhoto: string; fullBodyPhoto: string };

// Psychology assessment — 8 questions, each scored 0-3
const PSYCH_QUESTIONS = [
  { id: 'q1', text: 'How do you handle being away from family for a long time?', options: ['Very difficult, I struggle', 'It\'s hard but I can manage', 'I can adapt well', 'I am fully prepared'] },
  { id: 'q2', text: 'Have you worked or lived away from home before?', options: ['Never', 'Briefly (less than 3 months)', 'Yes, 3-12 months', 'Yes, more than 1 year'] },
  { id: 'q3', text: 'How would you rate your ability to work under strict rules and supervision?', options: ['I prefer full independence', 'Somewhat comfortable', 'Comfortable most of the time', 'Very comfortable'] },
  { id: 'q4', text: 'What is your primary motivation for working abroad?', options: ['Family pressure only', 'Not sure yet', 'Improve family income', 'Career growth and financial goals'] },
  { id: 'q5', text: 'How do you cope with cultural differences and new environments?', options: ['Very uncomfortable', 'Takes me a long time', 'I adjust moderately', 'I adapt quickly'] },
  { id: 'q6', text: 'Do you have a support system (family/friends) who encourage your decision?', options: ['No support at all', 'Some support', 'Good support', 'Strong support and encouragement'] },
  { id: 'q7', text: 'How confident are you in completing your full contract period (2+ years)?', options: ['Not confident', 'Somewhat unsure', 'Fairly confident', 'Very confident'] },
  { id: 'q8', text: 'Have you received any pre-departure counseling or training?', options: ['None', 'Basic information only', 'Some training', 'Full pre-departure training'] },
];

type PsychologyData = { [key: string]: number }; // questionId -> answer index (0-3)

type Draft = {
  id: string;
  personal: PersonalData;
  skills: SkillsData;
  docs: DocumentsData;
  step: number;
  createdAt: string;
};

const steps = ['Personal', 'Skills', 'Assessment', 'Documents', 'Review'] as const;

type RegistrationWizardProps = {
  initialStep?: number;
};

export function RegistrationWizard({ initialStep = 0 }: RegistrationWizardProps) {
  const [step, setStep] = useState(Math.max(0, Math.min(initialStep, steps.length - 1)));
  const [activeTab, setActiveTab] = useState(0);

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
    contactPhone: '',
    alternatePhone: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelation: '',
    nationalId: '',
    laborId: '',
    passportNumber: '',
    passportExpiryDate: '',
    fatherName: '',
    motherName: '',
    bankName: '',
    bankAccountNumber: '',
    bankBranch: ''
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

  const [docs, setDocs] = useState<DocumentsData>({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '' });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
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
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [showEmployeeSearch, setShowEmployeeSearch] = useState(false);
  const [searchedEmployees, setSearchedEmployees] = useState<any[]>([]);
  const [searchingEmployees, setSearchingEmployees] = useState(false);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateProgress = () => {
    let completed = 0;
    const totalFields = 25;
    if (personal.firstName.trim()) completed++;
    if (personal.lastName.trim()) completed++;
    if (personal.email.trim()) completed++;
    if (personal.dateOfBirth) completed++;
    if (personal.gender) completed++;
    if (personal.maritalStatus) completed++;
    if (personal.nationality) completed++;
    if (personal.region) completed++;
    if (personal.zone) completed++;
    if (personal.contactPhone.trim()) completed++;
    if (personal.alternatePhone.trim()) completed++;
    if (personal.emergencyContact.trim()) completed++;
    if (personal.emergencyPhone.trim()) completed++;
    if (personal.nationalId.trim()) completed++;
    if (personal.passportNumber.trim()) completed++;
    if (skills.education) completed++;
    if (skills.role) completed++;
    if (skills.experience) completed++;
    if (skills.destination) completed++;
    if (skills.languages.length > 0) completed++;
    if (Object.keys(psychology).length >= PSYCH_QUESTIONS.length) completed++;
    if (docs.passportSizePhoto) completed++;
    if (docs.fullBodyPhoto) completed++;
    if (docs.tgVideoId) completed++;
    return Math.round((completed / totalFields) * 100);
  };

  const progress = calculateProgress();

  const tabItems = [
    { id: 0, label: 'Personal', icon: User, section: 'personal' },
    { id: 1, label: 'Skills', icon: Briefcase, section: 'skills' },
    { id: 2, label: 'Assessment', icon: Brain, section: 'assessment' },
    { id: 3, label: 'Documents', icon: FileText, section: 'documents' },
    { id: 4, label: 'Review', icon: CheckSquare, section: 'review' },
  ];

  useEffect(() => {
    setStep(Math.max(0, Math.min(initialStep, steps.length - 1)));
    
    const loadExistingDrafts = async () => {
      try {
        const response = await fetch('/api/employees/drafts');
        const data = await response.json();
        
        if (response.ok && data.success && data.data.length > 0) {
          setExistingDrafts(data.data);
        }
      } catch (error) {
        console.error('Failed to load existing drafts:', error);
      }
    };
    
    loadExistingDrafts();
  }, [initialStep]);

  const next = () => {
    autoSave();
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prev = () => {
    autoSave();
    setStep((s) => Math.max(s - 1, 0));
  };

  const autoSave = useCallback(async (showFeedback = false) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        await saveDraft(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 1000);
  }, [personal, skills, docs, step, draftId]);

  const saveDraft = async (showFeedback = true) => {
    try {
      const draftData = {
        personal,
        skills,
        docs,
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
        setDocs(draft.docs || docs);
        setStep(draft.step || 0);
        setDraftId(draftIdToLoad);
        setShowDraftSelector(false);
        return true;
      } else {
        throw new Error(data.error?.message || 'Failed to load draft');
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      throw error;
    }
  };

  const deleteDraft = async (draftIdToDelete: string) => {
    try {
      const response = await fetch(`/api/employees/drafts/${draftIdToDelete}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setExistingDrafts(existingDrafts.filter(d => d.id !== draftIdToDelete));
        if (draftId === draftIdToDelete) {
          setDraftId(null);
          setStep(0);
          setPersonal({
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            gender: '',
            maritalStatus: '',
            nationality: '',
            region: '',
            zone: '',
            contactPhone: '',
            alternatePhone: '',
            emergencyContact: '',
            emergencyPhone: '',
            emergencyRelation: '',
            nationalId: '',
            laborId: '',
            passportNumber: '',
            passportExpiryDate: '',
            fatherName: '',
            motherName: '',
            bankName: '',
            bankAccountNumber: '',
            bankBranch: ''
          });
          setSkills({
            education: '',
            role: '',
            experience: '',
            destination: '',
            languages: [],
            additionalSkills: ''
          });
          setDocs({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '' });
        }
      }
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const startNewRegistration = () => {
    setDraftId(null);
    setStep(0);
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
      contactPhone: employee.contactPhone || '',
      alternatePhone: employee.alternatePhone || '',
      emergencyContact: employee.emergencyContact || '',
      emergencyPhone: employee.emergencyPhone || '',
      emergencyRelation: employee.emergencyRelation || '',
      nationalId: employee.nationalId || '',
      laborId: employee.laborId || '',
      passportNumber: employee.passportNumber || '',
      passportExpiryDate: employee.passportExpiryDate || '',
      fatherName: employee.fatherName || '',
      motherName: employee.motherName || '',
      bankName: employee.bankName || '',
      bankAccountNumber: employee.bankAccountNumber || '',
      bankBranch: employee.bankBranch || ''
    });
    setShowEmployeeSearch(false);
    setEmployeeSearchQuery('');
    setSearchedEmployees([]);
  };

  // Get zones for selected region
  const selectedRegionData = ethiopianRegions.find((r) => r.region === personal.region);
  const zones = selectedRegionData?.zones || [];

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
      fatherName: data.fatherName || prev.fatherName,
      motherName: data.motherName || prev.motherName
    }));
    // Switch to Personal tab so user can see and edit the auto-filled fields
    setActiveTab(0);
  };

  const saveAndContinue = async () => {
    try {
      await saveDraft(true);
      next();
    } catch (error) {
      setResult({ ok: false, message: error instanceof Error ? error.message : 'Failed to save draft' });
    }
  };

  const onSubmit = async () => {
    if (uploadingFiles) return;
    setSubmitting(true);
    setResult(null);
    try {
      // Save final draft before submission
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
            contactPhone: personal.contactPhone,
            alternatePhone: personal.alternatePhone || undefined,
            emergencyContact: personal.emergencyContact,
            emergencyPhone: personal.emergencyPhone || undefined,
            nationalId: personal.nationalId || undefined,
            laborId: personal.laborId || undefined,
            passportNumber: personal.passportNumber || undefined,
            passportExpiryDate: personal.passportExpiryDate || undefined,
            fatherName: personal.fatherName || undefined,
            motherName: personal.motherName || undefined,
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
            fullBodyPhoto: docs.fullBodyPhoto || undefined
          },
          psychology: {
            score: PSYCH_QUESTIONS.length > 0 ? Math.round((Object.values(psychology).reduce((a, b) => a + b, 0) / (PSYCH_QUESTIONS.length * 3)) * 100) : 0,
            answers: Object.entries(psychology).map(([qId, answerIndex]) => ({ questionId: qId, answerIndex, score: answerIndex })),
            notes: ''
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header with action buttons */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-ink">Employee Registration</h2>
        
        {/* Search Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => { setShowEmployeeSearch(false); setShowDraftSelector(true); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                !showEmployeeSearch ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Search Drafts
            </button>
            <button
              type="button"
              onClick={() => { setShowEmployeeSearch(true); setShowDraftSelector(false); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                showEmployeeSearch ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Search Employees
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => {
              setDraftId(null);
              setStep(0);
              setPersonal({
                firstName: '', lastName: '', email: '', dateOfBirth: '', gender: '',
                maritalStatus: '', nationality: '', region: '', zone: '',
                contactPhone: '', alternatePhone: '', emergencyContact: '', emergencyPhone: '',
                emergencyRelation: '', nationalId: '', laborId: '', passportNumber: '', passportExpiryDate: '',
                fatherName: '', motherName: '', bankName: '', bankAccountNumber: '', bankBranch: ''
              });
              setSkills({ education: '', role: '', experience: '', destination: '', languages: [], additionalSkills: '' });
              setDocs({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '' });
            }}
            className="flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Registration
          </button>
        </div>
      </div>

      {/* Employee Search Bar */}
      {showEmployeeSearch && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, passport number, or phone..."
                value={employeeSearchQuery}
                onChange={(e) => { setEmployeeSearchQuery(e.target.value); searchEmployees(e.target.value); }}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowEmployeeSearch(false)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
          
          {/* Search Results */}
          {searchingEmployees && (
            <p className="mt-3 text-sm text-slate-500">Searching...</p>
          )}
          
          {!searchingEmployees && searchedEmployees.length > 0 && (
            <div className="mt-3 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white">
              {searchedEmployees.map((emp) => (
                <button
                  key={emp.id}
                  type="button"
                  onClick={() => loadEmployeeForEdit(emp)}
                  className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-ink">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500">
                      {emp.passportNumber && `Passport: ${emp.passportNumber} `}
                      {emp.contactPhone && `• Phone: ${emp.contactPhone}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    emp.status === 'REGISTERED' ? 'bg-blue-50 text-blue-700' :
                    emp.status === 'INTERVIEW_UPLOADED' ? 'bg-purple-50 text-purple-700' :
                    emp.status === 'PROCESSING' ? 'bg-yellow-50 text-yellow-700' :
                    emp.status === 'DEPLOYED' ? 'bg-green-50 text-green-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {emp.status || 'Registered'}
                  </span>
                </button>
              ))}
            </div>
          )}
          
          {!searchingEmployees && employeeSearchQuery && searchedEmployees.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">No employees found matching "{employeeSearchQuery}"</p>
          )}
        </div>
      )}

      {/* Tabbed Layout with Progress Sidebar */}
      <div className="flex gap-6">
        {/* Progress Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* Progress Circle */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <div className="relative mx-auto mb-3 h-24 w-24">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray={`${progress * 2.83} 283`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-800">{progress}%</span>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600">Registration Complete</p>
          </div>

          {/* Tab Navigation */}
          <div className="space-y-2">
            {tabItems.map((tab) => {
              const tabStart = tab.id * 20;
              const tabEnd = (tab.id + 1) * 20;
              const isCompleted = progress >= tabEnd;
              const isCurrent = progress >= tabStart && progress < tabEnd;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-brand-50 border-2 border-brand-300'
                      : isCompleted
                      ? 'bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive
                      ? 'bg-brand-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}>
                    {isCompleted ? '✓' : tab.id + 1}
                  </span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${isActive ? 'text-brand-800' : 'text-slate-700'}`}>
                      {tab.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Not started'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">

      {/* All sections always visible - controlled by accordion headers */}

      {activeTab === 0 && (
        <div className="space-y-3">
          <PassportScanner onAutoFill={handlePassportAutoFill} />

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">1. Personal Identity</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="First Name *" value={personal.firstName} onChange={(v) => setPersonal({ ...personal, firstName: v })} required placeholder="e.g., Abebe" />
              <TextField label="Last Name *" value={personal.lastName} onChange={(v) => setPersonal({ ...personal, lastName: v })} required placeholder="e.g., Kebede" />
              <TextField label="Father's Name" value={personal.fatherName} onChange={(v) => setPersonal({ ...personal, fatherName: v })} placeholder="As in passport" />
              <TextField label="Mother's Name" value={personal.motherName} onChange={(v) => setPersonal({ ...personal, motherName: v })} placeholder="As in passport" />
              <TextField label="Date of Birth *" type="date" value={personal.dateOfBirth} onChange={(v) => setPersonal({ ...personal, dateOfBirth: v })} required />
              <SelectField label="Gender" value={personal.gender} onChange={(v) => setPersonal({ ...personal, gender: v })} options={genders} />
              <SelectField label="Marital Status" value={personal.maritalStatus} onChange={(v) => setPersonal({ ...personal, maritalStatus: v })} options={maritalStatus} />
              <SelectField label="Nationality" value={personal.nationality} onChange={(v) => setPersonal({ ...personal, nationality: v })} options={countries} />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">2. Contact</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="Email" type="email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} placeholder="e.g., abebe@email.com" />
              <TextField label="Phone *" type="tel" value={personal.contactPhone} onChange={(v) => setPersonal({ ...personal, contactPhone: v })} required placeholder="+251911234567" />
              <TextField label="Alternate Phone" type="tel" value={personal.alternatePhone} onChange={(v) => setPersonal({ ...personal, alternatePhone: v })} placeholder="+251912345678" />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">3. Address</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <SelectField label="Region *" value={personal.region} onChange={(v) => setPersonal({ ...personal, region: v, zone: '' })} options={ethiopianRegions.map((r) => r.region)} />
              {personal.region && <SelectField label="Zone / Woreda" value={personal.zone} onChange={(v) => setPersonal({ ...personal, zone: v })} options={zones} />}
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">4. Passport &amp; ID</h4>
            <p className="text-xs text-blue-600 mb-2">Enter exactly as on official documents</p>
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="Passport Number *" value={personal.passportNumber} onChange={(v) => setPersonal({ ...personal, passportNumber: v })} required placeholder="e.g., ET1234567" />
              <TextField label="Passport Expiry" type="date" value={personal.passportExpiryDate} onChange={(v) => setPersonal({ ...personal, passportExpiryDate: v })} />
              <TextField label="National ID" value={personal.nationalId} onChange={(v) => setPersonal({ ...personal, nationalId: v })} placeholder="e.g., 1234567890" />
              <TextField label="Labor ID" value={personal.laborId} onChange={(v) => setPersonal({ ...personal, laborId: v })} placeholder="e.g., LAB-2024-001" />
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">5. Emergency Contact</h4>
            <div className="grid gap-3 md:grid-cols-3">
              <TextField label="Full Name *" value={personal.emergencyContact} onChange={(v) => setPersonal({ ...personal, emergencyContact: v })} required placeholder="e.g., Sara Kebede" />
              <TextField label="Phone *" type="tel" value={personal.emergencyPhone} onChange={(v) => setPersonal({ ...personal, emergencyPhone: v })} required placeholder="+251911234567" />
              <SelectField label="Relationship *" value={personal.emergencyRelation} onChange={(v) => setPersonal({ ...personal, emergencyRelation: v })} options={['Spouse', 'Parent', 'Sibling', 'Child', 'Relative', 'Friend', 'Other']} />
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600">6. Bank Account</h4>
            <p className="text-xs text-emerald-600 mb-2">For salary remittance from abroad</p>
            <div className="grid gap-3 md:grid-cols-3">
              <SelectField label="Bank Name" value={personal.bankName} onChange={(v) => setPersonal({ ...personal, bankName: v })} options={['Commercial Bank of Ethiopia', 'Awash Bank', 'Dashen Bank', 'Bank of Abyssinia', 'Oromia Cooperative Bank', 'Berhan Bank', 'Nib International Bank', 'United Bank', 'Cooperative Bank of Oromia', 'Other']} />
              <TextField label="Account Number" value={personal.bankAccountNumber} onChange={(v) => setPersonal({ ...personal, bankAccountNumber: v })} placeholder="e.g., 1000123456789" />
              <TextField label="Branch" value={personal.bankBranch} onChange={(v) => setPersonal({ ...personal, bankBranch: v })} placeholder="e.g., Bole Branch" />
            </div>
          </div>
        </div>
      )}

      {activeTab === 2 && (() => {
        const answered = Object.keys(psychology).length;
        const total = PSYCH_QUESTIONS.length;
        const rawScore = Object.values(psychology).reduce((sum, v) => sum + v, 0);
        const maxScore = total * 3;
        const pctScore = maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;
        const getRisk = () => {
          if (pctScore >= 75) return { label: 'Low Risk', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', bar: 'bg-emerald-500' };
          if (pctScore >= 50) return { label: 'Medium Risk', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', bar: 'bg-amber-400' };
          return { label: 'High Risk — Consider Counseling', color: 'text-red-700', bg: 'bg-red-50 border-red-200', bar: 'bg-red-500' };
        };
        const risk = getRisk();
        return (
          <div className="space-y-5">
            <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-4">
              <h4 className="font-semibold text-violet-800 flex items-center gap-2">🧠 Psychological Suitability Assessment</h4>
              <p className="mt-1 text-xs text-violet-600">This assessment helps predict employee retention. Research shows ~20% of overseas workers return early. Answer honestly to get an accurate suitability score.</p>
              {answered > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className={risk.color}>{risk.label}</span>
                    <span className="text-slate-600">{answered}/{total} answered · Score: {pctScore}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div className={`h-full rounded-full transition-all ${risk.bar}`} style={{ width: `${pctScore}%` }} />
                  </div>
                </div>
              )}
            </div>

            {PSYCH_QUESTIONS.map((q, qi) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-800 mb-3">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold mr-2">{qi + 1}</span>
                  {q.text}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))}
                      className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-all ${
                        psychology[q.id] === oi
                          ? 'border-violet-400 bg-violet-50 font-semibold text-violet-800'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                        psychology[q.id] === oi ? 'border-violet-500 bg-violet-500' : 'border-slate-300'
                      }`} />
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {answered === total && (
              <div className={`rounded-2xl border p-4 ${risk.bg}`}>
                <p className={`font-bold text-sm ${risk.color}`}>Assessment Complete — Suitability Score: {pctScore}/100</p>
                <p className="text-xs text-slate-600 mt-1">
                  {pctScore >= 75 ? 'Employee shows strong suitability indicators. Recommended for deployment.' :
                   pctScore >= 50 ? 'Employee may need additional pre-departure counseling before deployment.' :
                   'High early-return risk. Mandatory counseling session recommended before proceeding.'}
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {activeTab === 1 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills &amp; Experience</h4>
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField label="Education" value={skills.education} onChange={(v) => setSkills({ ...skills, education: v })} options={educationLevels} />
            <SelectField label="Job Role" value={skills.role} onChange={(v) => setSkills({ ...skills, role: v })} options={jobRoles} />
            <SelectField label="Experience" value={skills.experience} onChange={(v) => setSkills({ ...skills, experience: v })} options={experienceLevels} />
            <SelectField label="Destination" value={skills.destination} onChange={(v) => setSkills({ ...skills, destination: v })} options={countries} />
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Languages</h4>
            <select multiple value={skills.languages} onChange={(e) => { const selected = Array.from(e.target.selectedOptions, (o) => o.value); setSkills({ ...skills, languages: selected }); }}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none" style={{ minHeight: '80px' }}>
              {languages.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
            </select>
            {skills.languages.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {skills.languages.map((lang) => (
                  <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {lang}
                    <button type="button" onClick={() => setSkills({ ...skills, languages: skills.languages.filter((l) => l !== lang) })} className="hover:text-brand-900">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <TextField label="Additional Skills" value={skills.additionalSkills} onChange={(v) => setSkills({ ...skills, additionalSkills: v })} placeholder="e.g., First aid, Cooking, Childcare" />
        </div>
      )}

{activeTab === 3 && (
  <div className="space-y-4">
    <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3">
      <p className="text-xs text-brand-700 flex items-center gap-2">
        <Upload className="h-3.5 w-3.5" />
        Photos are stored securely via Telegram bot. JPG, PNG accepted — max 10MB each.
      </p>
    </div>

    {/* Passport Size Photo */}
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Passport Size Photo</h4>
      {docs.passportSizePhoto ? (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white">
            <img
              src={`/api/telegram/photo/${docs.passportSizePhoto}`}
              alt="Passport size"
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800">Passport Photo Uploaded</p>
            <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
          </div>
          <button type="button" onClick={() => setDocs({ ...docs, passportSizePhoto: '' })} className="flex-shrink-0 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'}`}>
          {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400" />}
          <div>
            <p className="text-sm font-semibold text-slate-700">{uploadingFiles ? 'Uploading via Telegram...' : 'Upload Passport Size Photo'}</p>
            <p className="text-xs text-slate-400">Click to select or drag &amp; drop</p>
          </div>
          <input type="file" className="hidden" accept="image/*" disabled={uploadingFiles} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingFiles(true); setUploadError(null); try { const fd = new FormData(); fd.append('file', file); fd.append('photoType', 'passport-size'); fd.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim() || 'Unknown'); const res = await fetch('/api/telegram/photo', { method: 'POST', body: fd }); const data = await res.json(); if (data.success && data.data?.fileId) setDocs(d => ({ ...d, passportSizePhoto: data.data.fileId })); else setUploadError(data.error?.message || 'Upload failed'); } catch { setUploadError('Upload failed'); } finally { setUploadingFiles(false); } }} />
        </label>
      )}
    </div>

    {/* Full Body Photo */}
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Body Photo</h4>
      {docs.fullBodyPhoto ? (
        <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white">
            <img
              src={`/api/telegram/photo/${docs.fullBodyPhoto}`}
              alt="Full body"
              className="h-full w-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-800">Full Body Photo Uploaded</p>
            <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
          </div>
          <button type="button" onClick={() => setDocs({ ...docs, fullBodyPhoto: '' })} className="flex-shrink-0 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'}`}>
          {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400" />}
          <div>
            <p className="text-sm font-semibold text-slate-700">{uploadingFiles ? 'Uploading via Telegram...' : 'Upload Full Body Photo'}</p>
            <p className="text-xs text-slate-400">Click to select or drag &amp; drop</p>
          </div>
          <input type="file" className="hidden" accept="image/*" disabled={uploadingFiles} onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setUploadingFiles(true); setUploadError(null); try { const fd = new FormData(); fd.append('file', file); fd.append('photoType', 'full-body'); fd.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim() || 'Unknown'); const res = await fetch('/api/telegram/photo', { method: 'POST', body: fd }); const data = await res.json(); if (data.success && data.data?.fileId) setDocs(d => ({ ...d, fullBodyPhoto: data.data.fileId })); else setUploadError(data.error?.message || 'Upload failed'); } catch { setUploadError('Upload failed'); } finally { setUploadingFiles(false); } }} />
        </label>
      )}
    </div>

    {uploadError && <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"><AlertTriangle className="h-4 w-4" />{uploadError}<button onClick={() => setUploadError(null)} className="ml-auto text-red-400"><X className="h-4 w-4" /></button></div>}

    <div className="border-t border-slate-200 pt-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Interview Video</h4>
      {docs.tgVideoId ? (
        <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <div className="flex-1"><p className="text-sm font-semibold text-emerald-800">Interview uploaded</p><p className="text-xs text-emerald-700">Stored securely via Telegram</p></div>
          <button onClick={() => setDocs({ ...docs, tgVideoId: '' })} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => setShowInterviewModal(true)} className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 bg-white p-3 hover:bg-purple-50">
            <Video className="h-5 w-5 text-purple-500" /><span className="text-sm font-semibold text-purple-700">Record via Telegram</span>
          </button>
          <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 hover:bg-slate-50 cursor-pointer">
            <Upload className="h-5 w-5 text-slate-400" /><span className="text-sm font-semibold text-slate-600">Upload Video</span>
            <input type="file" className="hidden" accept="video/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; setInterviewUploading(true); try { const fd = new FormData(); fd.append('video', file); fd.append('employeeName', `${personal.firstName} ${personal.lastName}`); const res = await fetch('/api/telegram/interview', { method: 'POST', body: fd }); const data = await res.json(); if (data.success && data.data?.fileId) setDocs(d => ({ ...d, tgVideoId: data.data.fileId })); } catch { } finally { setInterviewUploading(false); } }} />
          </label>
        </div>
      )}
      {interviewUploading && <div className="flex items-center gap-2 text-sm text-purple-700"><Loader2 className="h-4 w-4 animate-spin" /> Uploading to Telegram...</div>}
    </div>
  </div>
)}

      {activeTab === 4 && (
        <div className="space-y-4">
          {/* Photo Preview Row */}
          <div className="flex gap-4">
            <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Passport Photo</h4>
              {docs.passportSizePhoto ? (
                <img src={`/api/telegram/photo/${docs.passportSizePhoto}`} alt="Passport" className="mx-auto h-28 w-28 rounded-lg border border-slate-200 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><Camera className="h-8 w-8" /></div>
              )}
            </div>
            <div className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-center">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Full Body Photo</h4>
              {docs.fullBodyPhoto ? (
                <img src={`/api/telegram/photo/${docs.fullBodyPhoto}`} alt="Full body" className="mx-auto h-28 w-28 rounded-lg border border-slate-200 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100 text-slate-400"><Camera className="h-8 w-8" /></div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-xs font-bold uppercase text-brand-600 mb-2">Personal Info</h4>
            <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
              <p><strong>First Name:</strong> {personal.firstName || '-'}</p>
              <p><strong>Last Name:</strong> {personal.lastName || '-'}</p>
              <p><strong>Father:</strong> {personal.fatherName || '-'}</p>
              <p><strong>Mother:</strong> {personal.motherName || '-'}</p>
              <p><strong>DOB:</strong> {personal.dateOfBirth || '-'}</p>
              <p><strong>Gender:</strong> {personal.gender || '-'}</p>
              <p><strong>Marital:</strong> {personal.maritalStatus || '-'}</p>
              <p><strong>Nationality:</strong> {personal.nationality || '-'}</p>
              <p><strong>Region:</strong> {personal.region || '-'}</p>
              <p><strong>Zone:</strong> {personal.zone || '-'}</p>
              <p><strong>Phone:</strong> {personal.contactPhone || '-'}</p>
              <p><strong>Alt Phone:</strong> {personal.alternatePhone || '-'}</p>
              <p><strong>Email:</strong> {personal.email || '-'}</p>
              <p><strong>Emergency:</strong> {personal.emergencyContact || '-'}</p>
              <p><strong>Emergency Phone:</strong> {personal.emergencyPhone || '-'} ({personal.emergencyRelation || '-'})</p>
            </div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <h4 className="text-xs font-bold uppercase text-blue-600 mb-2">Passport &amp; IDs</h4>
            <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-4">
              <p><strong>Passport:</strong> {personal.passportNumber || '-'}</p>
              <p><strong>Expiry:</strong> {personal.passportExpiryDate || '-'}</p>
              <p><strong>National ID:</strong> {personal.nationalId || '-'}</p>
              <p><strong>Labor ID:</strong> {personal.laborId || '-'}</p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h4 className="text-xs font-bold uppercase text-emerald-600 mb-2">Skills &amp; Bank</h4>
            <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
              <p><strong>Education:</strong> {skills.education || '-'}</p>
              <p><strong>Role:</strong> {skills.role || '-'}</p>
              <p><strong>Experience:</strong> {skills.experience || '-'}</p>
              <p><strong>Destination:</strong> {skills.destination || '-'}</p>
              <p><strong>Languages:</strong> {skills.languages.join(', ') || '-'}</p>
              <p><strong>Skills:</strong> {skills.additionalSkills || '-'}</p>
              <p><strong>Bank:</strong> {personal.bankName || '-'}</p>
              <p><strong>Account:</strong> {personal.bankAccountNumber || '-'}</p>
              <p><strong>Branch:</strong> {personal.bankBranch || '-'}</p>
            </div>
          </div>
          <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
            <h4 className="text-xs font-bold uppercase text-violet-600 mb-2">Assessment &amp; Documents</h4>
            <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
              <p><strong>Psychology:</strong> {Object.keys(psychology).length}/{PSYCH_QUESTIONS.length} ({PSYCH_QUESTIONS.length > 0 ? Math.round((Object.values(psychology).reduce((a,b)=>a+b,0) / (PSYCH_QUESTIONS.length * 3)) * 100) : 0}%)</p>
              <p><strong>Passport Photo:</strong> {docs.passportSizePhoto ? 'Yes' : 'No'}</p>
              <p><strong>Full Body Photo:</strong> {docs.fullBodyPhoto ? 'Yes' : 'No'}</p>
              <p><strong>Interview Video:</strong> {docs.tgVideoId ? 'Uploaded' : 'No'}</p>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Operations - Bottom Navigation */}
      <div className="mt-8 border-t border-slate-200 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left Side - Navigation */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Draft selector */}
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

          {/* Right Side - Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Save Draft Button */}
            <button
              type="button"
              onClick={() => saveDraft(true)}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>

            {/* Submit Button - enabled when all required fields are filled */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={
                !personal.firstName.trim() || 
                !personal.lastName.trim() || 
                !personal.contactPhone.trim() ||
                !skills.role ||
                Object.keys(psychology).length < PSYCH_QUESTIONS.length ||
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
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500">
        {isAutoSaving ? (
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3 animate-spin" /> Auto-saving...
          </span>
        ) : draftId ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Draft auto-saved
          </span>
        ) : null}
      </div>

      {/* Draft Status */}
      {draftSaved && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Draft saved successfully
        </div>
      )}

      {result ? (
        <div className="mt-4 space-y-3">
          <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${result.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {result.message}
          </p>
          {result.ok && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDraftId(null);
                  setStep(0);
                  setPersonal({
                    firstName: '', lastName: '', email: '', dateOfBirth: '', gender: '',
                    maritalStatus: '', nationality: '', region: '', zone: '',
                    contactPhone: '', alternatePhone: '', emergencyContact: '', emergencyPhone: '',
                    emergencyRelation: '', nationalId: '', laborId: '', passportNumber: '', passportExpiryDate: '',
                    fatherName: '', motherName: '', bankName: '', bankAccountNumber: '', bankBranch: ''
                  });
                  setSkills({ education: '', role: '', experience: '', destination: '', languages: [], additionalSkills: '' });
          setDocs({ docPath: '', tgVideoId: '', passportSizePhoto: '', fullBodyPhoto: '' });
                  setResult(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <span>+</span> Register New Employee
              </button>
              <button
                type="button"
                onClick={() => setShowDraftSelector(true)}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Search & Edit Draft
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Draft Selector Modal */}
      {showDraftSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink">Saved Drafts</h3>
              <button
                type="button"
                onClick={() => setShowDraftSelector(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search by name, passport, or phone..."
                value={draftSearchQuery}
                onChange={(e) => setDraftSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none"
              />
              {draftSearchQuery && (
                <button
                  type="button"
                  onClick={() => setDraftSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {existingDrafts.filter(d => {
              const query = draftSearchQuery.toLowerCase();
              if (!query) return true;
              const name = `${d.personal?.firstName || ''} ${d.personal?.lastName || ''}`.toLowerCase();
              const passport = d.personal?.passportNumber?.toLowerCase() || '';
              const phone = d.personal?.contactPhone?.toLowerCase() || '';
              return name.includes(query) || passport.includes(query) || phone.includes(query);
            }).length > 0 ? (
              <div className="space-y-3">
                {existingDrafts.filter(d => {
              const query = draftSearchQuery.toLowerCase();
              if (!query) return true;
              const name = `${d.personal?.firstName || ''} ${d.personal?.lastName || ''}`.toLowerCase();
              const passport = d.personal?.passportNumber?.toLowerCase() || '';
              const phone = d.personal?.contactPhone?.toLowerCase() || '';
              return name.includes(query) || passport.includes(query) || phone.includes(query);
            }).map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:border-brand-300"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-ink">
                        {draft.personal?.firstName || 'Unnamed'} {draft.personal?.lastName || ''}
                      </p>
                      <p className="text-sm text-slate-500">
                        Step {draft.step + 1}: {steps[draft.step]} • Created: {new Date(draft.createdAt).toLocaleDateString()}
                      </p>
                      {(draft.personal?.passportNumber || draft.personal?.contactPhone) && (
                        <p className="text-xs text-slate-400 mt-1">
                          {draft.personal?.passportNumber && <span>Passport: {draft.personal.passportNumber} </span>}
                          {draft.personal?.contactPhone && <span>Phone: {draft.personal.contactPhone}</span>}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => loadDraft(draft.id)}
                        className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                      >
                        Continue
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDraft(draft.id)}
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">{draftSearchQuery ? 'No drafts match your search.' : 'No saved drafts found.'}</p>
                <p className="text-sm text-slate-400 mt-2">Click "Start New Registration" to begin.</p>
              </div>
            )}

            <button
              type="button"
              onClick={startNewRegistration}
              className="mt-4 w-full rounded-2xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Start New Registration
            </button>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink flex items-center gap-2">
                <Video className="h-6 w-6 text-purple-600" />
                Record Interview
              </h3>
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="rounded-full p-2 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Via Telegram</span>
              </div>
              <p className="text-sm text-purple-700">
                Videos are sent to your private Telegram channel for secure storage and streaming to international partners.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employee Name
              </label>
              <input
                type="text"
                value={`${personal.firstName} ${personal.lastName}`.trim()}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Video File
              </label>
              <input
                type="file"
                accept="video/*"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setInterviewUploading(true);
                  try {
                    const fd = new FormData();
                    fd.append('video', file);
                    fd.append('employeeName', `${personal.firstName} ${personal.lastName}`.trim());
                    const res = await fetch('/api/telegram/interview', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.success && data.data?.fileId) {
                      setDocs(d => ({ ...d, tgVideoId: data.data.fileId }));
                      setShowInterviewModal(false);
                    }
                  } catch (err) {
                    console.error('Interview upload failed:', err);
                  } finally {
                    setInterviewUploading(false);
                  }
                }}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
