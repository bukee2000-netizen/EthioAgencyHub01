import { ok } from '@/lib/api/responses';
import { billingCycles, subscriptionPlans } from '@/config/subscription';

export async function GET() {
  return ok({ plans: subscriptionPlans, cycles: billingCycles, currency: 'ETB' });
}
