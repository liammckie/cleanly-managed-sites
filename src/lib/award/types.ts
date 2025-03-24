
import { Json } from '../types';

export type CleaningLevel = 1 | 2 | 3;
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public_holiday';
export type PublicHoliday = string; // ISO date string
export type AllowanceType = 'leading_hand' | 'first_aid' | 'broken_shift' | 'meal_allowance' | 'laundry' | 'travel' | 'toilet_cleaning' | 'other';
export type FrequencyType = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

// Additional types needed by components
export type EmployeeLevel = CleaningLevel;
export type PayCondition = 'standard' | 'saturday' | 'sunday' | 'public_holiday' | 'early_morning' | 'evening' | 'night' | 'base' | 'shift-early-late' | 'overtime-first-2-hours' | 'overtime-after-2-hours' | 'overtime-sunday' | 'overtime-public-holiday';
export type ShiftDay = Day;

export interface RateInfo {
  rate: number;
  multiplier: number;
}

export interface EmployeeLevelRates {
  level: CleaningLevel;
  employmentType: EmploymentType;
  baseRate: number;
  hourlyRate: number;
  saturdayRate?: number;
  sundayRate?: number;
  publicHolidayRate?: number;
  rates: Record<PayCondition, RateInfo>;
}

export interface AwardSettings {
  useModernAward: boolean;
  usePenalties: boolean;
  includeAllowances: boolean;
  awardVersion: string;
  customRates: boolean;
  baseRateMultiplier: number;
  lastUpdated?: string;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
}

export interface JobCostingParams {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  dayType: PayCondition;
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
  penaltyMultiplier?: number;
  allowanceCosts?: Record<string, number>;
  laborCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  margin: number;
  totalPrice: number;
  hourlyBreakdown: JobCostBreakdownItem[];
}

export interface AwardRate {
  level: CleaningLevel;
  employment_type: EmploymentType;
  rate_type: string;
  rate: number;
}

export interface AwardOvertime {
  employment_type: EmploymentType;
  first_two_hours: number; // Percentage
  after_two_hours: number; // Percentage
  sunday: number; // Percentage
  public_holiday: number; // Percentage
}

export interface Penalty {
  employment_type: EmploymentType;
  saturday: number; // Percentage
  sunday: number; // Percentage
  public_holiday: number; // Percentage
  early_morning: number; // Percentage
  evening: number; // Percentage
  night: number; // Percentage
}

export interface Allowance {
  id: string;
  name: string;
  type: AllowanceType;
  amount: number;
  unit: 'per_hour' | 'per_shift' | 'per_day' | 'per_week' | 'flat';
  description?: string;
}

export interface AwardData {
  name?: string;
  code?: string;
  effectiveDate?: string;
  levels: EmployeeLevelRates[];
  rates?: AwardRate[];
  penalties?: Penalty[];
  overtime?: AwardOvertime[];
  allowances?: Allowance[];
  public_holidays?: PublicHoliday[];
}

export interface ShiftTime {
  hours: number;
  minutes: number;
}

export interface QuoteShift {
  id: string;
  quoteId: string;
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  level: CleaningLevel;
  employmentType: EmploymentType;
  numberOfCleaners: number;
  location?: string;
  allowances: string[];
  estimatedCost: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcontractor {
  id: string;
  quoteId: string;
  name: string;
  service?: string;
  description?: string;
  frequency: FrequencyType;
  cost: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OverheadProfile {
  id: string;
  name: string;
  percentage: number;
  laborPercentage?: number;
  description?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarginProfile {
  id: string;
  name: string;
  percentage: number;
  description?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Quote {
  id: string;
  name: string;
  clientId?: string;
  clientName?: string;
  siteAddress?: string;
  siteName?: string;
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'months' | 'years';
  expiryDate?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'accepted';
  overheadPercentage: number;
  marginPercentage: number;
  overheadProfile?: string;
  laborCost: number;
  overheadAmount: number;
  overheadCost?: number;
  marginAmount: number;
  totalPrice: number;
  totalCost?: number;
  subcontractorCost?: number;
  totalHours: number;
  notes?: string;
  userId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  shifts?: QuoteShift[];
  subcontractors?: Subcontractor[];
}
