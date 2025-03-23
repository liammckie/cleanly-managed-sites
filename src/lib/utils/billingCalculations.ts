
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

/**
 * Calculates the weekly amount based on a billing line's frequency and amount
 */
export const calculateWeeklyAmount = (amount: number, frequency: string) => {
  switch (frequency) {
    case 'weekly':
      return amount;
    case 'biweekly':
      return amount / 2;
    case 'monthly':
      return amount / 4.33;  // Average weeks in a month
    case 'quarterly':
      return amount / 13;    // 13 weeks in a quarter
    case 'annually':
      return amount / 52;    // 52 weeks in a year
    default:
      return 0;
  }
};

/**
 * Calculates the monthly amount based on a billing line's frequency and amount
 */
export const calculateMonthlyAmount = (amount: number, frequency: string) => {
  switch (frequency) {
    case 'weekly':
      return amount * 4.33;  // Average weeks in a month
    case 'biweekly':
      return amount * 2.17;  // Half of a month
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;     // 3 months in a quarter
    case 'annually':
      return amount / 12;    // 12 months in a year
    default:
      return 0;
  }
};

/**
 * Calculates the annual amount based on a billing line's frequency and amount
 */
export const calculateAnnualAmount = (amount: number, frequency: string) => {
  switch (frequency) {
    case 'weekly':
      return amount * 52;    // 52 weeks in a year
    case 'biweekly':
      return amount * 26;    // 26 biweekly periods in a year
    case 'monthly':
      return amount * 12;    // 12 months in a year
    case 'quarterly':
      return amount * 4;     // 4 quarters in a year
    case 'annually':
      return amount;
    default:
      return 0;
  }
};

/**
 * Checks if a billing line is currently on hold
 */
export const isBillingLineOnHold = (billingLine: BillingLine): boolean => {
  if (!billingLine.onHold) return false;
  
  const now = new Date();
  const startDate = billingLine.holdStartDate ? new Date(billingLine.holdStartDate) : null;
  const endDate = billingLine.holdEndDate ? new Date(billingLine.holdEndDate) : null;
  
  // If on hold and no date range specified, it's on indefinite hold
  if (!startDate && !endDate) return true;
  
  // If only start date is specified, check if we're after the start date
  if (startDate && !endDate) return now >= startDate;
  
  // If only end date is specified, check if we're before the end date
  if (!startDate && endDate) return now <= endDate;
  
  // If both dates are specified, check if we're within the range
  return startDate && endDate ? now >= startDate && now <= endDate : false;
};

/**
 * Checks if any of a site's billing lines are on hold
 */
export const isSiteBillingOnHold = (billingLines: BillingLine[]): boolean => {
  return billingLines.some(isBillingLineOnHold);
};
