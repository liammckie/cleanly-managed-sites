
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
  renewalTerms?: string;
  contractLength?: number;
  contractLengthUnit?: string;
  serviceFrequency?: string;
  serviceDeliveryMethod?: string;
  terms?: { id: string; name: string; description: string }[];
  additionalContracts?: any[];
}

export interface ContractSummaryData {
  // Expiration counts
  expiringThisMonth: number;
  expiringNext3Months: number;
  expiringNext6Months: number;
  expiringThisYear: number;
  
  // Expiration values
  valueExpiringThisMonth: number;
  valueExpiringNext3Months: number;
  valueExpiringNext6Months: number;
  valueExpiringThisYear: number;
  
  // Overall contract data
  totalContracts: number;
  totalValue: number;
  
  // Financial metrics
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  avgContractValue: number;
  profitMargin: number;
  
  // Additional metrics
  activeCount?: number; // Add this property for ContractValueMetrics component
}

// Define contract forecast interface
export interface ContractForecast {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

// Define interface for grouped contracts
export interface GroupedContracts {
  [key: string]: any[];
}
