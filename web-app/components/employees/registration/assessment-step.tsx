'use client';

import { TextField } from '@/components/employees/form-fields';
import type { PsychologyData, PsychInterviewData } from './types';
import {
  PSYCH_QUESTIONS,
  INTERVIEW_PSYCH_QUESTIONS,
  LANGUAGE_ASSESSMENT,
  DOMESTIC_WORK_ASSESSMENT,
  APPLIANCE_ASSESSMENT,
  CULTURE_ASSESSMENT,
  PSYCH_INTERVIEW_RATINGS,
  PSYCH_INTERVIEW_SECTION,
  RETURN_RISK_ASSESSMENT,
  MEDICAL_HISTORY_SECTION,
} from './types';

type AssessmentStepProps = {
  psychology: PsychologyData;
  setPsychology: React.Dispatch<React.SetStateAction<PsychologyData>>;
  psychInterview: PsychInterviewData;
  setPsychInterview: React.Dispatch<React.SetStateAction<PsychInterviewData>>;
};

function getPsychScore(psychology: PsychologyData) {
  if (PSYCH_QUESTIONS.length === 0) return 0;
  const numericValues = Object.values(psychology).filter(value => typeof value === 'number') as number[];
  return Math.round((numericValues.reduce((a, b) => a + b, 0) / (PSYCH_QUESTIONS.length * 3)) * 100);
}

function getPsychClass(psychology: PsychologyData) {
  const s = getPsychScore(psychology);
  if (s >= 75) return 'bg-emerald-500';
  if (s >= 50) return 'bg-amber-400';
  return 'bg-red-500';
}

