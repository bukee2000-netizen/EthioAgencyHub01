'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search, FileText, Download, Share2, ChevronDown, ChevronUp, Eye, Save, Plus, X, Loader2,
  Camera, Palette, Type, Image, Building2, Globe, RefreshCw, CheckCircle2, AlertTriangle,
  User, Briefcase, GraduationCap, Languages, Heart, Phone, MapPin, Bookmark, Banknote, Brain
} from 'lucide-react';

type CVEmployee = {
  id: string; firstName?: string; lastName?: string; name?: string;
  fatherName?: string; motherName?: string;
  dateOfBirth?: string; gender?: string; maritalStatus?: string;
  nationality?: string; religion?: string;
  region?: string; zone?: string; woreda?: string; kebele?: string;
  contactPhone?: string; alternatePhone?: string; email?: string;
  passportNumber?: string; passportExpiryDate?: string;
  passportIssuingDate?: string; passportPlaceOfIssue?: string;
  nationalId?: string; laborId?: string;
  education?: string; role?: string; experience?: string;
  destination?: string; languages?: string[] | string;
  additionalSkills?: string;
  emergencyContact?: string; emergencyPhone?: string; emergencyRelation?: string;
  bankName?: string; bankAccountNumber?: string; bankBranch?: string;
  medicalHistory?: string;
  psychologyScore?: number; psychInterviewData?: string;
  passportSizePhotoPath?: string; fullBodyPhotoPath?: string;
  photoUrl?: string; fullPhotoUrl?: string;
  status: string; createdAt: string;
};

type CVTemplateConfig = {
  id?: string; name: string;
  layout: 'english-only' | 'arabic-only' | 'bilingual';
  style: 'standard' | 'professional' | 'modern' | 'elegant' | 'compact';
  logoUrl?: string; companyName?: string; companyAddress?: string;
  companyPhone?: string; companyEmail?: string; companyWebsite?: string;
  primaryColor: string; accentColor: string;
  fontSize: 'small' | 'normal' | 'large';
  showPassportPhoto: boolean; showFullBodyPhoto: boolean;
  isDefault?: boolean;
};

const DEFAULT_CONFIG: CVTemplateConfig = {
  name: 'Default', layout: 'bilingual', style: 'standard',
  companyName: 'Ethio Agency Hub', companyAddress: 'Addis Ababa, Ethiopia',
  companyPhone: '+251-XXX-XXXX', companyEmail: 'info@ethioagencyhub.com',
  primaryColor: '#1e40af', accentColor: '#059669',
  fontSize: 'normal', showPassportPhoto: true, showFullBodyPhoto: true,
};

const STYLES: { id: string; name: string; desc: string; icon: string }[] = [
  { id: 'standard', name: 'Standard', desc: 'Blue headers, clean borders', icon: '\u{1F4C4}' },
  { id: 'professional', name: 'Professional', desc: 'Gold header bar, executive', icon: '\u{1F4CB}' },
  { id: 'modern', name: 'Modern', desc: 'Left sidebar layout, minimal', icon: '\u2728' },
  { id: 'elegant', name: 'Elegant', desc: 'Ornate borders, premium feel', icon: '\u{1F3AF}' },
  { id: 'compact', name: 'Compact', desc: 'Dense text, one-page max', icon: '\u{1F4DD}' },
];

const LAYOUTS: { id: string; name: string; desc: string }[] = [
  { id: 'english-only', name: 'English Only', desc: 'Full page English' },
  { id: 'arabic-only', name: 'Arabic Only', desc: 'Full page Arabic (RTL)' },
  { id: 'bilingual', name: 'Bilingual', desc: 'English + Arabic side-by-side' },
];

const FONT_SCALE = {
  small: { xs: 7, sm: 8, md: 9, lg: 10, xl: 12, title: 16 },
  normal: { xs: 8, sm: 9, md: 10, lg: 12, xl: 14, title: 18 },
  large: { xs: 9, sm: 10, md: 11, lg: 13, xl: 16, title: 20 },
};

export const CvGenerator = CVGeneratorModule;

