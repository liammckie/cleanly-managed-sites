
import { Json } from './index';

export interface ContractData {
  id: string;
  site_id: string;
  site_name: string;
  client_id: string;
  client_name: string;
  status: string;
  monthly_revenue: number;
  contract_details: {
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
    [key: string]: any;
  };
  
  // For compatibility with old components
  client?: {
    id: string;
    name: string;
  };
  site?: {
    id: string;
    name: string;
  };
  value?: number;
  startDate?: string;
  endDate?: string;
}

export interface ContractSummaryData {
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  expiringCount: number;
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  totalValue: number;
  activeValue: number;
  averageValue: number;
  profitMargin: number;
}

export interface GroupedContracts {
  [category: string]: ContractData[];
}
