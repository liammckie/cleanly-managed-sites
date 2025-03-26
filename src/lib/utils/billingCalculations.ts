import { BillingLine, BillingFrequency } from '@/components/sites/forms/types/billingTypes';
import { isLineOnHold } from './billingLineUtils';

// Calculate the monthly amount for a billing line
export const calculateMonthlyAmount = (line: BillingLine): number => {
  if (isLineOnHold(line) || !line.isRecurring) return 0;
  
  const amount = line.amount;
  
  switch (line.frequency) {
    case 'weekly':
      return (amount * 52) / 12;
    case 'fortnightly':
      return (amount * 26) / 12;
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'annually':
      return amount / 12;
    case 'one-time':
      return 0; // One-time payments don't contribute to monthly amount
    default:
      return 0;
  }
};

// Calculate the annual amount for a billing line
export const calculateAnnualAmount = (line: BillingLine): number => {
  if (isLineOnHold(line) || !line.isRecurring) return 0;
  
  const amount = line.amount;
  
  switch (line.frequency) {
    case 'weekly':
      return amount * 52;
    case 'fortnightly':
      return amount * 26;
    case 'monthly':
      return amount * 12;
    case 'quarterly':
      return amount * 4;
    case 'annually':
      return amount;
    case 'one-time':
      return 0; // One-time payments don't contribute to annual amount
    default:
      return 0;
  }
};

// Calculate the weekly amount for a billing line
export const calculateWeeklyAmount = (line: BillingLine): number => {
  if (isLineOnHold(line) || !line.isRecurring) return 0;
  
  const amount = line.amount;
  
  switch (line.frequency) {
    case 'weekly':
      return amount;
    case 'fortnightly':
      return amount / 2;
    case 'monthly':
      return (amount * 12) / 52;
    case 'quarterly':
      return (amount * 4) / 52;
    case 'annually':
      return amount / 52;
    case 'one-time':
      return 0; // One-time payments don't contribute to weekly amount
    default:
      return 0;
  }
};

// Calculate the total weekly amount for all billing lines
export const calculateTotalWeeklyAmount = (lines: BillingLine[]): number => {
  return lines.reduce((total, line) => total + calculateWeeklyAmount(line), 0);
};

// Calculate the total monthly amount for all billing lines
export const calculateTotalMonthlyAmount = (lines: BillingLine[]): number => {
  return lines.reduce((total, line) => total + calculateMonthlyAmount(line), 0);
};

// Calculate the total annual amount for all billing lines
export const calculateTotalAnnualAmount = (lines: BillingLine[]): number => {
  return lines.reduce((total, line) => total + calculateAnnualAmount(line), 0);
};
