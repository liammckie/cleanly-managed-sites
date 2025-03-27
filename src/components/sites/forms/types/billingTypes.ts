
import { BillingFrequency } from '@/types/common';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  onHold: boolean;
  frequency: BillingFrequency;
  weeklyAmount?: number; 
  monthlyAmount?: number;
  annualAmount?: number;
}

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface BillingDetails {
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingAddress?: BillingAddress;
  serviceDeliveryType?: string;
  billingLines: BillingLine[];
  contacts?: BillingContact[];
  
  // Additional properties needed by various components
  weeklyBudget?: number;
  rate?: string;
  xeroContactId?: string;
  
  // Billing frequency related properties
  billingFrequency?: string;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Revenue related properties
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  
  // Purchase order related properties
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  
  // Service related properties
  serviceType?: string;
  deliveryMethod?: string;
  
  // Contractor related properties
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Calculated totals (used in some components)
  totalWeeklyAmount?: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Invoice method related properties
  invoiceMethod?: string;
  accountNumber?: string;
}

// DTO types for API
export interface BillingAddressDTO {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface BillingLineDTO {
  id: string;
  description: string;
  amount: number;
  isRecurring?: boolean;
  onHold?: boolean;
  frequency?: BillingFrequency;
}

export interface BillingDetailsDTO {
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingAddress?: BillingAddressDTO;
  serviceDeliveryType?: string;
  billingLines?: BillingLineDTO[];
  contacts?: BillingContact[];
  // Include other fields needed for the API
  serviceType?: string;
  deliveryMethod?: string;
  xeroContactId?: string;
  weeklyBudget?: number;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
}
