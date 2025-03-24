
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

export type AllowanceType = 
  | 'broken-shift' 
  | 'height' 
  | 'cold-places' 
  | 'hot-places' 
  | 'leading-hand' 
  | 'refuse-collection' 
  | 'toilet-cleaning'
  | 'vehicle-mileage'
  | 'uniform'
  | 'first-aid'
  | 'on-call';

export interface Allowance {
  id: string;
  type: AllowanceType;
  name: string;
  amount: number;
  unit: 'per-hour' | 'per-shift' | 'per-day' | 'per-week' | 'per-km';
  description: string;
  maxPerWeek?: number;
  maxPerDay?: number;
  conditions?: string;
}

export interface QuoteShift {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday';
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[]; // IDs of allowances that apply to this shift
  estimatedCost: number;
  location?: string;
  notes?: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  service: string;
  cost: number;
  frequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly';
  notes?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  laborPercentage: number;
  suppliesCostPerHour: number;
  equipmentCostPerHour: number;
  additionalCosts: {
    name: string;
    amount: number;
    type: 'fixed' | 'percentage';
  }[];
}

export interface Quote {
  id: string;
  name: string;
  clientId?: string;
  clientName?: string;
  siteId?: string;
  siteName?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  expiryDate?: string;
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
  overheadProfile: string; // ID of the overhead profile
  overheadPercentage: number;
  marginPercentage: number;
  laborCost: number;
  overheadCost: number;
  subcontractorCost: number;
  totalCost: number;
  marginAmount: number;
  totalPrice: number;
  notes?: string;
  version: number;
  versionHistory?: {
    version: number;
    updatedAt: string;
    updatedBy: string;
    changes: string;
  }[];
}
