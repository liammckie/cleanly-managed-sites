
// Basic types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Status types
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type UserStatus = 'active' | 'inactive' | 'pending';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'in-progress' | 'completed';

// Date and time related
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day | 'weekday' | 'weekend';

// Frequency options
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';

// Payment and billing
export type PayCondition = 
  'base' | 
  'saturday' | 
  'sunday' | 
  'publicHoliday' | 
  'earlyMorning' | 
  'evening' | 
  'overnight' | 
  'overtime1' | 
  'overtime2' | 
  'overtime3';

// Employment related
export type EmployeeLevel = 1 | 2 | 3 | 4;
export type EmploymentType = 'full-time' | 'part-time' | 'casual';

// Service related
export type ServiceDeliveryType = 'direct' | 'contractor' | 'mixed';

// Common utility types
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Nullable<T> = T | null;
