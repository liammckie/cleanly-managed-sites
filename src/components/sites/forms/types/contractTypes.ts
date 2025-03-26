
export interface ContractTerm {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
  details?: string;
  isActive?: boolean;
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
  contractType?: string;
  additionalContracts?: ContractDetails[];
  terms?: any[];
  notes?: string;
  contractNumber?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  // Additional fields
  value?: number;
  billingCycle?: string;
  id?: string;
  autoRenew?: boolean;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  created_at: string;
  created_by?: string;
  notes?: string;
  version_number: number;
  contract_details: any;
}

export interface ContractForecast {
  id: string;
  contractNumber: string;
  clientName: string;
  siteName: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
  contractType: string;
  renewalDate?: string;
  noticeDate?: string;
  daysRemaining: number;
}
