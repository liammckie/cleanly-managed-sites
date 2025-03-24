
import { QuoteShift, Day } from './types';

// Calculate the total cost across all shifts
export function calculateTotalCosts(shifts: QuoteShift[]): number {
  return shifts.reduce((total, shift) => {
    // For each shift, add its estimatedCost multiplied by the number of cleaners
    return total + (shift.estimatedCost * shift.numberOfCleaners);
  }, 0);
}

// Function to detect overtime hours across shifts
export function detectOvertimeHours(shifts: QuoteShift[]): Record<string, number> {
  // Group shifts by employment type
  const shiftsByType: Record<string, QuoteShift[]> = {};
  
  shifts.forEach(shift => {
    if (!shiftsByType[shift.employmentType]) {
      shiftsByType[shift.employmentType] = [];
    }
    shiftsByType[shift.employmentType].push(shift);
  });
  
  const overtimeHours: Record<string, number> = {
    fullTime: 0,
    partTime: 0,
    casual: 0,
    total: 0
  };
  
  // Calculate full-time overtime (over 38 hours/week)
  if (shiftsByType.full_time) {
    const totalHours = calculateTotalHoursForShifts(shiftsByType.full_time);
    if (totalHours > 38) {
      overtimeHours.fullTime = totalHours - 38;
      overtimeHours.total += overtimeHours.fullTime;
    }
  }
  
  // Calculate part-time overtime (over contracted hours, assuming 30 hours/week as standard)
  if (shiftsByType.part_time) {
    const totalHours = calculateTotalHoursForShifts(shiftsByType.part_time);
    if (totalHours > 30) {
      overtimeHours.partTime = totalHours - 30;
      overtimeHours.total += overtimeHours.partTime;
    }
  }
  
  // Calculate casual overtime (over 12 hours in a day or 38 hours/week)
  if (shiftsByType.casual) {
    const totalHours = calculateTotalHoursForShifts(shiftsByType.casual);
    if (totalHours > 38) {
      overtimeHours.casual = totalHours - 38;
      overtimeHours.total += overtimeHours.casual;
    }
    
    // Also check for daily overtime
    const hoursByDay = groupShiftsByDay(shiftsByType.casual);
    Object.values(hoursByDay).forEach(hoursInDay => {
      if (hoursInDay > 12) {
        const dailyOvertime = hoursInDay - 12;
        overtimeHours.casual += dailyOvertime;
        overtimeHours.total += dailyOvertime;
      }
    });
  }
  
  return overtimeHours;
}

// Helper function to calculate total hours for a set of shifts
function calculateTotalHoursForShifts(shifts: QuoteShift[]): number {
  return shifts.reduce((total, shift) => {
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const startMinute = parseInt(shift.startTime.split(':')[1]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    const endMinute = parseInt(shift.endTime.split(':')[1]);
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Calculate duration in minutes, accounting for break time
    const durationInMinutes = endTimeInMinutes - startTimeInMinutes - shift.breakDuration;
    
    // Convert to hours
    const hours = durationInMinutes / 60;
    
    // Multiply by the number of cleaners
    return total + (hours * shift.numberOfCleaners);
  }, 0);
}

// Helper function to group shifts by day
function groupShiftsByDay(shifts: QuoteShift[]): Record<string, number> {
  const hoursByDay: Record<string, number> = {};
  
  shifts.forEach(shift => {
    if (!hoursByDay[shift.day]) {
      hoursByDay[shift.day] = 0;
    }
    
    const startHour = parseInt(shift.startTime.split(':')[0]);
    const startMinute = parseInt(shift.startTime.split(':')[1]);
    const endHour = parseInt(shift.endTime.split(':')[0]);
    const endMinute = parseInt(shift.endTime.split(':')[1]);
    
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    
    // Calculate duration in hours, accounting for break time
    const durationInHours = (endTimeInMinutes - startTimeInMinutes - shift.breakDuration) / 60;
    
    hoursByDay[shift.day] += durationInHours * shift.numberOfCleaners;
  });
  
  return hoursByDay;
}

// Function to detect broken shifts
export function detectBrokenShifts(shifts: QuoteShift[]): QuoteShift[][] {
  // Group shifts by day
  const shiftsByDay: Record<string, QuoteShift[]> = {};
  
  shifts.forEach(shift => {
    if (!shiftsByDay[shift.day]) {
      shiftsByDay[shift.day] = [];
    }
    shiftsByDay[shift.day].push(shift);
  });
  
  // Find days with multiple shifts
  const brokenShiftDays: QuoteShift[][] = [];
  
  Object.values(shiftsByDay).forEach(dayShifts => {
    if (dayShifts.length > 1) {
      brokenShiftDays.push(dayShifts);
    }
  });
  
  return brokenShiftDays;
}
