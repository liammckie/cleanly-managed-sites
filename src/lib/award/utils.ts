
import { QuoteShift } from './types';

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
    return total + calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
  }, 0);
}

// Calculate overtime hours from a set of shifts
export function calculateOvertimeHours(shifts: QuoteShift[]): Record<string, number> {
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
    if (key.startsWith('full-time')) {
      const overtime = Math.max(0, totalHours - 38);
      overtimeHours.fullTime += overtime;
      overtimeHours.total += overtime;
    }
    
    // For part-time employees, overtime depends on contracted hours
    // For this example, assume part-time is 20 hours per week
    else if (key.startsWith('part-time')) {
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
    case 'yearly':
      return cost / 12;
    case 'once-off':
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
    case 'yearly':
      return cost;
    case 'once-off':
      return cost; // For once-off, just use the full cost
    default:
      return cost;
  }
}
