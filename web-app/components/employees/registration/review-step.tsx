'use client';

import type { PersonalData, SkillsData, DocumentsData, PsychologyData, PsychInterviewData } from './types';
import {
  PSYCH_QUESTIONS,
  INTERVIEW_PSYCH_QUESTIONS,
  LANGUAGE_ASSESSMENT,
  DOMESTIC_WORK_ASSESSMENT,
  APPLIANCE_ASSESSMENT,
  CULTURE_ASSESSMENT,
  RETURN_RISK_ASSESSMENT,
} from './types';

type ReviewStepProps = {
  personal: PersonalData;
  skills: SkillsData;
  docs: DocumentsData;
  psychology: PsychologyData;
  psychInterview: PsychInterviewData;
};

export function ReviewStep({ personal, skills, docs, psychology, psychInterview }: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <h5 className="text-xs font-bold uppercase text-brand-600 mb-2">Personal Info</h5>
        <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
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
        <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
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
        <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
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
        <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-3">
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
  );
}
