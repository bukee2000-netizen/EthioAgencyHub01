'use client';

import { useState, useEffect } from 'react';
import { Check, CreditCard, Building, Smartphone, ArrowLeft, TrendingUp, Users, Shield, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { subscriptionPlans, billingCycles, formatEtb, type BillingCycle } from '@/config/subscription';
import { useToast } from '@/components/ui/toast-provider';

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr', icon: Smartphone, description: 'Instant mobile payment via Telebirr' },
  { id: 'cbe', name: 'CBE Birr', icon: Building, description: 'Commercial Bank of Ethiopia' },
  { id: 'awash', name: 'Awash Bank', icon: Building, description: 'Awash National Bank' },
  { id: 'card', name: 'Debit/Credit Card', icon: CreditCard, description: 'Visa, Mastercard, CB' },
];

const planIcons: Record<string, any> = { starter: Users, professional: TrendingUp, enterprise: Shield };

export function SubscriptionPlans() {
  const { addToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [processing, setProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/billing/plans')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // No current plan in response, keeping state as null
        }
      })
      .catch(() => {});
  }, []);

  const handleSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPayment(true);
    setSuccess(false);
  };

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const res = await fetch('/api/billing/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan, billingCycle, paymentMethod })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setCurrentPlan(selectedPlan);
        setTimeout(() => { setShowPayment(false); setSuccess(false); }, 2000);
      }
    } catch (err) {
      console.error('Payment failed:', err);
      addToast({ title: 'Error', description: 'Payment failed. Please try again.', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white dark:from-slate-800 via-brand-50/30 dark:via-brand-800/30 to-white dark:to-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <Link href="/login" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Link>
        <h1 className="text-4xl font-bold text-ink dark:text-ink-dark mt-4">Choose Your Plan</h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">Scale your agency with the right subscription. All plans priced in Ethiopian Birr (ETB).</p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1.5 w-fit mx-auto shadow-sm dark:shadow-soft-dark">
        {billingCycles.map(cycle => (
          <button key={cycle.id} onClick={() => setBillingCycle(cycle.id)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              billingCycle === cycle.id ? 'bg-brand-600 text-white shadow-sm dark:shadow-soft-dark' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}>
            {cycle.label}
            {cycle.discountLabel && <span className="ml-1.5 text-xs opacity-80">({cycle.discountLabel})</span>}
          </button>
        ))}
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {subscriptionPlans.map(plan => {
          const Icon = planIcons[plan.id] || Users;
          const isCurrent = currentPlan === plan.id;
          const price = plan.pricesEtb[billingCycle];
          const monthlyPrice = billingCycle === 'yearly' ? Math.round(plan.pricesEtb.yearly / 12) : billingCycle === 'quarterly' ? Math.round(plan.pricesEtb.quarterly / 3) : plan.pricesEtb.monthly;
          const isPopular = plan.id === 'professional';

          return (
            <div key={plan.id} className={`relative rounded-2xl border-2 p-6 transition-all hover:shadow-lg dark:hover:shadow-soft-dark ${
              isCurrent ? 'border-brand-600 bg-brand-50' : selectedPlan === plan.id ? 'border-brand-400 bg-brand-50/50' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
            }`}>
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-bold text-white shadow-sm dark:shadow-soft-dark">
                  Most Popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-xs font-bold text-white shadow-sm dark:shadow-soft-dark">
                  Current Plan
                </div>
              )}

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                plan.id === 'starter' ? 'bg-blue-100 text-blue-600' :
                plan.id === 'professional' ? 'bg-purple-100 text-purple-600' :
                'bg-amber-100 text-amber-600'
              }`}>
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold text-ink dark:text-ink-dark">{plan.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>

              <div className="mt-4">
                <span className="text-4xl font-extrabold text-ink dark:text-ink-dark">{formatEtb(monthlyPrice)}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">/mo</span>
                {billingCycle !== 'monthly' && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{formatEtb(price)} per {billingCycle}</p>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="font-medium">{plan.employeeLimit === 'unlimited' ? 'Unlimited employees' : `Up to ${plan.employeeLimit} employees`}</span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className={`h-5 w-5 shrink-0 mt-0.5 ${i < 3 ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-slate-700 dark:text-slate-200">{f}</span>
                  </li>
                ))}
              </ul>

              {!isCurrent ? (
                <button onClick={() => handleSelect(plan.id)} disabled={processing}
                  className={`mt-6 w-full rounded-xl py-3 text-sm font-bold text-white transition-all shadow-sm dark:shadow-soft-dark ${
                    isPopular ? 'bg-brand-600 hover:bg-brand-700' : 'bg-slate-700 dark:bg-slate-600 hover:bg-slate-800'
                  } disabled:opacity-50`}>
                  {processing && selectedPlan === plan.id ? 'Processing...' : isPopular ? 'Get Started' : 'Choose Plan'}
                </button>
              ) : (
                <div className="mt-6 w-full rounded-xl bg-emerald-100 dark:bg-emerald-900/50 py-3 text-sm font-bold text-emerald-700 text-center">
                  Active Plan
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-soft-dark max-w-5xl mx-auto">
        <h3 className="font-bold text-ink dark:text-ink-dark text-lg mb-4">Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Feature</th>
                {subscriptionPlans.map(p => <th key={p.id} className="px-4 py-3 text-center font-bold text-ink dark:text-ink-dark">{p.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {[
                { label: 'Monthly Price', values: subscriptionPlans.map(p => formatEtb(p.pricesEtb.monthly)) },
                { label: 'Employee Limit', values: subscriptionPlans.map(p => p.employeeLimit === 'unlimited' ? 'Unlimited' : String(p.employeeLimit)) },
                ...subscriptionPlans[0].features.map((_, i) => ({
                  label: subscriptionPlans[2].features[i] || subscriptionPlans[1].features[i] || subscriptionPlans[0].features[i],
                  values: subscriptionPlans.map(p => p.features[i] ? '✓' : '—')
                }))
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                  {row.values.map((v, j) => (
                    <td key={j} className={`px-4 py-3 text-center ${v === '✓' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 shadow-xl">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-ink dark:text-ink-dark text-lg">Complete Payment</h3>
              {success && <p className="text-emerald-600 font-bold mt-2 flex items-center gap-2"><Check className="h-5 w-5" />Payment successful! Plan activated.</p>}
            </div>
            {!success && (
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Plan: <strong className="text-ink dark:text-ink-dark">{subscriptionPlans.find(p => p.id === selectedPlan)?.name}</strong></p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Billing: <strong className="text-ink dark:text-ink-dark">{billingCycle}</strong></p>
                  <p className="text-lg font-bold text-ink dark:text-ink-dark mt-2">{formatEtb(subscriptionPlans.find(p => p.id === selectedPlan)?.pricesEtb[billingCycle] || 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_METHODS.map(m => (
                      <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${paymentMethod === m.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                        <m.icon className="h-5 w-5 text-brand-600" />
                        <div className="text-left">
                          <p className="text-sm font-semibold">{m.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{m.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button onClick={() => setShowPayment(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              {!success && (
                <button onClick={handlePayment} disabled={processing}
                  className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50 shadow-sm dark:shadow-soft-dark">
                  {processing ? 'Processing...' : 'Pay Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