export function AssessmentStep({ psychology, setPsychology, psychInterview, setPsychInterview }: AssessmentStepProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-4 mb-4">
        <h4 className="font-semibold text-violet-800 flex items-center gap-2">🧠 Basic Psychological Assessment</h4>
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
                  return 'High Risk — Consider Counseling';
                })()}
              </span>
              <span className="text-slate-600 dark:text-slate-300">{Object.keys(psychology).filter(key => PSYCH_QUESTIONS.some(q => q.id === key)).length}/{PSYCH_QUESTIONS.length} answered</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-600/50">
              <div className={`h-full rounded-full transition-all ${getPsychClass(psychology)} w-full`} style={{ width: `${getPsychScore(psychology)}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
        <h4 className="font-semibold text-purple-800 flex items-center gap-2">💬 Interview Psychological Assessment</h4>
        <p className="mt-1 text-xs text-purple-600">Specific questions for Ethiopian employees working in Middle Eastern countries, addressing cultural and religious differences.</p>
        {INTERVIEW_PSYCH_QUESTIONS.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-purple-400 bg-purple-50 font-semibold text-purple-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-purple-500 bg-purple-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
        <h4 className="font-semibold text-indigo-800 flex items-center gap-2">🧑‍⚕️ Psychological Interview (Professional Evaluation)</h4>
        <p className="mt-1 text-xs text-indigo-600">To be completed by the interviewing officer. Assess the candidate through direct interaction and observation.</p>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
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
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{qi + 2}</span>
              {q.text}
            </p>
            {q.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 ml-7">{q.desc}</p>}
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {PSYCH_INTERVIEW_RATINGS.map((label, oi) => {
                const key = q.id.replace('psychInterview_', '') as keyof PsychInterviewData;
                const currentValue = psychInterview[key] as number;
                return (
                  <button key={oi} type="button" onClick={() => setPsychInterview(prev => ({ ...prev, [key]: oi + 1 }))} className={`rounded-lg border px-2 py-2 text-center text-xs transition-all ${
                    currentValue === oi + 1
                      ? 'border-indigo-400 bg-indigo-50 font-semibold text-indigo-800'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}>
                    <span className={`mx-auto mb-1 block h-3 w-3 rounded-full border-2 ${
                      currentValue === oi + 1 ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-600'
                    }`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{PSYCH_INTERVIEW_SECTION.length + 2}</span>
            Interview Observations
          </p>
          <textarea
            value={psychInterview.observations}
            onChange={(e) => setPsychInterview(prev => ({ ...prev, observations: e.target.value }))}
            placeholder="Record your observations about the candidate's demeanor, confidence, body language, and overall presentation during the interview..."
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mr-2">{PSYCH_INTERVIEW_SECTION.length + 3}</span>
            Overall Assessment
          </p>
          <div className="grid gap-3 md:grid-cols-3 mb-3">
            <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'fit' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'fit' ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'fit' ? 'text-emerald-800' : 'text-slate-700 dark:text-slate-200'}`}>Psychologically Fit</p>
              <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'fit' ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>Candidate is ready for deployment</p>
            </button>
            <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'counseling' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'counseling' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'counseling' ? 'text-amber-800' : 'text-slate-700 dark:text-slate-200'}`}>Needs Counseling</p>
              <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'counseling' ? 'text-amber-600' : 'text-slate-500 dark:text-slate-400'}`}>Additional pre-departure counseling recommended</p>
            </button>
            <button type="button" onClick={() => setPsychInterview(prev => ({ ...prev, overallAssessment: 'unfit' }))} className={`rounded-xl border p-3 text-left transition-all ${psychInterview.overallAssessment === 'unfit' ? 'border-red-400 bg-red-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
              <p className={`text-sm font-bold ${psychInterview.overallAssessment === 'unfit' ? 'text-red-800' : 'text-slate-700 dark:text-slate-200'}`}>Not Psychologically Fit</p>
              <p className={`text-xs mt-1 ${psychInterview.overallAssessment === 'unfit' ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'}`}>Candidate should not be deployed at this time</p>
            </button>
          </div>
          <textarea
            value={psychInterview.recommendations}
            onChange={(e) => setPsychInterview(prev => ({ ...prev, recommendations: e.target.value }))}
            placeholder="Additional recommendations, follow-up actions, or notes..."
            rows={2}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <h4 className="font-semibold text-blue-800 flex items-center gap-2">🗣️ Language Skills Assessment</h4>
        <p className="mt-1 text-xs text-blue-600">Evaluate language proficiency for effective communication in different environments.</p>
        {LANGUAGE_ASSESSMENT.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-blue-400 bg-blue-50 font-semibold text-blue-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
        <h4 className="font-semibold text-green-800 flex items-center gap-2">🏠 Domestic Work Experience</h4>
        <p className="mt-1 text-xs text-green-600">Assess experience with household tasks and domestic responsibilities.</p>
        {DOMESTIC_WORK_ASSESSMENT.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-green-400 bg-green-50 font-semibold text-green-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-green-500 bg-green-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
        <h4 className="font-semibold text-amber-800 flex items-center gap-2">🔌 Appliance Familiarity</h4>
        <p className="mt-1 text-xs text-amber-600">Evaluate comfort level with modern household appliances and technology. Many Ethiopian employees from rural areas may have limited experience with modern appliances.</p>
        {APPLIANCE_ASSESSMENT.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-amber-400 bg-amber-50 font-semibold text-amber-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-amber-500 bg-amber-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
        <h4 className="font-semibold text-purple-800 flex items-center gap-2">🌍 Culture & Religion Awareness</h4>
        <p className="mt-1 text-xs text-purple-600">Assess understanding of different cultures, religions, and social norms. Important for Ethiopian employees working in Muslim-majority countries.</p>
        {CULTURE_ASSESSMENT.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-purple-400 bg-purple-50 font-semibold text-purple-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-purple-500 bg-purple-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
        <h4 className="font-semibold text-red-800 flex items-center gap-2">🏥 Medical History Assessment</h4>
        <p className="mt-1 text-xs text-red-600">Evaluate medical history to ensure employees are fit for overseas work and have no conditions that may be exacerbated by the new environment.</p>
        {MEDICAL_HISTORY_SECTION.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold mr-2">{qi + 1}</span>
              {q.text}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, oi) => (
                <button key={oi} type="button" onClick={() => setPsychology(prev => ({ ...prev, [q.id]: oi }))} className={`rounded-lg border px-3 py-2 text-left text-sm transition-all ${
                  psychology[q.id] === oi
                    ? 'border-red-400 bg-red-50 font-semibold text-red-800'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}>
                  <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                    psychology[q.id] === oi ? 'border-red-500 bg-red-500' : 'border-slate-300 dark:border-slate-600'
                  }`} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
        <h4 className="font-semibold text-red-800 flex items-center gap-2">⚠️ Early Return Risk Assessment</h4>
        <p className="mt-1 text-xs text-red-600">Evaluate likelihood of returning before 6 months to reduce early turnover. Consider cultural shock, food differences, and religious factors.</p>
        {RETURN_RISK_ASSESSMENT.map((q, qi) => (
          <div key={q.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 mb-3">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
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
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                      (psychology[q.id] as string[] || []).includes(opt) ? 'border-red-500 bg-red-500' : 'border-slate-300 dark:border-slate-600'
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
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}>
                    <span className={`mr-2 inline-block h-4 w-4 rounded-full border-2 align-middle ${
                      psychology[q.id] === oi ? 'border-red-500 bg-red-500' : 'border-slate-300 dark:border-slate-600'
                    }`} />
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(psychology).length >= PSYCH_QUESTIONS.length + LANGUAGE_ASSESSMENT.length + DOMESTIC_WORK_ASSESSMENT.length + APPLIANCE_ASSESSMENT.length + CULTURE_ASSESSMENT.length + RETURN_RISK_ASSESSMENT.length + INTERVIEW_PSYCH_QUESTIONS.length + MEDICAL_HISTORY_SECTION.length && (
        <div className={`rounded-2xl border p-4 bg-opacity-50 ${
          getPsychScore(psychology) >= 75 ? 'bg-emerald-50 border-emerald-200' :
          getPsychScore(psychology) >= 50 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          <p className={`font-bold text-sm ${
            getPsychScore(psychology) >= 75 ? 'text-emerald-700' :
            getPsychScore(psychology) >= 50 ? 'text-amber-700' :
            'text-red-700'
          }`}>
            Assessment Complete — Overall Suitability Score: {getPsychScore(psychology)}/100
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {getPsychScore(psychology) >= 75 ? 'Employee shows strong suitability indicators. Recommended for deployment.' :
             getPsychScore(psychology) >= 50 ? 'Employee may need additional pre-departure counseling before deployment.' :
             'High early-return risk. Mandatory counseling session recommended before proceeding.'}
          </p>
        </div>
      )}
    </div>
  );
}
