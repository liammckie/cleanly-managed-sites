
// Common status types
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'cancelled' | 'renewal';
export type UserStatus = 'active' | 'pending' | 'inactive';
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'pending' | 'accepted';

// Common day and time types
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type TimeFormat = '12h' | '24h';

// Employee types
export type EmploymentType = 'casual' | 'part_time' | 'full_time' | 'contractor';
export type EmployeeLevel = 1 | 2 | 3;

// Frequency types
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// JSON related types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type JsonObject = { [key: string]: Json };
export type JsonValue = Json;

// Add UnifiedDay to align with the types in shift-planner
export type UnifiedDay = Day | 'weekday' | 'weekend';
