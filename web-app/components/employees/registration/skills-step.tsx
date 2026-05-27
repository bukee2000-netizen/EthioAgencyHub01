'use client';

import { SelectField, TextField } from '@/components/employees/form-fields';
import {
  educationLevels,
  jobRoles,
  experienceLevels,
  countries
} from '@/config/registration-data';
import type { SkillsData } from './types';

type SkillsStepProps = {
  skills: SkillsData;
  setSkills: React.Dispatch<React.SetStateAction<SkillsData>>;
};

export function SkillsStep({ skills, setSkills }: SkillsStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <SelectField label="Education" value={skills.education} onChange={(v) => setSkills({ ...skills, education: v })} options={educationLevels} />
        <SelectField label="Job Role" value={skills.role} onChange={(v) => setSkills({ ...skills, role: v })} options={jobRoles} />
        <SelectField label="Experience" value={skills.experience} onChange={(v) => setSkills({ ...skills, experience: v })} options={experienceLevels} />
      </div>
      <div className="grid gap-3 md:grid-cols-1">
        <SelectField label="Deploy Country *" value={skills.destination} onChange={(v) => setSkills({ ...skills, destination: v })} options={countries} />
      </div>

      <div>
        <h5 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Languages & Interpreters *</h5>
        <div className="grid gap-2 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Primary Languages</label>
            <select multiple value={skills.languages} onChange={(e) => { const selected = Array.from(e.target.selectedOptions, (o) => o.value); setSkills({ ...skills, languages: selected }); }} className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm shadow-sm dark:shadow-soft-dark focus:border-brand-600 focus:outline-none" style={{ minHeight: '80px' }}>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">Selected Languages</label>
              <div className="flex flex-wrap gap-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 min-h-[80px]">
                {skills.languages.map((lang) => (
                  <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    {lang}
                    <button type="button" onClick={() => setSkills({ ...skills, languages: skills.languages.filter((l) => l !== lang) })} className="hover:text-brand-900">✕</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          <p>Important: Employees will need interpreters for Arabic, Amharic, and Oromo in Middle Eastern countries.</p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <TextField label="Additional Skills" value={skills.additionalSkills} onChange={(v) => setSkills({ ...skills, additionalSkills: v })} placeholder="e.g., First aid, Cooking" />
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