export function CVGeneratorModule() {
  const [employees, setEmployees] = useState<CVEmployee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<CVEmployee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [layout, setLayout] = useState<'english-only' | 'arabic-only' | 'bilingual'>('bilingual');
  const [style, setStyle] = useState<'standard' | 'professional' | 'modern' | 'elegant' | 'compact'>('standard');
  const [config, setConfig] = useState<CVTemplateConfig>({ ...DEFAULT_CONFIG });
  const fs = (level: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'title') => FONT_SCALE[config.fontSize][level];
  const [savedTemplates, setSavedTemplates] = useState<CVTemplateConfig[]>([]);
  const [showCustomization, setShowCustomization] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedCvs, setGeneratedCvs] = useState<any[]>([]);
  const [generatedCv, setGeneratedCv] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const searchProgrammaticRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { loadSavedTemplates(); loadRecentCvs(); }, []);

  useEffect(() => {
    if (searchProgrammaticRef.current) { searchProgrammaticRef.current = false; return; }
    if (searchQuery.length >= 2) searchEmployees(searchQuery);
    else if (searchQuery.length === 0) setEmployees([]);
  }, [searchQuery]);

  const notify = (msg: string) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };

  const loadSavedTemplates = async () => {
    try {
      const res = await fetch('/api/cvs/templates');
      const data = await res.json();
      if (data.success) {
        const templates = (data.data || []).map((t: any) => ({ ...t, isDefault: t.isDefault }));
        setSavedTemplates(templates);
        const def = templates.find((t: CVTemplateConfig) => t.isDefault);
        if (def) applyTemplate(def);
      }
    } catch {}
  };

  const loadRecentCvs = async () => {
    try {
      const res = await fetch('/api/cvs?limit=5');
      const data = await res.json();
      if (data.success) setGeneratedCvs(data.data || []);
    } catch {}
  };

  const searchEmployees = async (q: string) => {
    setSearching(true);
    setShowSearchResults(true);
    try {
      const res = await fetch(`/api/employees/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setEmployees(data.data.slice(0, 10));
        return;
      }
      setEmployees([]);
    } catch { setEmployees([]); }
    finally { setSearching(false); }
  };

  const loadEmployeeData = async (emp: CVEmployee) => {
    try {
      const res = await fetch(`/api/employees/${emp.id}`);
      const data = await res.json();
      if (data.success) setSelectedEmployee(data.data);
      else setSelectedEmployee(emp);
    } catch { setSelectedEmployee(emp); }
    setShowSearchResults(false);
    searchProgrammaticRef.current = true;
    setSearchQuery(`${emp.firstName || ''} ${emp.lastName || ''}`.trim());
  };

  const applyTemplate = (t: CVTemplateConfig) => {
    setConfig(t);
    setLayout(t.layout);
    setStyle(t.style);
  };

  const saveTemplate = async () => {
    const name = templateName.trim() || config.name;
    try {
      const res = await fetch('/api/cvs/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, name, layout, style }),
      });
      const data = await res.json();
      if (data.success) {
        notify('Template saved!');
        loadSavedTemplates();
        setTemplateName('');
      } else notify('Failed to save template');
    } catch { notify('Failed to save template'); }
  };

  const handleGenerate = async () => {
    if (!selectedEmployee) return;
    setGenerating(true);
    try {
      const htmlContent = previewRef.current?.innerHTML || '';
      const res = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          template: style,
          language: layout === 'arabic-only' ? 'ar' : 'en',
          layout, style,
          htmlContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedCv(data.data);
        notify('CV generated and saved!');
        loadRecentCvs();
      } else notify('Failed to generate CV');
    } catch { notify('Failed to generate CV'); }
    finally { setGenerating(false); }
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = 210; const pdfH = 297;
      const ratio = canvas.width / canvas.height;
      let finalW = pdfW, finalH = pdfW / ratio;
      if (finalH > pdfH) { finalH = pdfH; finalW = pdfH * ratio; }
      pdf.addImage(imgData, 'JPEG', (pdfW - finalW) / 2, 0, finalW, finalH);
      const name = selectedEmployee ? `${selectedEmployee.firstName || ''}_${selectedEmployee.lastName || ''}`.trim() : 'CV';
      pdf.save(`CV-${name}.pdf`);
      notify('PDF downloaded!');
    } catch { notify('Failed to generate PDF'); }
  };

  const getSafe = (emp: CVEmployee, field: string): string => {
    const val = (emp as any)[field];
    if (val === null || val === undefined || val === '') return '-';
    return String(val);
  };

  const getLanguages = (emp: CVEmployee): string => {
    if (!emp.languages) return '-';
    if (Array.isArray(emp.languages)) return emp.languages.join(', ');
    try { return JSON.parse(emp.languages).join(', '); } catch { return emp.languages; }
  };

  const getPhotoUrl = (path?: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/api/telegram/photo/${path}`;
  };

  const getPsychInterview = (emp: CVEmployee): {
    interviewerName?: string; interviewDate?: string; overallAssessment?: string; recommendations?: string;
    emotionalStability?: number; socialAdaptability?: number; communicationSkills?: number;
    workMotivation?: number; selfAwareness?: number; problemSolving?: number;
  } | null => {
    if (!emp.psychInterviewData) return null;
    try { return JSON.parse(emp.psychInterviewData); } catch { return null; }
  };

  const renderPsychSection = (emp: CVEmployee) => {
    const interview = getPsychInterview(emp);
    const hasScore = emp.psychologyScore !== null && emp.psychologyScore !== undefined;
    if (!hasScore && !interview) return null;
    return (
      <>
        {hasScore && renderField('Overall Score', `${emp.psychologyScore}/100`, 'النتيجة الإجمالية')}
        {interview?.overallAssessment && renderField('Assessment', interview.overallAssessment, 'التقييم العام')}
        {interview?.recommendations && renderField('Recommendations', interview.recommendations, 'التوصيات')}
        {interview?.interviewerName && renderField('Interviewer', interview.interviewerName, 'المقابِل')}
        {interview?.interviewDate && renderField('Interview Date', interview.interviewDate, 'تاريخ المقابلة')}
        {interview?.emotionalStability !== undefined && renderField('Emotional Stability', `${interview.emotionalStability}/10`, 'الاستقرار العاطفي')}
        {interview?.socialAdaptability !== undefined && renderField('Social Adaptability', `${interview.socialAdaptability}/10`, 'التكيف الاجتماعي')}
        {interview?.communicationSkills !== undefined && renderField('Communication Skills', `${interview.communicationSkills}/10`, 'مهارات التواصل')}
        {interview?.workMotivation !== undefined && renderField('Work Motivation', `${interview.workMotivation}/10`, 'الدافع الوظيفي')}
        {interview?.selfAwareness !== undefined && renderField('Self-Awareness', `${interview.selfAwareness}/10`, 'الوعي الذاتي')}
        {interview?.problemSolving !== undefined && renderField('Problem Solving', `${interview.problemSolving}/10`, 'حل المشكلات')}
      </>
    );
  };

  const renderAgencyHeader = () => {
    const logoUrl = getPhotoUrl(config.logoUrl);
    return (
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: `3px solid ${config.primaryColor}`, paddingBottom: 8, marginBottom: 12 }}>
        {config.showPassportPhoto && selectedEmployee && getPhotoUrl(selectedEmployee.passportSizePhotoPath || selectedEmployee.photoUrl) && (
          <img src={getPhotoUrl(selectedEmployee.passportSizePhotoPath || selectedEmployee.photoUrl)!}
            alt="Passport" style={{ height: 65, width: 65, borderRadius: '8px', objectFit: 'cover', border: `2px solid ${config.accentColor}`, marginRight: 16 }} />
        )}
        {logoUrl && <img src={logoUrl} alt="Logo" style={{ height: 50, width: 50, objectFit: 'contain', marginRight: 12 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: fs('title'), fontWeight: 'bold', color: config.primaryColor }}>{config.companyName || 'Company Name'}</div>
          <div style={{ fontSize: fs('sm'), color: '#64748b' }}>
            {[config.companyAddress, config.companyPhone, config.companyEmail, config.companyWebsite].filter(Boolean).join(' | ')}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (titleEn: string, titleAr: string, children: React.ReactNode) => (
    <div style={{ marginBottom: 10 }}>
      {layout === 'bilingual' && (
        <div style={{ display: 'flex', gap: 8, borderBottom: `2px solid ${config.primaryColor}40`, paddingBottom: 3, marginBottom: 5 }}>
          <div style={{ flex: 1, fontSize: fs('lg'), fontWeight: 'bold', color: config.primaryColor }}>{titleEn}</div>
          <div style={{ flex: 1, fontSize: fs('lg'), fontWeight: 'bold', color: config.accentColor, textAlign: 'right', direction: 'rtl' }}>{titleAr}</div>
        </div>
      )}
      {layout === 'english-only' && <div style={{ fontSize: fs('lg'), fontWeight: 'bold', color: config.primaryColor, borderBottom: `2px solid ${config.primaryColor}40`, paddingBottom: 3, marginBottom: 5 }}>{titleEn}</div>}
      {layout === 'arabic-only' && <div style={{ fontSize: fs('lg'), fontWeight: 'bold', color: config.primaryColor, textAlign: 'right', direction: 'rtl', borderBottom: `2px solid ${config.primaryColor}40`, paddingBottom: 3, marginBottom: 5 }}>{titleAr}</div>}
      {children}
    </div>
  );

  const renderField = (label: string, value: string, labelAr?: string) => {
    if (!value || value === '-') return null;
    if (layout === 'bilingual') {
      return (
        <div style={{ display: 'flex', gap: 4, marginBottom: 3, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, fontSize: fs('sm') }}><span style={{ color: '#64748b', fontWeight: 500 }}>{label}: </span><span style={{ color: '#1e293b' }}>{value}</span></div>
          <div style={{ width: 1, background: '#e2e8f0', alignSelf: 'stretch', margin: '0 4px' }} />
          <div style={{ flex: 1, fontSize: fs('sm'), textAlign: 'right', direction: 'rtl' }}>
            {labelAr ? <span style={{ color: '#64748b', fontWeight: 500 }}>{labelAr}: </span> : <span style={{ color: '#64748b', fontWeight: 500 }}>{label}: </span>}
            <span style={{ color: '#1e293b' }}>{value}</span>
          </div>
        </div>
      );
    }
    const isRtl = layout === 'arabic-only';
    const finalLabel = (isRtl && labelAr) ? labelAr : label;
    return (
      <div style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: isRtl ? 'right' : 'left', fontSize: fs('sm'), marginBottom: 3 }}>
        <span style={{ color: '#64748b', fontWeight: 500 }}>{finalLabel}: </span><span style={{ color: '#1e293b' }}>{value}</span>
      </div>
    );
  };

  const renderStandard = (e: CVEmployee) => (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#1e293b', padding: '0 4px', fontSize: fs('md') }}>
      {renderAgencyHeader()}
      {renderSection('PERSONAL INFORMATION', 'البيانات الشخصية',
        <>
          {renderField('Name', `${getSafe(e, 'firstName')} ${getSafe(e, 'lastName')}`.replace(' -', ''), 'الاسم')}
          {renderField('Father', getSafe(e, 'fatherName'), 'اسم الأب')}
          {renderField('Mother', getSafe(e, 'motherName'), 'اسم الأم')}
          {renderField('DOB', getSafe(e, 'dateOfBirth').slice(0, 10), 'تاريخ الميلاد')}
          {renderField('Gender', getSafe(e, 'gender'), 'الجنس')}
          {renderField('Marital', getSafe(e, 'maritalStatus'), 'الحالة الاجتماعية')}
          {renderField('Nationality', getSafe(e, 'nationality'), 'الجنسية')}
          {renderField('Religion', getSafe(e, 'religion'), 'الديانة')}
          {renderField('Region', getSafe(e, 'region'), 'المنطقة')}
          {renderField('Zone', getSafe(e, 'zone'), 'المقاطعة')}
          {renderField('Woreda', getSafe(e, 'woreda'), 'الناحية')}
          {renderField('Kebele', getSafe(e, 'kebele'), 'القبيلة')}
        </>
      )}
      {renderSection('CONTACT', 'الاتصال',
        <>
          {renderField('Phone', getSafe(e, 'contactPhone'), 'الهاتف')}
          {renderField('Alt Phone', getSafe(e, 'alternatePhone'), 'هاتف آخر')}
          {renderField('Email', getSafe(e, 'email'), 'البريد')}
        </>
      )}
      {renderSection('IDENTIFICATION', 'وثائق الهوية',
        <>
          {renderField('Passport', getSafe(e, 'passportNumber'), 'جواز السفر')}
          {renderField('Passport Exp', getSafe(e, 'passportExpiryDate').slice(0, 10), 'انتهاء الجواز')}
          {renderField('Issue Date', getSafe(e, 'passportIssuingDate').slice(0, 10), 'تاريخ الإصدار')}
          {renderField('Place of Issue', getSafe(e, 'passportPlaceOfIssue'), 'مكان الإصدار')}
          {renderField('National ID', getSafe(e, 'nationalId'), 'الهوية الوطنية')}
          {renderField('Labor ID', getSafe(e, 'laborId'), 'رقم العمل')}
        </>
      )}
      {renderSection('EDUCATION & EXPERIENCE', 'التعليم والخبرة',
        <>
          {renderField('Education', getSafe(e, 'education'), 'التعليم')}
          {renderField('Job Role', getSafe(e, 'role'), 'الوظيفة')}
          {renderField('Experience', getSafe(e, 'experience'), 'الخبرة')}
          {renderField('Destination', getSafe(e, 'destination'), 'الدولة')}
        </>
      )}
      {renderSection('LANGUAGES & SKILLS', 'اللغات والمهارات',
        <>
          {renderField('Languages', getLanguages(e), 'اللغات')}
          {renderField('Skills', getSafe(e, 'additionalSkills'), 'المهارات')}
        </>
      )}
      {renderSection('EMERGENCY CONTACT', 'جهة الاتصال في حالات الطوارئ',
        <>
          {renderField('Name', getSafe(e, 'emergencyContact'), 'الاسم')}
          {renderField('Phone', getSafe(e, 'emergencyPhone'), 'الهاتف')}
          {renderField('Relation', getSafe(e, 'emergencyRelation'), 'العلاقة')}
        </>
      )}
      {renderSection('BANK INFORMATION', 'المعلومات المصرفية',
        <>
          {renderField('Bank', getSafe(e, 'bankName'), 'البنك')}
          {renderField('Account', getSafe(e, 'bankAccountNumber'), 'رقم الحساب')}
          {renderField('Branch', getSafe(e, 'bankBranch'), 'الفرع')}
        </>
      )}
      {e.medicalHistory && renderSection('MEDICAL', 'المعلومات الطبية',
        <>{renderField('History', getSafe(e, 'medicalHistory'), 'التاريخ الطبي')}</>
      )}
      {((e.psychologyScore !== null && e.psychologyScore !== undefined) || getPsychInterview(e)) ? renderSection('PSYCHOLOGICAL ASSESSMENT', 'التقييم النفسي',
        <>{renderPsychSection(e)}</>
      ) : null}
      {config.showFullBodyPhoto && getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl) && (
        <div style={{ textAlign: 'left', marginTop: 8 }}>
          <div style={{ fontSize: fs('sm'), fontWeight: 'bold', color: config.primaryColor, marginBottom: 4 }}>Full Body Photo / صورة كاملة</div>
          <img src={getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl)!} alt="Full body"
            style={{ height: 160, objectFit: 'contain', borderRadius: 4, border: '1px solid #e2e8f0' }} />
        </div>
      )}
      <div style={{ marginTop: 8, paddingTop: 4, borderTop: '1px solid #e2e8f0', fontSize: fs('xs'), color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
        <span>Generated by {config.companyName || 'Ethio Agency Hub'}</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );

  const renderProfessional = (e: CVEmployee) => (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1e293b', fontSize: fs('md') }}>
      <div style={{ background: `linear-gradient(135deg, ${config.accentColor}, ${config.primaryColor})`, color: 'white', padding: '12 16', borderRadius: '4 4 0 0', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
        {config.showPassportPhoto && getPhotoUrl(e.passportSizePhotoPath || e.photoUrl) &&
          <img src={getPhotoUrl(e.passportSizePhotoPath || e.photoUrl)!} alt="" style={{ height: 60, width: 60, borderRadius: '8px', border: '2px solid white', marginRight: 16 }} />}
        {getPhotoUrl(config.logoUrl) && <img src={getPhotoUrl(config.logoUrl)!} alt="" style={{ height: 40, borderRadius: '50%', marginRight: 10 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: fs('title'), fontWeight: 'bold' }}>{config.companyName}</div>
          <div style={{ fontSize: fs('xs'), opacity: 0.8 }}>{[config.companyAddress, config.companyPhone].filter(Boolean).join(' | ')}</div>
        </div>
      </div>
      <div style={{ fontSize: fs('xl'), fontWeight: 'bold', textAlign: 'center', marginBottom: 2 }}>
        {e.firstName} {e.lastName}
      </div>
      <div style={{ fontSize: fs('sm'), textAlign: 'center', color: '#64748b', marginBottom: 10, fontStyle: 'italic' }}>
        {[e.role, e.destination].filter(Boolean).join(' → ')}
      </div>
      {[
        ['Personal Info', `${e.gender || ''} | ${e.maritalStatus || ''} | ${e.nationality || ''}${e.religion ? ' | ' + e.religion : ''}${e.dateOfBirth ? ' | DOB: ' + e.dateOfBirth.slice(0, 10) : ''}`],
        ['Contact', `Phone: ${e.contactPhone || ''}${e.email ? ' | Email: ' + e.email : ''}`],
        ['Address', [e.region, e.zone, e.woreda, e.kebele].filter(Boolean).join(', ') || '-'],
        ['Passport', [`#${e.passportNumber || '-'}`, e.passportExpiryDate ? `Exp: ${e.passportExpiryDate.slice(0, 10)}` : '', e.passportIssuingDate ? `Issued: ${e.passportIssuingDate.slice(0, 10)}` : '', e.passportPlaceOfIssue ? `Place: ${e.passportPlaceOfIssue}` : '', e.nationalId ? `ID: ${e.nationalId}` : '', e.laborId ? `Labor: ${e.laborId}` : ''].filter(Boolean).join(' | ')],
        ['Education & Role', `${e.education || '-'} | ${e.role || '-'} | ${e.experience || '-'}`],
        ['Destination', e.destination || '-'],
        ['Languages', getLanguages(e)],
        e.additionalSkills ? ['Skills', e.additionalSkills] : null,
        ['Emergency', [e.emergencyContact, e.emergencyPhone, e.emergencyRelation].filter(Boolean).join(' | ')],
        ['Bank', [e.bankName, e.bankAccountNumber].filter(Boolean).join(': ')],
        e.medicalHistory ? ['Medical', e.medicalHistory] : null,
      ].filter((item): item is [string, string] => item !== null && item[1] != null && item[1] !== '' && item[1] !== '- | -' && item[1] !== '-' && item[1] !== ' | ').map(([title, val]) => (
        <div key={title as string}>
          <div style={{ fontSize: fs('sm'), fontWeight: 'bold', color: config.primaryColor, borderBottom: '1px solid #e2e8f0', marginBottom: 2, paddingBottom: 1 }}>{title}</div>
          <div style={{ fontSize: fs('sm'), marginBottom: 4, paddingLeft: 4 }}>{val}</div>
        </div>
      ))}
      {((e.psychologyScore !== null && e.psychologyScore !== undefined) || getPsychInterview(e)) ? (() => {
        const interview = getPsychInterview(e);
        const lines: string[] = [];
        if (e.psychologyScore !== null && e.psychologyScore !== undefined) lines.push(`Score: ${e.psychologyScore}/100`);
        if (interview?.overallAssessment) lines.push(`Eval: ${interview.overallAssessment}`);
        if (interview?.recommendations) lines.push(`Rec: ${interview.recommendations}`);
        if (interview?.interviewerName) lines.push(`Interviewer: ${interview.interviewerName}`);
        if (interview?.emotionalStability !== undefined) lines.push(`Emotional: ${interview.emotionalStability}/10`);
        if (interview?.socialAdaptability !== undefined) lines.push(`Social: ${interview.socialAdaptability}/10`);
        if (interview?.communicationSkills !== undefined) lines.push(`Comm: ${interview.communicationSkills}/10`);
        if (interview?.workMotivation !== undefined) lines.push(`Motivation: ${interview.workMotivation}/10`);
        if (interview?.selfAwareness !== undefined) lines.push(`Self-Aware: ${interview.selfAwareness}/10`);
        if (interview?.problemSolving !== undefined) lines.push(`Problem: ${interview.problemSolving}/10`);
        return (
          <div>
            <div style={{ fontSize: fs('sm'), fontWeight: 'bold', color: config.primaryColor, borderBottom: '1px solid #e2e8f0', marginBottom: 2, paddingBottom: 1 }}>Psychology</div>
            <div style={{ fontSize: fs('sm'), marginBottom: 4, paddingLeft: 4 }}>
              {lines.join(' | ')}
            </div>
          </div>
        );
      })() : null}
      {config.showFullBodyPhoto && getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl) && (
        <div style={{ textAlign: 'left', marginTop: 12 }}>
          <img src={getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl)!} alt="" style={{ height: 160, objectFit: 'contain', borderRadius: 4, border: '1px solid #e2e8f0' }} />
        </div>
      )}
      <div style={{ marginTop: 6, fontSize: fs('xs'), color: '#94a3b8', textAlign: 'center' }}>Generated by {config.companyName} | {new Date().toLocaleDateString()}</div>
    </div>
  );

  const renderModern = (e: CVEmployee) => (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', fontSize: fs('md') }}>
      <div style={{ width: 100, background: `linear-gradient(180deg, ${config.primaryColor}, ${config.accentColor})`, color: 'white', padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {config.showPassportPhoto && getPhotoUrl(e.passportSizePhotoPath || e.photoUrl) &&
          <img src={getPhotoUrl(e.passportSizePhotoPath || e.photoUrl)!} alt="" style={{ height: 70, width: 70, borderRadius: '8px', border: '2px solid white', marginBottom: 12, objectFit: 'cover' }} />}
        {getPhotoUrl(config.logoUrl) && <img src={getPhotoUrl(config.logoUrl)!} alt="" style={{ height: 30, marginBottom: 8 }} />}
        <div style={{ fontSize: fs('xs'), fontWeight: 'bold', textAlign: 'center' }}>{e.firstName} {e.lastName}</div>
        <div style={{ fontSize: fs('xs'), textAlign: 'center', marginTop: 2 }}>{e.role || ''}</div>
        
        {config.showFullBodyPhoto && getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl) && (
          <div style={{ marginTop: 'auto', paddingTop: 16 }}>
            <img src={getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl)!} alt="" style={{ height: 120, objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.3)' }} />
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: '8 10' }}>
        {((data: CVEmployee) => {
          const interview = getPsychInterview(data);
          const psychRows: [string, string | undefined][] = [];
          if (data.psychologyScore !== null && data.psychologyScore !== undefined) psychRows.push(['Score', `${data.psychologyScore}/100`]);
          if (interview?.overallAssessment) psychRows.push(['Assessment', interview.overallAssessment]);
          if (interview?.recommendations) psychRows.push(['Recommendations', interview.recommendations]);
          if (interview?.interviewerName) psychRows.push(['Interviewer', interview.interviewerName]);
          if (interview?.emotionalStability !== undefined) psychRows.push(['Emotional', `${interview.emotionalStability}/10`]);
          if (interview?.socialAdaptability !== undefined) psychRows.push(['Social', `${interview.socialAdaptability}/10`]);
          if (interview?.communicationSkills !== undefined) psychRows.push(['Comm Skills', `${interview.communicationSkills}/10`]);
          if (interview?.workMotivation !== undefined) psychRows.push(['Motivation', `${interview.workMotivation}/10`]);
          if (interview?.selfAwareness !== undefined) psychRows.push(['Self-Aware', `${interview.selfAwareness}/10`]);
          if (interview?.problemSolving !== undefined) psychRows.push(['Problem Solving', `${interview.problemSolving}/10`]);
          const sections: { title: string; rows: [string, string | undefined][] }[] = [
            { title: 'Personal', rows: [['DOB', (data.dateOfBirth || '').slice(0, 10)], ['Gender', data.gender], ['Marital', data.maritalStatus], ['Nationality', data.nationality], ['Religion', data.religion], ['Region', data.region], ['Zone', data.zone], ['Woreda', data.woreda], ['Kebele', data.kebele]] },
            { title: 'Contact', rows: [['Phone', data.contactPhone], ['Email', data.email], ['Emergency', [data.emergencyContact, data.emergencyPhone, data.emergencyRelation].filter(Boolean).join(' / ')]] },
            { title: 'IDs', rows: [['Passport', data.passportNumber], ['Passport Exp', (data.passportExpiryDate || '').slice(0, 10) || undefined], ['Issue Date', (data.passportIssuingDate || '').slice(0, 10) || undefined], ['Place of Issue', data.passportPlaceOfIssue], ['National ID', data.nationalId], ['Labor ID', data.laborId]] },
            { title: 'Work', rows: [['Role', data.role] as [string, string | undefined], ['Education', data.education] as [string, string | undefined], ['Experience', data.experience] as [string, string | undefined], ['Destination', data.destination] as [string, string | undefined], ['Languages', getLanguages(data)] as [string, string | undefined], ['Skills', data.additionalSkills] as [string, string | undefined]] },
            { title: 'Bank', rows: [['Bank', data.bankName] as [string, string | undefined], ['Account', data.bankAccountNumber] as [string, string | undefined]] },
            ...(data.medicalHistory ? [{ title: 'Medical', rows: [['History', data.medicalHistory] as [string, string | undefined]] }] : []),
            ...(psychRows.length > 0 ? [{ title: 'Psychology', rows: psychRows }] : []),
          ];
          return sections.filter(s => s.rows.some(([, v]) => v && v !== '-')).map(s => (
            <div key={s.title} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: fs('sm'), fontWeight: 'bold', color: config.primaryColor, borderBottom: `1px solid ${config.primaryColor}30`, marginBottom: 2 }}>{s.title}</div>
              {s.rows.filter(([, v]) => v && v !== '-').map(([label, val]) => (
                <div key={label} style={{ fontSize: fs('xs'), marginBottom: 1 }}><span style={{ color: '#64748b' }}>{label}: </span>{val}</div>
              ))}
            </div>
          ));
        })(e)}
      </div>
    </div>
  );

  const renderElegant = (e: CVEmployee) => (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1e293b', background: '#faf8f5', padding: 8, border: '2px solid #d4a574', fontSize: fs('md') }}>
      <div style={{ borderTop: '3px double #d4a574', borderBottom: '3px double #d4a574', padding: '8 0', marginBottom: 10, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          {config.showPassportPhoto && getPhotoUrl(e.passportSizePhotoPath || e.photoUrl) &&
            <img src={getPhotoUrl(e.passportSizePhotoPath || e.photoUrl)!} alt="" style={{ height: 60, width: 60, borderRadius: '8px', border: '2px solid #d4a574', objectFit: 'cover' }} />}
          {getPhotoUrl(config.logoUrl) && <img src={getPhotoUrl(config.logoUrl)!} alt="" style={{ height: 35 }} />}
          <div>
            <div style={{ fontSize: fs('xl'), fontWeight: 'bold', color: '#1e293b', letterSpacing: 2 }}>{config.companyName}</div>
            <div style={{ fontSize: fs('xs'), color: '#64748b' }}>{config.companyAddress}</div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: fs('lg'), fontWeight: 'bold', fontStyle: 'italic', marginBottom: 8 }}>
        {e.firstName} {e.lastName}
      </div>
      <table style={{ width: '100%', fontSize: fs('sm'), borderCollapse: 'collapse' }}>
        {(() => {
          const interview = getPsychInterview(e);
          const psychScore = e.psychologyScore !== null && e.psychologyScore !== undefined ? `Score: ${e.psychologyScore}/100` : '';
          const psychLines: string[] = [];
          if (psychScore) psychLines.push(psychScore);
          if (interview?.overallAssessment) psychLines.push(`Eval: ${interview.overallAssessment}`);
          if (interview?.recommendations) psychLines.push(`Rec: ${interview.recommendations}`);
          if (interview?.interviewerName) psychLines.push(`By: ${interview.interviewerName}`);
          if (interview?.emotionalStability !== undefined) psychLines.push(`Emotional: ${interview.emotionalStability}/10`);
          if (interview?.socialAdaptability !== undefined) psychLines.push(`Social: ${interview.socialAdaptability}/10`);
          if (interview?.communicationSkills !== undefined) psychLines.push(`Comm: ${interview.communicationSkills}/10`);
          if (interview?.workMotivation !== undefined) psychLines.push(`Motivation: ${interview.workMotivation}/10`);
          if (interview?.selfAwareness !== undefined) psychLines.push(`Awareness: ${interview.selfAwareness}/10`);
          if (interview?.problemSolving !== undefined) psychLines.push(`Problem: ${interview.problemSolving}/10`);
          const psychCombined = psychLines.join(' | ');
          return [
            ['DOB', (e.dateOfBirth || '').slice(0, 10) || undefined, 'Gender', e.gender],
            ['Marital', e.maritalStatus, 'Nationality', e.nationality],
            ['Religion', e.religion, 'Region', e.region],
            ['Zone', e.zone, 'Woreda', e.woreda],
            ['Kebele', e.kebele, 'Phone', e.contactPhone],
            ['Email', e.email, '', ''],
            ['Passport', e.passportNumber, 'Passport Exp', (e.passportExpiryDate || '').slice(0, 10) || undefined],
            ['Issue Date', (e.passportIssuingDate || '').slice(0, 10) || undefined, 'Place of Issue', e.passportPlaceOfIssue],
            ['National ID', e.nationalId, 'Labor ID', e.laborId],
            ['Education', e.education, 'Role', e.role],
            ['Experience', e.experience, 'Destination', e.destination],
            ['Languages', getLanguages(e), '', ''],
            e.additionalSkills ? ['Skills', e.additionalSkills, '', ''] : null,
            ['Emergency', [e.emergencyContact, e.emergencyPhone, e.emergencyRelation].filter(Boolean).join(' / '), '', ''],
            ['Bank', [e.bankName, e.bankAccountNumber].filter(Boolean).join(': '), '', ''],
            e.medicalHistory ? ['Medical', e.medicalHistory, '', ''] : null,
            ...(psychCombined ? [['Psychology', psychCombined, '', '']] : []),
          ];
        })().filter((item): item is [string, string | undefined, string, string | undefined] => item !== null).filter(([, v2]) => v2 && v2 !== '-').map(([l1, v1, l2, v2], i) => (
          <tr key={i}>
            <td style={{ color: '#64748b', padding: '2 4', width: '25%', fontWeight: 'bold' }}>{l1}</td>
            <td style={{ padding: '2 4', width: '25%' }}>{v1}</td>
            <td style={{ color: '#64748b', padding: '2 4', width: '25%', fontWeight: 'bold' }}>{l2}</td>
            <td style={{ padding: '2 4', width: '25%' }}>{v2}</td>
          </tr>
        ))}
      </table>
      {config.showFullBodyPhoto && getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl) && (
        <div style={{ textAlign: 'left', marginTop: 12 }}><img src={getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl)!} alt="" style={{ height: 160, objectFit: 'contain', border: '2px solid #d4a574', padding: 2 }} /></div>
      )}
      <div style={{ borderTop: '1px solid #d4a574', marginTop: 6, paddingTop: 4, fontSize: fs('xs'), color: '#94a3b8', textAlign: 'center' }}>
        {config.companyName} | {new Date().toLocaleDateString()}
      </div>
    </div>
  );

  const renderCompact = (e: CVEmployee) => (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: fs('sm'), color: '#1e293b', padding: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {config.showPassportPhoto && getPhotoUrl(e.passportSizePhotoPath || e.photoUrl) &&
          <img src={getPhotoUrl(e.passportSizePhotoPath || e.photoUrl)!} alt="" style={{ height: 45, width: 45, borderRadius: '4px', objectFit: 'cover' }} />}
        {getPhotoUrl(config.logoUrl) && <img src={getPhotoUrl(config.logoUrl)!} alt="" style={{ height: 25 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: fs('sm'), fontWeight: 'bold', color: config.primaryColor }}>{config.companyName}</div>
          <div style={{ fontSize: fs('xs'), color: '#64748b' }}>{config.companyAddress}</div>
        </div>
      </div>
      <div style={{ fontWeight: 'bold', fontSize: fs('md'), marginBottom: 2 }}>{e.firstName} {e.lastName}</div>
      <div style={{ marginBottom: 4 }}>
        {[
          [e.gender, e.maritalStatus, e.nationality].filter(Boolean).join(' | '),
          e.religion,
          e.dateOfBirth ? `DOB: ${e.dateOfBirth.slice(0, 10)}` : '',
          [e.region, e.zone, e.woreda, e.kebele].filter(Boolean).join(', ') || 'Address: -',
          `Phone: ${e.contactPhone || '-'}${e.email ? ' | ' + e.email : ''}`,
          `Passport: ${e.passportNumber || '-'}${e.passportExpiryDate ? ' | Exp: ' + e.passportExpiryDate.slice(0, 10) : ''}${e.passportIssuingDate ? ' | Issued: ' + e.passportIssuingDate.slice(0, 10) : ''}${e.passportPlaceOfIssue ? ' | Place: ' + e.passportPlaceOfIssue : ''} | ID: ${e.nationalId || '-'} | Labor: ${e.laborId || '-'}`,
          `${e.education || ''} | ${e.role || ''} | ${e.experience || ''}`,
          `Destination: ${e.destination || '-'}`,
          `Languages: ${getLanguages(e)}`,
          `Skills: ${e.additionalSkills || '-'}`,
          `Emergency: ${[e.emergencyContact, e.emergencyPhone, e.emergencyRelation].filter(Boolean).join(' / ')}`,
          [e.bankName, e.bankAccountNumber].filter(Boolean).join(': '),
          e.medicalHistory ? `Medical: ${e.medicalHistory}` : '',
          (() => {
            const int = getPsychInterview(e);
            const parts: string[] = [];
            if (e.psychologyScore !== null && e.psychologyScore !== undefined) parts.push(`Score: ${e.psychologyScore}/100`);
            if (int?.overallAssessment) parts.push(`Eval: ${int.overallAssessment}`);
            if (int?.recommendations) parts.push(`Rec: ${int.recommendations}`);
            if (int?.interviewerName) parts.push(`By: ${int.interviewerName}`);
            if (int?.emotionalStability !== undefined) parts.push(`Emotional: ${int.emotionalStability}/10`);
            if (int?.socialAdaptability !== undefined) parts.push(`Social: ${int.socialAdaptability}/10`);
            if (int?.communicationSkills !== undefined) parts.push(`Comm: ${int.communicationSkills}/10`);
            if (int?.workMotivation !== undefined) parts.push(`Motivation: ${int.workMotivation}/10`);
            if (int?.selfAwareness !== undefined) parts.push(`Awareness: ${int.selfAwareness}/10`);
            if (int?.problemSolving !== undefined) parts.push(`Problem: ${int.problemSolving}/10`);
            return parts.length > 0 ? `Psychology: ${parts.join(' | ')}` : '';
          })(),
        ].filter(Boolean).join('\n').split('\n').map((line, i) => (
          <div key={i} style={{ lineHeight: 1.3 }}>{line}</div>
        ))}
      </div>
      {config.showFullBodyPhoto && getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl) && (
        <div style={{ textAlign: 'left', marginTop: 8 }}><img src={getPhotoUrl(e.fullBodyPhotoPath || e.fullPhotoUrl)!} alt="" style={{ height: 120, objectFit: 'contain' }} /></div>
      )}
      <div style={{ fontSize: fs('xs'), color: '#94a3b8', textAlign: 'center', marginTop: 2 }}>{config.companyName} | {new Date().toLocaleDateString()}</div>
    </div>
  );

  const renderPreview = () => {
    if (!selectedEmployee) return null;
    const e = selectedEmployee;
    const previews: Record<string, (e: CVEmployee) => React.ReactNode> = {
      standard: renderStandard, professional: renderProfessional,
      modern: renderModern, elegant: renderElegant, compact: renderCompact,
    };
    const renderFn = previews[style] || renderStandard;
    return renderFn(e);
  };

  const empName = selectedEmployee ? `${selectedEmployee.firstName || ''} ${selectedEmployee.lastName || ''}`.trim() : '';

  const renderSearchDropdown = () => {
    if (!showSearchResults) return null;
    return (
      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 240, overflow: 'auto', marginTop: 4 }}>
        {searching ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#64748b', fontSize: 13 }}>Searching...</div>
        ) : employees.length > 0 ? (
          employees.map((emp) => (
            <button key={emp.id} type="button" onClick={() => loadEmployeeData(emp)}
              style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '10 12', border: 'none', borderBottom: '1px solid #f1f5f9', background: 'white', textAlign: 'left', cursor: 'pointer', fontSize: 13, gap: 10 }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = '#f8fafc'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = 'white'}>
              {getPhotoUrl(emp.passportSizePhotoPath || emp.photoUrl) ? (
                <img src={getPhotoUrl(emp.passportSizePhotoPath || emp.photoUrl)!} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f5f9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8' }}>
                  {(emp.firstName?.[0] || '?').toUpperCase()}
                </div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>
                  {[emp.passportNumber, emp.contactPhone, emp.role].filter(Boolean).join(' · ')}
                </div>
              </div>
            </button>
          ))
        ) : searchQuery.length >= 2 ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No employees found</div>
        ) : null}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
      {/* Notification Toast */}
      {notification && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100, background: '#059669', color: 'white', padding: '10 20', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 13, fontWeight: 600 }}>
          {notification}
        </div>
      )}

      {/* Employee Search */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Select Employee</div>
          <div ref={searchContainerRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text" value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Search by name, passport, or phone..."
                style={{ width: '100%', padding: '10 12 10 36', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, outline: 'none' }}
              />
              {renderSearchDropdown()}
            </div>
            {selectedEmployee && (
              <button type="button" onClick={() => { setSelectedEmployee(null); setSearchQuery(''); }}
                style={{ padding: '6 12', border: '1px solid #e2e8f0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 12, color: '#64748b' }}>
                Clear
              </button>
            )}
          </div>
          {selectedEmployee && (
            <div style={{ marginTop: 8, padding: '8 12', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 12 }}>
              <CheckCircle2 size={14} style={{ color: '#16a34a', display: 'inline', marginRight: 4 }} />
              Selected: <strong>{empName}</strong> {selectedEmployee.passportNumber && <span>Â· Passport: {selectedEmployee.passportNumber}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Layout Mode Selector */}
      {selectedEmployee && (
        <>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 8 }}>Layout Mode</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LAYOUTS.map((l) => (
                <button key={l.id} type="button" onClick={() => setLayout(l.id as any)}
                  style={{ flex: 1, minWidth: 120, padding: '10 12', border: `2px solid ${layout === l.id ? config.primaryColor : '#e2e8f0'}`, borderRadius: 8, background: layout === l.id ? '#f8fafc' : 'white', cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: 12, color: layout === l.id ? config.primaryColor : '#1e293b' }}>{l.name}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Style Selector */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Template Style</div>
              <button type="button" onClick={() => setShowCustomization(!showCustomization)}
                style={{ padding: '6 12', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 11, color: '#64748b' }}>
                {showCustomization ? 'Hide' : 'Customize'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STYLES.map((s) => (
                <button key={s.id} type="button" onClick={() => setStyle(s.id as any)}
                  style={{ flex: 1, minWidth: 100, padding: '8 10', border: `2px solid ${style === s.id ? config.primaryColor : '#e2e8f0'}`, borderRadius: 8, background: style === s.id ? '#f8fafc' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 11, color: style === s.id ? config.primaryColor : '#1e293b', marginTop: 2 }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: '#64748b', marginTop: 1 }}>{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Panel */}
          {showCustomization && (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 10 }}>Agency Branding</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Company Name</label>
                  <input type="text" value={config.companyName || ''} onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                    style={{ width: '100%', padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Address</label>
                  <input type="text" value={config.companyAddress || ''} onChange={(e) => setConfig({ ...config, companyAddress: e.target.value })}
                    style={{ width: '100%', padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Phone</label>
                  <input type="text" value={config.companyPhone || ''} onChange={(e) => setConfig({ ...config, companyPhone: e.target.value })}
                    style={{ width: '100%', padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Email</label>
                  <input type="text" value={config.companyEmail || ''} onChange={(e) => setConfig({ ...config, companyEmail: e.target.value })}
                    style={{ width: '100%', padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Website</label>
                  <input type="text" value={config.companyWebsite || ''} onChange={(e) => setConfig({ ...config, companyWebsite: e.target.value })}
                    style={{ width: '100%', padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Logo</label>
                  <button type="button" onClick={() => logoInputRef.current?.click()}
                    style={{ width: '100%', padding: '8 10', border: '1px dashed #e2e8f0', borderRadius: 6, background: '#f8fafc', cursor: 'pointer', fontSize: 12, color: '#64748b' }}>
                    {uploadingLogo ? 'Uploading...' : config.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    setUploadingLogo(true);
                    try {
                      const fd = new FormData(); fd.append('file', file); fd.append('type', 'logo');
                      const res = await fetch('/api/upload', { method: 'POST', body: fd });
                      const data = await res.json();
                      if (data.success && data.data?.url) setConfig({ ...config, logoUrl: data.data.url });
                    } catch {} finally { setUploadingLogo(false); }
                  }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Primary Color</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="color" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }} />
                    <input type="text" value={config.primaryColor} onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      style={{ flex: 1, padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Accent Color</label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="color" value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer', padding: 0 }} />
                    <input type="text" value={config.accentColor} onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                      style={{ flex: 1, padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Font Size</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['small', 'normal', 'large'] as const).map((s) => (
                      <button key={s} type="button" onClick={() => setConfig({ ...config, fontSize: s })}
                        style={{ flex: 1, padding: '6 8', border: `1px solid ${config.fontSize === s ? config.primaryColor : '#e2e8f0'}`, borderRadius: 6, background: config.fontSize === s ? '#f8fafc' : 'white', cursor: 'pointer', fontSize: 10, fontWeight: config.fontSize === s ? 600 : 400, color: config.fontSize === s ? config.primaryColor : '#1e293b' }}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Photo Settings</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
                      <input type="checkbox" checked={config.showPassportPhoto} onChange={(e) => setConfig({ ...config, showPassportPhoto: e.target.checked })} /> Passport
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
                      <input type="checkbox" checked={config.showFullBodyPhoto} onChange={(e) => setConfig({ ...config, showFullBodyPhoto: e.target.checked })} /> Full Body
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Template name..." style={{ flex: 1, padding: '8 10', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 12 }} />
                <button type="button" onClick={saveTemplate}
                  style={{ padding: '8 16', background: config.primaryColor, color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                  <Save size={14} style={{ display: 'inline', marginRight: 4 }} />Save Template
                </button>
              </div>
              {savedTemplates.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {savedTemplates.map((t) => (
                    <button key={t.id} type="button" onClick={() => applyTemplate(t)}
                      style={{ padding: '6 12', border: `1px solid ${t.isDefault ? config.primaryColor : '#e2e8f0'}`, borderRadius: 6, background: t.isDefault ? '#f8fafc' : 'white', cursor: 'pointer', fontSize: 10, color: t.isDefault ? config.primaryColor : '#64748b' }}>
                      {t.name} {t.isDefault ? '(default)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CV Preview */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12 16', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                CV Preview â€” {STYLES.find(s => s.id === style)?.name} ({LAYOUTS.find(l => l.id === layout)?.name})
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" onClick={() => setShowPreview(!showPreview)}
                  style={{ padding: '6 12', border: '1px solid #e2e8f0', borderRadius: 6, background: 'white', cursor: 'pointer', fontSize: 11, color: '#64748b' }}>
                  {showPreview ? 'Hide' : 'Show'}
                </button>
                <button type="button" onClick={handleDownload}
                  style={{ padding: '6 12', border: '1px solid #e2e8f0', borderRadius: 6, background: '#fef2f2', cursor: 'pointer', fontSize: 11, color: '#dc2626', fontWeight: 600 }}>
                  <Download size={14} style={{ display: 'inline', marginRight: 4 }} />PDF
                </button>
                <button type="button" onClick={handleGenerate} disabled={generating}
                  style={{ padding: '6 14', border: 'none', borderRadius: 6, background: config.primaryColor, color: 'white', cursor: generating ? 'not-allowed' : 'pointer', fontSize: 11, fontWeight: 600, opacity: generating ? 0.6 : 1 }}>
                  {generating ? 'Generating...' : 'Generate & Save'}
                </button>
              </div>
            </div>
            {showPreview && (
              <div style={{ padding: 16, background: '#f8fafc', minHeight: 400 }}>
                {selectedEmployee ? (
                  <div ref={previewRef} style={{ background: 'white', maxWidth: 794, margin: '0 auto', padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif' }}>
                    {renderPreview()}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8', fontSize: 13 }}>Select an employee to preview their CV</div>
                )}
              </div>
            )}
          </div>

          {/* Recently Generated */}
          {generatedCvs.length > 0 && (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '12 16', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 600, color: '#1e293b' }}>Recently Generated CVs</div>
              <div style={{ padding: 8 }}>
                {generatedCvs.map((cv) => (
                  <div key={cv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8 12', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={16} style={{ color: config.primaryColor }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>CV â€” {cv.style || cv.template} ({cv.layout || cv.language?.toUpperCase()})</div>
                        <div style={{ fontSize: 10, color: '#94a3b8' }}>{new Date(cv.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Eye size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
