
import { QuoteShift, EmploymentType, EmployeeLevel, Day, PayCondition } from './types';
import { cleaningServicesAward } from './awardData';

export const getPayConditionForDay = (day: Day): PayCondition => {
  switch (day) {
    case 'saturday':
      return 'saturday';
    case 'sunday':
      return 'sunday';
    case 'public_holiday':
      return 'public_holiday';
    case 'monday':
      return 'monday';
    case 'tuesday':
      return 'tuesday';
    case 'wednesday':
      return 'wednesday';
    case 'thursday':
      return 'thursday';
    case 'friday':
      return 'friday';
    default:
      return 'weekday';
  }
};

export const getShiftDurationHours = (startTime: string, endTime: string, breakDuration: number): number => {
  // Convert the time strings to Date objects for comparison
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  
  // If end time is before start time, assume it's the next day
  if (end < start) {
    end.setDate(end.getDate() + 1);
  }
  
  // Calculate the difference in milliseconds
  const diff = end.getTime() - start.getTime();
  
  // Convert to hours and subtract break
  const hours = diff / (1000 * 60 * 60);
  const workHours = hours - (breakDuration / 60);
  
  return workHours;
};

export const calculateShiftCost = (
  shift: QuoteShift,
  allowanceRates: Record<string, number>
): number => {
  // Get the employee level rates
  const employeeRates = cleaningServicesAward.levels.find(
    level => level.level === shift.level && level.employmentType === shift.employmentType
  );
  
  if (!employeeRates) {
    console.error('Employee rates not found for level', shift.level, 'and type', shift.employmentType);
    return 0;
  }
  
  // Get the base hourly rate for the specific level and employment type
  const hourlyRate = employeeRates.hourlyRate;
  
  // Calculate the duration of the shift in hours (excluding breaks)
  const workHours = getShiftDurationHours(shift.startTime, shift.endTime, shift.breakDuration);
  
  // Determine the rate multiplier based on the day of the week
  let condition = getPayConditionForDay(shift.day as Day);
  let rateMultiplier = 1.0;
  
  // Use the correct key for public_holiday
  if (condition === 'weekday') {
    rateMultiplier = employeeRates.rates.weekday.multiplier;
  } else if (condition === 'saturday') {
    rateMultiplier = employeeRates.rates.saturday.multiplier;
  } else if (condition === 'sunday') {
    rateMultiplier = employeeRates.rates.sunday.multiplier;
  } else if (condition === 'public_holiday') {
    rateMultiplier = employeeRates.rates['public_holiday'].multiplier;
  } else if (employeeRates.rates[condition]) {
    // Handle other days explicitly
    rateMultiplier = employeeRates.rates[condition].multiplier;
  }
  
  // Calculate the base labor cost
  let laborCost = hourlyRate * workHours * rateMultiplier * shift.numberOfCleaners;
  
  // Add allowances if applicable
  let allowanceCost = 0;
  if (shift.allowances && shift.allowances.length > 0) {
    for (const allowance of shift.allowances) {
      if (allowanceRates[allowance]) {
        allowanceCost += allowanceRates[allowance] * workHours * shift.numberOfCleaners;
      }
    }
  }
  
  return laborCost + allowanceCost;
};
