
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

/**
 * Checks if a site's billing is currently on hold
 */
export const isSiteBillingOnHold = (isOnHold?: boolean): boolean => {
  return isOnHold === true;
};

/**
 * Calculates the billing amounts (weekly, monthly, annual) for a given billing line
 */
export const calculateBillingAmounts = (
  amount: number,
  frequency: string
): { weeklyAmount: number; monthlyAmount: number; annualAmount: number } => {
  const weeklyAmount = calculateWeeklyAmount(amount, frequency);
  const monthlyAmount = calculateMonthlyAmount(weeklyAmount);
  const annualAmount = calculateAnnualAmount(weeklyAmount);
  
  return {
    weeklyAmount,
    monthlyAmount,
    annualAmount
  };
};

/**
 * Calculates the weekly amount from a given amount and frequency
 */
export const calculateWeeklyAmount = (amount: number, frequency: string): number => {
  switch (frequency) {
    case 'weekly':
      return amount;
    case 'fortnightly':
      return amount / 2;
    case 'monthly':
      return amount / 4.33; // Average weeks in a month
    case 'quarterly':
      return amount / 13; // 52 weeks / 4 quarters = 13 weeks per quarter
    case 'semi-annually':
      return amount / 26; // 52 weeks / 2 = 26 weeks per half year
    case 'annually':
      return amount / 52;
    default:
      return 0;
  }
};

/**
 * Calculates monthly amount from weekly amount
 */
export const calculateMonthlyAmount = (weeklyAmount: number): number => {
  return weeklyAmount * 4.33; // Average weeks in a month
};

/**
 * Calculates annual amount from weekly amount
 */
export const calculateAnnualAmount = (weeklyAmount: number): number => {
  return weeklyAmount * 52;
};

/**
 * Calculates total billing amounts from an array of billing lines
 */
export const calculateTotalBillingAmounts = (
  billingLines: BillingLine[]
): { totalWeeklyAmount: number; totalMonthlyAmount: number; totalAnnualAmount: number } => {
  // Initialize totals
  let totalWeeklyAmount = 0;
  let totalMonthlyAmount = 0;
  let totalAnnualAmount = 0;
  
  // Sum up all active billing lines
  billingLines.forEach(line => {
    if (!line.onHold) {
      const lineAmounts = calculateBillingAmounts(line.amount || 0, line.frequency || 'monthly');
      totalWeeklyAmount += lineAmounts.weeklyAmount;
      totalMonthlyAmount += lineAmounts.monthlyAmount;
      totalAnnualAmount += lineAmounts.annualAmount;
    }
  });
  
  return {
    totalWeeklyAmount,
    totalMonthlyAmount,
    totalAnnualAmount
  };
};
