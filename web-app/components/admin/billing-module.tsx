'use client';

import { useState } from 'react';
import { Plus, Download, Eye, Edit2, CreditCard, AlertCircle, Users, FileCheck2, Plane, BarChart3 } from 'lucide-react';
import { subscriptionPlans, billingCycles, formatEtb } from '@/config/subscription';

export function BillingModule() {
  const [billingPeriod] = useState('monthly');
  const [plans] = useState(subscriptionPlans.map(p => ({
    id: p.id,
    name: p.name,
    price: p.pricesEtb.monthly,
    period: 'month',
    status: 'current' as const,
    nextBilling: '2026-06-15',
    employeeLimit: p.employeeLimit
  })));
  const [currentPlan] = useState(subscriptionPlans[1]); // Professional
  const [invoices] = useState([
    { id: 'INV-001', date: '2026-04-15', amount: 6500, status: 'paid', pdf: '#' },
    { id: 'INV-002', date: '2026-03-15', amount: 6500, status: 'paid', pdf: '#' },
    { id: 'INV-003', date: '2026-02-15', amount: 6500, status: 'paid', pdf: '#' },
  ]);
  const [usageMetrics] = useState([
    { metric: 'Total Employees Registered', usage: 156, limit: currentPlan.employeeLimit === 'unlimited' ? 9999 : currentPlan.employeeLimit, percentage: 31 },
    { metric: 'Documents Processed', usage: 892, limit: 2000, percentage: 45 },
    { metric: 'Travel Bookings', usage: 34, limit: 100, percentage: 34 },
    { metric: 'API Calls', usage: 45678, limit: 100000, percentage: 46 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm dark:shadow-soft-dark">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-ink dark:text-ink-dark">Billing & Subscription</h2>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-medium text-white hover:bg-brand-700">
            <Plus className="h-5 w-5" />
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Current Plan */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50 to-blue-50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Current Plan</p>
            <h3 className="text-2xl font-bold text-ink dark:text-ink-dark mt-1">{plans[0].name} Plan</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-300">
        {formatEtb(plans[0].price)}/{plans[0].period} â€¢ Next billing: {plans[0].nextBilling}
      </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-brand-600 px-4 py-2 font-medium text-brand-600 hover:bg-white dark:bg-slate-800">
            <Edit2 className="h-4 w-4" />
            Change Plan
          </button>
        </div>
      </div>

      {/* Usage Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Usage Metrics</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {usageMetrics.map((metric, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3">{metric.metric}</p>
              <div className="mb-3">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-2xl font-bold text-ink dark:text-ink-dark">{metric.usage}</span>
                  <span className="text-sm text-slate-600 dark:text-slate-300">of {metric.limit}</span>
                </div>
                <div className="h-3 w-full rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-brand-600"
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{metric.percentage}% of limit used</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Invoices</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Invoice</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Date</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Amount</th>
              <th className="px-6 py-4 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-6 py-4 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-ink dark:text-ink-dark">{invoice.id}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{invoice.date}</td>
                <td className="px-6 py-4 text-ink dark:text-ink-dark font-semibold">{formatEtb(invoice.amount)}</td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="flex items-center justify-end gap-1 text-brand-600 hover:text-brand-700">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">PDF</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Billing Information */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h3 className="text-lg font-semibold text-ink dark:text-ink-dark mb-4">Billing Information</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Company Name</label>
            <input
              type="text"
              defaultValue="EthioAgency LLC"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Tax ID</label>
            <input
              type="text"
              defaultValue="ETH-123456"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Billing Email</label>
            <input
              type="email"
              defaultValue="billing@ethioagency.com"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Billing Address</label>
            <input
              type="text"
              defaultValue="Addis Ababa, Ethiopia"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink dark:text-ink-dark">Payment Methods</h3>
          <button className="flex items-center gap-2 rounded-lg border border-brand-600 px-4 py-2 font-medium text-brand-600 hover:bg-brand-50">
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-medium text-ink dark:text-ink-dark">Visa ending in 4242</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Expires 12/2025</p>
              </div>
            </div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              Default
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
