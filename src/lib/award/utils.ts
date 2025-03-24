
import { EmployeeLevelRates, EmploymentType, EmployeeLevel, PayCondition, QuoteShift, Day } from './types';
import { cleaningServicesAward } from './awardData';

// Calculate the total costs for a job including labor and margins
export const calculateTotalCosts = (
  employmentType: EmploymentType,
  level: EmployeeLevel,
  hours: Record<PayCondition, number>,
  overheadPercentage: number,
  marginPercentage: number
) => {
  const laborCost = calculateLaborCost(employmentType, level, hours);
  const overheadCost = (laborCost * overheadPercentage) / 100;
  const totalCost = laborCost + overheadCost;
  const marginAmount = (totalCost * marginPercentage) / 100;
  
  return {
    laborCost,
    overheadCost,
    totalCost,
    marginAmount,
    totalPrice: totalCost + marginAmount
  };
};

// Calculate labor cost based on employment type, level, and hours
export const calculateLaborCost = (
  employmentType: EmploymentType,
  level: EmployeeLevel,
  hours: Record<PayCondition, number>
): number => {
  // Find the applicable rate for the given employment type and level
  const employeeRate = cleaningServicesAward.levels.find(
    (rate) => rate.employmentType === employmentType && rate.level === level
  );

  if (!employeeRate) {
    console.error('No rate found for the given employment type and level');
    return 0;
  }

  // Calculate the cost for each pay condition
  let totalCost = 0;

  Object.entries(hours).forEach(([condition, hoursWorked]) => {
    const payCondition = condition as PayCondition;
    const rate = employeeRate.rates[payCondition]?.rate || 0;
    totalCost += rate * hoursWorked;
  });

  return totalCost;
};

// Helper function to check if a time falls within early/late hours
export const hasEarlyLateHours = (startTime: string, endTime: string): boolean => {
  const startHour = parseInt(startTime.split(':')[0], 10);
  const endHour = parseInt(endTime.split(':')[0], 10);
  
  // Early hours: before 6:00 AM
  // Late hours: after 6:00 PM
  return startHour < 6 || endHour >= 18;
};

// Helper function to calculate the difference between two time strings in hours
export const calculateHourDifference = (startTime: string, endTime: string, breakMinutes: number = 0): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  
  // Handle overnight shifts
  let minutesWorked = endMinutes >= startMinutes
    ? endMinutes - startMinutes
    : (24 * 60) - startMinutes + endMinutes;
  
  // Subtract break time
  minutesWorked -= breakMinutes;
  
  return minutesWorked / 60;
};

// Helper function to detect overtime hours
export const detectOvertimeHours = (shifts: QuoteShift[], day: Day): number => {
  // Group shifts by day
  const dayShifts = shifts.filter(shift => shift.day === day);
  
  // Calculate total hours worked on this day
  const totalHours = dayShifts.reduce((sum, shift) => {
    const hours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
    return sum + hours;
  }, 0);
  
  // Return overtime hours (hours over 8)
  return Math.max(0, totalHours - 8);
};
