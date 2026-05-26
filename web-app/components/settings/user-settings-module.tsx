'use client';

import { useState, useEffect } from 'react';
import {
  User, Lock, Bell, LogOut, Globe, Moon, Sun, Save, Camera,
  Mail, Phone, Building2, MapPin, Calendar, Shield, Eye, EyeOff,
  Key, Smartphone, Watch, Tablet, CheckCircle2, AlertCircle,
  MessageSquare, FileText, Clock, BellRing, BellOff
} from 'lucide-react';
import { useTheme } from '@/components/layout/theme-provider';
import { useLanguage } from '@/components/layout/language-provider';

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  bio: string;
  avatar?: string;
  address: string;
  city: string;
  country: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  documentUpdates: boolean;
  travelSchedules: boolean;
  weeklyReport: boolean;
  systemAlerts: boolean;
  agentUpdates: boolean;
  pilgrimUpdates: boolean;
  financialAlerts: boolean;
}

interface Preferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  compactMode: boolean;
  showAnimations: boolean;
}

export function UserSettingsModule() {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profile, setProfile] = useState<Profile>({
    firstName: 'Abebe',
    lastName: 'Kebede',
    email: 'abebe@ethioagency.com',
    phone: '+251911234567',
    title: 'System Administrator',
    department: 'IT',
    bio: 'Experienced IT professional with focus on system administration and user management.',
    address: 'Bole Road, Addis Ababa',
    city: 'Addis Ababa',
    country: 'Ethiopia',
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginAlerts: true,
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    documentUpdates: true,
    travelSchedules: true,
    weeklyReport: true,
    systemAlerts: true,
    agentUpdates: true,
    pilgrimUpdates: false,
    financialAlerts: true,
  });

  const { dict } = useLanguage();
  const { theme: currentTheme, setTheme: setAppTheme } = useTheme();

  const [preferences, setPreferences] = useState<Preferences>({
    language: 'English',
    timezone: 'Africa/Addis_Ababa',
    theme: currentTheme,
    compactMode: false,
    showAnimations: true,
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaveMessage({ type: 'success', text: 'Settings saved successfully!' });
    setIsSaving(false);
    
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const tabs = [
    { id: 'profile', label: dict.common.profile, icon: User },
    { id: 'security', label: dict.common.security, icon: Lock },
    { id: 'notifications', label: dict.common.notifications, icon: Bell },
    { id: 'preferences', label: dict.common.preferences, icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-cyan-200 dark:border-cyan-800 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink dark:text-ink-dark flex items-center gap-3">
              <User className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
              {dict.common.settings}
            </h2>
            <p className="mt-1 text-slate-600 dark:text-slate-400">
              {dict.common.preferences}
            </p>
          </div>
          {saveMessage && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              saveMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
            }`}>
              {saveMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-ink mb-6">{dict.common.profile}</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-32 h-32 rounded-full bg-cyan-100 flex items-center justify-center text-3xl font-bold text-cyan-600">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-600 text-white hover:bg-cyan-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-ink">{profile.firstName} {profile.lastName}</h3>
              <p className="text-sm text-slate-500">{profile.title}</p>
              <p className="text-sm text-cyan-600 mt-2">{profile.department}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-ink mb-4">{dict.common.status}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status</span>
                  <span className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Last Login</span>
                  <span className="text-sm text-slate-500">Today, 10:30 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Member Since</span>
                  <span className="text-sm text-slate-500">Jan 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-ink mb-6">{dict.common.password}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 pr-10 text-sm focus:border-cyan-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button className="w-full rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700">
                {dict.common.save}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-cyan-600" />
                  <h4 className="font-semibold text-ink">{dict.common.twoFactor}</h4>
                </div>
                <button
                  onClick={() => setSecurity({ ...security, twoFactorEnabled: !security.twoFactorEnabled })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    security.twoFactorEnabled ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    security.twoFactorEnabled ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              <p className="text-sm text-slate-500">
                {security.twoFactorEnabled 
                  ? 'Your account is protected with 2FA using authenticator app.'
                  : 'Enable two-factor authentication for enhanced security.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-cyan-600" />
                  <h4 className="font-semibold text-ink">{dict.common.notifications}</h4>
                </div>
                <button
                  onClick={() => setSecurity({ ...security, loginAlerts: !security.loginAlerts })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    security.loginAlerts ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    security.loginAlerts ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              <p className="text-sm text-slate-500">
                Receive email alerts when your account is accessed from new devices.
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h4 className="font-semibold text-red-800 mb-2">{dict.common.dangerZone}</h4>
              <p className="text-sm text-red-600 mb-4">
                Permanently delete your account and all associated data.
              </p>
              <button className="rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100">
                {dict.common.deleteAccount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 p-6">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-6">{dict.common.notifications}</h3>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'documentUpdates', label: 'Document Updates', desc: 'When document status changes' },
              { key: 'travelSchedules', label: 'Travel Schedules', desc: 'Departure and travel updates' },
              { key: 'weeklyReport', label: 'Weekly Report', desc: 'Summary of weekly activities' },
              { key: 'systemAlerts', label: 'System Alerts', desc: 'Important system notifications' },
              { key: 'agentUpdates', label: 'Agent Updates', desc: 'New agents and status changes' },
              { key: 'pilgrimUpdates', label: 'Pilgrim Updates', desc: 'Hajj & Umrah pilgrim changes' },
              { key: 'financialAlerts', label: 'Financial Alerts', desc: 'Payment and financial notifications' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-ink">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof NotificationSettings] })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[item.key as keyof NotificationSettings] ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[item.key as keyof NotificationSettings] ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-6">{dict.common.appearance}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option>English</option>
                  <option>Amharic</option>
                  <option>Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none"
                >
                  <option>Africa/Addis_Ababa</option>
                  <option>UTC</option>
                  <option>Europe/London</option>
                  <option>Asia/Dubai</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{dict.common.theme}</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setPreferences({ ...preferences, theme: 'light' }); setAppTheme('light'); }}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border ${
                      currentTheme === 'light' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <Sun className="h-5 w-5" />
                    <span className="text-sm font-medium">{dict.common.lightMode}</span>
                  </button>
                  <button
                    onClick={() => { setPreferences({ ...preferences, theme: 'dark' }); setAppTheme('dark'); }}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border ${
                      currentTheme === 'dark' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <Moon className="h-5 w-5" />
                    <span className="text-sm font-medium">{dict.common.darkMode}</span>
                  </button>
                  <button
                    onClick={() => { setPreferences({ ...preferences, theme: 'system' }); setAppTheme('system'); }}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border ${
                      currentTheme === 'system' ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30' : 'border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    <Globe className="h-5 w-5" />
                    <span className="text-sm font-medium">{dict.common.systemTheme}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-6">{dict.common.preferences}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-ink">Compact Mode</p>
                  <p className="text-sm text-slate-500">Reduce spacing for more content</p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, compactMode: !preferences.compactMode })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.compactMode ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.compactMode ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-ink">Show Animations</p>
                  <p className="text-sm text-slate-500">Enable UI transitions and animations</p>
                </div>
                <button
                  onClick={() => setPreferences({ ...preferences, showAnimations: !preferences.showAnimations })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    preferences.showAnimations ? 'bg-cyan-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    preferences.showAnimations ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
        >
          {isSaving ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}