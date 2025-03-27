
import { Json } from '@/lib/types';

export interface ContractData {
  id: string;
  site_id: string;
  site_name: string;
  client_id: string;
  client_name: string;
  monthly_revenue: number;
  contract_details: {
    [key: string]: any;
    contractNumber?: string;
    startDate?: string;
    endDate?: string;
    autoRenewal?: boolean;
    renewalPeriod?: number;
    renewalNotice?: number;
    noticeUnit?: string;
    terminationPeriod?: string;
    renewalTerms?: string;
    contractLength?: number;
    contractLengthUnit?: string;
    serviceFrequency?: string;
    serviceDeliveryMethod?: string;
  };
  status: string;
  is_primary: boolean;
}

export interface ContractSummaryData {
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  activeCount: number;
  totalValue: number;
  
  // Added missing properties
  totalContracts: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgContractValue: number;
  profitMargin: number;
  totalCount?: number;
}

export interface GroupedContracts {
  activeContracts: ContractData[];
  expiringContracts: ContractData[];
  expiredContracts: ContractData[];
}
