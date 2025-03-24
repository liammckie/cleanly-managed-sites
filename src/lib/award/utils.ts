
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
