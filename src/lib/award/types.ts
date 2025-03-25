
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type PayCondition = 
  | 'standard' 
  | 'overtime-weekday' 
  | 'overtime-saturday' 
  | 'overtime-sunday'
  | 'overtime-public-holiday'
  | 'saturday' 
  | 'sunday' 
  | 'public-holiday' 
  | 'evening' 
  | 'night';

export interface EmployeeLevelRates {
  level: string;
  hourlyRate: number;
  baseRate: number;
  rates: Record<PayCondition, number>;
}

export interface AwardSettings {
  baseRates: Record<string, number>;
  loadingRates: Record<PayCondition, number>;
  allowances: Record<string, number>;
}

export interface AwardData {
  levels: Record<string, EmployeeLevelRates>;
  allowances: Record<string, number>;
  settings: AwardSettings;
}

export interface JobCostingParams {
  employmentType: string;
  level: string;
  hours: number;
  day: string;
  startTime: string;
  endTime: string;
  allowances?: string[];
}

export interface JobCostBreakdownItem {
  hours: number;
  rate: number;
  total: number;
  condition: PayCondition;
}

export interface JobCostBreakdown {
  items: JobCostBreakdownItem[];
  total: number;
  totalHours: number;
  hourlyAverage: number;
  baseRate: number;
  margin: number;
}
