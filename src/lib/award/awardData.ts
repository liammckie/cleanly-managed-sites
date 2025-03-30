
import { CleaningServicesAward, EmployeeLevel, PayCondition } from './types';

// Define award data with proper typing
export const awardData = {
  levels: [1, 2, 3, 4, 5] as EmployeeLevel[],
  employeeLevelRates: {
    1: 22.5,
    2: 23.7,
    3: 24.8,
    4: 26.0,
    5: 27.5
  },
  conditionRates: {
    base: 1.0,
    saturday: 1.5,
    sunday: 1.75,
    publicHoliday: 2.5,
    earlyMorning: 1.15,
    evening: 1.15,
    overnight: 1.3,
    overtime1: 1.5,
    overtime2: 2.0,
    overtime3: 2.5
  } as Record<PayCondition, number>
};

// Export the award settings
export const defaultAwardSettings = {
  baseRateMultiplier: 1.0,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20,
  casualLoading: 0.25,
  saturdayLoading: 0.5,
  sundayLoading: 0.75,
  eveningLoading: 0.15,
  publicHolidayLoading: 1.5
};

// Export the cleaning services award
export const cleaningServicesAward: CleaningServicesAward = {
  name: "Cleaning Services Award",
  levels: [
    { id: 1, name: "Level 1", baseRate: 22.5 },
    { id: 2, name: "Level 2", baseRate: 23.7 },
    { id: 3, name: "Level 3", baseRate: 24.8 },
    { id: 4, name: "Level 4", baseRate: 26.0 },
    { id: 5, name: "Level 5", baseRate: 27.5 }
  ],
  employeeLevelRates: {
    '1': 22.5,
    '2': 23.7,
    '3': 24.8,
    '4': 26.0,
    '5': 27.5,
    'contractor': 35.0
  },
  conditionRates: {
    base: 1.0,
    saturday: 1.5,
    sunday: 1.75,
    publicHoliday: 2.5,
    earlyMorning: 1.15,
    evening: 1.15,
    overnight: 1.3,
    overtime1: 1.5,
    overtime2: 2.0,
    overtime3: 2.5
  },
  penalties: {
    casual: 0.25,
    saturday: 0.5,
    sunday: 0.75,
    publicHoliday: 1.5,
    evening: 0.15
  },
  casualLoading: 0.25,
  defaultSettings: {
    overheadPercentageDefault: 15,
    marginPercentageDefault: 20
  }
};
