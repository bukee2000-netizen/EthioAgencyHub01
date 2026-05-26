'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { billingCycles, formatEtb, subscriptionPlans, type BillingCycle, type SubscriptionPlan } from '@/config/subscription';

export function PlanSelector() {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selected, setSelected] = useState<SubscriptionPlan['id']>('professional');

  const selectedPlan = useMemo(() => subscriptionPlans.find((plan) => plan.id === selected)!, [selected]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Subscription billing</p>
        <h2 className="mt-2 text-3xl font-bold text-ink">Choose a plan in Ethiopian Birr</h2>
        <p className="mt-3 max-w-3xl text-slate-600">Select a billing cycle and subscription level for your agency.</p>
        <div className="mt-6 inline-flex rounded-2xl bg-slate-100 p-1">
          {billingCycles.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setCycle(option.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                cycle === option.id ? 'bg-white text-brand-700 shadow' : 'text-slate-500 hover:text-ink'
              }`}
            >
              {option.label}
              {option.discountLabel ? <span className="ml-2 text-xs text-emerald-600">{option.discountLabel}</span> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        {subscriptionPlans.map((plan) => {
          const isSelected = plan.id === selected;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={`rounded-3xl border p-6 text-left shadow-sm transition ${
                isSelected ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-200' : 'border-slate-200 bg-white hover:border-brand-400'
              }`}
            >
              <h3 className="text-xl font-bold text-ink">{plan.name}</h3>
              <p className="mt-2 min-h-12 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-5 text-3xl font-bold text-brand-700">{formatEtb(plan.pricesEtb[cycle])}</p>
              <p className="text-xs text-slate-500">per {cycle === 'monthly' ? 'month' : cycle === 'quarterly' ? 'quarter' : 'year'}</p>
              <p className="mt-4 text-sm font-semibold text-ink">Employees: {plan.employeeLimit}</p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-ink">Order summary</h3>
        <p className="mt-1 text-sm text-slate-500">Review your selection before confirming your subscription.</p>
        <dl className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Plan</dt>
            <dd className="mt-1 text-lg font-semibold text-ink">{selectedPlan.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Billing cycle</dt>
            <dd className="mt-1 text-lg font-semibold text-ink">{billingCycles.find((c) => c.id === cycle)?.label}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Total</dt>
            <dd className="mt-1 text-lg font-bold text-brand-700">{formatEtb(selectedPlan.pricesEtb[cycle])}</dd>
          </div>
        </dl>
        <button type="button" className="mt-6 rounded-2xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
          Confirm subscription
        </button>
      </section>
    </div>
  );
}
