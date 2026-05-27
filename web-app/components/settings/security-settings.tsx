'use client';

import { useState, useEffect } from 'react';
import { Save, Key, Lock, Shield, Eye, EyeOff, Copy, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SecuritySettings() {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(true);
  const [setupMode, setSetupMode] = useState<'idle' | 'setup' | 'verify' | 'done'>('idle');
  const [setupData, setSetupData] = useState<{ secret: string; otpauth: string; backupCodes: string[] } | null>(null);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setMfaEnabled(data.data?.twoFactorEnabled || false);
        }
      })
      .catch(() => {})
      .finally(() => setMfaLoading(false));
  }, []);

  const handlePasswordChange = async () => {
    setError('');
    if (passwords.new !== passwords.confirm) { setError('New passwords do not match'); return; }
    if (passwords.new.length < 8) { setError('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new })
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setPasswords({ current: '', new: '', confirm: '' });
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error?.message || 'Failed to update password');
      }
    } catch {
      setError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleSetup2FA = async () => {
    setSetupMode('setup');
    try {
      const res = await fetch('/api/auth/2fa/setup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSetupData(data.data);
        setSetupMode('verify');
      }
    } catch {
      setError('Failed to start 2FA setup');
      setSetupMode('idle');
    }
  };

  const handleVerify2FA = async () => {
    if (!verifyToken) return;
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verifyToken, type: 'totp' })
      });
      const data = await res.json();
      if (data.success) {
        setMfaEnabled(true);
        setSetupMode('done');
      } else {
        setVerifyError(data.error?.message || 'Invalid code');
      }
    } catch {
      setVerifyError('Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      const res = await fetch('/api/auth/2fa/disable', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMfaEnabled(false);
        setSetupMode('idle');
        setSetupData(null);
      }
    } catch {
      setError('Failed to disable 2FA');
    }
  };

  const copyBackupCodes = () => {
    if (!setupData) return;
    navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const InputPassword = ({ value, onChange, show, onToggle, placeholder }: any) => (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 pl-3 pr-10 text-sm focus:border-brand-600 focus:outline-none" />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-100 p-2"><Lock className="h-5 w-5 text-amber-600" /></div>
          <div>
            <h3 className="text-lg font-bold">Change Password</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your password to keep your account secure.</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Current Password</label>
            <InputPassword value={passwords.current} onChange={(e: any) => setPasswords({ ...passwords, current: e.target.value })}
              show={showPasswords.current} onToggle={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
              placeholder="Enter current password" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">New Password</label>
            <InputPassword value={passwords.new} onChange={(e: any) => setPasswords({ ...passwords, new: e.target.value })}
              show={showPasswords.new} onToggle={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
              placeholder="Enter new password" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm New Password</label>
            <InputPassword value={passwords.confirm} onChange={(e: any) => setPasswords({ ...passwords, confirm: e.target.value })}
              show={showPasswords.confirm} onToggle={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
              placeholder="Confirm new password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
        <button onClick={handlePasswordChange} disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
          className="mt-6 flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 font-medium text-white disabled:opacity-50">
          <Key className="h-4 w-4" />
          {saving ? 'Updating...' : saved ? 'Updated!' : 'Update Password'}
        </button>
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2"><Shield className="h-5 w-5 text-emerald-600" /></div>
          <div>
            <h3 className="text-lg font-bold">Two-Factor Authentication</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
          </div>
        </div>

        {setupMode === 'idle' && (
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="font-medium">
                {mfaLoading ? 'Checking...' : mfaEnabled ? (
                  <span className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-5 w-5 text-green-600" /> Status: Enabled
                  </span>
                ) : 'Status: Not Enabled'}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mfaEnabled ? 'Your account is protected with 2FA' : 'Enable 2FA for enhanced security'}
              </p>
            </div>
            <button onClick={mfaEnabled ? handleDisable2FA : handleSetup2FA}
              className={`rounded-xl px-4 py-2 text-sm font-medium ${mfaEnabled ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
              {mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        )}

        {setupMode === 'setup' && (
          <div className="mt-6 text-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-600" />
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Setting up 2FA...</p>
          </div>
        )}

        {setupMode === 'verify' && setupData && (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-ink dark:text-ink-dark">Scan this QR code with your authenticator app:</p>
            <div className="flex justify-center py-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupData.otpauth)}`}
                  alt="QR Code" className="w-48 h-48" />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Or manually enter: <code className="bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-xs font-mono">{setupData.secret}</code></p>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">Backup Codes</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Save these codes somewhere safe. Each code can be used once.</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {setupData.backupCodes.map((code, i) => (
                  <code key={i} className="bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded text-sm font-mono text-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {code}
                  </code>
                ))}
              </div>
              <button onClick={copyBackupCodes} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700">
                {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy all codes'}
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
              <p className="text-sm font-medium text-ink dark:text-ink-dark mb-2">Verify Setup</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Enter the 6-digit code from your authenticator app to confirm setup.</p>
              <div className="flex gap-3 items-center">
                <input type="text" maxLength={6} placeholder="000000" value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-32 rounded-xl border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-center text-lg font-mono tracking-widest focus:border-brand-600 focus:outline-none" />
                <button onClick={handleVerify2FA} disabled={verifying || verifyToken.length < 6}
                  className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                </button>
              </div>
              {verifyError && <p className="text-xs text-red-600 mt-2">{verifyError}</p>}
            </div>
          </div>
        )}

        {setupMode === 'done' && (
          <div className="mt-6 text-center py-6">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-600 mb-3" />
            <h4 className="text-lg font-bold text-ink dark:text-ink-dark">2FA Enabled Successfully</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your account is now protected with two-factor authentication.</p>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark">
        <h3 className="text-lg font-bold">Active Sessions</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your active login sessions.</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Chrome on Windows - Addis Ababa, ET</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Active</span>
          </div>
        </div>
        <button className="mt-4 text-sm font-medium text-red-600 hover:text-red-700">Sign out of all other sessions</button>
      </section>
    </div>
  );
}
