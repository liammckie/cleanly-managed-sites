
import { BillingLine, BillingFrequency } from "@/components/sites/forms/types/billingTypes";

/**
 * Convert an amount from one billing frequency to weekly, monthly and annual amounts
 */
export function calculateBillingAmounts(amount: number, frequency: BillingFrequency): {
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
} {
  let weeklyAmount = 0;
  let monthlyAmount = 0;
  let annualAmount = 0;

  switch (frequency) {
    case 'weekly':
      weeklyAmount = amount;
      monthlyAmount = amount * 4.33; // Average weeks per month
      annualAmount = amount * 52;
      break;
    case 'fortnightly':
      weeklyAmount = amount / 2;
      monthlyAmount = amount * 2.17; // Average fortnights per month
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
    default:
      // Default to monthly calculations if frequency is not recognized
      weeklyAmount = amount / 4.33;
      monthlyAmount = amount;
      annualAmount = amount * 12;
  }

  return {
    weeklyAmount: Number(weeklyAmount.toFixed(2)),
    monthlyAmount: Number(monthlyAmount.toFixed(2)),
    annualAmount: Number(annualAmount.toFixed(2))
  };
}

/**
 * Calculate total amounts across all billing lines
 */
export function calculateTotalBillingAmounts(billingLines: BillingLine[]): {
  totalWeeklyAmount: number;
  totalMonthlyAmount: number;
  totalAnnualAmount: number;
} {
  let totalWeeklyAmount = 0;
  let totalMonthlyAmount = 0;
  let totalAnnualAmount = 0;

  billingLines.forEach(line => {
    // Skip lines that are on hold
    if (line.onHold) return;
    
    // Use pre-calculated amounts if available, otherwise calculate them
    if (line.weeklyAmount !== undefined && 
        line.monthlyAmount !== undefined && 
        line.annualAmount !== undefined) {
      totalWeeklyAmount += line.weeklyAmount;
      totalMonthlyAmount += line.monthlyAmount;
      totalAnnualAmount += line.annualAmount;
    } else {
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
}

/**
 * Check if a billing line is currently on hold based on date range
 */
export function isBillingLineOnHold(line: BillingLine): boolean {
  if (!line.onHold) return false;
  
  const today = new Date();
  const holdStartDate = line.holdStartDate ? new Date(line.holdStartDate) : null;
  const holdEndDate = line.holdEndDate ? new Date(line.holdEndDate) : null;
  
  // If no dates are provided, assume it's on permanent hold
  if (!holdStartDate && !holdEndDate) return true;
  
  // If only start date is provided, check if today is after start date
  if (holdStartDate && !holdEndDate) {
    return today >= holdStartDate;
  }
  
  // If only end date is provided, check if today is before end date
  if (!holdStartDate && holdEndDate) {
    return today <= holdEndDate;
  }
  
  // If both dates are provided, check if today is between start and end date
  if (holdStartDate && holdEndDate) {
    return today >= holdStartDate && today <= holdEndDate;
  }
  
  return false;
}

/**
 * Check if site billing is currently on hold based on date range
 */
export function isSiteBillingOnHold(
  billingOnHold: boolean | undefined,
  holdStartDate: string | undefined,
  holdEndDate: string | undefined
): boolean {
  if (!billingOnHold) return false;
  
  const today = new Date();
  const startDate = holdStartDate ? new Date(holdStartDate) : null;
  const endDate = holdEndDate ? new Date(holdEndDate) : null;
  
  // If no dates are provided, assume it's on permanent hold
  if (!startDate && !endDate) return true;
  
  // If only start date is provided, check if today is after start date
  if (startDate && !endDate) {
    return today >= startDate;
  }
  
  // If only end date is provided, check if today is before end date
  if (!startDate && endDate) {
    return today <= endDate;
  }
  
  // If both dates are provided, check if today is between start and end date
  if (startDate && endDate) {
    return today >= startDate && today <= endDate;
  }
  
  return false;
}
