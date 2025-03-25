
// Employment types
export type EmploymentType = 'full_time' | 'part_time' | 'casual';

// Employee levels
export type EmployeeLevel = 1 | 2 | 3;

// Days of the week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday';

// Pay conditions
export type PayCondition = 
  | 'base'
  | 'standard'
  | 'weekday'
  | 'shift-early-late'
  | 'saturday'
  | 'sunday'
  | 'public-holiday'  // Note the hyphen instead of underscore
  | 'early_morning'
  | 'evening'
  | 'night'
  | 'overnight'
  | 'overtime-first-2-hours'
  | 'overtime-after-2-hours'
  | 'overtime-sunday'
  | 'overtime-public-holiday';

// Frequency for payments
export type Frequency = 
  | 'weekly' 
  | 'fortnightly' 
  | 'monthly' 
  | 'quarterly' 
  | 'annually' 
  | 'daily'
  | 'per_event'
  | 'one_time';

// Allowance types
export type AllowanceType = 'laundry' | 'meal' | 'travel' | 'vehicle' | 'uniform' | 'first_aid' | 'leading_hand' | 'other';

// Quote status
export type QuoteStatus = 'draft' | 'expired' | 'submitted' | 'approved' | 'rejected' | 'sent' | 'accepted';

// Rate definition
export interface RateDefinition {
  rate: number;
  multiplier: number;
}

// Employee level rates
export interface EmployeeLevelRates {
  level: number;
  employmentType: EmploymentType;
  baseRate: number;
  hourlyRate: number;
  rates: Record<PayCondition, RateDefinition>;
}

// Award data structure
export interface AwardData {
  name: string;
  code: string;
  version: string;
  lastUpdated: string;
  levels: EmployeeLevelRates[];
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
  loadingRates: Record<PayCondition, number>;
  allowances: Record<string, number>;
}

// Job costing parameters
export interface JobCostingParams {
  employmentType: EmploymentType;
  level: EmployeeLevel; 
  hours: number;
  overheadPercentage: number;
  marginPercentage: number;
}

// Job cost breakdown item
export interface JobCostBreakdownItem {
  hours: number;
  condition: PayCondition;
  rate: number;
  cost: number;
}

// Job cost breakdown
export interface JobCostBreakdown {
  baseRate: number;
  hourlyRate: number;
  totalHours: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  margin: number;
  price: number;
  items: JobCostBreakdownItem[];
}

// Quote shift
export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes?: string;
}

// Subcontractor
export interface Subcontractor {
  id: string;
  quoteId?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  notes?: string;
  rate?: number;
}

// Quote
export interface Quote {
  id: string;
  title: string;
  name: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: QuoteStatus;
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  suppliesCost: number;
  equipmentCost: number;
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
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}
