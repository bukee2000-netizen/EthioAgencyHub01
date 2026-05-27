'use client';

import { SelectField, TextField } from '@/components/employees/form-fields';
import type { PersonalData } from './types';

type BankStepProps = {
  personal: PersonalData;
  setPersonal: React.Dispatch<React.SetStateAction<PersonalData>>;
};

export function BankStep({ personal, setPersonal }: BankStepProps) {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Emergency Contact</h5>
        <div className="grid gap-3 md:grid-cols-3">
          <TextField label="Emergency Contact *" value={personal.emergencyContact} onChange={(v) => setPersonal({ ...personal, emergencyContact: v })} required placeholder="e.g., Sara Kebede" />
          <TextField label="Emergency Phone *" type="tel" value={personal.emergencyPhone} onChange={(v) => setPersonal({ ...personal, emergencyPhone: v })} required placeholder="+251911234567" />
          <SelectField label="Relationship *" value={personal.emergencyRelation} onChange={(v) => setPersonal({ ...personal, emergencyRelation: v })} options={['Spouse', 'Parent', 'Sibling', 'Child', 'Relative', 'Friend', 'Other']} />
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
        <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Bank Account</h5>
        <p className="text-xs text-emerald-700 mb-3">For salary remittance from abroad</p>
        <div className="grid gap-3 md:grid-cols-3">
          <SelectField label="Bank Name" value={personal.bankName} onChange={(v) => setPersonal({ ...personal, bankName: v })} options={['Commercial Bank of Ethiopia', 'Awash Bank', 'Dashen Bank', 'Bank of Abyssinia', 'Oromia Cooperative Bank', 'Berhan Bank', 'NIB International Bank', 'United Bank', 'Cooperative Bank of Oromia', 'Other']} />
          <TextField label="Account Number" value={personal.bankAccountNumber} onChange={(v) => setPersonal({ ...personal, bankAccountNumber: v })} placeholder="e.g., 1000123456789" />
          <TextField label="Branch" value={personal.bankBranch} onChange={(v) => setPersonal({ ...personal, bankBranch: v })} placeholder="e.g., Bole Branch" />
        </div>
      </div>
    </div>
  );
}
