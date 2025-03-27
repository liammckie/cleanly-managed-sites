
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';

export type PayCondition = 
  | 'base'
  | 'standard'
  | 'weekday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'shift-early-late'
  | 'saturday'
  | 'sunday'
  | 'public_holiday'
  | 'early_morning'
  | 'evening'
  | 'night'
  | 'overnight'
  | 'overtime-first-2-hours'
  | 'overtime-after-2-hours'
  | 'overtime-sunday'
  | 'overtime-public-holiday';

export interface RateDefinition {
  id: string;
  percentage: number;
  description: string;
  dayType?: string;
  startTime?: string;
  endTime?: string;
  multiplier?: number;
}

export interface EmployeeLevelRates {
  base: number;
  fullTime: number;
  partTime: number;
  casual: number;
}

export interface AwardSettings {
  minimumShiftHours: number;
  casualMinimumHours: number;
  dailyMaxHours: number;
  weeklyMaxHours: number;
  breakThresholdHours: number;
  allowances: Record<string, number>;
  usePenalties?: boolean;
  baseRateMultiplier?: number;
  overheadPercentageDefault?: number;
  marginPercentageDefault?: number;
  lastUpdated?: string;
}

export interface AwardData {
  levels: Record<EmployeeLevel, number>;
  penalties: RateDefinition[];
  employeeLevelRates?: Record<EmployeeLevel, EmployeeLevelRates>;
  conditionRates?: Record<PayCondition, RateDefinition>;
  settings: AwardSettings;
  rates?: any;
}

export interface JobCostCalculationInput {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
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
  
  // Required properties
  laborHours: number;
  breakdownByDay: any;
  byTimeOfDay: any;
  profitMargin: number;
  finalPrice: number;
}

// Export Subcontractor interface for award/utils.ts
export interface Subcontractor {
  id?: string;
  business_name: string;
  contact_name: string;
  email?: string;
  phone?: string;
  is_flat_rate?: boolean;
  monthly_cost?: number;
  services?: string[];
  customServices?: string;
  contractor_id?: string;
  name?: string;
}
