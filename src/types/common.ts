
// Common enums and types used throughout the application

export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Extended day type including additional options
export type UnifiedDay = Day | 'weekday' | 'weekend' | 'public_holiday';

export type EmploymentType = 'full_time' | 'part_time' | 'casual';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';

export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually';

export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'submitted' | 'approved' | 'accepted' | 'declined' | 'rejected' | 'expired';

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

export type UserStatus = 'active' | 'pending' | 'inactive';

// JSON utility types
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type Json = JsonValue | { [key: string]: JsonValue };

// Validation types
export interface ValidationMessage {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  row?: number; // Added row property to fix validation errors
  value?: any; // Added value property required by validation functions
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[] | ValidationMessage[];
  warnings: string[] | ValidationMessage[];
  data: any[];
}

export interface EnhancedValidationResult extends ValidationResult {
  success: boolean;
  messages: ValidationMessage[];
  imported?: number;
}

// Helper function to validate enum values
export function isValidEnumValue<T extends string>(value: string, enumValues: readonly T[]): value is T {
  return (enumValues as readonly string[]).includes(value);
}
