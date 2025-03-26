
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

/**
 * Calculate derived billing amounts based on the primary amount and frequency
 */
export function calculateBillingAmounts(amount: number, frequency: string) {
  let weeklyAmount = 0;
  let monthlyAmount = 0;
  let annualAmount = 0;

  switch (frequency) {
    case 'weekly':
      weeklyAmount = amount;
      monthlyAmount = amount * 52 / 12;
      annualAmount = amount * 52;
      break;
    case 'fortnightly':
      weeklyAmount = amount / 2;
      monthlyAmount = amount * 26 / 12;
      annualAmount = amount * 26;
      break;
    case 'monthly':
      weeklyAmount = amount * 12 / 52;
      monthlyAmount = amount;
      annualAmount = amount * 12;
      break;
    case 'quarterly':
      weeklyAmount = amount * 4 / 52;
      monthlyAmount = amount / 3;
      annualAmount = amount * 4;
      break;
    case 'annually':
      weeklyAmount = amount / 52;
      monthlyAmount = amount / 12;
      annualAmount = amount;
      break;
    case 'one-time':
      weeklyAmount = 0;
      monthlyAmount = 0;
      annualAmount = amount;
      break;
    default:
      weeklyAmount = 0;
      monthlyAmount = 0;
      annualAmount = 0;
  }

  return {
    weeklyAmount,
    monthlyAmount,
    annualAmount
  };
}

/**
 * Calculate total billing amounts across all billing lines
 */
export function calculateTotalBillingAmounts(billingLines: BillingLine[]) {
  let totalWeeklyAmount = 0;
  let totalMonthlyAmount = 0;
  let totalAnnualAmount = 0;

  billingLines.forEach(line => {
    if (!line.onHold) {
      totalWeeklyAmount += line.weeklyAmount || 0;
      totalMonthlyAmount += line.monthlyAmount || 0;
      totalAnnualAmount += line.annualAmount || 0;
    }
  });

  return {
    totalWeeklyAmount,
    totalMonthlyAmount,
    totalAnnualAmount
  };
}

/**
 * Check if site billing is on hold
 */
export function isSiteBillingOnHold(billingOnHold?: boolean) {
  return billingOnHold === true;
}
