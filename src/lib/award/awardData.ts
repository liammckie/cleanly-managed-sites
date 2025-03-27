
import { 
  AwardData, 
  AwardSettings, 
  EmployeeLevel, 
  EmployeeLevelRates, 
  PayCondition, 
  RateDefinition 
} from './types';

// Define the proper award data structure
export const awardData: AwardData = {
  name: "Cleaning Services Award",
  description: "Award rates for cleaning services industry",
  conditionRates: {
    'base': {
      id: 'base',
      percentage: 100,
      description: 'Base rate',
      dayType: 'weekday',
      startTime: '07:00',
      endTime: '19:00',
      multiplier: 1.0
    },
    'overtime_1_5': {
      id: 'overtime_1_5',
      percentage: 150,
      description: 'Overtime (first 2 hours)',
      multiplier: 1.5
    },
    'overtime_2': {
      id: 'overtime_2',
      percentage: 200,
      description: 'Overtime (after 2 hours)',
      multiplier: 2.0
    },
    'saturday': {
      id: 'saturday',
      percentage: 150,
      description: 'Saturday rate',
      dayType: 'saturday',
      multiplier: 1.5
    },
    'sunday': {
      id: 'sunday',
      percentage: 200,
      description: 'Sunday rate',
      dayType: 'sunday',
      multiplier: 2.0
    },
    'public_holiday': {
      id: 'public_holiday',
      percentage: 250,
      description: 'Public holiday rate',
      dayType: 'public_holiday',
      multiplier: 2.5
    },
    'early_morning': {
      id: 'early_morning',
      percentage: 115,
      description: 'Early morning (before 6am)',
      startTime: '00:00',
      endTime: '06:00',
      multiplier: 1.15
    },
    'evening': {
      id: 'evening',
      percentage: 115,
      description: 'Evening (after 6pm)',
      startTime: '18:00',
      endTime: '24:00',
      multiplier: 1.15
    },
    'night': {
      id: 'night',
      percentage: 130,
      description: 'Night shift',
      startTime: '00:00',
      endTime: '6:00',
      multiplier: 1.3
    },
    'shift_allowance': {
      id: 'shift_allowance',
      percentage: 115,
      description: 'Shift allowance',
      multiplier: 1.15
    },
    'meal_allowance': {
      id: 'meal_allowance',
      percentage: 0,
      description: 'Meal allowance',
      multiplier: 0
    }
  },

  // Fix employee level rates
  employeeLevelRates: {
    '1': { base: 21.75, title: 'Property Services Employee Level 1' },
    '2': { base: 22.55, title: 'Property Services Employee Level 2' },
    '3': { base: 23.69, title: 'Property Services Employee Level 3' },
    '4': { base: 24.77, title: 'Property Services Employee Level 4' },
    '5': { base: 25.88, title: 'Property Services Employee Level 5' },
    'contractor': { base: 0, title: 'Contractor' }
  },

  // Award settings
  settings: {
    minimumShiftHours: 3,
    casualMinimumHours: 2,
    dailyMaxHours: 12,
    weeklyMaxHours: 38,
    breakThresholdHours: 5,
    usePenalties: true,
    allowances: {
      meal: 15.94,
      travel: 0.78,
      uniform: 1.23,
      laundry: 0.70,
      other: 0
    }
  },
  
  // List of levels for dropdowns
  levels: ['1', '2', '3', '4', '5', 'contractor']
};

// Default award settings export for the app
export const defaultAwardSettings: AwardSettings = {
  minimumShiftHours: 3,
  casualMinimumHours: 2,
  dailyMaxHours: 12,
  weeklyMaxHours: 38,
  breakThresholdHours: 5,
  usePenalties: true,
  allowances: {
    meal: 15.94,
    travel: 0.78,
    uniform: 1.23,
    laundry: 0.70,
    other: 0
  },
  baseRateMultiplier: 1.0,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20
};

// Export the cleaning services award
export const cleaningServicesAward = awardData;
