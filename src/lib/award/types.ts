
// Employee levels
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Employment types
export type EmploymentType = 'full_time' | 'part_time' | 'casual';

// Days of the week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday' | 'public_holiday';

// Pay conditions
export type PayCondition = 
  'base' | 
  'standard' | 
  'weekday' | 
  'monday' | 
  'tuesday' | 
  'wednesday' | 
  'thursday' | 
  'friday' | 
  'saturday' | 
  'sunday' | 
  'public_holiday' | 
  'shift-early-late' | 
  'early_morning' | 
  'evening' | 
  'night' | 
  'overnight' | 
  'overtime-first-2-hours' | 
  'overtime-after-2-hours' | 
  'overtime-sunday' | 
  'overtime-public-holiday';

// Rate definition
export interface RateDefinition {
  percentage: number;
  description: string;
}

// Level rates
export interface EmployeeLevelRates {
  base: number;
  loading: Record<PayCondition, number>;
}

// Award settings
export interface AwardSettings {
  useModernAward: boolean;
  usePenalties: boolean;
  includeAllowances: boolean;
  awardVersion: string;
  customRates: boolean;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  lastUpdated: string;
  baseRates: Record<EmployeeLevel, number>;
  loadingRates: Record<PayCondition, RateDefinition>;
  allowances: {
    meal: { amount: number; unit: string };
    travel: { amount: number; unit: string };
    uniform: { amount: number; unit: string };
    laundry: { amount: number; unit: string };
    other: { amount: number; unit: string };
  };
}

// Award data
export interface AwardData {
  settings: AwardSettings;
  rates: Record<EmployeeLevel, EmployeeLevelRates>;
  penalties: Record<PayCondition, RateDefinition>;
  employeeLevelRates: Record<EmployeeLevel, EmployeeLevelRates>;
  conditionRates: Record<PayCondition, RateDefinition>;
}

// For job cost calculation
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
  items: Array<{
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }>;
}

// Quote types
export interface Quote {
  id: string;
  name: string;
  clientName: string;
  siteName: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  startDate: string;
  endDate: string;
  expiryDate: string;
  contractLength: number;
  contractLengthUnit: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile: string;
  overheadPercentage: number;
  marginPercentage: number;
  laborCost: number;
  overheadCost: number;
  subcontractorCost: number;
  totalCost: number;
  marginAmount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes: string;
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
}

export type Frequency = 'one_time' | 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day | string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType | string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface Subcontractor {
  id: string;
  quoteId: string;
  name: string;
  description: string;
  cost: number;
  frequency: Frequency | string;
  services: string[];
  email?: string;
  phone?: string;
  notes?: string;
  service?: string;
  customServices?: string;
  rate?: number;
  monthlyCost?: number;
  isFlatRate?: boolean;
}
