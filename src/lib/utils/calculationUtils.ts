
import { QuoteShift } from '@/lib/types/award/types';
import { BillingLine } from '@/components/sites/forms/types/billingTypes';

// Simple placeholder calculation function - in reality this would be more complex
export function calculateShiftCost(shift: Partial<QuoteShift>, options: any): number {
  // Basic calculation logic 
  const baseRate = 25; // Placeholder base rate
  const numberOfCleaners = shift.numberOfCleaners || 1;
  
  // Calculate hours (simplified)
  let hours = 2; // Default to 2 hours if we can't calculate
  
  if (shift.startTime && shift.endTime) {
    const start = new Date(`2000-01-01T${shift.startTime}`);
    const end = new Date(`2000-01-01T${shift.endTime}`);
    
    // If end time is earlier than start time, assume it's the next day
    let milliseconds = end.getTime() - start.getTime();
    if (milliseconds < 0) {
      milliseconds += 24 * 60 * 60 * 1000;
    }
    
    // Convert to hours and subtract break
    hours = milliseconds / (1000 * 60 * 60);
    
    // Subtract break duration if specified
    if (shift.breakDuration) {
      hours -= shift.breakDuration / 60;
    }
  }
  
  // Employment type multiplier
  let typeMultiplier = 1;
  if (shift.employmentType === 'casual') {
    typeMultiplier = 1.25;
  }
  
  // Level multiplier
  let levelMultiplier = 1;
  if (shift.level) {
    levelMultiplier = 1 + ((shift.level - 1) * 0.1);
  }
  
  // Day multiplier (weekend rates)
  let dayMultiplier = 1;
  if (shift.day === 'saturday') {
    dayMultiplier = 1.5;
  } else if (shift.day === 'sunday') {
    dayMultiplier = 2;
  }
  
  // Calculate cost
  const cost = baseRate * hours * numberOfCleaners * typeMultiplier * levelMultiplier * dayMultiplier;
  
  return parseFloat(cost.toFixed(2));
}

// Calculate billing amounts based on frequency
export function calculateBillingAmounts(amount: number, frequency: string): { 
  weekly: number; 
  monthly: number; 
  annual: number 
} {
  let weekly = 0;
  let monthly = 0;
  let annual = 0;
  
  switch (frequency) {
    case 'weekly':
      weekly = amount;
      monthly = amount * 4.33; // Average weeks in a month
      annual = amount * 52;
      break;
    case 'fortnightly':
      weekly = amount / 2;
      monthly = amount * 2.167; // Average fortnights in a month
      annual = amount * 26;
      break;
    case 'monthly':
      weekly = amount / 4.33;
      monthly = amount;
      annual = amount * 12;
      break;
    case 'quarterly':
      weekly = amount / 13;
      monthly = amount / 3;
      annual = amount * 4;
      break;
    case 'yearly':
      weekly = amount / 52;
      monthly = amount / 12;
      annual = amount;
      break;
    case 'once':
      weekly = 0;
      monthly = 0;
      annual = amount;
      break;
    default:
      weekly = amount;
      monthly = amount * 4.33;
      annual = amount * 52;
  }
  
  return {
    weekly: parseFloat(weekly.toFixed(2)),
    monthly: parseFloat(monthly.toFixed(2)),
    annual: parseFloat(annual.toFixed(2))
  };
}

// Calculate total from billing lines
export function calculateTotalBillingAmounts(billingLines: BillingLine[]): {
  weekly: number;
  monthly: number;
  annual: number;
} {
  let totalWeekly = 0;
  let totalMonthly = 0;
  let totalAnnual = 0;
  
  billingLines.forEach(line => {
    if (!line.on_hold) {
      const amounts = calculateBillingAmounts(line.amount, line.frequency);
      totalWeekly += amounts.weekly;
      totalMonthly += amounts.monthly;
      totalAnnual += amounts.annual;
    }
  });
  
  return {
    weekly: parseFloat(totalWeekly.toFixed(2)),
    monthly: parseFloat(totalMonthly.toFixed(2)),
    annual: parseFloat(totalAnnual.toFixed(2))
  };
}

// Check if site billing is on hold
export function isSiteBillingOnHold(billingDetails: any): boolean {
  return billingDetails?.billingOnHold === true;
}
