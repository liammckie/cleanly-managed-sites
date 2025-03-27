
// Common type definitions for the application

// Site status types
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

// Day of the week types for scheduling
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

// Additional compatible day type for components
export type UnifiedDay = Day;

// Employment types
export type EmploymentType = 'casual' | 'part-time' | 'full-time';

// Employee level types
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Frequency types for billing/scheduling
export type Frequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

// Quote status types
export type QuoteStatus = 
  | 'draft' 
  | 'sent' 
  | 'approved' 
  | 'accepted' 
  | 'rejected' 
  | 'expired' 
  | 'pending';

// JSON type for type safety
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type JsonValue = Json;

// For backward compatibility
export type BillingFrequency = Frequency;
