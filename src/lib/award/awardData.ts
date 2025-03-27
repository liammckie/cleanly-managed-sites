
import { AwardData, AwardSettings, EmployeeLevel, EmployeeLevelRates, PayCondition, RateDefinition } from './types';

// Define condition rates with the updated RateDefinition interface
const conditionRates: Record<PayCondition, RateDefinition> = {
  'base': { id: 'base', percentage: 100, description: 'Base Rate' },
  'standard': { id: 'standard', percentage: 100, description: 'Standard Rate' },
  'weekday': { id: 'weekday', percentage: 100, description: 'Weekday Rate' },
  'monday': { id: 'monday', percentage: 100, description: 'Monday Rate' },
  'tuesday': { id: 'tuesday', percentage: 100, description: 'Tuesday Rate' },
  'wednesday': { id: 'wednesday', percentage: 100, description: 'Wednesday Rate' },
  'thursday': { id: 'thursday', percentage: 100, description: 'Thursday Rate' },
  'friday': { id: 'friday', percentage: 100, description: 'Friday Rate' },
  'shift-early-late': { id: 'shift-early-late', percentage: 110, description: 'Early/Late Shift' },
  'saturday': { id: 'saturday', percentage: 125, description: 'Saturday Rate' },
  'sunday': { id: 'sunday', percentage: 150, description: 'Sunday Rate' },
  'public_holiday': { id: 'public_holiday', percentage: 200, description: 'Public Holiday Rate' },
  'early_morning': { id: 'early_morning', percentage: 115, description: 'Early Morning Rate' },
  'evening': { id: 'evening', percentage: 115, description: 'Evening Rate' },
  'night': { id: 'night', percentage: 130, description: 'Night Rate' },
  'overnight': { id: 'overnight', percentage: 130, description: 'Overnight Rate' },
  'overtime-first-2-hours': { id: 'overtime-first-2-hours', percentage: 150, description: 'Overtime (First 2 Hours)' },
  'overtime-after-2-hours': { id: 'overtime-after-2-hours', percentage: 200, description: 'Overtime (After 2 Hours)' },
  'overtime-sunday': { id: 'overtime-sunday', percentage: 200, description: 'Overtime (Sunday)' },
  'overtime-public-holiday': { id: 'overtime-public-holiday', percentage: 250, description: 'Overtime (Public Holiday)' }
};

// Define level rates - only include valid EmployeeLevel values (1-5)
const levelRates: Record<EmployeeLevel, number> = {
  1: 22.04,
  2: 23.28,
  3: 24.54,
  4: 25.80,
  5: 27.15
};

// Define employee level rates with the EmployeeLevelRates interface
const employeeLevelRates: Record<EmployeeLevel, EmployeeLevelRates> = {
  1: {
    base: 22.04,
    fullTime: 22.04,
    partTime: 22.04,
    casual: 27.55
  },
  2: {
    base: 23.28,
    fullTime: 23.28,
    partTime: 23.28,
    casual: 29.10
  },
  3: {
    base: 24.54,
    fullTime: 24.54,
    partTime: 24.54,
    casual: 30.68
  },
  4: {
    base: 25.80,
    fullTime: 25.80,
    partTime: 25.80,
    casual: 32.25
  },
  5: {
    base: 27.15,
    fullTime: 27.15,
    partTime: 27.15,
    casual: 33.94
  }
};

// Award settings with additional properties
const settings: AwardSettings = {
  minimumShiftHours: 3,
  casualMinimumHours: 2,
  dailyMaxHours: 10,
  weeklyMaxHours: 38,
  breakThresholdHours: 5,
  allowances: {
    meal: 12.97,
    travel: 0.90,
    laundry: 1.23,
    uniform: 3.55,
    firstAid: 9.30
  },
  usePenalties: true,
  baseRateMultiplier: 1.0,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20
};

// Penalties with the proper RateDefinition interface
const penalties: RateDefinition[] = [
  { id: 'p1', percentage: 125, description: 'Saturday', dayType: 'saturday' },
  { id: 'p2', percentage: 150, description: 'Sunday', dayType: 'sunday' },
  { id: 'p3', percentage: 250, description: 'Public Holiday', dayType: 'public_holiday' }
];

// Final award data export
export const awardData: AwardData = {
  levels: levelRates,
  penalties: penalties,
  employeeLevelRates: employeeLevelRates,
  conditionRates: conditionRates,
  settings: settings
};

// Export a convenience function to get current award data
export function getAwardData(): AwardData {
  return awardData;
}
