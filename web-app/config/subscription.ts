export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

export type SubscriptionPlan = {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  description: string;
  pricesEtb: Record<BillingCycle, number>;
  employeeLimit: number | 'unlimited';
  features: string[];
};

export const PLANS = {
  BASIC: {
    monthlyPrice: 2500,
    yearlyPrice: 25500,
    features: ['Employee registration', 'Document tracking', 'Telegram upload', 'Basic reports']
  },
  PREMIUM: {
    monthlyPrice: 6500,
    yearlyPrice: 66300,
    features: ['Everything in Basic', 'Agent performance', 'Travel management', 'CV database', 'Advanced cross-match']
  },
  ENTERPRISE: {
    monthlyPrice: 15000,
    yearlyPrice: 153000,
    features: ['Everything in Premium', 'Multi-branch', 'Priority support', 'Audit trail', 'Custom integrations']
  }
} as const;

export const billingCycles: { id: BillingCycle; label: string; discountLabel?: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'quarterly', label: 'Quarterly', discountLabel: 'Save 5%' },
  { id: 'yearly', label: 'Yearly', discountLabel: 'Save 15%' }
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Agency',
    description: 'For small agencies digitizing their employee registration workflow.',
    pricesEtb: { monthly: 2500, quarterly: 7125, yearly: 25500 },
    employeeLimit: 250,
    features: ['Employee registration', 'Document tracking', 'Telegram short video upload', 'Basic reports']
  },
  {
    id: 'professional',
    name: 'Professional Agency',
    description: 'For growing agencies managing documents, travel, agents, and partners.',
    pricesEtb: { monthly: 6500, quarterly: 18525, yearly: 66300 },
    employeeLimit: 'unlimited',
    features: ['Everything in Starter', 'Agent performance', 'Travel management', 'CV database', 'Advanced document cross-match']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Network',
    description: 'For multi-branch and high-volume agency networks requiring full controls.',
    pricesEtb: { monthly: 15000, quarterly: 42750, yearly: 153000 },
    employeeLimit: 'unlimited',
    features: ['Everything in Professional', 'Multi-branch operations', 'Priority support', 'Audit trail', 'Custom integrations']
  }
];

export function formatEtb(amount: number) {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0
  }).format(amount);
}
