
import { BillingFrequency, BillingLine } from '@/components/sites/forms/types/billingTypes';

interface BillingAmounts {
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
}

/**
 * Calculates weekly, monthly, and annual amounts based on a billing amount and frequency
 */
export const calculateBillingAmounts = (
  amount: number,
  frequency: BillingFrequency
): BillingAmounts => {
  let weeklyAmount = 0;
  let monthlyAmount = 0;
  let annualAmount = 0;

  if (amount === 0) {
    return { weeklyAmount, monthlyAmount, annualAmount };
  }

  switch (frequency) {
    case 'weekly':
      weeklyAmount = amount;
      monthlyAmount = amount * 4.33;
      annualAmount = amount * 52;
      break;
    case 'fortnightly':
      weeklyAmount = amount / 2;
      monthlyAmount = amount * 2.165;
      annualAmount = amount * 26;
      break;
    case 'monthly':
      weeklyAmount = amount / 4.33;
      monthlyAmount = amount;
      annualAmount = amount * 12;
      break;
    case 'quarterly':
      weeklyAmount = amount / 13;
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
    weeklyAmount: parseFloat(weeklyAmount.toFixed(2)),
    monthlyAmount: parseFloat(monthlyAmount.toFixed(2)),
    annualAmount: parseFloat(annualAmount.toFixed(2)),
  };
};

/**
 * Calculates the total billing amounts across all lines
 */
export const calculateTotalBillingAmounts = (
  billingLines: BillingLine[]
): BillingAmounts => {
  return billingLines.reduce(
    (totals, line) => {
      // Skip non-recurring lines for totals
      if (!line.isRecurring || line.onHold) {
        return totals;
      }

      const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
        line.amount,
        line.frequency as BillingFrequency
      );

      return {
        weeklyAmount: totals.weeklyAmount + weeklyAmount,
        monthlyAmount: totals.monthlyAmount + monthlyAmount,
        annualAmount: totals.annualAmount + annualAmount,
      };
    },
    { weeklyAmount: 0, monthlyAmount: 0, annualAmount: 0 }
  );
};

/**
 * Creates a BillingLine object with default values
 */
export const createBillingLine = (description: string = '', amount: number = 0): BillingLine => {
  return {
    id: crypto.randomUUID(),
    description,
    amount,
    frequency: 'monthly',
    isRecurring: true,
    onHold: false,
    weeklyAmount: 0,
    monthlyAmount: 0,
    annualAmount: 0,
  };
};

/**
 * Checks if a site's billing is on hold
 */
export const isSiteBillingOnHold = (billingOnHold?: boolean): boolean => {
  return !!billingOnHold;
};
