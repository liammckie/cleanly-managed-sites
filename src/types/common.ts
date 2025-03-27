
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
