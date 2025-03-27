
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'on-hold' | 'lost';

export interface ValidationMessage {
  field: string;
  message: string;
  row?: number;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}

export interface EnhancedValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  data: any[];
}

// Add missing types referenced throughout the codebase
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day;
export type EmploymentType = 'full_time' | 'part_time' | 'casual';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';
export type BillingFrequency = Frequency;
export type QuoteStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'expired';
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type JsonValue = Json;
