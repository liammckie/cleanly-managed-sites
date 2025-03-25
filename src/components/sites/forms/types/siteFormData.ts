
import { ContractDetails } from './contractTypes';
import { BillingDetails } from './billingTypes';
import { Subcontractor } from './subcontractorTypes';

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
  primaryContact?: {
    name: string;
    email: string;
    phone: string;
    role: string;
  };
  contacts?: Array<{
    id?: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    isPrimary?: boolean;
  }>;
  contract_details?: ContractDetails;
  useClientInfo?: boolean;
  billingDetails?: BillingDetails;
  additionalContracts?: ContractDetails[];
  subcontractors?: Subcontractor[];
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
  };
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  replenishables?: {
    stock?: any[];
    contactDetails?: string;
    supplies?: any[];
    notes?: string;
  };
  periodicals?: {
    carpets?: {
      cleaning?: boolean;
      shampooing?: boolean;
      frequency?: string;
      lastCompleted?: string;
      nextScheduled?: string;
      charges?: number;
    };
    floors?: {
      buffing?: boolean;
      stripping?: boolean;
      frequency?: string;
      lastCompleted?: string;
      nextScheduled?: string;
      charges?: number;
    };
    windows?: {
      internal?: boolean;
      external?: boolean;
      frequency?: string;
      lastCompleted?: string;
      nextScheduled?: string;
      charges?: number;
    };
    highDusting?: {
      dusting?: boolean;
      frequency?: string;
      lastCompleted?: string;
      nextScheduled?: string;
      charges?: number;
    };
    deepCleaning?: {
      upholstery?: boolean;
      pressureWashing?: boolean;
      frequency?: string;
      lastCompleted?: string;
      nextScheduled?: string;
      charges?: number;
    };
  };
  adHocWorkAuthorization?: {
    enabled?: boolean;
    approvalLimit?: number;
    requirePurchaseOrder?: boolean;
    approver?: string;
    approverEmail?: string;
    approverPhone?: string;
  };
  securityDetails?: {
    alarmCode?: string;
    keyLocation?: string;
    accessNotes?: string;
    afterHoursContact?: string;
    afterHoursPhone?: string;
  };
}
