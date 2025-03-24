
import { AwardData, AwardSettings, EmployeeLevelRate, PayCondition } from './types';

// Cleaning Services Award [MA000022] rates effective July 1, 2024
export const cleaningServicesAward: AwardData = {
  name: "Cleaning Services Award",
  code: "MA000022",
  effectiveDate: "2024-07-01",
  levels: [
    // Full-time Level 1
    {
      level: 1,
      employmentType: 'full_time',
      baseRate: 24.97,
      hourlyRate: 24.97,
      rates: {
        'base': { rate: 24.97, multiplier: 1.00 },
        'standard': { rate: 24.97, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 28.72, multiplier: 1.15 },
        'saturday': { rate: 32.46, multiplier: 1.30 },
        'sunday': { rate: 37.46, multiplier: 1.50 },
        'public_holiday': { rate: 62.43, multiplier: 2.50 },
        'overtime-first-2-hours': { rate: 37.46, multiplier: 1.50 },
        'overtime-after-2-hours': { rate: 49.94, multiplier: 2.00 },
        'overtime-sunday': { rate: 49.94, multiplier: 2.00 },
        'overtime-public-holiday': { rate: 62.43, multiplier: 2.50 },
        'weekday': { rate: 24.97, multiplier: 1.00 },
        'early_morning': { rate: 28.72, multiplier: 1.15 },
        'evening': { rate: 28.72, multiplier: 1.15 },
        'night': { rate: 28.72, multiplier: 1.15 }, // Added night
        'overnight': { rate: 28.72, multiplier: 1.15 }
      }
    },
    // Full-time Level 2
    {
      level: 2,
      employmentType: 'full_time',
      baseRate: 25.80,
      hourlyRate: 25.80,
      rates: {
        'base': { rate: 25.80, multiplier: 1.00 },
        'standard': { rate: 25.80, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 29.67, multiplier: 1.15 },
        'saturday': { rate: 33.54, multiplier: 1.30 },
        'sunday': { rate: 38.70, multiplier: 1.50 },
        'public_holiday': { rate: 64.50, multiplier: 2.50 },
        'overtime-first-2-hours': { rate: 38.70, multiplier: 1.50 },
        'overtime-after-2-hours': { rate: 51.60, multiplier: 2.00 },
        'overtime-sunday': { rate: 51.60, multiplier: 2.00 },
        'overtime-public-holiday': { rate: 64.50, multiplier: 2.50 },
        'weekday': { rate: 25.80, multiplier: 1.00 },
        'early_morning': { rate: 29.67, multiplier: 1.15 },
        'evening': { rate: 29.67, multiplier: 1.15 },
        'night': { rate: 29.67, multiplier: 1.15 }, // Added night
        'overnight': { rate: 29.67, multiplier: 1.15 }
      }
    },
    // ... similar updates for other levels
    // Full-time Level 3
    {
      level: 3,
      employmentType: 'full_time',
      baseRate: 27.17,
      hourlyRate: 27.17,
      rates: {
        'base': { rate: 27.17, multiplier: 1.00 },
        'standard': { rate: 27.17, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 31.25, multiplier: 1.15 },
        'saturday': { rate: 35.32, multiplier: 1.30 },
        'sunday': { rate: 40.76, multiplier: 1.50 },
        'public_holiday': { rate: 67.93, multiplier: 2.50 },
        'overtime-first-2-hours': { rate: 40.76, multiplier: 1.50 },
        'overtime-after-2-hours': { rate: 54.34, multiplier: 2.00 },
        'overtime-sunday': { rate: 54.34, multiplier: 2.00 },
        'overtime-public-holiday': { rate: 67.93, multiplier: 2.50 },
        'weekday': { rate: 27.17, multiplier: 1.00 },
        'early_morning': { rate: 31.25, multiplier: 1.15 },
        'evening': { rate: 31.25, multiplier: 1.15 },
        'night': { rate: 31.25, multiplier: 1.15 }, // Added night
        'overnight': { rate: 31.25, multiplier: 1.15 }
      }
    },
    // Part-time Level 1
    {
      level: 1,
      employmentType: 'part_time',
      baseRate: 28.72,
      hourlyRate: 28.72,
      rates: {
        'base': { rate: 28.72, multiplier: 1.00 },
        'standard': { rate: 28.72, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 32.46, multiplier: 1.13 },
        'saturday': { rate: 41.20, multiplier: 1.43 },
        'sunday': { rate: 53.69, multiplier: 1.87 },
        'public_holiday': { rate: 66.17, multiplier: 2.30 },
        'overtime-first-2-hours': { rate: 37.46, multiplier: 1.30 },
        'overtime-after-2-hours': { rate: 49.94, multiplier: 1.74 },
        'overtime-sunday': { rate: 49.94, multiplier: 1.74 },
        'overtime-public-holiday': { rate: 62.43, multiplier: 2.17 },
        'weekday': { rate: 28.72, multiplier: 1.00 },
        'early_morning': { rate: 32.46, multiplier: 1.13 },
        'evening': { rate: 32.46, multiplier: 1.13 },
        'night': { rate: 32.46, multiplier: 1.13 }, // Added night
        'overnight': { rate: 32.46, multiplier: 1.13 }
      }
    },
    // Part-time Level 2
    {
      level: 2,
      employmentType: 'part_time',
      baseRate: 29.67,
      hourlyRate: 29.67,
      rates: {
        'base': { rate: 29.67, multiplier: 1.00 },
        'standard': { rate: 29.67, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 33.54, multiplier: 1.13 },
        'saturday': { rate: 42.57, multiplier: 1.43 },
        'sunday': { rate: 55.47, multiplier: 1.87 },
        'public_holiday': { rate: 68.37, multiplier: 2.30 },
        'overtime-first-2-hours': { rate: 38.70, multiplier: 1.30 },
        'overtime-after-2-hours': { rate: 51.60, multiplier: 1.74 },
        'overtime-sunday': { rate: 51.60, multiplier: 1.74 },
        'overtime-public-holiday': { rate: 64.50, multiplier: 2.17 },
        'weekday': { rate: 29.67, multiplier: 1.00 },
        'early_morning': { rate: 33.54, multiplier: 1.13 },
        'evening': { rate: 33.54, multiplier: 1.13 },
        'night': { rate: 33.54, multiplier: 1.13 }, // Added night
        'overnight': { rate: 33.54, multiplier: 1.13 }
      }
    },
    // Part-time Level 3
    {
      level: 3,
      employmentType: 'part_time',
      baseRate: 31.25,
      hourlyRate: 31.25,
      rates: {
        'base': { rate: 31.25, multiplier: 1.00 },
        'standard': { rate: 31.25, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 35.32, multiplier: 1.13 },
        'saturday': { rate: 44.83, multiplier: 1.43 },
        'sunday': { rate: 58.42, multiplier: 1.87 },
        'public_holiday': { rate: 72.00, multiplier: 2.30 },
        'overtime-first-2-hours': { rate: 40.76, multiplier: 1.30 },
        'overtime-after-2-hours': { rate: 54.34, multiplier: 1.74 },
        'overtime-sunday': { rate: 54.34, multiplier: 1.74 },
        'overtime-public-holiday': { rate: 67.93, multiplier: 2.17 },
        'weekday': { rate: 31.25, multiplier: 1.00 },
        'early_morning': { rate: 35.32, multiplier: 1.13 },
        'evening': { rate: 35.32, multiplier: 1.13 },
        'night': { rate: 35.32, multiplier: 1.13 }, // Added night
        'overnight': { rate: 35.32, multiplier: 1.13 }
      }
    },
    // Casual Level 1
    {
      level: 1,
      employmentType: 'casual',
      baseRate: 31.21,
      hourlyRate: 31.21,
      rates: {
        'base': { rate: 31.21, multiplier: 1.00 },
        'standard': { rate: 31.21, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 34.96, multiplier: 1.12 },
        'saturday': { rate: 38.70, multiplier: 1.24 },
        'sunday': { rate: 43.70, multiplier: 1.40 },
        'public_holiday': { rate: 68.67, multiplier: 2.20 },
        'overtime-first-2-hours': { rate: 43.70, multiplier: 1.40 },
        'overtime-after-2-hours': { rate: 56.18, multiplier: 1.80 },
        'overtime-sunday': { rate: 56.18, multiplier: 1.80 },
        'overtime-public-holiday': { rate: 68.67, multiplier: 2.20 },
        'weekday': { rate: 31.21, multiplier: 1.00 },
        'early_morning': { rate: 34.96, multiplier: 1.12 },
        'evening': { rate: 34.96, multiplier: 1.12 },
        'night': { rate: 34.96, multiplier: 1.12 }, // Added night
        'overnight': { rate: 34.96, multiplier: 1.12 }
      }
    },
    // Casual Level 2
    {
      level: 2,
      employmentType: 'casual',
      baseRate: 32.25,
      hourlyRate: 32.25,
      rates: {
        'base': { rate: 32.25, multiplier: 1.00 },
        'standard': { rate: 32.25, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 36.12, multiplier: 1.12 },
        'saturday': { rate: 39.99, multiplier: 1.24 },
        'sunday': { rate: 45.15, multiplier: 1.40 },
        'public_holiday': { rate: 70.95, multiplier: 2.20 },
        'overtime-first-2-hours': { rate: 45.15, multiplier: 1.40 },
        'overtime-after-2-hours': { rate: 58.05, multiplier: 1.80 },
        'overtime-sunday': { rate: 58.05, multiplier: 1.80 },
        'overtime-public-holiday': { rate: 70.95, multiplier: 2.20 },
        'weekday': { rate: 32.25, multiplier: 1.00 },
        'early_morning': { rate: 36.12, multiplier: 1.12 },
        'evening': { rate: 36.12, multiplier: 1.12 },
        'night': { rate: 36.12, multiplier: 1.12 }, // Added night
        'overnight': { rate: 36.12, multiplier: 1.12 }
      }
    },
    // Casual Level 3
    {
      level: 3,
      employmentType: 'casual',
      baseRate: 33.96,
      hourlyRate: 33.96,
      rates: {
        'base': { rate: 33.96, multiplier: 1.00 },
        'standard': { rate: 33.96, multiplier: 1.00 }, // Added standard
        'shift-early-late': { rate: 38.04, multiplier: 1.12 },
        'saturday': { rate: 42.11, multiplier: 1.24 },
        'sunday': { rate: 47.55, multiplier: 1.40 },
        'public_holiday': { rate: 74.72, multiplier: 2.20 },
        'overtime-first-2-hours': { rate: 47.55, multiplier: 1.40 },
        'overtime-after-2-hours': { rate: 61.13, multiplier: 1.80 },
        'overtime-sunday': { rate: 61.13, multiplier: 1.80 },
        'overtime-public-holiday': { rate: 74.72, multiplier: 2.20 },
        'weekday': { rate: 33.96, multiplier: 1.00 },
        'early_morning': { rate: 38.04, multiplier: 1.12 },
        'evening': { rate: 38.04, multiplier: 1.12 },
        'night': { rate: 38.04, multiplier: 1.12 }, // Added night
        'overnight': { rate: 38.04, multiplier: 1.12 }
      }
    }
  ]
};

// Default award settings
export const defaultAwardSettings: AwardSettings = {
  useModernAward: true,
  usePenalties: true,
  includeAllowances: true,
  awardVersion: "2024-07-01",
  customRates: false,
  baseRateMultiplier: 1.0, // No adjustment by default
  overheadPercentageDefault: 25, // 25% overhead by default
  marginPercentageDefault: 15, // 15% margin by default
  lastUpdated: "2024-07-01" // lastUpdated is now valid
};
