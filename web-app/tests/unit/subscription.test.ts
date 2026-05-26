import { describe, expect, it } from 'vitest';
import { billingCycles, formatEtb, subscriptionPlans } from '@/config/subscription';

describe('subscription config', () => {
  it('exposes all three billing cycles', () => {
    const ids = billingCycles.map((cycle) => cycle.id);
    expect(ids).toEqual(['monthly', 'quarterly', 'yearly']);
  });

  it('lists all plans with ETB pricing for every cycle', () => {
    for (const plan of subscriptionPlans) {
      expect(plan.pricesEtb.monthly).toBeGreaterThan(0);
      expect(plan.pricesEtb.quarterly).toBeGreaterThan(0);
      expect(plan.pricesEtb.yearly).toBeGreaterThan(0);
    }
  });

  it('formats ETB currency with the ETB symbol', () => {
    const formatted = formatEtb(2500);
    expect(formatted).toMatch(/2,?500/);
    expect(formatted.toLowerCase()).toContain('etb');
  });
});
