
import { Json } from '../types';

export type CleaningLevel = 1 | 2 | 3;
export type EmploymentType = 'casual' | 'part_time' | 'full_time';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type PublicHoliday = string; // ISO date string
export type AllowanceType = 'leading_hand' | 'first_aid' | 'broken_shift' | 'meal_allowance' | 'laundry' | 'travel' | 'toilet_cleaning' | 'other';
export type FrequencyType = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';

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
  rates: AwardRate[];
  penalties: Penalty[];
  overtime: AwardOvertime[];
  allowances: Allowance[];
  public_holidays: PublicHoliday[];
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
  startDate?: string;
  endDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'months' | 'years';
  expiryDate?: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';
  overheadPercentage: number;
  marginPercentage: number;
  laborCost: number;
  overheadAmount: number;
  marginAmount: number;
  totalPrice: number;
  totalHours: number;
  notes?: string;
  userId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
