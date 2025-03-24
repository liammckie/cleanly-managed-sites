
import { getAwardRates } from './awardEngine';
import { 
  QuoteShift, 
  EmploymentType, 
  EmployeeLevel, 
  AllowanceType 
} from './types';
import { 
  calculateHourDifference, 
  hasEarlyLateHours 
} from './utils';

export const calculateShiftCost = (shift: Partial<QuoteShift>): number => {
  if (!shift.startTime || !shift.endTime || !shift.employmentType || !shift.level || !shift.day) {
    return 0;
  }
  
  const hours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration || 0);
  if (hours <= 0) return 0;
  
  // Get base rates for the employment type and level
  const rateInfo = getAwardRates(
    shift.employmentType as EmploymentType, 
    shift.level as EmployeeLevel
  );
  
  if (!rateInfo) {
    return 0;
  }
  
  let hourlyRate: number;
  let condition: string;
  
  // Determine the applicable rate based on day and time
  if (shift.day === 'saturday') {
    condition = 'saturday';
    hourlyRate = rateInfo.rates.saturday.rate;
  } else if (shift.day === 'sunday') {
    condition = 'sunday';
    hourlyRate = rateInfo.rates.sunday.rate;
  } else if (shift.day === 'public-holiday') {
    condition = 'public-holiday';
    hourlyRate = rateInfo.rates['public-holiday'].rate;
  } else if (hasEarlyLateHours(shift.startTime, shift.endTime)) {
    condition = 'shift-early-late';
    hourlyRate = rateInfo.rates['shift-early-late'].rate;
  } else {
    condition = 'base';
    hourlyRate = rateInfo.rates.base.rate;
  }
  
  // Calculate base labor cost
  let laborCost = hourlyRate * hours;
  
  // Multiply by number of cleaners
  const totalCost = laborCost * (shift.numberOfCleaners || 1);
  
  // Note: Allowance costs will be added separately once we have the allowance data
  
  return parseFloat(totalCost.toFixed(2));
};

export const calculateShiftCostWithAllowances = (
  shift: QuoteShift, 
  allowances: Array<{
    id: string;
    type: AllowanceType;
    amount: number;
    unit: 'per-hour' | 'per-shift' | 'per-day' | 'per-week' | 'per-km';
    description?: string;
  }>
): number => {
  // Start with the base cost calculation
  const baseCost = calculateShiftCost(shift);
  
  // Calculate hours for hourly allowances
  const hours = calculateHourDifference(shift.startTime, shift.endTime, shift.breakDuration);
  
  // Add allowance costs
  let allowanceCost = 0;
  if (shift.allowances && allowances) {
    shift.allowances.forEach(allowanceId => {
      const allowance = allowances.find(a => a.id === allowanceId);
      if (allowance) {
        if (allowance.unit === 'per-hour') {
          allowanceCost += allowance.amount * hours;
        } else if (allowance.unit === 'per-shift') {
          allowanceCost += allowance.amount;
        } else if (allowance.unit === 'per-day') {
          allowanceCost += allowance.amount;
        }
      }
    });
  }
  
  // Multiply allowances by number of cleaners if applicable
  // Some allowances are per-person, others might be per-shift regardless of staff count
  const allowancesByCleaners = allowanceCost * shift.numberOfCleaners;
  
  return parseFloat((baseCost + allowancesByCleaners).toFixed(2));
};

export const checkForBrokenShifts = (shifts: QuoteShift[]): string[] => {
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
