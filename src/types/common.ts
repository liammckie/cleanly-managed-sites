
// Define common types used across the application

export type SiteStatus = 'active' | 'inactive' | 'pending' | 'on-hold' | 'lost';

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'pending';

export type UserStatus = 'active' | 'pending' | 'inactive';

export type ContractorStatus = 'active' | 'inactive' | 'pending';

export type WorkOrderStatus = 
  | 'draft'
  | 'pending'
  | 'in-progress'
  | 'completed' 
  | 'cancelled'
  | 'on-hold';

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export type QuoteStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type InvoiceFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type ContractLengthUnit = 'days' | 'weeks' | 'months' | 'years';

// Define validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Define validation message type to match what's used in import-export
export interface ValidationMessage {
  field: string;
  message: string;
}

// Enhanced validation result type to work with the existing code
export interface EnhancedValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
}
