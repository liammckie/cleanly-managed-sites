
import { PayCondition, AwardData, RateDefinition, AwardSettings } from './types';
import { v4 as uuidv4 } from 'uuid';

// Define the cleaning services award data
export const cleaningServicesAward: AwardData = {
  baseLevelRates: {
    1: 22.46,
    2: 23.37,
    3: 24.55,
    4: 25.74,
    5: 27.20,
    6: 29.50  // Supervisor level (optional)
  },
  casualLoading: 0.25, // 25% casual loading
  levels: [1, 2, 3, 4, 5],
  rates: [
    { id: uuidv4(), percentage: 1.0, description: "Base rate" },
    { id: uuidv4(), percentage: 1.5, description: "Saturday rate" },
    { id: uuidv4(), percentage: 2.0, description: "Sunday rate" },
    { id: uuidv4(), percentage: 2.5, description: "Public holiday rate" },
    { id: uuidv4(), percentage: 1.15, description: "Early morning (midnight to 6am)" },
    { id: uuidv4(), percentage: 1.15, description: "Evening (6pm to midnight)" },
    { id: uuidv4(), percentage: 1.30, description: "Overnight (midnight to 6am)" },
    { id: uuidv4(), percentage: 1.5, description: "Overtime (first 2 hours)" },
    { id: uuidv4(), percentage: 2.0, description: "Overtime (after 2 hours)" },
    { id: uuidv4(), percentage: 2.5, description: "Overtime (public holiday)" }
  ],
  penaltyRates: {
    base: { id: uuidv4(), percentage: 1.0, description: "Base rate" },
    saturday: { id: uuidv4(), percentage: 1.5, description: "Saturday rate" },
    sunday: { id: uuidv4(), percentage: 2.0, description: "Sunday rate" },
    publicHoliday: { id: uuidv4(), percentage: 2.5, description: "Public holiday rate" },
    earlyMorning: { id: uuidv4(), percentage: 1.15, description: "Early morning (midnight to 6am)" },
    evening: { id: uuidv4(), percentage: 1.15, description: "Evening (6pm to midnight)" },
    overnight: { id: uuidv4(), percentage: 1.30, description: "Overnight (midnight to 6am)" },
    overtime1: { id: uuidv4(), percentage: 1.5, description: "Overtime (first 2 hours)" },
    overtime2: { id: uuidv4(), percentage: 2.0, description: "Overtime (after 2 hours)" },
    overtime3: { id: uuidv4(), percentage: 2.5, description: "Overtime (public holiday)" }
  },
  employeeLevelRates: {
    1: 22.46,
    2: 23.37,
    3: 24.55,
    4: 25.74,
    5: 27.20
  },
  // Define penalty rates for each condition
  conditionRates: {
    base: 1.0,
    saturday: 1.5,
    sunday: 2.0,
    publicHoliday: 2.5,
    earlyMorning: 1.15,
    evening: 1.15,
    overnight: 1.3,
    overtime1: 1.5,
    overtime2: 2.0,
    overtime3: 2.5
  },
  
  // Define allowances 
  allowances: {
    meal: { amount: 13.87, unit: "each" },
    travel: { amount: 0.78, unit: "per km" },
    uniform: { amount: 7.50, unit: "per week" },
    laundry: { amount: 1.55, unit: "per day" },
    other: { amount: 0, unit: "each" }
  },
  
  // Default settings for the award
  defaultSettings: {
    usePenalties: true,
    minimumShiftHours: 4,
    casualMinimumHours: 3,
    dailyMaxHours: 12,
    weeklyMaxHours: 38,
    breakThresholdHours: 5,
    allowances: {
      meal: 13.87,
      travel: 0.78,
      uniform: 7.50,
      laundry: 1.55
    },
    baseRateMultiplier: 1.0,
    overheadPercentageDefault: 15,
    marginPercentageDefault: 20
  }
};

export const defaultAwardSettings: AwardSettings = {
  usePenalties: true,
  minimumShiftHours: 4,
  casualMinimumHours: 3,
  dailyMaxHours: 12,
  weeklyMaxHours: 38,
  breakThresholdHours: 5,
  allowances: {
    meal: 13.87,
    travel: 0.78,
    uniform: 7.50,
    laundry: 1.55
  },
  baseRateMultiplier: 1.0,
  overheadPercentageDefault: 15,
  marginPercentageDefault: 20
};
