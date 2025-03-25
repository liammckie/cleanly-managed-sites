
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EmploymentType = 'fulltime' | 'casual';

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';

export interface EmployeeLevelRates {
  base: number;
  loading: {
    [key in PayCondition]: number;
  };
}

export type PayCondition = 
  | 'base' 
  | 'standard' 
  | 'weekday' 
  | 'shift-early-late' 
  | 'saturday' 
  | 'sunday' 
  | 'public_holiday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'early_morning' 
  | 'evening' 
  | 'night' 
  | 'overnight' 
  | 'overtime-first-2-hours' 
  | 'overtime-after-2-hours' 
  | 'overtime-sunday' 
  | 'overtime-public-holiday';

export type AllowanceType = 'meal' | 'travel' | 'uniform' | 'laundry' | 'other';

export interface RateDefinition {
  percentage: number;
  description: string;
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
  lastUpdated: string;
  baseRates: Record<EmployeeLevel, number>;
  loadingRates: Record<PayCondition, number>;
  allowances: Record<AllowanceType, { amount: number; unit: string }>;
}

export interface AwardData {
  settings: AwardSettings;
  rates: Record<EmployeeLevel, EmployeeLevelRates>;
  penalties: Record<PayCondition, RateDefinition>;
}

export interface JobCostBreakdown {
  baseLabor: number;
  penalties: number;
  overtime: number;
  allowances: number;
  totalLabor: number;
  overhead: number;
  margin: number;
  totalCost: number;
  totalCostBeforeMargin?: number; // Added missing property
}

export interface CostCalculationResult {
  totalCost: number;
  breakdown: JobCostBreakdown;
  marginAmount: number;
  marginPercentage: number;
  totalCostBeforeMargin?: number; // Added missing property
}

// Quote types
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day | string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType | string;
  level: EmployeeLevel | number;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

export interface Subcontractor {
  id: string;
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency | string;
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

export interface Quote {
  id: string;
  name: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: QuoteStatus | string;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  client_contact?: string;
  client_email?: string;
  client_phone?: string;
  site_address?: string;
  site_id?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  created_by?: string;
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: string;
  overhead_profile?: string;
  user_id?: string;
  title?: string;
  clientName?: string; // Backward compatibility
  siteName?: string; // Backward compatibility
  clientId?: string; // Backward compatibility
  siteId?: string; // Backward compatibility
  quoteNumber?: string; // Backward compatibility
  validUntil?: string; // Backward compatibility
  clientContact?: string; // Backward compatibility
  clientEmail?: string; // Backward compatibility
  clientPhone?: string; // Backward compatibility
  siteAddress?: string; // Backward compatibility
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}
