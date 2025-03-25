
// Basic types
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'daily' | 'per_event';

export type PayCondition = 
  | 'standard' 
  | 'overtime-weekday' 
  | 'overtime-saturday' 
  | 'overtime-sunday'
  | 'overtime-public-holiday'
  | 'overtime-first-2-hours'
  | 'overtime-after-2-hours'
  | 'saturday' 
  | 'sunday' 
  | 'public-holiday' 
  | 'evening' 
  | 'night'
  | 'weekday'
  | 'early_morning'
  | 'overnight'
  | 'shift-early-late'
  | 'base'; // Adding base as it's used in the code

export type EmploymentType = 'full_time' | 'part_time' | 'casual' | 'contractor';
export type EmployeeLevel = 1 | 2 | 3;
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday';

// Rate definition interfaces
export interface RateDefinition {
  rate: number;
  multiplier: number;
}

export interface EmployeeLevelRates {
  level: EmployeeLevel | string;
  employmentType: EmploymentType;
  baseRate: number;
  hourlyRate: number;
  rates: Record<PayCondition, RateDefinition>;
}

export interface AwardSettings {
  baseRates: Record<string, number>;
  loadingRates: Record<PayCondition, number>;
  allowances: Record<string, number>;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  useModernAward?: boolean;
  usePenalties?: boolean;
  includeAllowances?: boolean;
  awardVersion?: string;
  customRates?: boolean;
  lastUpdated?: string;
}

export interface AwardData {
  name: string;
  code: string;
  effectiveDate: string;
  levels: EmployeeLevelRates[];
}

// Job costing related types
export interface JobCostingParams {
  employmentType: EmploymentType | string;
  level: EmployeeLevel | string;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
}

export interface JobCostBreakdownItem {
  condition: PayCondition;
  hours: number;
  rate: number;
  cost: number;
}

export interface JobCostBreakdown {
  baseRate: number;
  hourlyRate: number;
  totalCost: number;
  laborCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  margin: number;
  totalPrice: number;
  hourlyBreakdown: JobCostBreakdownItem[];
}

// Quote related types
export interface QuoteShift {
  id: string;
  quoteId: string;
  day?: Day;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: EmploymentType;
  level?: EmployeeLevel;
  allowances?: string[];
  estimatedCost?: number;
  location?: string;
  notes?: string;
}

export interface Subcontractor {
  id: string;
  quoteId?: string;
  name?: string;
  description?: string;
  cost?: number;
  frequency?: Frequency;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
}

export interface Quote {
  id: string;
  title: string;
  name: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'expired';
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  siteId?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  notes?: string;
  created_by?: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadProfile?: string;
  userId?: string;
}

export type AllowanceType = 'travel' | 'uniform' | 'meal' | 'vehicle' | 'tool' | 'specialty' | 'other';
