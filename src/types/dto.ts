
/**
 * Domain Transfer Objects (DTOs)
 * 
 * This file defines the stable contract between our UI components and API/database.
 * These types serve as a bridge between frontend forms and backend data structures.
 */

// User DTO Types
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
  status: "active" | "pending" | "inactive";
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

// Site Related DTOs
export interface SiteDTO {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  client_id: string;
  client_name?: string;
  status: "active" | "inactive" | "pending" | "on-hold" | "lost";
  representative?: string;
  contract_details?: ContractDetailsDTO;
  billing_details?: BillingDetailsDTO;
  job_specifications?: JobSpecificationsDTO;
  security_details?: SecurityDetailsDTO;
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
}

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

export interface BillingDetailsDTO {
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  billingEmail: string;
  
  // Billing lines for the form
  billingLines?: BillingLineDTO[];
  
  // Service delivery details
  serviceType?: string;
  deliveryMethod?: string;
  serviceDeliveryType?: 'direct' | 'contractor';
  
  // Contractor details
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Budget details
  weeklyBudget?: number;
  
  // Additional billing fields
  rate?: string;
  xeroContactId?: string;
}

export interface BillingLineDTO {
  id: string;
  description: string;
  amount: number;
  frequency: "weekly" | "monthly" | "quarterly" | "annually";
  isRecurring?: boolean;
  onHold?: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface JobSpecificationsDTO {
  daysPerWeek?: number;
  hoursPerDay?: number;
  directEmployees?: number;
  notes?: string;
  cleaningFrequency?: string;
  customFrequency?: string;
  serviceDays?: string;
  serviceTime?: string;
  estimatedHours?: string;
  equipmentRequired?: string;
  scopeNotes?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
}

export interface SecurityDetailsDTO {
  keyLocation?: string;
  alarmCode?: string;
  securityContact?: string;
  specialAccess?: string;
  notes?: string;
}

// Quote related DTOs
export interface QuoteDTO {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  clientName: string;
  siteName?: string;
  status: "draft" | "submitted" | "approved" | "declined" | "expired";
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

export interface OverheadProfileDTO {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}
