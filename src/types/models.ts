
import { 
  Day, 
  EmployeeLevel, 
  EmploymentType, 
  BillingFrequency, 
  SiteStatus, 
  Frequency,
  JsonValue,
  QuoteStatus
} from './common';

// User related types
export interface SystemUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  role_id?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  title?: string;
  phone?: string;
  status?: 'active' | 'pending' | 'inactive';
  last_login?: string;
  custom_id?: string;
  notes?: string;
  territories?: string[];
  permissions?: string[];
}

export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

// Client related types
export interface ClientRecord {
  id: string;
  name: string;
  contact_name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  notes?: string;
  logo_url?: string;
  industry?: string;
  status: 'active' | 'inactive' | 'prospect' | 'pending';
  client_since?: string;
  created_at?: string;
  updated_at?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
  billing_contact_name?: string;
  billing_email?: string;
  billing_phone?: string;
  account_manager_id?: string;
  account_manager_name?: string;
  primary_contact_id?: string;
  primary_contact_name?: string;
  annual_revenue?: number;
  monthly_revenue?: number;
  total_sites?: number;
  custom_id?: string;
  contacts?: ContactRecord[];
  xero_contact_id?: string;
}

// Contact related types
export interface ContactRecord {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  department?: string;
  notes?: string;
  entity_id: string;
  entity_type: string;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  monthly_cost?: number;
  is_flat_rate?: boolean;
  services?: string[];
  user_id?: string;
}

// Site related types
export interface SiteRecord {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  postcode?: string;
  country?: string;
  client_id?: string;
  client_name?: string;
  site_manager_id?: string;
  site_manager_name?: string;
  location_details?: JsonValue;
  monthly_revenue?: number;
  monthly_cost?: number;
  annual_revenue?: number;
  weekly_revenue?: number;
  contract_details?: JsonValue;
  job_specifications?: JsonValue;
  security_details?: JsonValue;
  billing_details?: JsonValue;
  status: 'active' | 'pending' | 'inactive' | 'on-hold';
  created_at?: string;
  updated_at?: string;
  replenishables?: JsonValue;
  periodicals?: JsonValue;
  has_subcontractors?: boolean;
  subcontractors?: JsonValue;
}

// Quote related types
export interface Quote {
  id: string;
  name: string;
  title?: string;
  client_name: string;
  clientName: string;
  site_name?: string;
  siteName: string;
  description?: string;
  status: QuoteStatus;
  overhead_percentage: number;
  overheadPercentage: number;
  margin_percentage: number;
  marginPercentage: number;
  total_price: number;
  totalPrice: number;
  labor_cost: number;
  laborCost: number;
  supplies_cost?: number;
  equipment_cost?: number;
  subcontractor_cost: number;
  subcontractorCost: number;
  created_at: string;
  createdAt: string;
  updated_at: string;
  updatedAt: string;
  quote_number?: string;
  quoteNumber?: string;
  valid_until?: string;
  validUntil?: string;
  client_id?: string;
  clientId?: string;
  site_id?: string;
  siteId?: string;
  shifts?: QuoteShift[];
  subcontractors?: QuoteSubcontractor[];
  
  // Additional fields
  notes: string;
  overheadCost?: number;
  totalCost?: number;
  marginAmount?: number;
  startDate?: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  contractLength?: number;
  contractLengthUnit?: 'days' | 'weeks' | 'months' | 'years';
  overheadProfile?: string;
  userId?: string;
  createdBy?: string;
  frequency?: string;
  scope?: string;
  terms?: string;
  clientContact?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
}

export interface QuoteShift {
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
  quoteId: string;
  name: string;
  description?: string;
  cost: number;
  frequency: Frequency;
  email?: string;
  phone?: string;
  service?: string;
  notes?: string;
  services?: string[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
  is_flat_rate?: boolean;
  monthly_cost?: number;
  business_name?: string;
  contact_name?: string;
}

// Contract Data
export interface ContractData {
  id: string;
  client: string;
  site: string;
  value: number;
  startDate: string;
  endDate: string;
  status: string;
}

// Site Form Data
export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;  // Changed from postcode for consistency
  country: string;
  client_id?: string;   // Changed from clientId to match backend
  client_name?: string;
  status: SiteStatus;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  primary_contact?: {
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  contacts: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isPrimary?: boolean;  // Changed from is_primary
    department?: string;
    notes?: string;
  }[];
  contractDetails?: ContractDetails;  // Alias for contract_details
  contract_details?: ContractDetails;
  useClientInfo?: boolean;
  billingDetails?: BillingDetails;
  additionalContracts?: ContractDetails[];
  subcontractors?: Subcontractor[];
  monthlyCost?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  replenishables?: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
  periodicals?: Periodicals;
  adHocWorkAuthorization?: AdHocWorkAuthorization;
  securityDetails?: SecurityDetails;
  jobSpecifications?: {
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
  };
  notes?: string;
  // Add backward compatibility properties
  clientId?: string;                  // Alias for client_id
  postcode?: string;                  // Alias for postalCode
  // Property for has_subcontractors
  hasSubcontractors?: boolean;
}

// Import these types from their respective files to avoid duplication
import { ContractDetails } from '@/components/sites/forms/types/contractTypes';
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';
import { Subcontractor } from '@/components/sites/forms/types/subcontractorTypes';
import { Periodicals } from '@/components/sites/forms/types/periodicalTypes';
import { SecurityDetails } from '@/components/sites/forms/types/securityTypes';
import { AdHocWorkAuthorization } from '@/components/sites/forms/types/adHocWorkTypes';

// Export alias names for backward compatibility
export const siteStatusOptions: SiteStatus[] = ['active', 'pending', 'inactive', 'lost', 'on-hold'];

// OverheadProfile
export interface OverheadProfile {
  id: string;
  name: string;
  description?: string;
  laborPercentage: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface DbOverheadProfile {
  id: string;
  name: string;
  description?: string;
  labor_percentage: number;
  created_at: string;
  updated_at: string;
  user_id?: string;
}
