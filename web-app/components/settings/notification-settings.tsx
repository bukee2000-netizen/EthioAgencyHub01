'use client';

import { useState } from 'react';
import { Save, Bell, Mail, MessageSquare, AlertTriangle } from 'lucide-react';

export function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    emailDocuments: true,
    emailTravel: true,
    emailEmployees: false,
    pushDocuments: true,
    pushTravel: false,
    pushEmployees: true,
    criticalAlerts: true,
    weeklyDigest: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving notifications:', error);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-600'}`}
    >
      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );

  const NotificationGroup = ({ icon: Icon, title, description, children }: any) => (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-brand-100 dark:bg-brand-900/30 p-2">
          <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h4 className="font-medium dark:text-ink-dark">{title}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <NotificationGroup
        icon={Mail}
        title="Email Notifications"
        description="Receive updates via email"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Document updates</span>
          <Toggle checked={notifications.emailDocuments} onChange={(v: boolean) => setNotifications({ ...notifications, emailDocuments: v })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Travel schedules</span>
          <Toggle checked={notifications.emailTravel} onChange={(v: boolean) => setNotifications({ ...notifications, emailTravel: v })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Employee registrations</span>
          <Toggle checked={notifications.emailEmployees} onChange={(v: boolean) => setNotifications({ ...notifications, emailEmployees: v })} />
        </div>
      </NotificationGroup>

      <NotificationGroup
        icon={MessageSquare}
        title="Push Notifications"
        description="Receive in-app notifications"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Document updates</span>
          <Toggle checked={notifications.pushDocuments} onChange={(v: boolean) => setNotifications({ ...notifications, pushDocuments: v })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Travel schedules</span>
          <Toggle checked={notifications.pushTravel} onChange={(v: boolean) => setNotifications({ ...notifications, pushTravel: v })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Employee registrations</span>
          <Toggle checked={notifications.pushEmployees} onChange={(v: boolean) => setNotifications({ ...notifications, pushEmployees: v })} />
        </div>
      </NotificationGroup>

      <NotificationGroup
        icon={AlertTriangle}
        title="Alert Preferences"
        description="Configure urgent alerts"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Critical alerts (security, errors)</span>
          <Toggle checked={notifications.criticalAlerts} onChange={(v: boolean) => setNotifications({ ...notifications, criticalAlerts: v })} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm dark:text-slate-200">Weekly digest</span>
          <Toggle checked={notifications.weeklyDigest} onChange={(v: boolean) => setNotifications({ ...notifications, weeklyDigest: v })} />
        </div>
      </NotificationGroup>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-6 py-2.5 font-medium text-white disabled:opacity-50 transition-colors"
      >
        <Save className="h-4 w-4" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  );
}