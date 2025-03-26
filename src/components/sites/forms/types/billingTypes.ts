
import { BillingFrequency } from '@/types/common';

export interface BillingContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: string;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts: BillingContact[];
  rate: number;
  billingFrequency: BillingFrequency;
  billingDay: string;
  billingTerms: string;
  billingNotes?: string;
  billingMethod: string;
  billingContact?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingLines?: BillingLine[];
  totalWeeklyAmount: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
  
  // Additional billing properties required by components
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  paymentTerms?: string;
  invoiceMethod?: string;
  useSiteAddress?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  
  // Invoice properties
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  
  // Revenue properties
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  
  // Service delivery properties
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  laborPlan?: any;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  
  // Xero integration
  xeroContactId?: string;
}
