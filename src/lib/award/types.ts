
// Add this file if it doesn't exist yet
import { createClient } from '@supabase/supabase-js';

// Define a replacement for Json type that was imported from supabase
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Quote = {
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
  notes: string;
  laborCost: number;
  overheadCost: number;
  subcontractorCost: number;
  totalCost: number;
  marginAmount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  userId: string;
  shifts: QuoteShift[];
  subcontractors: Subcontractor[];
};

export type QuoteShift = {
  id: string;
  quoteId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'public-holiday';
  startTime: string;
  endTime: string;
  breakDuration: number;
  level: number;
  employmentType: EmploymentType;
  numberOfCleaners: number;
  location: string;
  allowances: any[];
  estimatedCost: number;
  notes: string;
};

export type Subcontractor = {
  id: string;
  quoteId: string;
  name: string;
  service: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once-off';
  cost: number;
  notes?: string; // Add notes as an optional property
};

export type OverheadProfile = {
  id: string;
  name: string;
  description: string;
  laborPercentage: number;
};

export type Allowance = {
  id: string;
  name: string;
  unit: string;
  amount: number;
  description?: string;
};

// Add the missing types that are referenced in other files
export type AllowanceType = 'travel' | 'meal' | 'uniform' | 'tool' | 'vehicle' | 'other';

export type EmploymentType = 'full-time' | 'part-time' | 'casual';
export type EmployeeLevel = 1 | 2 | 3;
export type PayCondition = 'base' | 'shift-early-late' | 'saturday' | 'sunday' | 'public-holiday' 
  | 'overtime-first-2-hours' | 'overtime-after-2-hours' | 'overtime-sunday' | 'overtime-public-holiday';

// Additional types needed for the quote system
export type ShiftTemplate = {
  id: string;
  name: string;
  description?: string;
  day: QuoteShift['day'];
  startTime: string;
  endTime: string;
  breakDuration: number;
  level: number;
  employmentType: EmploymentType;
  numberOfCleaners: number;
  allowances: any[];
};

// Add job cost calculation related types
export type EmployeeLevelRates = {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  baseRate: number;
  rates: Record<PayCondition, {
    rate: number;
    multiplier: number;
  }>;
};

export type JobCostingParams = {
  employmentType: EmploymentType;
  level: EmployeeLevel;
  hours: Record<PayCondition, number>;
  overheadPercentage: number;
  marginPercentage: number;
};

export type JobCostBreakdown = {
  laborCost: number;
  overheadCost: number;
  totalCostBeforeMargin: number;
  margin: number;
  totalPrice: number;
  hourlyBreakdown: Array<{
    condition: PayCondition;
    hours: number;
    rate: number;
    cost: number;
  }>;
};

// Add award data types
export type AwardData = {
  name: string;
  code: string;
  effectiveDate: string;
  levels: EmployeeLevelRates[];
};

export type AwardSettings = {
  baseRateMultiplier: number;
  lastUpdated: string;
  overheadPercentageDefault: number;
  marginPercentageDefault: number;
};
