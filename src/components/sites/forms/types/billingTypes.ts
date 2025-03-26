
import { BillingContact } from './contactTypes';

export type BillingFrequency = 
  | 'weekly' 
  | 'fortnightly' 
  | 'monthly' 
  | 'quarterly' 
  | 'annually' 
  | 'one-time'
  | 'one_time'
  | 'per_event';

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
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  billingEmail: string;
  contacts: BillingContact[];
  rate: number;
  billingFrequency: BillingFrequency;
  billingDay: string;
  billingTerms: string;
  billingNotes: string;
  billingMethod: string;
  billingContact: string;
  billingContactEmail: string;
  billingContactPhone: string;
  billingLines: BillingLine[];
  totalWeeklyAmount: number;
  totalMonthlyAmount?: number;
  totalAnnualAmount?: number;
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
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  invoicePostcode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  annualContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  contractorInvoiceFrequency?: string;
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  laborPlan?: string;
  xeroContactId?: string;
}
