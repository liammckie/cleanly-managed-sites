
import { Day, EmploymentType, EmployeeLevel, Frequency, BillingFrequency, QuoteStatus, SiteStatus, UserStatus } from './common';

// User DTO types
export interface UserDTO {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  title?: string;
  phone?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  status: UserStatus;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  daily_summary?: boolean;
}

export interface UserRoleDTO {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  created_at?: string;
  updated_at?: string;
  user_count?: number;
}

// Site DTO types
export interface SiteDTO {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  client_id?: string;
  client_name?: string;
  status: SiteStatus;
  representative?: string;
  contract_details?: ContractDetailsDTO;
  billing_details?: BillingDetailsDTO;
  job_specifications?: any;
  security_details?: any;
  monthly_revenue?: number;
  weekly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  custom_id?: string;
  notes?: string;
  email?: string;
  phone?: string;
  contacts?: ContactDTO[];
}

export interface ContactDTO {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  is_primary?: boolean;
}

// Contract DTO types
export interface ContractDetailsDTO {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  contractLength?: number;
  contractLengthUnit?: string;
  contractType?: string;
  renewalPeriod?: string;
  renewalNoticeDays?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  value?: number;
  billingCycle?: string;
  notes?: string;
}

// Billing DTO types
export interface BillingDetailsDTO {
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingLines?: BillingLineDTO[];
  contacts?: BillingContactDTO[];
  
  // Optional fields used in components
  serviceDeliveryType?: 'direct' | 'contractor';
  weeklyBudget?: number;
  annualDirectCost?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Additional properties that might be used
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  billingFrequency?: string;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceMethod?: string;
  rate?: string;
  xeroContactId?: string;
}

export interface BillingLineDTO {
  id: string;
  description: string;
  amount: number;
  frequency?: BillingFrequency;
  isRecurring?: boolean;
  onHold?: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  creditAmount?: number | string;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingContactDTO {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

// Quote DTO types
export interface QuoteDTO {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  clientName: string;
  siteName?: string;
  status: QuoteStatus;
  laborCost: number;
  overheadPercentage: number;
  marginPercentage: number;
  marginAmount?: number;
  overheadCost?: number;
  totalCost?: number;
  subcontractorCost: number;
  totalPrice: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  quoteNumber?: string;
  validUntil?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteShiftDTO {
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
}

export interface QuoteSubcontractorDTO {
  id: string;
  quote_id?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
}

// Business profile DTO type
export interface BusinessProfileDTO {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Overhead profile DTO type
export interface OverheadProfileDTO {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
