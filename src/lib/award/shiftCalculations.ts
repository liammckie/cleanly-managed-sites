
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
    default:
      return 'weekday';
  }
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
  const startTime = new Date(`2000-01-01T${shift.startTime}`);
  const endTime = new Date(`2000-01-01T${shift.endTime}`);
  
  if (endTime < startTime) {
    // If the shift crosses midnight, add 24 hours to the end time
    endTime.setDate(endTime.getDate() + 1);
  }
  
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  const workHours = durationHours - (shift.breakDuration / 60);
  
  // Determine the rate multiplier based on the day of the week
  let condition = getPayConditionForDay(shift.day as Day);
  let rateMultiplier = 1.0;
  
  if (condition === 'weekday') {
    rateMultiplier = employeeRates.rates.weekday.multiplier;
  } else if (condition === 'saturday') {
    rateMultiplier = employeeRates.rates.saturday.multiplier;
  } else if (condition === 'sunday') {
    rateMultiplier = employeeRates.rates.sunday.multiplier;
  } else if (condition === 'public_holiday') {
    rateMultiplier = employeeRates.rates['public-holiday'].multiplier;
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
