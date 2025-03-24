
import { QuoteShift, Subcontractor } from './types';

/**
 * Calculate the hour difference between start and end time, accounting for breaks
 */
export const calculateHourDifference = (startTime: string, endTime: string, breakDuration: number): number => {
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is earlier than start time, add 1 day to end time (overnight shift)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Subtract break duration (convert minutes to hours)
  return diffHours - (breakDuration / 60);
};

/**
 * Determine if a shift spans early/late hours (before 6am or after 6pm)
 */
export const hasEarlyLateHours = (startTime: string, endTime: string): boolean => {
  const earlyStartHour = 6; // 6am
  const lateEndHour = 18; // 6pm
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is earlier than start time, add 1 day to end time (overnight shift)
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  const startHour = start.getHours();
  const endHour = end.getHours();
  
  return startHour < earlyStartHour || endHour >= lateEndHour;
};

/**
 * Calculate weekly hours for each employee type to determine overtime
 */
export const calculateOvertimeHours = (shifts: QuoteShift[]): Record<string, number> => {
  // Group shifts by employment type + level (employee profile)
  const employeeShifts: Record<string, number> = {};
  
  shifts.forEach(shift => {
    const employeeKey = `${shift.employmentType}-${shift.level}-${shift.numberOfCleaners}`;
    const shiftHours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
    
    if (!employeeShifts[employeeKey]) {
      employeeShifts[employeeKey] = 0;
    }
    
    employeeShifts[employeeKey] += shiftHours;
  });
  
  // Calculate overtime hours
  const overtimeHours: Record<string, number> = {};
  
  Object.entries(employeeShifts).forEach(([employeeKey, totalHours]) => {
    if (totalHours > 38) {
      overtimeHours[employeeKey] = totalHours - 38;
    }
  });
  
  return overtimeHours;
};

/**
 * Calculate monthly cost for a subcontractor based on frequency
 */
export const calculateSubcontractorMonthlyCost = (subcontractor: Subcontractor): number => {
  switch (subcontractor.frequency) {
    case 'daily':
      return subcontractor.cost * 21.67; // Average work days per month
    case 'weekly':
      return subcontractor.cost * 4.33; // Average weeks per month
    case 'fortnightly':
      return subcontractor.cost * 2.167; // Average fortnights per month
    case 'monthly':
      return subcontractor.cost;
    default:
      return subcontractor.cost;
  }
};

/**
 * Calculate weekly cost for a subcontractor based on frequency
 */
export const calculateSubcontractorWeeklyCost = (subcontractor: Subcontractor): number => {
  switch (subcontractor.frequency) {
    case 'daily':
      return subcontractor.cost * 5; // Average work days per week
    case 'weekly':
      return subcontractor.cost;
    case 'fortnightly':
      return subcontractor.cost / 2;
    case 'monthly':
      return subcontractor.cost / 4.33; // Average weeks per month
    default:
      return subcontractor.cost / 4.33;
  }
};

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
};

/**
 * Get time multiplier based on timeframe
 */
export const getTimeframeFactor = (timeframe: 'weekly' | 'monthly' | 'annual'): number => {
  switch (timeframe) {
    case 'weekly': return 1;
    case 'monthly': return 4.33; // Average weeks per month
    case 'annual': return 52; // Weeks per year
    default: return 1;
  }
};

/**
 * Calculate total cost with overhead and margin
 * @param laborCost Total labor cost
 * @param subcontractorCost Total subcontractor cost
 * @param overheadPercentage Overhead percentage to apply
 * @param marginPercentage Margin percentage to apply
 * @param overheadOnSubcontractors Whether to apply overhead on subcontractor costs
 */
export const calculateTotalCostWithOverheadAndMargin = (
  laborCost: number,
  subcontractorCost: number,
  overheadPercentage: number,
  marginPercentage: number,
  overheadOnSubcontractors: boolean = false
): {
  laborCost: number;
  subcontractorCost: number;
  overheadCost: number;
  costBeforeMargin: number;
  marginAmount: number;
  totalPrice: number;
  profitPercentage: number;
} => {
  // Calculate overhead based on configuration
  const laborOverhead = (laborCost * overheadPercentage) / 100;
  const subcontractorOverhead = overheadOnSubcontractors ? (subcontractorCost * overheadPercentage) / 100 : 0;
  const totalOverhead = laborOverhead + subcontractorOverhead;
  
  // Calculate cost before margin
  const costBeforeMargin = laborCost + subcontractorCost + totalOverhead;
  
  // Calculate margin
  const marginAmount = (costBeforeMargin * marginPercentage) / 100;
  
  // Calculate total price
  const totalPrice = costBeforeMargin + marginAmount;
  
  // Calculate profit percentage (margin as percentage of total price)
  const profitPercentage = totalPrice > 0 ? ((marginAmount) / totalPrice) * 100 : 0;
  
  return {
    laborCost,
    subcontractorCost,
    overheadCost: totalOverhead,
    costBeforeMargin,
    marginAmount,
    totalPrice,
    profitPercentage
  };
};

