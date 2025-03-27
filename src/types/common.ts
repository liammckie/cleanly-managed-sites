
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

// Fixed properties in LegacyValidationResult to align with how it's being used
export interface LegacyValidationResult<T = unknown> {
  isValid: boolean;
  data?: T;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

// Added ContractForecast type for useContractForecast hook
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  contractCount: number;
}

// Define UserRole properly
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

// Define UserProfile for consistent use
export interface UserProfile {
  id?: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  status: UserStatus;
  role_id?: string;
  title?: string;
  phone?: string;
  notes?: string;
  custom_id?: string;
  daily_summary?: boolean;
  territories?: string[];
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}
