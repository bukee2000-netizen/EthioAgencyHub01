'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, XCircle, Send, Loader2 } from 'lucide-react';

export function WhatsAppConfigPanel() {
  const [status, setStatus] = useState<{ configured: boolean; health?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/whatsapp/send')
      .then(r => r.json())
      .then(data => setStatus({ configured: data.configured, health: data.health }))
      .catch(() => setStatus({ configured: false, health: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  const handleTestSend = async () => {
    if (!testPhone) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testPhone, message: testMessage || 'Test message from EthioAgencyHub' }),
      });
      const data = await res.json();
      setSendResult(data.success ? 'Message sent successfully' : (data.error?.message || 'Send failed'));
    } catch {
      setSendResult('Network error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">WhatsApp Notifications</h3>
        </div>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-400 dark:text-slate-500" />
        ) : status?.configured ? (
          <span className="flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle2 className="h-4 w-4" /> Connected
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
            <XCircle className="h-4 w-4" /> Not Configured
          </span>
        )}
      </div>

      {!status?.configured && (
        <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-4 text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-1">WhatsApp Business API not configured</p>
          <p>Set <code className="bg-amber-100 dark:bg-amber-800/50 px-1 rounded">WHATSAPP_PHONE_ID</code>, <code className="bg-amber-100 dark:bg-amber-800/50 px-1 rounded">WHATSAPP_ACCESS_TOKEN</code>, and <code className="bg-amber-100 dark:bg-amber-800/50 px-1 rounded">WHATSAPP_VERIFY_TOKEN</code> in your <code className="bg-amber-100 dark:bg-amber-800/50 px-1 rounded">.env</code> file to enable WhatsApp notifications.</p>
        </div>
      )}

      {status?.configured && (
        <div className="space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Health: <span className="font-medium">{status.health || 'Unknown'}</span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            <p className="text-sm font-medium text-ink dark:text-ink-dark mb-3">Send Test Message</p>
            <div className="space-y-3">
              <input type="text" placeholder="Phone number (e.g., +251911234567)" value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm focus:border-green-500 focus:outline-none" />
              <input type="text" placeholder="Message (optional)" value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm focus:border-green-500 focus:outline-none" />
              <button onClick={handleTestSend} disabled={sending || !testPhone}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {sending ? 'Sending...' : 'Send Test'}
              </button>
              {sendResult && (
                <p className={`text-sm ${sendResult.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {sendResult}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
