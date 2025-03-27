
import { ContractDetails } from './contractTypes';
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
  postalCode: string;
  country: string;
  client_id?: string;
  client_name?: string;
  status: SiteStatus;
  phone?: string;
  email?: string;
  representative?: string;
  customId?: string;
  contacts: {
    id?: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    isPrimary?: boolean;
    department?: string;
    notes?: string;
  }[];
  primary_contact?: {
    name: string;
    email?: string;
    phone?: string;
    role: string;
  };
  contract_details?: ContractDetails;
  contractDetails?: ContractDetails;  // Alias for backward compatibility
  useClientInfo?: boolean;
  billingDetails?: BillingDetails;
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
  locationDetails?: {
    floor?: string;
    building?: string;
    suite?: string;
    propertyType?: string;
    accessHours?: string;
    keyLocation?: string;
    parkingDetails?: string;
    siteSize?: string;
    siteSizeUnit?: 'sqft' | 'sqm';
  };
  notes?: string;
  clientId?: string;                  // Alias for client_id
  postcode?: string;                  // Alias for postalCode
}

// Export alias names for backward compatibility
export const siteStatusOptions: SiteStatus[] = ['active', 'pending', 'inactive', 'lost', 'on-hold'];
