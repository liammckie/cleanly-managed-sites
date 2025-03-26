
/**
 * Common type definitions for award calculations 
 */

export interface RateDefinition {
  // Original expected props
  percentage: number;
  description: string;
  
  // Added props to satisfy errors
  id?: string;
  dayType?: string;
  startTime?: string;
  endTime?: string;
  multiplier?: number;
  flatRate?: number;
}

export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  price: number;
  totalCostBeforeMargin: number;
  items: any[];
  
  // Added props to satisfy errors
  laborHours: number;
  breakdownByDay: any;
  byTimeOfDay: any;
  profitMargin: number;
  finalPrice: number;
}

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | number;

export type EmployeeLevelRates = Record<EmployeeLevel, number> & {
  loading?: boolean; // Additional prop to satisfy errors
};

export interface AwardSettings {
  useModernAward: boolean;
  includeAllowances: boolean;
  awardVersion: string;
  customRates: boolean;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  lastUpdated: string;
  baseRates: Record<string, number>;
  loadingRates: Record<string, number>;
  allowances: Record<string, number>;
  
  // Added props to satisfy errors
  usePenalties?: boolean;
}

export interface AwardData {
  settings: AwardSettings;
  conditions: Record<string, RateDefinition>;
  
  // Added props to satisfy errors
  rates?: any;
}
