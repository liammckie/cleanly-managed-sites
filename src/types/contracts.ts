
import { Json } from './common';

export interface ContractDetails {
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  autoRenewal?: boolean;
  renewalPeriod?: number;
  renewalNotice?: number;
  noticeUnit?: string;
  terminationPeriod?: string;
  contractType?: string;
  value?: number;
  frequency?: string;
  notes?: string;
  serviceDeliveryMethod?: string;
}

export interface ContractData {
  id: string;
  site_id: string;
  site_name: string;
  client_id: string;
  client_name: string;
  monthly_revenue: number;
  contract_details: ContractDetails;
  status: string;
  is_primary: boolean;
}

export interface GroupedContracts {
  activeContracts: ContractData[];
  expiringContracts: ContractData[];
  expiredContracts: ContractData[];
}

export interface ContractSummaryData {
  totalValue: number;
  totalCount: number;
  expiringCount: number;
  expiredCount: number;
  activeCount: number;
  // For compatibility with existing code
  pendingCount?: number;
  avgContractValue?: number;
  totalRevenue?: number;
  totalCost?: number;
  totalProfit?: number;
}
