
import { AwardData, AwardSettings, EmployeeLevelRates, PayCondition, RateDefinition } from './types';

export const cleaningServicesRates: RateDefinition[] = [
  { id: 'standard', dayType: 'all', multiplier: 1.0, percentage: 0, description: 'Standard Rate' },
  { id: 'saturday', dayType: 'saturday', multiplier: 1.5, percentage: 50, description: 'Saturday Rate' },
  { id: 'sunday', dayType: 'sunday', multiplier: 2.0, percentage: 100, description: 'Sunday Rate' },
  { id: 'publicHoliday', dayType: 'public_holiday', multiplier: 2.5, percentage: 150, description: 'Public Holiday Rate' },
  { id: 'overtime1', dayType: 'all', multiplier: 1.5, percentage: 50, description: 'Overtime (first 2 hours)' },
  { id: 'overtime2', dayType: 'all', multiplier: 2.0, percentage: 100, description: 'Overtime (after 2 hours)' },
  { id: 'earlyMorning', dayType: 'all', multiplier: 1.15, percentage: 15, description: 'Early Morning (before 6:00 AM)' },
  { id: 'evening', dayType: 'all', multiplier: 1.15, percentage: 15, description: 'Evening (after 6:00 PM)' }
];

export const defaultBaseRates = {
  1: 25.41, // Level 1
  2: 26.73, // Level 2
  3: 28.08, // Level 3
  4: 29.61, // Level 4
  5: 30.93, // Level 5
};

export const defaultEmployeeLevelRates: EmployeeLevelRates = {
  level1: 25.41,
  level2: 26.73,
  level3: 28.08,
  level4: 29.61,
  level5: 30.93,
  loading: 25, // Default casual loading percentage
};

export const defaultAllowances = {
  meal: { amount: 15.94, unit: 'per shift' },
  travel: { amount: 0.78, unit: 'per km' },
  uniform: { amount: 1.20, unit: 'per day' },
  laundry: { amount: 0.30, unit: 'per day' },
  other: { amount: 0.00, unit: 'custom' }
};

export const defaultAwardSettings: AwardSettings = {
  allowances: {
    meal: 15.94,
    travel: 0.78,
    uniform: 1.20,
    laundry: 0.30,
    other: 0.00
  },
  usePenalties: true,
  minimumShiftHours: 3,
  casualMinimumHours: 3,
  dailyMaxHours: 12,
  weeklyMaxHours: 38,
  breakThresholdHours: 5,
  baseRateMultiplier: 1.0,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20
};

export const cleaningServicesAward: AwardData = {
  settings: defaultAwardSettings,
  baseRates: defaultBaseRates,
  casualLoading: 25,
  employeeLevelRates: defaultEmployeeLevelRates,
  conditionRates: {
    standard: cleaningServicesRates[0],
    saturday: cleaningServicesRates[1],
    sunday: cleaningServicesRates[2],
    public_holiday: cleaningServicesRates[3],
    overtime: cleaningServicesRates[4],
    earlyMorning: cleaningServicesRates[6],
    evening: cleaningServicesRates[7]
  },
  rates: cleaningServicesRates
};
