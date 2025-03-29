
// Common enums and types used across the application

// Status types
export type UserStatus = 'active' | 'inactive' | 'pending' | 'archived';
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'prospect';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'canceled' | 'renewed';
export type ContractorStatus = 'active' | 'inactive' | 'pending' | 'blacklisted';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Service delivery types
export type ServiceDeliveryType = 'direct' | 'contractor' | 'mixed';

// Employment types
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contract';

// Employee levels for award calculations
export type EmployeeLevel = 1 | 2 | 3 | 4 | 5;

// JSON type for database fields
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
export type JsonValue = Json;

// Billing frequency types
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once-off';

// Payment condition types
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

// File types
export type FileType = 'image' | 'document' | 'spreadsheet' | 'pdf';

// Day type
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type UnifiedDay = Day;

// Frequency type
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'once-off';

// Quote status
export type QuoteStatus = 
  | 'draft'
  | 'submitted'
  | 'pending'
  | 'approved'
  | 'declined'
  | 'expired'
  | 'accepted'
  | 'sent'
  | 'rejected';
