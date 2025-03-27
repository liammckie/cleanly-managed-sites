
export interface ContractTerm {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  renewalTerms: string;
  terminationPeriod: string;
  autoRenew: boolean;
}

export interface ContractDetails {
  id?: string;
  startDate?: string;
  endDate?: string;
  contractNumber?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  renewalTerms?: string;
  terminationPeriod?: string;
  contractType?: string;
  terms?: ContractTerm[];
  value?: number;
  billingCycle?: string;
  notes?: string;
}

export interface ContractHistoryEntry {
  id: string;
  site_id: string;
  contract_details: any;
  version_number: number;
  notes: string;
  created_by: string;
  created_at: string;
  contractor_id?: any;
  // Add compatibility with the format expected elsewhere in the app
  date?: string;
  user?: string;
  changes?: any;
}

// Define ContractForecast interface
export interface ContractForecast {
  contractStartDate: Date;
  contractEndDate: Date;
  billingAmount: number;
  billingFrequency: string;
  upcomingRenewal?: Date;
  noticeDate?: Date;
  renewalLeadDays?: number;
  status: 'active' | 'ending' | 'pending-renewal' | 'expired';
}
