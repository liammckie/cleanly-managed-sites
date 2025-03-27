
// Define common types used across the application

export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'pending';

export type UserStatus = 'active' | 'pending' | 'inactive';

export type ContractorStatus = 'active' | 'inactive' | 'pending';

export type WorkOrderStatus = 
  | 'draft'
  | 'pending'
  | 'in-progress'
  | 'completed' 
  | 'cancelled'
  | 'on-hold';

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'approved' 
  | 'rejected' 
  | 'expired' 
  | 'pending'
  | 'accepted';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type InvoiceFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type ContractLengthUnit = 'days' | 'weeks' | 'months' | 'years';

// Define validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  data: any[];
  warnings?: ValidationMessage[];
}

// Define validation message type to match what's used in import-export
export interface ValidationMessage {
  field: string;
  message: string;
  row?: number;
  value?: any;
}

// Enhanced validation result type to work with the existing code
export interface EnhancedValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  data?: any[];
  warnings?: ValidationMessage[];
  imported?: number;
}

// Add missing types for Day, EmploymentType, EmployeeLevel, Frequency
export type Day = 
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'weekday'
  | 'public_holiday';

export type UnifiedDay = Day;

export type EmploymentType = 'full-time' | 'part-time' | 'casual';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type Frequency = 
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'once';

// Define Json and JsonValue types
export type JsonValue = 
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type Json = JsonValue | { [key: string]: JsonValue } | JsonValue[];
