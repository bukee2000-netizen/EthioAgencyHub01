'use client';

import { ScanLine, Phone, MapPin, AlertTriangle } from 'lucide-react';
import { SelectField, TextField } from '@/components/employees/form-fields';
import { PassportScanner } from '@/components/employees/passport-scanner';
import {
  ethiopianRegions,
  countries,
  genders,
  maritalStatus
} from '@/config/registration-data';
import type { PersonalData } from './types';

type PersonalStepProps = {
  personal: PersonalData;
  setPersonal: React.Dispatch<React.SetStateAction<PersonalData>>;
  handlePassportAutoFill: (data: any) => void;
};

export function PersonalStep({ personal, setPersonal, handlePassportAutoFill }: PersonalStepProps) {
  const selectedRegionData = ethiopianRegions.find((r) => r.region === personal.region);
  const zones = selectedRegionData?.zones || [];
  const selectedZoneData = zones.find((z: any) => z.name === personal.zone);
  const woredas = (selectedZoneData as any)?.woredas || [];

  return (
    <div className="space-y-4">
      <PassportScanner onAutoFill={handlePassportAutoFill} />

      <div className="rounded-xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ScanLine className="h-5 w-5 text-blue-600" />
          <h5 className="text-sm font-bold uppercase tracking-wider text-blue-800">Passport & Personal Information</h5>
          <span className="text-[10px] text-blue-500 ml-2">(Auto-filled from passport scan)</span>
        </div>

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

      <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-red-700">Medical History</h5>
        </div>
        <TextField label="Previous Medical Conditions" value={personal.medicalHistory} onChange={(v) => setPersonal({ ...personal, medicalHistory: v })} placeholder="List any previous medical conditions, surgeries, or chronic illnesses" />
      </div>
    </div>
  );
}
