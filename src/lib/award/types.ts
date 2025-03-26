
// This file contains the types used by the award module

export type Day = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday" 
  | "public_holiday"
  | "weekday"; 

export type EmploymentType = "casual" | "part_time" | "full_time";

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // Extended to support all levels

export type Frequency = 
  | "daily" 
  | "weekly" 
  | "fortnightly" 
  | "monthly" 
  | "quarterly" 
  | "yearly" 
  | "once";

export type QuoteStatus = 
  | "draft" 
  | "sent" 
  | "approved" 
  | "rejected" 
  | "expired"
  | "pending"
  | "accepted";

// New type for PayCondition
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

// Rate definition for different pay conditions
export interface RateDefinition {
  percentage: number;
  description: string;
}

// Defines the rates for a specific employee level
export interface EmployeeLevelRates {
  base: number;
  loading: Record<PayCondition, number>;
}

// Award settings interface
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
  allowances: Record<string, { amount: number; unit: string }>;
}

// Complete award data structure
export interface AwardData {
  settings: AwardSettings;
  rates: Record<EmployeeLevel, EmployeeLevelRates>;
  penalties: Record<PayCondition, RateDefinition>;
  employeeLevelRates: Record<EmployeeLevel, EmployeeLevelRates>;
  conditionRates: Record<PayCondition, RateDefinition>;
}

// Job cost calculation input
export interface JobCostCalculationInput {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Partial<Record<PayCondition, number>>;
  overheadPercentage: number;
  marginPercentage: number;
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
  totalCostBeforeMargin: number;
  items: {
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }[];
}

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
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  custom_services?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  contact_name?: string;
}

export interface QuoteSubcontractor extends Subcontractor {
  quoteId: string;
}

export interface Quote {
  id: string;
  name: string;
  title?: string;
  clientName: string;
  client_name: string;
  siteName?: string;
  site_name?: string;
  description?: string;
  status: QuoteStatus;
  overheadPercentage: number;
  overhead_percentage: number;
  marginPercentage: number;
  margin_percentage: number;
  totalPrice: number;
  total_price: number;
  laborCost: number;
  labor_cost: number;
  supplies_cost?: number;
  suppliesCost?: number;
  equipment_cost?: number;
  equipmentCost?: number;
  subcontractorCost: number;
  subcontractor_cost: number;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  notes: string;
  quoteNumber?: string;
  quote_number?: string;
  validUntil?: string;
  valid_until?: string;
  clientId?: string;
  client_id?: string;
  siteId?: string;
  site_id?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  overheadCost?: number;
  overhead_cost?: number;
  totalCost?: number;
  total_cost?: number;
  marginAmount?: number;
  margin_amount?: number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  contractLength?: number;
  contract_length?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile?: string;
  userId?: string;
  createdBy?: string;
  created_by?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  clientContact?: string;
  client_contact?: string;
  clientEmail?: string;
  client_email?: string;
  clientPhone?: string;
  client_phone?: string;
  siteAddress?: string;
  site_address?: string;
}
