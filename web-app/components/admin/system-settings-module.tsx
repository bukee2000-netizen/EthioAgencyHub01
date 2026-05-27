'use client';

import { useState } from 'react';
import { Save, Mail, Lock, Bell, Shield, Zap } from 'lucide-react';
import { WhatsAppConfigPanel } from '@/components/admin/whatsapp-config-panel';

export function SystemSettingsModule() {
  const [settings, setSettings] = useState({
    siteName: 'EthioAgencyHub',
    siteUrl: 'https://ethioagencyhub.com',
    adminEmail: 'admin@ethioagencyhub.com',
    supportEmail: 'support@ethioagencyhub.com',
    maintenanceMode: false,
    debugMode: false,
    maxUploadSize: 50,
    sessionTimeout: 3600,
    passwordMinLength: 8,
    requireTwoFactor: true,
    enableAuditLog: true,
    enableBackups: true,
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div>
          <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">System Settings</h2>
        </div>
      </div>

      {/* General Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">General Settings</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Site URL</label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">Enable Maintenance Mode</span>
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.debugMode}
                onChange={(e) => setSettings({ ...settings, debugMode: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">Enable Debug Mode</span>
            </label>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Email Settings</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Security Settings</h3>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Password Min Length</label>
              <input
                type="number"
                value={settings.passwordMinLength}
                onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Session Timeout (seconds)</label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Max Upload Size (MB)</label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(e) => setSettings({ ...settings, requireTwoFactor: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">Require Two-Factor Authentication</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAuditLog}
                onChange={(e) => setSettings({ ...settings, enableAuditLog: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">Enable Audit Logging</span>
            </label>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Backup Settings</h3>
        </div>
        <div className="grid gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableBackups}
              onChange={(e) => setSettings({ ...settings, enableBackups: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600"
            />
            <span className="font-medium text-slate-700 dark:text-slate-200">Enable Automatic Backups</span>
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 focus:border-brand-600 focus:outline-none"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>
      </div>

      {/* WhatsApp Configuration */}
      <WhatsAppConfigPanel />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 rounded-lg bg-brand-600 px-8 py-3 font-medium text-white hover:bg-brand-700"
      >
        <Save className="h-5 w-5" />
        Save Settings
      </button>
    </div>
  );
}
