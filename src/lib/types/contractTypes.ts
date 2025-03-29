
/**
 * Contract related type definitions
 */
import { Json } from './common';

// Basic contract type
export interface Contract {
  id: string;
  site_id: string;
  client_id?: string;
  title?: string;
  contractNumber?: string;
  description?: string;
  type?: string;
  status?: string;
  monthlyRevenue?: number;
  contractDetails?: ContractDetails;
  startDate?: string;
  endDate?: string;
  renewalPeriod?: string;
  autoRenewal?: boolean;
  value?: number;
  billingCycle?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  isPrimary?: boolean;
  created_at: string;
  updated_at: string;
}

// Contract details
export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  type?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalNoticeDays?: number;
  renewalLengthMonths?: number;
  terminationPeriod?: string;
  specificEndDate?: boolean;
  notes?: string;
  attachments?: string[];
  value?: number;
  billingCycle?: string;
  billingTerms?: string;
  agreementDate?: string;
  signedBy?: string;
  clientContact?: string;
  terms?: ContractTerm[];
  includeTax?: boolean;
  taxRate?: number;
  billingStartDate?: string;
  renewalPeriod?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
}

// Contract term
export interface ContractTerm {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  isAccepted?: boolean;
  acceptedDate?: string;
}

// Contract history entry
export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: ContractDetails;
  notes?: string;
  created_at: string;
  created_by?: string;
  version_number: number;
}

// Contract summary data
export interface ContractSummaryData {
  totalContracts: number;
  activeContracts: number;
  expiringContracts: number;
  monthlyRevenue: number;
  annualRevenue: number;
  averageContractValue: number;
  contractsByType: Record<string, number>;
  contractsByStatus: Record<string, number>;
  recentChanges: ContractHistoryEntry[];
}