/**
 * Calculate the total hours worked in a shift by all cleaners
 */
export const calculateTotalShiftHours = (shift: QuoteShift): number => {
  const shiftHours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
  return shiftHours * shift.numberOfCleaners;
};

/**
 * Calculate days per week from shifts
 */
export const calculateDaysPerWeek = (shifts: QuoteShift[]): number => {
  const uniqueDays = new Set(shifts.map(shift => shift.day));
  return uniqueDays.size;
};

/**
 * Get the frequency multiplier for converting between timeframes
 */
export const getFrequencyMultiplier = (
  fromFrequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'annual',
  toFrequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'annual',
  daysPerWeek: number = 5
): number => {
  // Convert everything to daily first
  const toDailyMultipliers: Record<string, number> = {
    'daily': 1,
    'weekly': 1/daysPerWeek,
    'fortnightly': 1/(daysPerWeek * 2),
    'monthly': 1/(daysPerWeek * 4.33),
    'annual': 1/(daysPerWeek * 52),
  };
  
  // Then convert from daily to target frequency
  const fromDailyMultipliers: Record<string, number> = {
    'daily': 1,
    'weekly': daysPerWeek,
    'fortnightly': daysPerWeek * 2,
    'monthly': daysPerWeek * 4.33,
    'annual': daysPerWeek * 52,
  };
  
  return toDailyMultipliers[fromFrequency] * fromDailyMultipliers[toFrequency];
};

/**
 * Detect broken shifts in a schedule
 * Broken shifts occur when the same employee type works multiple separate shifts on the same day
 */
export const detectBrokenShifts = (shifts: QuoteShift[]): string[] => {
  // Group shifts by day and employee type
  const shiftsByDayAndType: Record<string, QuoteShift[]> = {};
  
  shifts.forEach(shift => {
    const key = `${shift.day}-${shift.employmentType}-${shift.level}`;
    if (!shiftsByDayAndType[key]) {
      shiftsByDayAndType[key] = [];
    }
    shiftsByDayAndType[key].push(shift);
  });
  
  // Check for days with multiple shifts (potential broken shifts)
  const brokenShiftDays: string[] = [];
  
  Object.entries(shiftsByDayAndType).forEach(([key, dayShifts]) => {
    if (dayShifts.length > 1) {
      const [day] = key.split('-');
      if (!brokenShiftDays.includes(day)) {
        brokenShiftDays.push(day);
      }
    }
  });
  
  return brokenShiftDays;
};

/**
 * Calculate total labor and cleaning costs
 * @param shifts All shifts in the schedule
 * @param subcontractors All subcontractors
 * @param timeframe The desired timeframe for calculation (weekly, monthly, annual)
 */
export const calculateTotalCosts = (
  shifts: QuoteShift[],
  subcontractors: Subcontractor[],
  timeframe: 'weekly' | 'monthly' | 'annual' = 'monthly'
): {
  laborCost: number;
  subcontractorCost: number;
  totalCost: number;
  totalHours: number;
} => {
  // Calculate total labor cost
  const totalLaborCost = shifts.reduce((total, shift) => total + shift.estimatedCost, 0);
  
  // Calculate total hours
  const totalHours = shifts.reduce((total, shift) => {
    const shiftHours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
    return total + (shiftHours * shift.numberOfCleaners);
  }, 0);
  
  // Calculate total subcontractor cost based on timeframe
  let totalSubcontractorCost = 0;
  
  if (timeframe === 'weekly') {
    totalSubcontractorCost = subcontractors.reduce(
      (total, subcontractor) => total + calculateSubcontractorWeeklyCost(subcontractor),
      0
    );
  } else if (timeframe === 'monthly') {
    totalSubcontractorCost = subcontractors.reduce(
      (total, subcontractor) => total + calculateSubcontractorMonthlyCost(subcontractor),
      0
    );
  } else if (timeframe === 'annual') {
    totalSubcontractorCost = subcontractors.reduce(
      (total, subcontractor) => total + calculateSubcontractorMonthlyCost(subcontractor) * 12,
      0
    );
  }
  
  // Apply timeframe multiplier to labor costs
  const timeframeFactor = getTimeframeFactor(timeframe);
  const adjustedLaborCost = totalLaborCost * timeframeFactor;
  
  return {
    laborCost: adjustedLaborCost,
    subcontractorCost: totalSubcontractorCost,
    totalCost: adjustedLaborCost + totalSubcontractorCost,
    totalHours: totalHours * timeframeFactor
  };
};
