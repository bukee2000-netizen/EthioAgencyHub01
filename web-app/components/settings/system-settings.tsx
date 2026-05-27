'use client';

import { useState } from 'react';
import { Save, Building2, Bell, HardDrive, MessageSquare, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/toast-provider';

interface AgencySettings {
  name: string;
  country: string;
  timezone: string;
  language: string;
  currency: string;
}

interface NotificationSettings {
  emailAlerts: boolean;
  telegramNotifications: boolean;
  dailyDigest: boolean;
  criticalAlerts: boolean;
}

interface StorageSettings {
  provider: string;
  maxFileSize: string;
  retentionDays: string;
}

interface TelegramSettings {
  botToken: string;
  chatId: string;
  uploadEnabled: boolean;
}

export function SystemSettings() {
  const { addToast } = useToast();
  const [agency, setAgency] = useState<AgencySettings>({
    name: 'My Agency',
    country: 'ET',
    timezone: 'Africa/Addis_Ababa',
    language: 'en',
    currency: 'ETB'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailAlerts: true,
    telegramNotifications: true,
    dailyDigest: false,
    criticalAlerts: true
  });

  const [storage, setStorage] = useState<StorageSettings>({
    provider: 'teledrive',
    maxFileSize: '100',
    retentionDays: '90'
  });

  const [telegram, setTelegram] = useState<TelegramSettings>({
    botToken: '',
    chatId: '',
    uploadEnabled: true
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agency, notifications, storage, telegram })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      addToast({ title: 'Error', description: 'Failed to save settings. Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const SettingSection = ({ icon: Icon, title, description, children }: any) => (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-brand-100 p-2">
          <Icon className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">{children}</div>
    </section>
  );

  const Input = ({ label, value, onChange, type = 'text' }: any) => (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5"
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange }: any) => (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm">{label}</span>
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'}`}
      >
        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'}`} />
      </div>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">System Settings</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 font-medium text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <SettingSection
        icon={Building2}
        title="Agency Settings"
        description="Basic information about your agency"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Agency Name" value={agency.name} onChange={(v: string) => setAgency({ ...agency, name: v })} />
          <Input label="Country" value={agency.country} onChange={(v: string) => setAgency({ ...agency, country: v })} />
          <Input label="Timezone" value={agency.timezone} onChange={(v: string) => setAgency({ ...agency, timezone: v })} />
          <Input label="Currency" value={agency.currency} onChange={(v: string) => setAgency({ ...agency, currency: v })} />
        </div>
      </SettingSection>

      <SettingSection
        icon={Bell}
        title="Notification Settings"
        description="Configure how you receive alerts and updates"
      >
        <div className="space-y-4">
          <Toggle label="Email Alerts" checked={notifications.emailAlerts} onChange={(v: boolean) => setNotifications({ ...notifications, emailAlerts: v })} />
          <Toggle label="Telegram Notifications" checked={notifications.telegramNotifications} onChange={(v: boolean) => setNotifications({ ...notifications, telegramNotifications: v })} />
          <Toggle label="Daily Digest" checked={notifications.dailyDigest} onChange={(v: boolean) => setNotifications({ ...notifications, dailyDigest: v })} />
          <Toggle label="Critical Alerts" checked={notifications.criticalAlerts} onChange={(v: boolean) => setNotifications({ ...notifications, criticalAlerts: v })} />
        </div>
      </SettingSection>

      <SettingSection
        icon={HardDrive}
        title="Storage Settings"
        description="Configure file storage and retention"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Provider</label>
            <select
              value={storage.provider}
              onChange={(e) => setStorage({ ...storage, provider: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5"
            >
              <option value="teledrive">Teledrive</option>
              <option value="local">Local Storage</option>
              <option value="s3">AWS S3</option>
            </select>
          </div>
          <Input label="Max File Size (MB)" value={storage.maxFileSize} onChange={(v: string) => setStorage({ ...storage, maxFileSize: v })} />
          <Input label="Retention (Days)" value={storage.retentionDays} onChange={(v: string) => setStorage({ ...storage, retentionDays: v })} />
        </div>
      </SettingSection>

      <SettingSection
        icon={MessageSquare}
        title="Telegram Integration"
        description="Configure bot and video upload settings"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Bot Token" value={telegram.botToken} onChange={(v: string) => setTelegram({ ...telegram, botToken: v })} />
          <Input label="Chat ID" value={telegram.chatId} onChange={(v: string) => setTelegram({ ...telegram, chatId: v })} />
        </div>
        <div className="mt-4">
          <Toggle label="Enable Video Upload" checked={telegram.uploadEnabled} onChange={(v: boolean) => setTelegram({ ...telegram, uploadEnabled: v })} />
        </div>
      </SettingSection>
    </div>
  );
}