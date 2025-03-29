
/**
 * Common types shared across the application
 * Central source of truth for all common types
 */

// JSON type for use in database operations
export type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
export type Json = JsonValue;

// Common status types used across the application
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type ContractStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'inactive';
export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'approved' | 'accepted' | 'rejected' | 'expired';
export type UserStatus = 'active' | 'pending' | 'inactive';
export type WorkOrderStatus = 'draft' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

// Frequency types
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once-off';

// Employment related types
export type EmploymentType = 'full_time' | 'part_time' | 'casual' | 'contract' | 'intern';
export type EmployeeLevel = 1 | 2 | 3 | 4;

// Date & time related types
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day | 'weekday' | 'weekend';

// Service types
export type ServiceDeliveryType = 'in-house' | 'contractor' | 'hybrid';

// Payment conditions
export type PayCondition =
  | 'base'
  | 'standard'
  | 'saturday'
  | 'sunday'
  | 'publicHoliday'
  | 'earlyMorning'
  | 'evening'
  | 'overnight'
  | 'overtime1'
  | 'overtime2'
  | 'overtime3';

// Utility types
export type Nullable<T> = T | null;
