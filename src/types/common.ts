
// Common type definitions used across the application

// Day of the week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday' | 'weekend';

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'casual';

// Employee levels
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Frequency of payments, services, etc.
export type Frequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';

// Billing frequency
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Quote status
export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired' | 'accepted' | 'pending';

// Site status
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';

// JSON value type definition
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Json = JsonValue;

// User status
export type UserStatus = 'active' | 'pending' | 'inactive';
