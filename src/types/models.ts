
import type { Json, QuoteStatus, ContractStatus, EmploymentType, UserStatus, Day, EmployeeLevel, Frequency } from './common';

// Contract Activity – using camelCase for app usage.
export interface ContractActivity {
  id: string;
  contractId: string;    // mapped from "contract_id"
  contract_id?: string;  // For backward compatibility
  action: string;        // added missing property
  activity_type?: string; // For backward compatibility
  timestamp: string;     // added missing property
  created_at?: string;   // For backward compatibility
  userName: string;      // added missing property
  details: string | any; // added missing property
  metadata?: any;        // For backward compatibility
  description?: string;  // For backward compatibility
  created_by?: string;   // For backward compatibility
}

// Contract type – note the camelCase keys.
export interface Contract {
  id: string;
  siteId: string;        // from "site_id"
  site_id?: string;      // For backward compatibility
  clientId: string;      // from "client_id"
  client_id?: string;    // For backward compatibility
  contractNumber: string; // from "contract_number"
  contract_number?: string; // For backward compatibility
  startDate: string;     // from "start_date"
  start_date?: string;   // For backward compatibility
  endDate: string;       // from "end_date"
  end_date?: string;     // For backward compatibility
  monthlyRevenue?: number; // from "monthly_revenue"
  monthly_revenue?: number; // For backward compatibility
  contractDetails?: Json;  // from "contract_details"
  contract_details?: Json; // For backward compatibility
  autoRenewal?: boolean;   // from "auto_renewal"
  auto_renewal?: boolean;  // For backward compatibility
  renewalPeriod?: number;  // from "renewal_period"
  renewal_period?: number; // For backward compatibility
  renewalNoticeDays?: number; // from "renewal_notice_days"
  renewal_notice_days?: number; // For backward compatibility
  terminationPeriod?: number; // from "termination_period"
  termination_period?: number; // For backward compatibility
  billingCycle?: string;   // from "billing_cycle"
  billing_cycle?: string;  // For backward compatibility
  serviceFrequency?: string; // from "service_frequency"
  service_frequency?: string; // For backward compatibility
  serviceDeliveryMethod?: string; // from "service_delivery_method"
  service_delivery_method?: string; // For backward compatibility
  isPrimary?: boolean;     // from "is_primary"
  is_primary?: boolean;    // For backward compatibility
  createdAt: string;       // from "created_at"
  created_at?: string;     // For backward compatibility
  updatedAt: string;       // from "updated_at"
  updated_at?: string;     // For backward compatibility
  
  // Additional fields that might be used in UI
  site?: { id: string; name: string };
  client?: { id: string; name: string };
  value?: number;
  status?: string;
}

// Quote interfaces
export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  site_name?: string;
  description?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  margin_percentage: number;
  total_price: number;
  labor_cost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  created_at: string;
  updated_at: string;
  quote_number?: string;
  valid_until?: string;
  client_id?: string;
  site_id?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  overhead_cost?: number;
  total_cost?: number;
  margin_amount?: number;
  start_date?: string;
  end_date?: string;
  expiry_date?: string;
  contract_length?: number;
  contract_length_unit?: 'days' | 'weeks' | 'months' | 'years';
  overhead_profile?: string;
  user_id?: string;
  created_by?: string;
  notes?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  
  // Client and site related fields (for convenience)
  clientName?: string;
  siteName?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  
  // UI convenience properties (to avoid property not found errors) 
  overheadPercentage?: number;
  marginPercentage?: number;
  totalPrice?: number;
  laborCost?: number;
  subcontractorCost?: number;
  createdAt?: string;
  updatedAt?: string;
  suppliesCost?: number;
  equipmentCost?: number;
  quoteNumber?: string;
  validUntil?: string;
  clientId?: string;
  siteId?: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  endDate?: string;
  expiryDate?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
}

export interface QuoteShift {
  id: string;
  quote_id: string;
  quoteId?: string;
  day: Day;
  start_time: string;
  startTime?: string;
  end_time: string;
  endTime?: string;
  break_duration: number;
  breakDuration?: number;
  number_of_cleaners: number;
  numberOfCleaners?: number;
  employment_type: EmploymentType;
  employmentType?: EmploymentType;
  level: EmployeeLevel;
  allowances: string[];
  estimated_cost: number;
  estimatedCost?: number;
  location: string;
  notes: string;
}

// Frontend-friendly version with camelCase
export interface FrontendQuoteShift {
  id: string;
  quoteId: string;
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

export interface QuoteSubcontractor {
  id: string;
  quote_id: string;
  quoteId?: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  notes?: string;
  
  // Additional fields used in the UI
  service?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

// Overhead Profile types
export interface RawOverheadProfile {
  id?: string;
  name?: string;
  labor_percentage: number;
  // Add any other properties required by the DB
}

export interface OverheadProfile extends RawOverheadProfile {
  // Optionally, include additional camelCase keys if mapping is needed.
  laborPercentage?: number;
}

// User types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export type UserRole = 'admin' | 'manager' | 'user'; // base type

// Enhanced UserRole for components that need rich user role data
export interface UserRoleData {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
}

// System user with additional properties
export interface SystemUser extends UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  lastLogin?: string;
  permissions?: string[];
}

// Define ContactRecord for use in the application
export interface ContactRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  notes?: string;
  entity_id?: string;
  entity_type?: string;
  is_primary?: boolean;
}

// Type for contract history entries
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: Json;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

// Import/Export types
export interface ImportOptions {
  userId: string;
  dryRun?: boolean;
  skipExisting?: boolean;
}

// Site form data
export interface SiteFormData {
  id?: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  email?: string;
  phone?: string;
  client_id?: string;
  clientId?: string;
  client_name?: string;
  clientName?: string;
  status?: string;
  customId?: string;
  custom_id?: string;
  contractDetails?: any;
  contract_details?: any;
  billingDetails?: any;
  billing_details?: any;
  securityDetails?: any;
  security_details?: any;
  jobSpecifications?: any;
  job_specifications?: any;
  representative?: string;
  notes?: string;
  monthly_revenue?: number;
  monthly_cost?: number;
  [key: string]: any;
}

// Billing line type
export interface BillingLine {
  id?: string;
  site_id?: string;
  description: string;
  amount: number;
  frequency?: string;
  is_recurring?: boolean;
  on_hold?: boolean;
  monthly_amount?: number;
  annual_amount?: number;
  weekly_amount?: number;
}

// Service delivery types
export type ServiceDeliveryType = 'in-house' | 'contractor' | 'hybrid';

// Contract term interface
export interface ContractTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}
