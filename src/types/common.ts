
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

// Define employment types with consistent format (underscores instead of hyphens)
export type EmploymentType = 'full_time' | 'part_time' | 'casual';

// Define employee levels
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Define days of the week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday';

// Define unified day type for backward compatibility
export type UnifiedDay = Day;

// Define frequency types
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';

// Define billing frequency as an alias to Frequency for consistency
export type BillingFrequency = Frequency;

// Define quote status types to include 'sent' and 'approved'
export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'approved' | 'accepted' | 'rejected' | 'expired';

// Define JSON value types
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type JsonValue = Json;

// Define UserStatus for user management
export type UserStatus = 'active' | 'pending' | 'inactive';
