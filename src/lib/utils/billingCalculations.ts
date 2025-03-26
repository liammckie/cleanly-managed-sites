
import { BillingLine, BillingFrequency, BillingDetails } from '@/components/sites/forms/types/billingTypes';

// Calculate weekly, monthly and annual amounts based on the billing frequency and amount
export const calculateBillingAmounts = (
  amount: number,
  frequency: BillingFrequency
): { weeklyAmount: number; monthlyAmount: number; annualAmount: number } => {
  let weeklyAmount = 0;
  let monthlyAmount = 0;
  let annualAmount = 0;

  switch (frequency) {
    case 'weekly':
      weeklyAmount = amount;
      monthlyAmount = amount * 4.33; // Average weeks in a month
      annualAmount = amount * 52;
      break;
    case 'fortnightly':
      weeklyAmount = amount / 2;
      monthlyAmount = amount * 2.17; // Average fortnights in a month
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
    weeklyAmount: Number(weeklyAmount.toFixed(2)),
    monthlyAmount: Number(monthlyAmount.toFixed(2)),
    annualAmount: Number(annualAmount.toFixed(2))
  };
};

// Calculate total billing amounts from all billing lines
export const calculateTotalBillingAmounts = (
  billingLines: BillingLine[]
): { totalWeeklyAmount: number; totalMonthlyAmount: number; totalAnnualAmount: number } => {
  let totalWeeklyAmount = 0;
  let totalMonthlyAmount = 0;
  let totalAnnualAmount = 0;

  billingLines.forEach(line => {
    if (line.isRecurring && !line.on_hold) {
      const { weeklyAmount, monthlyAmount, annualAmount } = calculateBillingAmounts(
        line.amount,
        line.frequency
      );
      
      totalWeeklyAmount += weeklyAmount;
      totalMonthlyAmount += monthlyAmount;
      totalAnnualAmount += annualAmount;
    }
  });

  return {
    totalWeeklyAmount: Number(totalWeeklyAmount.toFixed(2)),
    totalMonthlyAmount: Number(totalMonthlyAmount.toFixed(2)),
    totalAnnualAmount: Number(totalAnnualAmount.toFixed(2))
  };
};

// Check if a billing line is on hold
export const isLineOnHold = (line: BillingLine): boolean => {
  // Check for either on_hold or onHold property
  return line.on_hold || !!line.onHold;
};

// Check if site billing is on hold
export const isSiteBillingOnHold = (billingOnHold?: boolean): boolean => {
  return !!billingOnHold;
};

// Format billing line for API
export const formatBillingLineForAPI = (line: BillingLine): BillingLine => {
  // Ensure on_hold property is set correctly for API
  return {
    ...line,
    on_hold: isLineOnHold(line)
  };
};
