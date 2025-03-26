
import { ContractDetails } from '../types/contractTypes';
import { BillingDetails } from './billingTypes';
import { SecurityDetails } from './securityTypes';
import { Periodicals } from './periodicalTypes';
import { AdHocWorkAuthorization } from './adHocWorkTypes';
import { SiteStatus } from '@/types/common';

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
    email?: string;
    phone?: string;
    role: string;
    isPrimary?: boolean;  // Changed from is_primary
    department?: string;
    notes?: string;
  }[];
  contract_details?: ContractDetails;  // Changed from contractDetails
  useClientInfo?: boolean;
  billingDetails?: BillingDetails;
  additionalContracts?: ContractDetails[];
  subcontractors?: any[];
  hasSubcontractors?: boolean;  // Added this property
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
  contractDetails?: ContractDetails;  // Alias for contract_details
  clientId?: string;                  // Alias for client_id
  postcode?: string;                  // Alias for postalCode
}

// Export alias names for backward compatibility
export const siteStatusOptions: SiteStatus[] = ['active', 'pending', 'inactive', 'lost', 'on-hold'];
