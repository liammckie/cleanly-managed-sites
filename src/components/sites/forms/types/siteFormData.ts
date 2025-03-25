
import { Json } from '@/lib/utils/json';
import { SiteStatus } from '@/lib/types';
import { BillingLine } from './billingTypes'; 
import { ContractDetails, ContractTerm } from './contractTypes';
import { ReplenishableSupply } from './replenishableTypes';
import { SiteContact } from './contactTypes';
import { ServiceOption } from './subcontractorTypes';

export interface JobSpecifications {
  daysPerWeek?: number;
  hoursPerDay?: number;
  directEmployees?: number;
  notes?: string;
  // Extended job specifications
  cleaningFrequency?: string;
  customFrequency?: string;
  serviceDays?: string;
  serviceTime?: string;
  estimatedHours?: string;
  equipmentRequired?: string;
  scopeNotes?: string;
}

export interface SecurityDetails {
  accessCode?: string;
  alarmCode?: string;
  keyLocation?: string;
  outOfHoursAccess?: boolean;
}

export interface PeriodicalService {
  frequency: string;
  lastCompleted?: string;
  nextScheduled?: string;
  charges?: number;
  cleaning?: boolean;
  shampooing?: boolean;
  buffing?: boolean;
  stripping?: boolean;
  internal?: boolean;
  external?: boolean;
  dusting?: boolean;
  upholstery?: boolean;
  pressureWashing?: boolean;
}

export interface Replenishables {
  stock?: any[];
  contactDetails?: string;
  supplies?: ReplenishableSupply[];
  notes?: string;
}

export interface BillingDetails {
  billingFrequency?: string;
  paymentTerms?: string;
  invoiceMethod?: string;
  billingEmail?: string;
  useSiteAddress?: boolean;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  billingLines: BillingLine[];
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  annualForecast?: string;
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  contacts?: any[];
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  rate?: number;
}

export interface AdHocWorkAuthorization {
  requiresApproval?: boolean;
  approvalThreshold?: number;
  approvalContact?: string;
  approvalEmail?: string;
  maxAmount?: number;
}

export interface Subcontractor {
  businessName: string;
  contactName: string;
  email?: string;
  phone?: string;
  services?: ServiceOption[];
  customServices?: string;
  monthlyCost?: number;
  isFlatRate?: boolean;
}

export interface SiteFormData {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  clientId: string;
  clientName?: string;
  representative: string;
  contactDetails: {
    email?: string;
    phone?: string;
    notes?: string;
  };
  status: SiteStatus;
  customId?: string;
  phone?: string;
  email?: string;
  monthlyRevenue?: number;
  annualRevenue?: number;
  monthlyCost?: number;
  weeklyRevenue?: number;
  contractDetails: ContractDetails & {
    billingCycle?: string;
    nextReviewDate?: string;
    cpiApplied?: boolean;
    cpiApplicationDate?: string;
    terms?: ContractTerm[];
  };
  jobSpecifications?: JobSpecifications;
  securityDetails?: SecurityDetails;
  replenishables: Replenishables;
  periodicals?: Record<string, PeriodicalService>;
  contacts: SiteContact[];
  billingDetails: BillingDetails;
  subcontractors: Subcontractor[];
  additionalContracts?: ContractDetails[];
  useClientInfo?: boolean;
  adHocWorkAuthorization?: AdHocWorkAuthorization;
}

