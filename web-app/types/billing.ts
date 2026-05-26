import type { BillingCycle, SubscriptionPlan } from '@/config/subscription';

export type AgencySubscription = {
  id: string;
  agencyId: string;
  planId: SubscriptionPlan['id'];
  billingCycle: BillingCycle;
  amountEtb: number;
  startsAt: string;
  renewsAt: string;
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
};
