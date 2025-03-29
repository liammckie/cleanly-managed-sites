
// JSON & utility types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Status types
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type QuoteStatus =
  | 'pending'
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'approved'
  | 'in-progress'
  | 'declined'
  | 'submitted'
  | 'completed';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'inactive';

// Date & Time
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day | 'weekday' | 'weekend';

// Frequency / Billing
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once-off';

// Employment
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract' | 'intern';
export type EmployeeLevel = 1 | 2 | 3 | 4;

// Payment Conditions
export type PayCondition =
  | 'base'
  | 'saturday'
  | 'sunday'
  | 'publicHoliday'
  | 'earlyMorning'
  | 'evening'
  | 'overnight'
  | 'overtime1'
  | 'overtime2'
  | 'overtime3';

// Other utility types
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Nullable<T> = T | null;
