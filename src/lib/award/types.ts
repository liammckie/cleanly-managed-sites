
// Basic types
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type EmployeeLevel = 1 | 2 | 3;
export type PayCondition = 
  'base' | 
  'standard' | 
  'weekday' | 
  'shift-early-late' | 
  'saturday' | 
  'sunday' | 
  'public-holiday' | 
  'public_holiday' | 
  'early_morning' | 
  'evening' | 
  'night' | 
  'overnight' | 
  'overtime-first-2-hours' | 
  'overtime-after-2-hours' | 
  'overtime-sunday' | 
  'overtime-public-holiday' |
  'monday' | 
  'tuesday' | 
  'wednesday' | 
  'thursday' | 
  'friday';

// Employee level rates
export type EmployeeLevelRates = Record<EmployeeLevel, Record<EmploymentType, number>>;

// General rate structure
export interface AwardRate {
  base: number;
  percentage: number;
  description: string;
}

// Job cost calculation input
export interface JobCostCalculationInput {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
}

// Hourly rate definitions
export interface RateDefinition {
  percentage: number;
  flatRate?: number;
  description: string;
}

// Cost calculation result
export interface CostCalculationResult {
  baseRate: number;
  totalHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  price: number;
  items: Array<{
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }>;
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
  baseRates: Record<string, number>;
  loadingRates: Record<string, number>;
  allowances: Record<string, number>;
}

// Complete quote type
export interface Quote {
  id: string;
  name: string;
  client_name?: string;
  site_name?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  created_by?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile?: string;
  overheadPercentage?: number;
  marginPercentage?: number;
  laborCost?: number;
  overheadCost?: number;
  subcontractorCost?: number;
  suppliesCost?: number;
  equipmentCost?: number;
  totalCost?: number;
  marginAmount?: number;
  totalPrice?: number;
  notes?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}

// QuoteShift interface
export interface QuoteShift {
  id: string;
  quoteId: string;
  day: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: string;
  level: number;
  allowances: string[];
  estimatedCost: number;
  location?: string;
  notes?: string;
}

// Subcontractor interface
export interface Subcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: string;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}
