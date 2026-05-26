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
  woreda: string;
  kebele: string;
  contactPhone: string;
  alternatePhone: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  nationalId: string;
  laborId: string;
  passportNumber: string;
  passportExpiryDate: string;
  passportIssuingDate: string;
  passportPlaceOfIssue: string;
  fatherName: string;
  motherName: string;
  bankName: string;
  bankAccountNumber: string;
  bankBranch: string;
  medicalHistory: string;
  religion: string;
};

type SkillsData = {
  education: string;
  role: string;
  experience: string;
  destination: string;
  languages: string[];
  additionalSkills: string;
};

type DocumentsData = { docPath: string; tgVideoId: string; passportSizePhoto: string; fullBodyPhoto: string; pdfDocuments: string[] };

// Psychology assessment â€” 8 questions, each scored 0-3
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

// Interview psychological assessment
const INTERVIEW_PSYCH_QUESTIONS = [
  { id: 'int1', text: 'How do you feel about working in a Muslim-majority country?', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
  { id: 'int2', text: 'How will you handle dietary differences (Injera vs rice-based meals)?', options: ['I will struggle greatly', 'I will have some difficulty', 'I can adapt reasonably well', 'I am fully prepared'] },
  { id: 'int3', text: 'How do you feel about working for employers from different religious backgrounds?', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
  { id: 'int4', text: 'How familiar are you with Middle Eastern culture and customs?', options: ['Not at all familiar', 'Slightly familiar', 'Moderately familiar', 'Very familiar'] },
  { id: 'int5', text: 'How will you communicate if you don\'t speak Arabic fluently?', options: ['I will struggle greatly', 'I will have difficulty', 'I can manage with basic phrases', 'I will find ways to communicate'] },
  { id: 'int6', text: 'How do you feel about living in urban areas after coming from rural Ethiopia?', options: ['Very overwhelming', 'Somewhat challenging', 'I can adapt', 'I look forward to it'] },
  { id: 'int7', text: 'How familiar are you with modern home appliances?', options: ['Not at all familiar', 'Slightly familiar', 'Moderately familiar', 'Very familiar'] },
  { id: 'int8', text: 'How do you plan to handle homesickness while working abroad?', options: ['I don\'t have a plan', 'I will rely on occasional calls', 'I will stay busy and connected', 'I am prepared emotionally'] },
];

// New assessment sections
const LANGUAGE_ASSESSMENT = [
  { id: 'lang1', text: 'How well do you speak Amharic?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang2', text: 'How well do you speak Oromo?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang3', text: 'How well do you understand English?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
  { id: 'lang4', text: 'How well do you understand Arabic?', options: ['Not at all', 'Basic phrases', 'Conversational', 'Fluent'] },
];

const DOMESTIC_WORK_ASSESSMENT = [
  { id: 'dom1', text: 'Experience with cooking Ethiopian food', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom2', text: 'Experience with cleaning and household chores', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom3', text: 'Experience with childcare', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'dom4', text: 'Experience with elderly care', options: ['None', 'Basic', 'Good', 'Expert'] },
];

const APPLIANCE_ASSESSMENT = [
  { id: 'app1', text: 'Experience with modern kitchen appliances', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app2', text: 'Experience with washing machines and dryers', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app3', text: 'Experience with vacuum cleaners', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'app4', text: 'Experience with home security systems', options: ['None', 'Basic', 'Good', 'Expert'] },
];

const CULTURE_ASSESSMENT = [
  { id: 'cult1', text: 'Knowledge of Middle Eastern food culture', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult2', text: 'Knowledge of Western food culture', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult3', text: 'Experience with different religious practices', options: ['None', 'Basic', 'Good', 'Expert'] },
  { id: 'cult4', text: 'Comfort level with cultural differences', options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable'] },
];

// Psychological Interview â€” professional interviewer evaluation
const PSYCH_INTERVIEW_RATINGS = ['Poor', 'Below Average', 'Average', 'Good', 'Excellent'];

const PSYCH_INTERVIEW_SECTION = [
  { id: 'psychInterview_emotionalStability', text: 'Emotional Stability & Resilience', desc: 'How well does the candidate handle stress and emotional challenges?' },
  { id: 'psychInterview_socialAdaptability', text: 'Social Adaptability', desc: 'Ability to adjust to new social environments and cultural norms.' },
  { id: 'psychInterview_communicationSkills', text: 'Communication Skills', desc: 'Clarity in expressing thoughts, listening ability, and responsiveness.' },
  { id: 'psychInterview_workMotivation', text: 'Work Motivation & Commitment', desc: 'Genuine motivation to work abroad and complete the contract.' },
  { id: 'psychInterview_selfAwareness', text: 'Self-Awareness & Realistic Expectations', desc: 'Does the candidate have realistic expectations about working abroad?' },
  { id: 'psychInterview_problemSolving', text: 'Problem-Solving & Conflict Resolution', desc: 'How would the candidate handle disputes or difficult situations at work?' },
];

const RETURN_RISK_ASSESSMENT = [
  { id: 'risk1', text: 'How likely are you to return home before 6 months?', options: ['Very likely', 'Somewhat likely', 'Unlikely', 'Very unlikely'] },
  { id: 'risk2', text: 'What would make you return early? (Select all that apply)', options: ['Homesickness', 'Culture shock', 'Poor working conditions', 'Family emergency', 'Financial reasons', 'None of the above'], multiple: true },
  { id: 'risk3', text: 'How prepared are you for potential challenges?', options: ['Not prepared at all', 'Somewhat prepared', 'Well prepared', 'Very well prepared'] },
  { id: 'risk4', text: 'Do you have a plan to stay committed for the full contract?', options: ['No plan', 'Basic plan', 'Detailed plan', 'Very committed'] },
];

const MEDICAL_HISTORY_SECTION = [
  { id: 'med1', text: 'Do you have any chronic medical conditions?', options: ['None', 'Mild (managed)', 'Moderate', 'Severe'] },
  { id: 'med2', text: 'Do you have any allergies (food, medication, environmental)?', options: ['None', 'Mild', 'Moderate', 'Severe'] },
  { id: 'med3', text: 'Do you have any history of mental health conditions?', options: ['None', 'Mild', 'Moderate', 'Severe'] },
  { id: 'med4', text: 'Are you currently taking any medications?', options: ['None', 'Occasional', 'Regular', 'Multiple medications'] },
  { id: 'med5', text: 'Have you ever been hospitalized for serious conditions?', options: ['Never', 'Once', '2-3 times', 'Multiple times'] },
  { id: 'med6', text: 'Do you have any physical limitations?', options: ['None', 'Minor', 'Moderate', 'Significant'] },
];

type PsychologyData = { [key: string]: number | string[] };

type Draft = {
  id: string;
  personal: PersonalData;
  skills: SkillsData;
  docs: DocumentsData;
  psychology: PsychologyData;
  step: number;
  createdAt: string;
};

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
      } catch {} finally { setLoadingDrafts(false); }
    };
    fetchDrafts();
  }, []);

  // Get zones for selected region
  const selectedRegionData = ethiopianRegions.find((r) => r.region === personal.region);
  const zones = selectedRegionData?.zones || [];

  // Get woredas for selected zone
  const selectedZoneData = zones.find((z: any) => z.name === personal.zone);
  const woredas = (selectedZoneData as any)?.woredas || [];

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

  const getPsychScore = () => {
    if (PSYCH_QUESTIONS.length === 0) return 0;
    const numericValues = Object.values(psychology).filter(value => typeof value === 'number') as number[];
    return Math.round((numericValues.reduce((a, b) => a + b, 0) / (PSYCH_QUESTIONS.length * 3)) * 100);
  };

  const getPsychClass = () => {
    const s = getPsychScore();
    if (s >= 75) return 'bg-emerald-500';
    if (s >= 50) return 'bg-amber-400';
    return 'bg-red-500';
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
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mt-0">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">Register New Employee</h2>
          <p className="mt-1 text-sm text-slate-500">Fill in all sections below â€” Personal, Skills, Assessment, Documents â€” then review and submit.</p>
        </div>
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
            <button type="button" onClick={() => setShowEmployeeSearch(false)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button>
          </div>
          {searchingEmployees && <p className="mt-3 text-sm text-slate-500">Searching...</p>}
          {!searchingEmployees && searchedEmployees.length > 0 && (
            <div className="mt-3 max-h-60 overflow-auto rounded-lg border border-slate-200 bg-white">
              {searchedEmployees.map((emp) => (
                <button key={emp.id} type="button" onClick={() => loadEmployeeForEdit(emp)} className="flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50">
                  <div>
                    <p className="font-semibold text-ink">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-slate-500">{emp.passportNumber && `Passport: ${emp.passportNumber} `}{emp.contactPhone && `â€¢ Phone: ${emp.contactPhone}`}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    emp.status === 'REGISTERED' ? 'bg-blue-50 text-blue-700' :
                    emp.status === 'INTERVIEW_UPLOADED' ? 'bg-purple-50 text-purple-700' :
                    emp.status === 'PROCESSING' ? 'bg-yellow-50 text-yellow-700' :
                    emp.status === 'DEPLOYED' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                  }`}>{emp.status || 'Registered'}</span>
                </button>
              ))}
            </div>
          )}
          {!searchingEmployees && employeeSearchQuery && searchedEmployees.length === 0 && (
            <p className="mt-3 text-sm text-slate-500">No employees found matching "{employeeSearchQuery}"</p>
          )}
        </div>
      )}

      {/* Tabbed Folder Wizard */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {steps.map((stepName, index) => (
            <button
              key={index}
              onClick={() => setStep(index)}
              className={`relative px-6 py-4 text-sm font-medium transition-colors min-w-[120px] ${
                step === index
                  ? 'text-brand-700 bg-white border-b-2 border-brand-600 font-semibold z-10'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                  step === index
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {index + 1}
                </span>
                {stepName}
                {getStepCompletionStatus(index) && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              {/* Left tab edge */}
              {index === 0 && (
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white border-r border-slate-200"></div>
              )}
              {/* Right tab edge */}
              {index === steps.length - 1 && (
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white border-l border-slate-200"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content - Only active tab is rendered for performance */}
        <div className="p-6">
          {/* Tab 1: Personal Identity */}
          {step === 0 && (
            <div className="space-y-4">
              {/* Passport Scanner */}
              <PassportScanner onAutoFill={handlePassportAutoFill} />

              {/* Unified Passport & Personal Information */}
              <div className="rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <ScanLine className="h-5 w-5 text-blue-600" />
                  <h5 className="text-sm font-bold uppercase tracking-wider text-blue-800">Passport & Personal Information</h5>
                  <span className="text-[10px] text-blue-500 ml-2">(Auto-filled from passport scan)</span>
                </div>

                {/* Passport Details Section */}
                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Surname (Last Name) *</label>
                    <TextField value={personal.lastName} onChange={(v) => setPersonal({ ...personal, lastName: v })} required placeholder="e.g., TADESSE" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Given Names (First Name) *</label>
                    <TextField value={personal.firstName} onChange={(v) => setPersonal({ ...personal, firstName: v })} required placeholder="e.g., ABEBE" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Nationality *</label>
                    <SelectField value={personal.nationality} onChange={(v) => setPersonal({ ...personal, nationality: v })} options={countries} required />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Date of Birth *</label>
                    <TextField type="date" value={personal.dateOfBirth} onChange={(v) => setPersonal({ ...personal, dateOfBirth: v })} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Sex / Gender *</label>
                    <SelectField value={personal.gender} onChange={(v) => setPersonal({ ...personal, gender: v })} options={genders} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Marital Status</label>
                    <SelectField value={personal.maritalStatus} onChange={(v) => setPersonal({ ...personal, maritalStatus: v })} options={maritalStatus} />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Passport Number *</label>
                    <TextField value={personal.passportNumber} onChange={(v) => setPersonal({ ...personal, passportNumber: v })} required placeholder="e.g., ET1234567" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Passport Expiry Date *</label>
                    <TextField type="date" value={personal.passportExpiryDate} onChange={(v) => setPersonal({ ...personal, passportExpiryDate: v })} required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Passport Issue Date *</label>
                    <TextField type="date" value={personal.passportIssuingDate} onChange={(v) => setPersonal({ ...personal, passportIssuingDate: v })} required />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Place of Issue</label>
                    <TextField value={personal.passportPlaceOfIssue} onChange={(v) => setPersonal({ ...personal, passportPlaceOfIssue: v })} placeholder="e.g., Addis Ababa" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">National ID *</label>
                    <TextField value={personal.nationalId} onChange={(v) => setPersonal({ ...personal, nationalId: v })} required placeholder="e.g., 1234567890" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Labor ID</label>
                    <TextField value={personal.laborId} onChange={(v) => setPersonal({ ...personal, laborId: v })} placeholder="e.g., LAB-2024-001" />
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Father's Name</label>
                    <TextField value={personal.fatherName} onChange={(v) => setPersonal({ ...personal, fatherName: v })} placeholder="As in passport" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Mother's Name</label>
                    <TextField value={personal.motherName} onChange={(v) => setPersonal({ ...personal, motherName: v })} placeholder="As in passport" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-blue-700 mb-1 uppercase tracking-wide">Religion</label>
                    <SelectField value={personal.religion} onChange={(v) => setPersonal({ ...personal, religion: v })} options={['Christian (Orthodox)', 'Christian (Protestant)', 'Christian (Catholic)', 'Muslim', 'Other']} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Phone className="h-4 w-4 text-emerald-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Contact Information</h5>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <TextField label="Email *" type="email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} required placeholder="e.g., abebe@email.com" />
                  <TextField label="Phone *" type="tel" value={personal.contactPhone} onChange={(v) => setPersonal({ ...personal, contactPhone: v })} required placeholder="+251911234567" />
                  <TextField label="Alternate Phone" type="tel" value={personal.alternatePhone} onChange={(v) => setPersonal({ ...personal, alternatePhone: v })} placeholder="+251912345678" />
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-amber-700">Address</h5>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <SelectField label="Region *" value={personal.region} onChange={(v) => setPersonal({ ...personal, region: v, zone: '', woreda: '', kebele: '' })} options={ethiopianRegions.map((r) => r.region)} />
                  {personal.region && <SelectField label="Zone *" value={personal.zone} onChange={(v) => setPersonal({ ...personal, zone: v, woreda: '', kebele: '' })} options={zones.map((z) => z.name)} />}
                  {personal.zone && <SelectField label="Woreda *" value={personal.woreda} onChange={(v) => setPersonal({ ...personal, woreda: v })} options={woredas} />}
                  {personal.woreda && <TextField label="Kebele" value={personal.kebele} onChange={(v) => setPersonal({ ...personal, kebele: v })} placeholder="e.g., 01" />}
                </div>
              </div>

              {/* Medical History */}
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <h5 className="text-xs font-bold uppercase tracking-wider text-red-700">Medical History</h5>
                </div>
                <TextField label="Previous Medical Conditions" value={personal.medicalHistory} onChange={(v) => setPersonal({ ...personal, medicalHistory: v })} placeholder="List any previous medical conditions, surgeries, or chronic illnesses" />
              </div>
            </div>
          )}

          {/* Tab 2: Skills & Destination */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <SelectField label="Education" value={skills.education} onChange={(v) => setSkills({ ...skills, education: v })} options={educationLevels} />
                <SelectField label="Job Role" value={skills.role} onChange={(v) => setSkills({ ...skills, role: v })} options={jobRoles} />
                <SelectField label="Experience" value={skills.experience} onChange={(v) => setSkills({ ...skills, experience: v })} options={experienceLevels} />
              </div>
              <div className="grid gap-3 md:grid-cols-1">
                <SelectField label="Deploy Country *" value={skills.destination} onChange={(v) => setSkills({ ...skills, destination: v })} options={countries} />
              </div>
              
              {/* Language Selection with Interpreter Options */}
              <div>
                <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Languages & Interpreters *</h5>
                <div className="grid gap-2 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Primary Languages</label>
                    <select multiple value={skills.languages} onChange={(e) => { const selected = Array.from(e.target.selectedOptions, (o) => o.value); setSkills({ ...skills, languages: selected }); }} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none" style={{ minHeight: '80px' }}>
                      <option value="English">English</option>
                      <option value="Arabic">Arabic</option>
                      <option value="Amharic">Amharic</option>
                      <option value="Oromo">Oromo</option>
                      <option value="Tigrinya">Tigrinya</option>
                      <option value="Somali">Somali</option>
                    </select>
                  </div>
                  {skills.languages.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Selected Languages</label>
                      <div className="flex flex-wrap gap-1 p-2 rounded-lg border border-slate-200 bg-slate-50 min-h-[80px]">
                        {skills.languages.map((lang) => (
                          <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                            {lang}
                            <button type="button" onClick={() => setSkills({ ...skills, languages: skills.languages.filter((l) => l !== lang) })} className="hover:text-brand-900">âœ•</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-slate-600">
                  <p>Important: Employees will need interpreters for Arabic, Amharic, and Oromo in Middle Eastern countries.</p>
                </div>
              </div>
              
              <div className="grid gap-3 md:grid-cols-3">
                <TextField label="Additional Skills" value={skills.additionalSkills} onChange={(v) => setSkills({ ...skills, additionalSkills: v })} placeholder="e.g., First aid, Cooking" />
                <div></div> {/* Empty cell for alignment */}
                <div></div> {/* Empty cell for alignment */}
              </div>
            </div>
          )}

          {/* Tab 3: Bank Account */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Emergency Contact moved to top of bank section */}
              <div className="mb-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Emergency Contact</h5>
                <div className="grid gap-3 md:grid-cols-3">
                  <TextField label="Emergency Contact *" value={personal.emergencyContact} onChange={(v) => setPersonal({ ...personal, emergencyContact: v })} required placeholder="e.g., Sara Kebede" />
                  <TextField label="Emergency Phone *" type="tel" value={personal.emergencyPhone} onChange={(v) => setPersonal({ ...personal, emergencyPhone: v })} required placeholder="+251911234567" />
                  <SelectField label="Relationship *" value={personal.emergencyRelation} onChange={(v) => setPersonal({ ...personal, emergencyRelation: v })} options={['Spouse', 'Parent', 'Sibling', 'Child', 'Relative', 'Friend', 'Other']} />
                </div>
              </div>
              
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                <p className="text-xs text-emerald-700 mb-3">For salary remittance from abroad</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <SelectField label="Bank Name" value={personal.bankName} onChange={(v) => setPersonal({ ...personal, bankName: v })} options={['Commercial Bank of Ethiopia', 'Awash Bank', 'Dashen Bank', 'Bank of Abyssinia', 'Oromia Cooperative Bank', 'Berhan Bank', 'NIB International Bank', 'United Bank', 'Cooperative Bank of Oromia', 'Other']} />
                  <TextField label="Account Number" value={personal.bankAccountNumber} onChange={(v) => setPersonal({ ...personal, bankAccountNumber: v })} placeholder="e.g., 1000123456789" />
                  <TextField label="Branch" value={personal.bankBranch} onChange={(v) => setPersonal({ ...personal, bankBranch: v })} placeholder="e.g., Bole Branch" />
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Enhanced Psychological Assessment */}
          {step === 3 && (
            <div className="space-y-6">
              {/* Basic Psychological Assessment */}
              <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-4 mb-4">
                <h4 className="font-semibold text-violet-800 flex items-center gap-2">ðŸ§  Basic Psychological Assessment</h4>
                <p className="mt-1 text-xs text-violet-600">This assessment helps predict employee retention. Research shows ~20% of overseas workers return early. Answer honestly to get an accurate suitability score.</p>
                {Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span>
                        {(function() {
                          const answered = Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length;
                          const rawScore = Object.values(psychology).filter(key => typeof key === 'number').reduce((sum, v) => sum + v, 0);
                          const pctScore = Math.round((rawScore / (PSYCH_QUESTIONS.length * 3)) * 100);
                          if (pctScore >= 75) return 'Low Risk';
                          if (pctScore >= 50) return 'Medium Risk';
                          return 'High Risk â€” Consider Counseling';
                        })()}
                      </span>
                      <span className="text-slate-600">{Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length}/{PSYCH_QUESTIONS.length} answered</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div className={`h-full rounded-full transition-all ${getPsychClass()} w-full`} style={{ width: `${getPsychScore()}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Psychological Assessment */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <h4 className="font-semibold text-purple-800 flex items-center gap-2">ðŸ’¬ Interview Psychological Assessment</h4>
                <p className="mt-1 text-xs text-purple-600">Specific questions for Ethiopian employees working in Middle Eastern countries, addressing cultural and religious differences.</p>
                {INTERVIEW_PSYCH_QUESTIONS.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-purple-400 bg-purple-50 font-semibold text-purple-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-purple-500 bg-purple-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Psychological Interview â€” Professional Evaluation */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <h4 className="font-semibold text-indigo-800 flex items-center gap-2">ðŸ§‘â€âš•ï¸ Psychological Interview (Professional Evaluation)</h4>
                <p className="mt-1 text-xs text-indigo-600">To be completed by the interviewing officer. Assess the candidate through direct interaction and observation.</p>
                
                <div className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">1</span>
                    Interviewer Information
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    <TextField label="Interviewer Name *" value={psychInterview.interviewerName} onChange={(v) => setPsychInterview(prev => ({ ...prev, interviewerName: v }))} placeholder="e.g., Dr. Amanuel G." />
                    <TextField label="Interviewer Role" value={psychInterview.interviewerRole} onChange={(v) => setPsychInterview(prev => ({ ...prev, interviewerRole: v }))} placeholder="e.g., Psychologist" />
                    <TextField label="Interview Date *" type="date" value={psychInterview.interviewDate} onChange={(v) => setPsychInterview(prev => ({ ...prev, interviewDate: v }))} />
                  </div>
                </div>

                {PSYCH_INTERVIEW_SECTION.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-1">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{qi + 2}</span>
                      {q.text}
                    </p>
                    {q.desc && <p className="text-xs text-slate-500 mb-2 ml-7">{q.desc}</p>}
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                      {PSYCH_INTERVIEW_RATINGS.map((label, oi) => {
                        const key = q.id.replace('psychInterview_', '') as keyof typeof psychInterview;
                        const currentValue = psychInterview[key] as number;
                        return (
                          <button key={oi} type="button" onClick={() => setPsychInterview(prev => ({ ...prev, [key]: oi + 1 }))} className={`rounded-lg border px-2 py-2 text-center text-xs transition-all ${
                            currentValue === oi + 1
                              ? 'border-indigo-400 bg-indigo-50 font-semibold text-indigo-800'
                              : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}>
                            <span className={`mx-auto mb-1 block h-3 w-3 rounded-full border-2 ${
                              currentValue === oi + 1 ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                            }`} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Observations */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{PSYCH_INTERVIEW_SECTION.length + 2}</span>
                    Interview Observations
                  </p>
                  <textarea
                    value={psychInterview.observations}
                    onChange={(e) => setPsychInterview(prev => ({ ...prev, observations: e.target.value }))}
                    placeholder="Record your observations about the candidate's demeanor, confidence, body language, and overall presentation during the interview..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Overall Assessment */}
                <div className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                  <p className="text-sm font-semibold text-slate-800 mb-2">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{PSYCH_INTERVIEW_SECTION.length + 3}</span>
                    Overall Assessment
                  </p>
                  <div className="grid gap-3 md:grid-cols-3 mb-3">
                    <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'fit' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'fit' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'fit' ? 'text-emerald-800' : 'text-slate-700'}`}>Psychologically Fit</p>
                      <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'fit' ? 'text-emerald-600' : 'text-slate-500'}`}>Candidate is ready for deployment</p>
                    </button>
                    <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'counseling' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'counseling' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'counseling' ? 'text-amber-800' : 'text-slate-700'}`}>Needs Counseling</p>
                      <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'counseling' ? 'text-amber-600' : 'text-slate-500'}`}>Additional pre-departure counseling recommended</p>
                    </button>
                    <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'unfit' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'unfit' ? 'border-red-400 bg-red-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'unfit' ? 'text-red-800' : 'text-slate-700'}`}>Not Psychologically Fit</p>
                      <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'unfit' ? 'text-red-600' : 'text-slate-500'}`}>Candidate should not be deployed at this time</p>
                    </button>
                  </div>
                  <textarea
                    value={psychInterview.recommendations}
                    onChange={(e) => setPsychInterview(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="Additional recommendations, follow-up actions, or notes..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Language Assessment */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2">ðŸ—£ï¸ Language Skills Assessment</h4>
                <p className="mt-1 text-xs text-blue-600">Evaluate language proficiency for effective communication in different environments.</p>
                {LANGUAGE_ASSESSMENT.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-blue-400 bg-blue-50 font-semibold text-blue-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Domestic Work Assessment */}
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                <h4 className="font-semibold text-green-800 flex items-center gap-2">ðŸ  Domestic Work Experience</h4>
                <p className="mt-1 text-xs text-green-600">Assess experience with household tasks and domestic responsibilities.</p>
                {DOMESTIC_WORK_ASSESSMENT.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-green-400 bg-green-50 font-semibold text-green-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-green-500 bg-green-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Appliance Familiarity Assessment */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <h4 className="font-semibold text-amber-800 flex items-center gap-2">ðŸ”Œ Appliance Familiarity</h4>
                <p className="mt-1 text-xs text-amber-600">Evaluate comfort level with modern household appliances and technology. Many Ethiopian employees from rural areas may have limited experience with modern appliances.</p>
                {APPLIANCE_ASSESSMENT.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-amber-400 bg-amber-50 font-semibold text-amber-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Culture & Religion Assessment */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                <h4 className="font-semibold text-purple-800 flex items-center gap-2">ðŸŒ Culture & Religion Awareness</h4>
                <p className="mt-1 text-xs text-purple-600">Assess understanding of different cultures, religions, and social norms. Important for Ethiopian employees working in Muslim-majority countries.</p>
                {CULTURE_ASSESSMENT.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-purple-400 bg-purple-50 font-semibold text-purple-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-purple-500 bg-purple-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Medical History Assessment */}
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <h4 className="font-semibold text-red-800 flex items-center gap-2">ðŸ¥ Medical History Assessment</h4>
                <p className="mt-1 text-xs text-red-600">Evaluate medical history to ensure employees are fit for overseas work and have no conditions that may be exacerbated by the new environment.</p>
                {MEDICAL_HISTORY_SECTION.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                          psychology[q.id] === oi
                            ? 'border-red-400 bg-red-50 font-semibold text-red-800'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}>
                          <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                            psychology[q.id] === oi ? 'border-red-500 bg-red-500' : 'border-slate-300'
                          }`} />
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Return Risk Assessment */}
              <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
                <h4 className="font-semibold text-red-800 flex items-center gap-2">âš ï¸ Early Return Risk Assessment</h4>
                <p className="mt-1 text-xs text-red-600">Evaluate likelihood of returning before 6 months to reduce early turnover. Consider cultural shock, food differences, and religious factors.</p>
                {RETURN_RISK_ASSESSMENT.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-3 mb-3">
                    <p className="text-sm font-semibold text-slate-800 mb-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">{qi + 1}</span>
                      {q.text}
                    </p>
                    {q.multiple ? (
                      <div className="grid gap-2">
                        {q.options.map((opt, oi) => (
                          <button
                            key={oi}
                            type="button"
                            onClick={() => {
                              const currentValues = (psychology[q.id] as string[]) || [];
                              const newValue = opt;
                              if (currentValues.includes(newValue)) {
                                setPsychology(prev => ({ ...prev, [q.id]: currentValues.filter(v => v !== newValue) }));
                              } else {
                                setPsychology(prev => ({ ...prev, [q.id]: [...currentValues, newValue] }));
                              }
                            }}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                              (psychology[q.id] as string[] || []).includes(opt)
                                ? 'border-red-400 bg-red-50 font-semibold text-red-800'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                              (psychology[q.id] as string[] || []).includes(opt) ? 'border-red-500 bg-red-500' : 'border-slate-300'
                            }`} />
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {q.options.map((opt, oi) => (
                          <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                            psychology[q.id] === oi
                              ? 'border-red-400 bg-red-50 font-semibold text-red-800'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}>
                            <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                              psychology[q.id] === oi ? 'border-red-500 bg-red-500' : 'border-slate-300'
                            }`} />
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Overall Assessment Summary */}
              {Object.keys(psychology).length >= PSYCH_QUESTIONS.length + LANGUAGE_ASSESSMENT.length + DOMESTIC_WORK_ASSESSMENT.length + APPLIANCE_ASSESSMENT.length + CULTURE_ASSESSMENT.length + RETURN_RISK_ASSESSMENT.length + INTERVIEW_PSYCH_QUESTIONS.length + MEDICAL_HISTORY_SECTION.length && (
                <div className={`rounded-2xl border p-4 bg-opacity-50 ${
                  getPsychScore() >= 75 ? 'bg-emerald-50 border-emerald-200' :
                  getPsychScore() >= 50 ? 'bg-amber-50 border-amber-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <p className={`font-bold text-sm ${
                    getPsychScore() >= 75 ? 'text-emerald-700' :
                    getPsychScore() >= 50 ? 'text-amber-700' :
                    'text-red-700'
                  }`}>
                    Assessment Complete â€” Overall Suitability Score: {getPsychScore()}/100
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {getPsychScore() >= 75 ? 'Employee shows strong suitability indicators. Recommended for deployment.' :
                     getPsychScore() >= 50 ? 'Employee may need additional pre-departure counseling before deployment.' :
                     'High early-return risk. Mandatory counseling session recommended before proceeding.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Documents */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-3 mb-4">
                <p className="text-xs text-brand-700 flex items-center gap-2">
                  <Upload className="h-3.5 w-3.5" />
                  Photos and documents are stored securely via Telegram bot. JPG, PNG, PDF accepted.
                </p>
              </div>
              
              {/* Passport Size Photo */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Passport Size Photo</h5>
                {docs.passportSizePhoto ? (
                  <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white">
                      <img src={`/api/telegram/photo/${docs.passportSizePhoto}`} alt="Passport size" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-800">Uploaded</p>
                      <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
                    </div>
                    <button type="button" onClick={() => setDocs({ ...docs, passportSizePhoto: '' })} className="flex-shrink-0 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'}`}>
                    {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400" />}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{uploadingFiles ? 'Uploading...' : 'Upload Passport Size Photo'}</p>
                      <p className="text-xs text-slate-400">Click to select or drag & drop</p>
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
              
              {/* Full Body Photo */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Body Photo</h5>
                {docs.fullBodyPhoto ? (
                  <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-emerald-300 bg-white">
                      <img src={`/api/telegram/photo/${docs.fullBodyPhoto}`} alt="Full body" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-emerald-800">Uploaded</p>
                      <p className="text-xs text-emerald-600">Stored securely via Telegram</p>
                    </div>
                    <button type="button" onClick={() => setDocs({ ...docs, fullBodyPhoto: '' })} className="flex-shrink-0 text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'}`}>
                    {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Camera className="h-5 w-5 text-slate-400" />}
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{uploadingFiles ? 'Uploading...' : 'Upload Full Body Photo'}</p>
                      <p className="text-xs text-slate-400">Click to select or drag & drop</p>
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
              
              {/* PDF/Documents Upload */}
              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Documents & Certificates</h5>
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
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 ${uploadingFiles ? 'border-brand-300 bg-brand-50' : 'border-slate-300 hover:border-brand-400 hover:bg-brand-50/30'}`}>
                  {uploadingFiles ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <FileText className="h-5 w-5 text-slate-400" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{uploadingFiles ? 'Uploading...' : 'Upload PDF/Documents'}</p>
                    <p className="text-xs text-slate-400">Click to select or drag & drop (PDF, DOC, DOCX)</p>
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
              
              {/* Interview Video */}
              <div className="border-t border-slate-200 pt-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Interview Video</h5>
                {docs.tgVideoId ? (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <div className="flex-1"><p className="text-sm font-semibold text-emerald-800">Uploaded</p><p className="text-xs text-emerald-700">Stored via Telegram</p></div>
                    <button onClick={() => setDocs({ ...docs, tgVideoId: '' })} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setShowInterviewModal(true)} className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 bg-white p-3 hover:bg-purple-50">
                      <Video className="h-5 w-5 text-purple-500" /><span className="text-sm font-semibold text-purple-700">Record via Telegram</span>
                    </button>
                    <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 hover:bg-slate-50 cursor-pointer">
                      <Upload className="h-5 w-5 text-slate-400" /><span className="text-sm font-semibold text-slate-600">Upload Video</span>
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
                        } catch { } finally { setInterviewUploading(false); }
                      }} />
                    </label>
                  </div>
                )}
                {interviewUploading && <div className="flex items-center gap-2 text-sm text-purple-700 mt-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading to Telegram...</div>}
              </div>
              
              {uploadError && <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600"><AlertTriangle className="h-4 w-4" />{uploadError}<button onClick={() => setUploadError(null)} className="ml-auto text-red-400"><X className="h-4 w-4" /></button></div>}
            </div>
          )}

          {/* Tab 6: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h5 className="text-xs font-bold uppercase text-brand-600 mb-2">Personal Info</h5>
                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                  <p><strong>Name:</strong> {personal.firstName || '-'} {personal.lastName || '-'}</p>
                  <p><strong>DOB:</strong> {personal.dateOfBirth || '-'}</p>
                  <p><strong>Gender:</strong> {personal.gender || '-'}</p>
                  <p><strong>Marital:</strong> {personal.maritalStatus || '-'}</p>
                  <p><strong>Nationality:</strong> {personal.nationality || '-'}</p>
                  <p><strong>Religion:</strong> {personal.religion || '-'}</p>
                  <p><strong>Email:</strong> {personal.email || '-'}</p>
                  <p><strong>Phone:</strong> {personal.contactPhone || '-'}</p>
                  <p><strong>Alt Phone:</strong> {personal.alternatePhone || '-'}</p>
                  <p><strong>Region:</strong> {personal.region || '-'}</p>
                  <p><strong>Zone:</strong> {personal.zone || '-'}</p>
                  <p><strong>Woreda:</strong> {personal.woreda || '-'}</p>
                  <p><strong>Kebele:</strong> {personal.kebele || '-'}</p>
                  <p><strong>Emergency:</strong> {personal.emergencyContact || '-'}</p>
                  <p><strong>Emergency Phone:</strong> {personal.emergencyPhone || '-'} ({personal.emergencyRelation || '-'})</p>
                </div>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <h5 className="text-xs font-bold uppercase text-blue-600 mb-2">Passport Information</h5>
                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                  <p><strong>Passport:</strong> {personal.passportNumber || '-'}</p>
                  <p><strong>Expiry:</strong> {personal.passportExpiryDate || '-'}</p>
                  <p><strong>Issuing Date:</strong> {personal.passportIssuingDate || '-'}</p>
                  <p><strong>Place of Issue:</strong> {personal.passportPlaceOfIssue || '-'}</p>
                  <p><strong>National ID:</strong> {personal.nationalId || '-'}</p>
                  <p><strong>Labor ID:</strong> {personal.laborId || '-'}</p>
                </div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <h5 className="text-xs font-bold uppercase text-emerald-600 mb-2">Skills & Bank</h5>
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
                <h5 className="text-xs font-bold uppercase text-violet-600 mb-2">Assessment & Documents</h5>
                <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-3">
                  <p><strong>Psychology:</strong> {Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length}/{PSYCH_QUESTIONS.length} ({Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length === PSYCH_QUESTIONS.length ? (() => { const r = Object.values(psychology).filter(key => typeof key === 'number').reduce((a, b) => a + b, 0); return Math.round((r / (PSYCH_QUESTIONS.length * 3)) * 100); })() : 0}%)</p>
                  <p><strong>Interview Psych:</strong> {Object.keys(psychology).filter(key => INTERVIEW_PSYCH_QUESTIONS.some(q => q.id === key)).length}/{INTERVIEW_PSYCH_QUESTIONS.length}</p>
                  <p><strong>Psych Interviewer:</strong> {psychInterview.interviewerName || '-'}</p>
                  <p><strong>Psych Overall:</strong> {psychInterview.overallAssessment === 'fit' ? 'Fit' : psychInterview.overallAssessment === 'counseling' ? 'Needs Counseling' : psychInterview.overallAssessment === 'unfit' ? 'Unfit' : '-'}</p>
                  <p><strong>Language:</strong> {Object.keys(psychology).filter(key => LANGUAGE_ASSESSMENT.some(q => q.id === key)).length}/{LANGUAGE_ASSESSMENT.length}</p>
                  <p><strong>Domestic:</strong> {Object.keys(psychology).filter(key => DOMESTIC_WORK_ASSESSMENT.some(q => q.id === key)).length}/{DOMESTIC_WORK_ASSESSMENT.length}</p>
                  <p><strong>Appliance:</strong> {Object.keys(psychology).filter(key => APPLIANCE_ASSESSMENT.some(q => q.id === key)).length}/{APPLIANCE_ASSESSMENT.length}</p>
                  <p><strong>Culture:</strong> {Object.keys(psychology).filter(key => CULTURE_ASSESSMENT.some(q => q.id === key)).length}/{CULTURE_ASSESSMENT.length}</p>

                  <p><strong>Return Risk:</strong> {Object.keys(psychology).filter(key => RETURN_RISK_ASSESSMENT.some(q => q.id === key)).length}/{RETURN_RISK_ASSESSMENT.length}</p>
                  <p><strong>Passport Photo:</strong> {docs.passportSizePhoto ? 'Yes' : 'No'}</p>
                  <p><strong>Full Body Photo:</strong> {docs.fullBodyPhoto ? 'Yes' : 'No'}</p>
                  <p><strong>Interview Video:</strong> {docs.tgVideoId ? 'Uploaded' : 'No'}</p>
                  <p><strong>Documents:</strong> {docs.pdfDocuments.length > 0 ? `${docs.pdfDocuments.length} files` : 'No'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 border-t border-slate-200 pt-5">
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
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
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
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-slate-500">
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
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >Search & Edit Draft</button>
            </div>
          )}
        </div>
      )}

      {/* Draft Selector Modal */}
      {showDraftSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-full max-w-lg overflow-auto rounded-3xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-ink">Saved Drafts</h3>
              <button type="button" onClick={() => setShowDraftSelector(false)} className="rounded-full p-2 hover:bg-slate-100">âœ•</button>
            </div>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search by name, passport, or phone..."
                value={draftSearchQuery}
                onChange={(e) => setDraftSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-2 pr-10 text-sm focus:border-brand-500 focus:outline-none"
              />
              {draftSearchQuery && (
                <button type="button" onClick={() => setDraftSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">âœ•</button>
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
                  <div key={draft.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{draft.personal?.firstName || 'Unnamed'} {draft.personal?.lastName || ''}</p>
                      <p className="text-sm text-slate-500">Step {draft.step + 1}: {steps[draft.step]} â€¢ {new Date(draft.createdAt).toLocaleDateString()}</p>
                      {(draft.personal?.passportNumber || draft.personal?.contactPhone) && (
                        <p className="text-xs text-slate-400 mt-1">
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
                <p className="text-slate-500">{draftSearchQuery ? 'No drafts match your search.' : 'No saved drafts found.'}</p>
                <p className="text-sm text-slate-400 mt-2">Click "Start New Registration" to begin.</p>
              </div>
            )}
            <button type="button" onClick={startNewRegistration} className="mt-4 w-full rounded-2xl border border-slate-300 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Start New Registration</button>
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
              <button type="button" onClick={() => setShowInterviewModal(false)} className="rounded-full p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-4 rounded-2xl bg-purple-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Via Telegram</span>
              </div>
              <p className="text-sm text-purple-700">Videos are sent to your private Telegram channel for secure storage and streaming to international partners.</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Employee Name</label>
              <input type="text" value={`${personal.firstName} ${personal.lastName}`.trim()} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Video File</label>
              <input type="file" accept="video/*" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" onChange={async (e) => {
                const file = e.target.files?.[0]; if (!file) return;
                setInterviewUploading(true);
                try {
                  const fd = new FormData();
                  fd.append('video', file);
                  fd.append('employeeName', `${personal.firstName} ${personal.lastName}`);
                  const res = await fetch('/api/telegram/interview', { method: 'POST', body: fd });
                  const data = await res.json();
                  if (data.success && data.data?.fileId) { setDocs(d => ({ ...d, tgVideoId: data.data.fileId })); setShowInterviewModal(false); }
                } catch { } finally { setInterviewUploading(false); }
              }} />
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowInterviewModal(false)} className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const steps = ['Personal', 'Skills', 'Bank', 'Assessment', 'Documents', 'Review'];