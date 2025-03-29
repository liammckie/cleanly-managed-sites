
/**
 * Site related type definitions
 * Centralizes all site types
 */
import { Json, SiteStatus } from './common';
import { ContractDetails } from './contractTypes';
import { SiteContact } from './contactTypes';

/**
 * Site record interface from database
 */
export interface SiteRecord {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  client_id: string;
  client_name?: string;
  status: SiteStatus;
  email: string;
  phone: string;
  representative: string;
  custom_id: string;
  contract_details?: Json;
  billing_details?: Json;
  job_specifications?: Json;
  weekly_revenue?: number;
  monthly_revenue?: number;
  annual_revenue?: number;
  monthly_cost?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  has_subcontractors?: boolean;
  replenishables?: Json;
  periodicals?: Json;
  security_details?: Json;
  subcontractors?: Json;
}

/**
 * Enhanced site record with additional properties
 */
export interface EnhancedSiteRecord extends SiteRecord {
  client_name?: string;
  contractor_name?: string;
  total_work_orders?: number;
  tasks_completed?: number;
  tasks_pending?: number;
}

/**
 * Site record for form handling with typed contract and billing details
 */
export interface TypedSiteRecord extends Omit<SiteRecord, 'contract_details' | 'billing_details'> {
  contract_details?: ContractDetails;
  billing_details?: any;
}

/**
 * Interface for site form data
 */
export interface SiteFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  client_id?: string;
  client_name?: string;
  status: SiteStatus;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  siteId?: string;
  contacts: SiteContact[];
  primary_contact?: {
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  contract_details?: ContractDetails;
  contractDetails?: ContractDetails;
  useClientInfo?: boolean;
  billingDetails?: any;
  additionalContracts?: ContractDetails[];
  subcontractors?: any[];
  hasSubcontractors?: boolean;
  monthlyCost?: number;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  replenishables?: {
    stock?: any[];
    supplies?: any[];
    notes?: string;
  };
  periodicals?: any;
  adHocWorkAuthorization?: any;
  securityDetails?: any;
  jobSpecifications?: any;
  locationDetails?: any;
  notes?: string;
  clientId?: string;
  postcode?: string;
}

/**
 * Billing line interface
 */
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold: boolean;
  notes?: string;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  // DB compatible fields
  is_recurring?: boolean;
  on_hold?: boolean;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
}

/**
 * Site billing details interface
 */
export interface BillingDetails {
  billingContact?: any;
  billingFrequency?: string;
  billingDay?: number;
  billingLines?: BillingLine[];
  paymentTerms?: string;
  invoiceEmail?: string;
  poRequired?: boolean;
  poNumber?: string;
  notes?: string;
  onHold?: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
}
