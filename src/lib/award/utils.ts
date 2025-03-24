
import { QuoteShift, Subcontractor } from './types';

// Calculate the difference in hours between two times, accounting for break
export function calculateHourDifference(
  startTime: string,
  endTime: string,
  breakMinutes: number = 0
): number {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);
  
  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);
  
  // If end time is earlier than start time, assume it's the next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  // Calculate difference in milliseconds
  const diffMs = endDate.getTime() - startDate.getTime();
  
  // Convert to hours and subtract break time in hours
  const hours = diffMs / (1000 * 60 * 60) - (breakMinutes / 60);
  
  // Round to 2 decimal places
  return Math.round(hours * 100) / 100;
}

// Check if a shift has early or late hours (before 6am or after 6pm)
export function hasEarlyLateHours(startTime: string, endTime: string): boolean {
  if (!startTime || !endTime) return false;
  
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  // Early hours are before 6am, late hours are after 6pm
  return startHour < 6 || endHour >= 18;
}

// Calculate total hours for a set of shifts
export function calculateTotalHours(shifts: QuoteShift[]): number {
  return shifts.reduce((total, shift) => {
    return total + calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration || 0);
  }, 0);
}

// Detect overtime hours from a set of shifts
export function detectOvertimeHours(shifts: QuoteShift[]): Record<string, number> {
  // Group shifts by employee type and day
  const shiftsByTypeAndDay = new Map<string, QuoteShift[]>();
  
  shifts.forEach(shift => {
    const key = `${shift.employmentType}-${shift.level}`;
    if (!shiftsByTypeAndDay.has(key)) {
      shiftsByTypeAndDay.set(key, []);
    }
    shiftsByTypeAndDay.get(key)?.push(shift);
  });
  
  const overtimeHours: Record<string, number> = {
    total: 0,
    fullTime: 0,
    partTime: 0,
    casual: 0
  };
  
  // Check for overtime for each employee type
  shiftsByTypeAndDay.forEach((employeeShifts, key) => {
    const totalHours = calculateTotalHours(employeeShifts);
    
    // For full-time employees, overtime is hours over 38 per week
    if (key.startsWith('full_time')) {
      const overtime = Math.max(0, totalHours - 38);
      overtimeHours.fullTime += overtime;
      overtimeHours.total += overtime;
    }
    
    // For part-time employees, overtime depends on contracted hours
    // For this example, assume part-time is 20 hours per week
    else if (key.startsWith('part_time')) {
      const overtime = Math.max(0, totalHours - 20);
      overtimeHours.partTime += overtime;
      overtimeHours.total += overtime;
    }
    
    // For casual employees, overtime is typically after 12 hours in a day
    // or after 38 hours in a week
    else if (key.startsWith('casual')) {
      const overtime = Math.max(0, totalHours - 38);
      overtimeHours.casual += overtime;
      overtimeHours.total += overtime;
    }
  });
  
  return overtimeHours;
}

// Calculate monthly cost based on frequency
export function calculateMonthlyCost(cost: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return cost * 21.67; // Average work days per month
    case 'weekly':
      return cost * 4.33; // Average weeks per month
    case 'fortnightly': // Adding support for "fortnightly"
      return cost * 2.167; // Average fortnights per month
    case 'monthly':
      return cost;
    case 'quarterly':
      return cost / 3;
    case 'annually':
      return cost / 12;
    case 'one_time':
      return cost; // For once-off, just use the full cost
    default:
      return cost;
  }
}

// Calculate yearly cost based on frequency
export function calculateYearlyCost(cost: number, frequency: string): number {
  switch (frequency) {
    case 'daily':
      return cost * 260; // Approx. working days per year
    case 'weekly':
      return cost * 52;
    case 'fortnightly': // Adding support for "fortnightly"
      return cost * 26;
    case 'monthly':
      return cost * 12;
    case 'quarterly':
      return cost * 4;
    case 'annually':
      return cost;
    case 'one_time':
      return cost; // For once-off, just use the full cost
    default:
      return cost;
  }
}

// Format currency for displaying
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Calculate total costs from shifts
export function calculateTotalCosts(shifts: QuoteShift[]): number {
  return shifts.reduce((total, shift) => {
    return total + (shift.estimatedCost || 0);
  }, 0);
}

// Calculate total cost with overhead and margin
export function calculateTotalCostWithOverheadAndMargin(
  laborCost: number, 
  overheadPercentage: number, 
  marginPercentage: number
): {
  overheadCost: number;
  totalCostBeforeMargin: number;
  marginAmount: number;
  totalPrice: number;
} {
  const overheadCost = laborCost * (overheadPercentage / 100);
  const totalCostBeforeMargin = laborCost + overheadCost;
  const marginAmount = totalCostBeforeMargin * (marginPercentage / 100);
  const totalPrice = totalCostBeforeMargin + marginAmount;
  
  return {
    overheadCost,
    totalCostBeforeMargin,
    marginAmount,
    totalPrice
  };
}

// Calculate subcontractor monthly cost
export function calculateSubcontractorMonthlyCost(subcontractors: Subcontractor[]): number {
  return subcontractors.reduce((total, sub) => {
    return total + calculateMonthlyCost(sub.cost, sub.frequency);
  }, 0);
}

// Get timeframe factor for converting between timeframes
export function getTimeframeFactor(fromTimeframe: string, toTimeframe: string): number {
  // Conversion factors to monthly
  const toMonthlyFactors: Record<string, number> = {
    daily: 1/21.67,
    weekly: 1/4.33,
    fortnightly: 1/2.167,
    monthly: 1,
    quarterly: 3,
    annually: 12,
    one_time: 1 // Treating once-off as monthly by default
  };
  
  // Conversion from monthly to target timeframe
  const fromMonthlyFactors: Record<string, number> = {
    daily: 21.67,
    weekly: 4.33,
    fortnightly: 2.167,
    monthly: 1,
    quarterly: 1/3,
    annually: 1/12,
    one_time: 1 // Treating once-off as monthly by default
  };
  
  // Convert to monthly then to target timeframe
  return toMonthlyFactors[fromTimeframe] * fromMonthlyFactors[toTimeframe];
}

// Calculate days per week based on shifts
export function calculateDaysPerWeek(shifts: QuoteShift[]): number {
  // Get unique days
  const uniqueDays = new Set(shifts.map(shift => shift.day));
  return uniqueDays.size;
}

// Detect broken shifts (multiple shifts for the same cleaner on the same day)
export function detectBrokenShifts(shifts: QuoteShift[]): QuoteShift[][] {
  const shiftsByDayAndLevel: Record<string, QuoteShift[]> = {};
  
  shifts.forEach(shift => {
    const key = `${shift.day}-${shift.level}-${shift.employmentType}`;
    if (!shiftsByDayAndLevel[key]) {
      shiftsByDayAndLevel[key] = [];
    }
    shiftsByDayAndLevel[key].push(shift);
  });
  
  return Object.values(shiftsByDayAndLevel).filter(dayShifts => dayShifts.length > 1);
}
