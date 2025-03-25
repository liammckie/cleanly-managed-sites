
import { ContractDetails } from './contractTypes';
import { BillingDetails } from './billingTypes';
import { Subcontractor } from './subcontractorTypes';
import { SecurityDetails } from './securityTypes';
import { Periodicals } from './periodicalTypes';
import { AdHocWorkAuthorization } from './adHocWorkTypes';

export type SiteStatus = 'active' | 'pending' | 'inactive' | 'lost' | 'on_hold';

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
    isPrimary?: boolean;
    department?: string;
    notes?: string;
  }[];
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
