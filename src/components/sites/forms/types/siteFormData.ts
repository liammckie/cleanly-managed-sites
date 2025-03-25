
import { ContractDetails } from './contractTypes';
import { BillingDetails } from './billingTypes';
import { Subcontractor } from './subcontractorTypes';
import { SecurityDetails } from './securityTypes';
import { Periodicals } from './periodicalTypes';
import { AdHocWorkAuthorization } from './adHocWorkTypes';
import { SiteStatus } from '@/lib/types/commonTypes';

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
    email: string;
    phone: string;
    role: string;
  };
  contacts?: {
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isPrimary?: boolean;  // Changed from is_primary
    department?: string;
    notes?: string;
  }[];
  contract_details?: ContractDetails;  // Changed from contractDetails
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
    contactDetails?: string;
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
}

// Add compatible aliases to support existing code
export type {
  SiteStatus
}

// Export alias names for backward compatibility
import { SiteStatus as SiteStatusType } from '@/lib/types/commonTypes';
export const siteStatusOptions: SiteStatusType[] = ['active', 'pending', 'inactive', 'lost', 'on_hold'];
