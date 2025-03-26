
/**
 * Types for the contract-related components
 */

export interface ContractTerm {
  id?: string;
  name: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}

export interface ContractSummary {
  id?: string;
  totalValue: number;
  expiringWithin30Days: number;
  renewalRate: number;
}

export interface ContractDetails {
  id?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  terminationPeriod?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  terms?: { id: string; name: string; description: string }[];
  additionalContracts?: any[];
}
