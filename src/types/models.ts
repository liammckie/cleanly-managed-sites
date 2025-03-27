
import { Day, EmploymentType, EmployeeLevel, Frequency, BillingFrequency, QuoteStatus } from './common';

export interface Quote {
  id: string;
  name?: string;
  clientName: string;
  siteName?: string;
  status: QuoteStatus;
  totalPrice: number;
  laborCost: number;
  overheadPercentage: number;
  marginPercentage: number;
  subcontractorCost: number;
  createdAt: string;
  updatedAt: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  
  // Additional fields used in components
  title?: string;
  description?: string;
  marginAmount?: number;
  overheadCost?: number;
  totalCost?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  notes?: string;
  quoteNumber?: string;
  validUntil?: string;
  contractLength?: number;
  contractLengthUnit?: string;
}

export interface QuoteShift {
  id: string;
  quote_id?: string;
  day: Day;
  start_time: string;
  end_time: string;
  break_duration: number;
  number_of_cleaners: number;
  employment_type: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  location?: string;
  notes?: string;
  
  // Camel case aliases
  quoteId?: string;
  startTime?: string;
  endTime?: string;
  breakDuration?: number;
  numberOfCleaners?: number;
  employmentType?: EmploymentType;
  estimatedCost?: number;
}

export interface QuoteSubcontractor {
  id: string;
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  
  // Additional fields used in UI
  service?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  
  // Camel case alias
  quoteId?: string;
}

// Add SystemUser type since it's referenced
export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  note?: string;  // singular in the database
  notes?: string;  // but components use plural
  territories?: string[];
  status: "active" | "pending" | "inactive";
  role_id?: string;
  role?: UserRole;  // Added role property
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

// Add BillingDetails for site form
export interface BillingDetails {
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  billingEmail: string;
  contacts?: BillingContact[];
  
  // Additional fields used in components
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingFrequency?: string;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceMethod?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  accountNumber?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  rate?: string;
  
  // Service delivery details
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  serviceDeliveryType?: 'direct' | 'contractor';
  weeklyBudget?: number;
  
  // Billing lines for the form
  billingLines?: BillingLine[];
  
  // Xero integration
  xeroContactId?: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPrimary?: boolean;
  department?: string;
  role?: string;
  position?: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring?: boolean;
  onHold?: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

// Add SiteFormData definition
export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;  // Keep this as postal_code to match backend
  postalCode?: string;  // Add this for UI compatibility
  country: string;
  client_id?: string;
  client_name?: string;
  status: SiteStatus;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  contract_details: any;
  periodicals?: any;
  billingDetails?: BillingDetails;
  security_details?: any;
  job_specifications?: any;
  subcontractors?: any;
  monthly_revenue?: number;
  weekly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  billing_on_hold?: boolean;
  billing_hold_start_date?: string;
  billing_hold_end_date?: string;
  notes?: string;
  contacts: any[];
  contractDetails?: any;
}

// Frontend version of QuoteShift with required fields for component use
export interface FrontendQuoteShift {
  id: string;
  quoteId?: string;  // Changed from required to optional for compatibility
  day: Day;
  startTime: string;
  endTime: string;
  breakDuration: number;
  numberOfCleaners: number;
  employmentType: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimatedCost: number;
  location: string;
  notes: string;
}

// Add DbOverheadProfile type
export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  laborPercentage?: number; // Add camelCase alias
  created_at: string;
  updated_at: string;
  user_id?: string;
}

// For ImportExport
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  data: any[];
  imported?: number;
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'xlsx';
  type: 'clients' | 'sites' | 'contracts' | 'contractors' | 'unified';
  mode: 'full' | 'incremental';
  validateOnly?: boolean;
  skipValidation?: boolean;
}

// Add missing SiteStatus definition
export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on-hold';
