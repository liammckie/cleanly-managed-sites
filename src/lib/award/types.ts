
import { Json } from "../types";

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';
export type PayCondition = 'weekday' | 'saturday' | 'sunday' | 'public_holiday' | 'evening' | 'early_morning' | 'overnight' | 'base' | 'shift-early-late' | 'overtime-first-2-hours' | 'overtime-after-2-hours' | 'overtime-sunday' | 'overtime-public-holiday' | 'standard';
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type EmployeeLevel = 1 | 2 | 3;
export type AllowanceType = 'laundry' | 'vehicle' | 'meal' | 'travel' | 'first_aid' | 'leading_hand' | 'broken_shift';
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one_time' | 'per_event';

export interface RateDetails {
  rate: number;
  multiplier: number;
  description?: string;
}

export interface EmployeeLevelRates {
  level: EmployeeLevel;
  employmentType: EmploymentType;
  baseRate: number;
  hourlyRate: number;
  rates: Record<PayCondition, RateDetails>;
  // Legacy fields for compatibility
  saturdayRate?: number;
  sundayRate?: number;
  publicHolidayRate?: number;
}

export interface AllowanceRate {
  id: string;
  name: string;
  description: string;
  amount: number;
  type: AllowanceType;
  frequency: Frequency;
  note?: string;
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
  lastUpdated?: string;
}

export interface AwardData {
  name: string;
  version: string;
  effectiveDate: string;
  levels: EmployeeLevelRates[];
}

export interface CleaningServiceAward {
  name: string;
  version: string;
  effectiveDate: string;
  levels: EmployeeLevelRates[];
  allowances: AllowanceRate[];
}

export interface JobCostingParams {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  dayType?: PayCondition;
  allowances?: string[];
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
  email?: string;
  phone?: string;
  services?: string[];
  service?: string;
  frequency?: Frequency;
  notes?: string;
  description?: string;
  cost: number;
  quoteId?: string;
  rate?: number;
}

export interface Quote {
  id: string;
  title: string;
  name?: string;
  clientName: string;
  siteName?: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
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
  
  // Additional fields used in components
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  overheadProfile?: string;
}
