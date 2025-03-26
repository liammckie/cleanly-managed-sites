
import { JsonValue } from '@/types';

export interface ContractTerm {
  id: string;
  description: string;
  details: string;
  isActive: boolean;
  name?: string;
}

export interface ContractDetails {
  startDate: string;
  endDate: string;
  contractLength: number;
  contractLengthUnit: string;
  autoRenewal: boolean;
  renewalPeriod: number;
  renewalNotice: number;
  noticeUnit: string;
  serviceFrequency: string;
  serviceDeliveryMethod: string;
  terms?: ContractTerm[];
  contractNumber?: string;
  value?: number;
  billingCycle?: string;
  terminationPeriod?: string;
  renewalTerms?: string;
  additionalContracts?: ContractDetails[];
}
