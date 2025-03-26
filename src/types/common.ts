
// Common type definitions used across the application
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on_hold';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

export type ContractType = 'cleaning' | 'maintenance' | 'security' | 'other';

// JSON type for database values
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Day type used across the application
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday' | 'public_holiday';

// These types were causing inconsistencies
export type EmploymentType = 'casual' | 'part_time' | 'full_time';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'yearly' | 'once';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'accepted';

// PayCondition type for award calculations
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
  'overtime-public-holiday';
