
/**
 * Award Engine Types
 */

// Define employee level types
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type PayCondition = 
  | 'base' 
  | 'saturday' 
  | 'sunday' 
  | 'publicHoliday' 
  | 'earlyMorning' 
  | 'evening' 
  | 'overnight'
  | 'overtime1'
  | 'overtime2'
  | 'overtime3';

// Input for job cost calculation
export interface JobCostCalculationInput {
  level: EmployeeLevel;
  hours: number;
  employmentType: 'casual' | 'permanent';
  conditions?: Partial<Record<PayCondition, number>>;
  baseRate?: number;
  overheadPercentage?: number;
  marginPercentage?: number;
}

// Result of cost calculation
export interface CostCalculationResult {
  baseRate: number;
  laborHours: number;
  totalHours: number;
  laborCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  profitMargin: number;
  margin: number;
  price: number;
  finalPrice: number;
  items: any[];
  breakdownByDay: Record<string, any>;
  byTimeOfDay: Record<string, any>;
}

// Award settings data structure
export interface AwardSettings {
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  lastUpdated?: string;
}

// Cleaning award structure
export interface CleaningServicesAward {
  name: string;
  levels: Array<{
    id: EmployeeLevel;
    name: string;
    baseRate: number;
  }>;
  employeeLevelRates?: Record<string, number>;
  baseLevelRates?: Record<string, number>;
  conditionRates?: Record<PayCondition, number>;
  penalties: {
    casual: number;
    saturday: number;
    sunday: number;
    publicHoliday: number;
    evening: number;
  };
  casualLoading?: number;
  defaultSettings: {
    overheadPercentageDefault: number;
    marginPercentageDefault: number;
  };
}
