// Award rate related types
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type EmployeeLevel = 1 | 2 | 3;
export type PayCondition = 
  | 'base'
  | 'standard'  // Added standard
  | 'weekday'
  | 'saturday'
  | 'sunday'
  | 'public_holiday'
  | 'early_morning'
  | 'evening'
  | 'night'     // Added night
  | 'overnight'
  | 'shift-early-late'
  | 'overtime-first-2-hours'
  | 'overtime-after-2-hours'
  | 'overtime-sunday'
  | 'overtime-public-holiday';

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'per_event';

export interface RateDetails {
  rate: number;
  multiplier: number;
}

export interface EmployeeLevelRate {
  level: EmployeeLevel;
  employmentType: EmploymentType;
  baseRate: number;
  hourlyRate: number;
  rates: Record<PayCondition, RateDetails>;
}

export interface AwardData {
  name: string;
  code: string;
  effectiveDate: string;
  levels: EmployeeLevelRate[];
}

export interface AwardSettings {
  useModernAward: boolean;
  usePenalties: boolean;
  includeAllowances: boolean;
  awardVersion: string;
  customRates: boolean;
  baseRateMultiplier: number;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
  lastUpdated?: string;  // Make lastUpdated optional
}

// Quoting related types
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
  notes: string;
}

export interface Subcontractor {
  id: string;
  name: string;
  quoteId?: string;
  description?: string;
  cost?: number;
  frequency?: Frequency;
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;  // Add service property for compatibility
  notes?: string;    // Add notes property
  rate?: number;     // Add rate property
}

export interface Quote {
  id: string;
  title: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  overheadPercentage: number;
  marginPercentage: number;
  totalPrice: number;
  laborCost: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  siteId?: string;
  
  // Additional fields
  name?: string;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadProfile?: string;
  
  // Cost calculation fields
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  
  // Collections
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
  
  // Other fields
  suppliesCost?: number;
  equipmentCost?: number;
  userId?: string;  // Add userId property
}
