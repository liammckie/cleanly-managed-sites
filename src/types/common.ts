
// Common type definitions for the application

// Site status options
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract' | 'intern';

// Employee levels (1-5)
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Common JSON type for flexible contract data
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// JsonValue type for API operations
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// Contract status options
export type ContractStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'draft';

// Billing frequency options
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Days of the week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// Unified day format (alternative name for compatibility)
export type UnifiedDay = Day;

// Quote frequency options
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';

// Quote status options
export type QuoteStatus = 'draft' | 'sent' | 'pending' | 'approved' | 'rejected' | 'expired' | 'accepted' | 'declined' | 'submitted';

// Service delivery types
export type ServiceDeliveryType = 'in-house' | 'contractor' | 'mixed' | 'other';

// Pay condition options for award calculations
export type PayCondition = 
  'base' | 
  'standard' | 
  'weekday' | 
  'shift-early-late' | 
  'saturday' | 
  'sunday' | 
  'public_holiday' | 
  'early_morning' | 
  'evening' | 
  'night' | 
  'overnight' | 
  'overtime-first-2-hours' | 
  'overtime-after-2-hours' | 
  'overtime-sunday' | 
  'overtime-public-holiday' |
  'monday' | 
  'tuesday' | 
  'wednesday' | 
  'thursday' | 
  'friday';

// User status options
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// User role options
export type UserRole = 'admin' | 'manager' | 'staff' | 'client';

// User permission options
export type UserPermission = 
  | 'read:clients'
  | 'write:clients'
  | 'read:sites'
  | 'write:sites'
  | 'read:contracts'
  | 'write:contracts'
  | 'read:users'
  | 'write:users'
  | 'read:workorders'
  | 'write:workorders';

// Basic user profile
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: string;
  status?: UserStatus;
}
