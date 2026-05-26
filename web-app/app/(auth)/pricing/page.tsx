'use client';

import { SubscriptionPlans } from '@/components/billing/subscription-plans';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <Link 
          href="/login" 
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-ink">Choose Your Plan</h1>
          <p className="mt-3 text-lg text-slate-600">
            Scale your agency with the right subscription plan
          </p>
        </div>

        <SubscriptionPlans />
      </div>
    </div>
  );
}