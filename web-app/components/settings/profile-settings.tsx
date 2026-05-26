'use client';

import { useState } from 'react';
import { Save, User, Mail, Building, Phone } from 'lucide-react';

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@ethioagency.com',
    phone: '+251911123456',
    role: 'AGENCY_ADMIN'
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Profile Information</h3>
        <p className="mt-1 text-sm text-slate-500">Update your personal information and contact details.</p>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4"
              />
            </div>
          </div>
          
          <div>
            <label className="mb-2 block text-sm font-medium">Role</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <select
                value={profile.role}
                disabled
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 bg-slate-50"
              >
                <option value="AGENCY_ADMIN">Agency Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="AGENT">Agent</option>
                <option value="VIEWER">Viewer</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 font-medium text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">Avatar</h3>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
            {profile.name.charAt(0)}
          </div>
          <div>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Upload Photo
            </button>
            <p className="mt-2 text-sm text-slate-500">JPG, PNG. Max 2MB.</p>
          </div>
        </div>
      </section>
    </div>
  );
}