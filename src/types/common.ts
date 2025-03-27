
// Define common types used across the application

// Status types
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
export type UserStatus = 'active' | 'pending' | 'inactive';
export type ContractStatus = 'active' | 'pending' | 'expired' | 'terminated' | 'renewed';
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';
export type WorkOrderStatus = 'draft' | 'scheduled' | 'in-progress' | 'completed' | 'canceled';

// Time periods
export type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Frequency = 'daily' | 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';
export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type ContractLengthUnit = 'days' | 'weeks' | 'months' | 'years';

// Employee types
export type EmploymentType = 'full-time' | 'part-time' | 'casual' | 'contractor';
export type EmployeeLevel = 1 | 2 | 3;
export type EmployeeStatus = 'active' | 'on-leave' | 'terminated';

// Service types
export type ServiceDeliveryType = 'direct' | 'contractor';
export type ServiceType = 'cleaning' | 'maintenance' | 'security' | 'other';

// Permission types
export type Permission = 
  | 'manage_users'
  | 'manage_clients'
  | 'manage_sites'
  | 'manage_quotes'
  | 'manage_work_orders'
  | 'manage_invoices'
  | 'manage_contracts'
  | 'manage_suppliers'
  | 'manage_reports'
  | 'manage_settings';

// Notification types
export type NotificationType = 'info' | 'warning' | 'error' | 'success';

// Used with type Json from the database
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
