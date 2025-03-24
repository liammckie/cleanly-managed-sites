
import { EmployeeLevel, EmploymentType, PayCondition, QuoteShift, Subcontractor, Day } from './types';
import { cleaningServicesAward } from './awardData';
import { v4 as uuidv4 } from 'uuid';

// Format currency values consistently
export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Helper function to calculate the total costs for all shifts
export function calculateTotalCosts(shifts: QuoteShift[]): number {
  if (!shifts || shifts.length === 0) return 0;
  
  return shifts.reduce((total, shift) => {
    return total + (shift.estimatedCost * (shift.numberOfCleaners || 1));
  }, 0);
}

// Helper to identify broken shifts (multiple shifts in the same day)
export function detectBrokenShifts(shifts: QuoteShift[]): Record<string, number> {
  const daysWithMultipleShifts: Record<string, number> = {};
  
  // Count shifts per day
  shifts.forEach(shift => {
    if (!daysWithMultipleShifts[shift.day]) {
      daysWithMultipleShifts[shift.day] = 1;
    } else {
      daysWithMultipleShifts[shift.day]++;
    }
  });
  
  // Filter to only days with multiple shifts
  Object.keys(daysWithMultipleShifts).forEach(day => {
    if (daysWithMultipleShifts[day] <= 1) {
      delete daysWithMultipleShifts[day];
    }
  });
  
  return daysWithMultipleShifts;
}

// Helper to detect overtime hours in shifts
export function detectOvertimeHours(shifts: QuoteShift[]): Record<string, number> {
  const overtimePerPerson: Record<string, number> = {};
  
  // Group shifts by days for each person
  shifts.forEach(shift => {
    // Calculate hours for this shift
    const startParts = shift.startTime.split(':').map(Number);
    const endParts = shift.endTime.split(':').map(Number);
    
    const startHours = startParts[0] + startParts[1] / 60;
    const endHours = endParts[0] + endParts[1] / 60;
    
    let hoursWorked = endHours - startHours;
    if (hoursWorked < 0) hoursWorked += 24; // Handle overnight shifts
    
    // Subtract break time
    hoursWorked -= shift.breakDuration / 60;
    
    // Track total hours for this person on this day
    const personId = `Person ${shift.level}`;
    if (!overtimePerPerson[personId]) {
      overtimePerPerson[personId] = 0;
    }
    
    overtimePerPerson[personId] += hoursWorked;
  });
  
  // Filter to only people with more than 8 hours
  Object.keys(overtimePerPerson).forEach(person => {
    if (overtimePerPerson[person] <= 8) {
      delete overtimePerPerson[person];
    } else {
      // Only count the overtime portion
      overtimePerPerson[person] -= 8;
    }
  });
  
  return overtimePerPerson;
}

// Calculate the difference between two time strings in hours
export function calculateHourDifference(start: string, end: string, breakMinutes: number = 0): number {
  const startParts = start.split(':').map(Number);
  const endParts = end.split(':').map(Number);
  
  const startHours = startParts[0] + startParts[1] / 60;
  const endHours = endParts[0] + endParts[1] / 60;
  
  let hoursWorked = endHours - startHours;
  if (hoursWorked < 0) hoursWorked += 24; // Handle overnight shifts
  
  // Subtract break time
  hoursWorked -= breakMinutes / 60;
  
  return Math.max(0, hoursWorked);
}

// Determine if a shift includes early or late hours
export function hasEarlyLateHours(start: string, end: string): boolean {
  const startHour = parseInt(start.split(':')[0], 10);
  const endHour = parseInt(end.split(':')[0], 10);
  
  // Early morning before 6am or evening after 7pm
  return startHour < 6 || startHour >= 19 || endHour < 6 || endHour >= 19;
}

// Calculate monthly cost based on subcontractor frequency
export function calculateSubcontractorMonthlyCost(subcontractor: Subcontractor): number {
  const cost = subcontractor.cost || 0;
  const frequency = subcontractor.frequency || 'monthly';
  
  switch (frequency) {
    case 'daily':
      return cost * 22; // Approx business days per month
    case 'weekly':
      return cost * 4.33; // Weeks per month
    case 'fortnightly':
      return cost * 2.17; // Fortnights per month
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'annually':
      return cost / 12;
    case 'per_event':
      return cost; // Assume once per month
    default:
      return cost;
  }
}

// Calculate total hours in shifts
export function calculateTotalHours(shifts: QuoteShift[]): number {
  return shifts.reduce((totalHours, shift) => {
    const hours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
    return totalHours + (hours * (shift.numberOfCleaners || 1));
  }, 0);
}

// Calculate total cost with overhead and margin
export function calculateTotalCostWithOverheadAndMargin(
  laborCost: number,
  subcontractorCost: number,
  overheadPercentage: number,
  marginPercentage: number
): { totalCost: number; overheadCost: number; marginCost: number; totalCostBeforeMargin: number; marginAmount: number; totalPrice: number } {
  const overheadCost = (laborCost * overheadPercentage) / 100;
  const totalCostBeforeMargin = laborCost + overheadCost + subcontractorCost;
  const marginAmount = (totalCostBeforeMargin * marginPercentage) / 100;
  const totalPrice = totalCostBeforeMargin + marginAmount;
  
  return {
    totalCost: laborCost + subcontractorCost,
    overheadCost,
    marginCost: marginAmount,
    totalCostBeforeMargin,
    marginAmount,
    totalPrice
  };
}

// Create a new shift with default values
export function createDefaultShift(quoteId: string): QuoteShift {
  return {
    id: uuidv4(),
    quoteId,
    day: 'monday',
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 30,
    numberOfCleaners: 1,
    employmentType: 'full_time',
    level: 1,
    allowances: [],
    estimatedCost: 0,
    location: '',
    notes: ''
  };
}
