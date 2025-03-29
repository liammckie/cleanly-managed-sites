
/**
 * Common type definitions used across the application
 */

// Basic JSON type that works with DB serialization
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Json = JsonValue;

// Status enums
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'terminated' | 'on-hold';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// Frequency and other common enums
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract' | 'independent';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type QuoteStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'expired';

// Common database types
export interface BaseRecord {
  id: string;
  created_at: string;
  updated_at: string;
}

// Standard API response format
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}
