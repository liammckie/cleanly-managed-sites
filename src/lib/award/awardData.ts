
import { AwardData, PayCondition, RateDefinition, EmployeeLevel, EmployeeLevelRates, AwardSettings } from './types';

// Define rate multipliers for different pay conditions
const penalties: Record<PayCondition, RateDefinition> = {
  'base': { percentage: 100, description: 'Base rate' },
  'standard': { percentage: 100, description: 'Standard rate' },
  'weekday': { percentage: 100, description: 'Normal weekday rate' },
  'monday': { percentage: 100, description: 'Monday rate' },
  'tuesday': { percentage: 100, description: 'Tuesday rate' },
  'wednesday': { percentage: 100, description: 'Wednesday rate' },
  'thursday': { percentage: 100, description: 'Thursday rate' },
  'friday': { percentage: 100, description: 'Friday rate' },
  'shift-early-late': { percentage: 115, description: 'Early morning or late evening shift' },
  'saturday': { percentage: 150, description: 'Saturday rate' },
  'sunday': { percentage: 200, description: 'Sunday rate' },
  'public_holiday': { percentage: 250, description: 'Public holiday rate' },
  'early_morning': { percentage: 115, description: 'Early morning 4am-6am rate' },
  'evening': { percentage: 115, description: 'Evening 7pm-12am rate' },
  'night': { percentage: 130, description: 'Night 12am-6am rate' },
  'overnight': { percentage: 130, description: 'Overnight rate' },
  'overtime-first-2-hours': { percentage: 150, description: 'First 2 hours of overtime' },
  'overtime-after-2-hours': { percentage: 200, description: 'After 2 hours of overtime' },
  'overtime-sunday': { percentage: 200, description: 'Sunday overtime' },
  'overtime-public-holiday': { percentage: 250, description: 'Public holiday overtime' }
};

// Base rates for each level
const baseRates: Record<EmployeeLevel, number> = {
  1: 22.46,
  2: 23.41,
  3: 24.35,
  4: 25.56,
  5: 26.76,
  6: 27.51,
  7: 28.47,
  8: 29.57,
  9: 30.03
};

// Generate employee level rates based on base rates and penalties
const generateLevelRates = (baseRate: number): EmployeeLevelRates => {
  const loading: Record<PayCondition, number> = {} as Record<PayCondition, number>;
  
  Object.entries(penalties).forEach(([key, penalty]) => {
    loading[key as PayCondition] = baseRate * (penalty.percentage / 100);
  });
  
  return {
    base: baseRate,
    loading
  };
};

// Generate rates for all levels
const generateRates = (): Record<EmployeeLevel, EmployeeLevelRates> => {
  const rates: Partial<Record<EmployeeLevel, EmployeeLevelRates>> = {};
  
  Object.entries(baseRates).forEach(([level, baseRate]) => {
    rates[Number(level) as EmployeeLevel] = generateLevelRates(baseRate);
  });
  
  return rates as Record<EmployeeLevel, EmployeeLevelRates>;
};

// Load allowances
const allowances = {
  meal: { amount: 15.94, unit: 'per meal break' },
  travel: { amount: 0.92, unit: 'per km' },
  uniform: { amount: 1.73, unit: 'per day' },
  laundry: { amount: 0.45, unit: 'per day' },
  other: { amount: 0, unit: 'custom' }
};

// Export default award settings
export const defaultAwardSettings: AwardSettings = {
  useModernAward: true,
  usePenalties: true,
  includeAllowances: true,
  awardVersion: '2023-07-01',
  customRates: false,
  baseRateMultiplier: 1,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20,
  lastUpdated: '2023-07-01',
  baseRates,
  loadingRates: penalties as any,
  allowances
};

// Export the complete award data
export const awardData: AwardData = {
  settings: defaultAwardSettings,
  rates: generateRates(),
  penalties,
  // Add these properties to fix the build errors
  employeeLevelRates: generateRates(),
  conditionRates: penalties
};

// Export cleaned up award data for components
export const cleaningServicesAward = {
  levels: [
    {
      level: 1,
      employmentType: 'full_time',
      hourlyRate: baseRates[1],
      rates: {
        weekday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        saturday: { 
          rate: baseRates[1] * 1.5, 
          multiplier: 1.5 
        },
        sunday: { 
          rate: baseRates[1] * 2.0, 
          multiplier: 2.0 
        },
        'public_holiday': { 
          rate: baseRates[1] * 2.5, 
          multiplier: 2.5 
        },
        // Add support for other conditions
        standard: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        base: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        monday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        tuesday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        wednesday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        thursday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        },
        friday: { 
          rate: baseRates[1], 
          multiplier: 1.0 
        }
      }
    },
    {
      level: 2,
      employmentType: 'full_time',
      hourlyRate: baseRates[2],
      rates: {
        weekday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        saturday: { 
          rate: baseRates[2] * 1.5, 
          multiplier: 1.5 
        },
        sunday: { 
          rate: baseRates[2] * 2.0, 
          multiplier: 2.0 
        },
        'public_holiday': { 
          rate: baseRates[2] * 2.5, 
          multiplier: 2.5 
        },
        // Add support for other conditions
        standard: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        base: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        monday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        tuesday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        wednesday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        thursday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        },
        friday: { 
          rate: baseRates[2], 
          multiplier: 1.0 
        }
      }
    },
    {
      level: 3,
      employmentType: 'full_time',
      hourlyRate: baseRates[3],
      rates: {
        weekday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        saturday: { 
          rate: baseRates[3] * 1.5, 
          multiplier: 1.5 
        },
        sunday: { 
          rate: baseRates[3] * 2.0, 
          multiplier: 2.0 
        },
        'public_holiday': { 
          rate: baseRates[3] * 2.5, 
          multiplier: 2.5 
        },
        // Add support for other conditions
        standard: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        base: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        monday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        tuesday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        wednesday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        thursday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        },
        friday: { 
          rate: baseRates[3], 
          multiplier: 1.0 
        }
      }
    }
  ]
};
