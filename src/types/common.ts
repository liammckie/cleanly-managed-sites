
/**
 * Common types used throughout the application
 */

// JSON type for database fields
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type JsonValue = Json;

// Common status types
export type Status = 'active' | 'inactive' | 'pending' | 'draft' | 'archived';
export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'pending';
export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';
export type ContractStatus = 'draft' | 'active' | 'pending' | 'expired' | 'canceled' | 'renewed' | 'terminated';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'void';
export type ContractorStatus = 'active' | 'inactive' | 'pending';
export type UserStatus = 'active' | 'pending' | 'inactive';

// Common frequency types
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'casual' | 'intern';
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// Day of week
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day;

// Quote status types - expanded to include all statuses found in the codebase
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'approved' | 'declined' | 'submitted' | 'pending';

// Contract types
export type ContractType = 'service' | 'maintenance' | 'one-time' | 'project' | 'other';
export type ContractBillingCycle = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Service delivery types
export type ServiceDeliveryType = 'direct' | 'contractor' | 'mixed';

/**
 * Utility type to make specific properties required in a type
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Utility type to make all properties optional in a type
 */
export type AllOptional<T> = { [P in keyof T]?: T[P] };

/**
 * Utility type to pick specific properties from a type and make them required
 */
export type PickRequired<T, K extends keyof T> = Pick<T, K> & { [P in K]-?: T[P] };

/**
 * Contract forecast for analytics
 */
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
  contractCount: number;
}
