
export type EmploymentType = 'full-time' | 'part-time' | 'casual';

export type EmployeeLevel = 1 | 2 | 3;

export type PayCondition = 
  | 'base' 
  | 'shift-early-late' 
  | 'saturday' 
  | 'sunday' 
  | 'public-holiday'
  | 'overtime-first-2-hours' 
  | 'overtime-after-2-hours' 
  | 'overtime-sunday'
  | 'overtime-public-holiday';

export interface AwardRate {
  rate: number;
  multiplier: number;
}

export interface AwardRates {
  [key: string]: AwardRate;
}

export interface EmployeeLevelRates {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  rates: {
    [key in PayCondition]: AwardRate;
  };
  baseRate: number;
}

export interface AwardData {
  name: string;
  code: string;
  effectiveDate: string;
  levels: EmployeeLevelRates[];
}

export interface JobCostingParams {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: {
    [key in PayCondition]?: number;
  };
  overheadPercentage: number;
  marginPercentage: number;
}

export interface JobCostBreakdown {
  laborCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  margin: number;
  totalPrice: number;
  hourlyBreakdown: {
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }[];
}

export interface AwardSettings {
  baseRateMultiplier: number;
  lastUpdated: string;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
}
