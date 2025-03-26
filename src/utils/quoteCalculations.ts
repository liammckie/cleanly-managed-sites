
import { Frequency } from '@/types/common';

// Function to calculate weekly amount from a given amount and frequency
export const calculateWeeklyAmount = (amount: number, frequency: string): number => {
  if (!amount || amount <= 0) {
    return 0;
  }

  switch (frequency) {
    case 'daily':
      return amount * 7;
    case 'weekly':
      return amount;
    case 'fortnightly':
      return amount / 2;
    case 'monthly':
      return amount * 12 / 52;
    case 'quarterly':
      return amount * 4 / 52;
    case 'yearly':
    case 'annually':
      return amount / 52;
    case 'once':
    case 'one-time':
    case 'one_time':
    case 'per_event':
      return 0; // One-time amounts don't contribute to recurring weekly amount
    default:
      return amount;
  }
};

// Function to calculate monthly amount from a given amount and frequency
export const calculateMonthlyAmount = (amount: number, frequency: string): number => {
  if (!amount || amount <= 0) {
    return 0;
  }

  switch (frequency) {
    case 'daily':
      return amount * 30.42; // Average days in a month
    case 'weekly':
      return amount * 4.33; // Average weeks in a month
    case 'fortnightly':
      return amount * 2.17; // Average fortnights in a month
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
    case 'annually':
      return amount / 12;
    case 'once':
    case 'one-time':
    case 'one_time':
    case 'per_event':
      return 0; // One-time amounts don't contribute to recurring monthly amount
    default:
      return amount;
  }
};

// Function to calculate annual amount from a given amount and frequency
export const calculateAnnualAmount = (amount: number, frequency: string): number => {
  if (!amount || amount <= 0) {
    return 0;
  }

  switch (frequency) {
    case 'daily':
      return amount * 365;
    case 'weekly':
      return amount * 52;
    case 'fortnightly':
      return amount * 26;
    case 'monthly':
      return amount * 12;
    case 'quarterly':
      return amount * 4;
    case 'yearly':
    case 'annually':
      return amount;
    case 'once':
    case 'one-time':
    case 'one_time':
    case 'per_event':
      return amount; // One-time amounts are included in annual amounts
    default:
      return amount;
  }
};

// Function to calculate total amounts from billing lines
export const calculateTotalAmounts = (billingLines: any[] = []): { totalWeeklyAmount: number; totalMonthlyAmount: number; totalAnnualAmount: number } => {
  if (!billingLines || billingLines.length === 0) {
    return {
      totalWeeklyAmount: 0,
      totalMonthlyAmount: 0,
      totalAnnualAmount: 0
    };
  }

  let totalWeekly = 0;
  let totalMonthly = 0;
  let totalAnnual = 0;

  billingLines.forEach(line => {
    // Skip lines that are on hold
    if (line.onHold || line.on_hold) {
      return;
    }

    const amount = Number(line.amount) || 0;
    const frequency = line.frequency || 'monthly';

    // Get existing calculated amounts or calculate them
    const weekly = line.weeklyAmount || calculateWeeklyAmount(amount, frequency);
    const monthly = line.monthlyAmount || calculateMonthlyAmount(amount, frequency);
    const annual = line.annualAmount || calculateAnnualAmount(amount, frequency);

    // Only add recurring amounts to weekly and monthly totals
    if (line.isRecurring || line.is_recurring) {
      totalWeekly += weekly;
      totalMonthly += monthly;
    }

    // Always add to annual total (both recurring and one-time amounts)
    totalAnnual += annual;
  });

  return {
    totalWeeklyAmount: totalWeekly,
    totalMonthlyAmount: totalMonthly,
    totalAnnualAmount: totalAnnual
  };
};
