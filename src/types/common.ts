
// src/types/common.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type JsonValue = Json;

export type ValidationError = {
  path: string;
  message: string;
};

export type ValidationResult<T = unknown> = {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
};

export type EnhancedValidationResult<T = unknown> = ValidationResult<T> & {
  warnings?: ValidationError[];
};

export type ValidationMessage = string;

export type UnifiedDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'weekday'
  | 'public_holiday';

export type Day = UnifiedDay;

export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'casual'
  | 'intern';

export type QuoteStatus =
  | 'draft'
  | 'submitted'
  | 'approved'
  | 'pending'
  | 'declined'
  | 'expired'
  | 'sent'
  | 'accepted'
  | 'rejected';

export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

export type UserStatus = 'active' | 'pending' | 'inactive';

// Add missing type definitions below
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'lost' | 'on-hold';

export type Frequency =
  | 'daily'
  | 'weekly'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'once';

export type BillingFrequency = 
  | 'weekly'
  | 'monthly' 
  | 'quarterly' 
  | 'annually';

export type ServiceDeliveryType = 'direct' | 'contractor';

// Fixed properties in ValidationResult to align with how it's being used
export interface LegacyValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}
