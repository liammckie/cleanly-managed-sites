
import { BillingFrequency } from '@/types/common';

export type { BillingFrequency };

export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  position?: string;
}

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency?: string;
  weekly_amount?: number;
  monthly_amount?: number;
  annual_amount?: number;
  is_recurring?: boolean;
  on_hold?: boolean;
  // Camel case aliases for convenience
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  isRecurring?: boolean;
  onHold?: boolean;
}

export interface BillingDetails {
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  contacts?: BillingContact[];
  rate?: number;
  billingFrequency?: BillingFrequency;
  billingDay?: string;
  billingNotes?: string;
  billingTerms?: string;
  billingMethod?: string;
  billingContact?: string;
  billingContactEmail?: string;
  billingContactPhone?: string;
  billingLines?: BillingLine[];
  totalWeeklyAmount?: number;
  // Additional fields needed by components
  invoiceMethod?: string;
  invoiceFrequency?: string;
  invoiceDay?: string;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  paymentTerms?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  billingOnHold?: boolean;
  billingHoldStartDate?: string;
  billingHoldEndDate?: string;
  billingHoldReason?: string;
  useSiteAddress?: boolean;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  xeroContactId?: string;
  // Service delivery fields
  serviceDeliveryType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  monthlyContractorCost?: number;
  weeklyContractorCost?: number;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  contractorInvoiceFrequency?: string;
  laborPlan?: any;
  totalAnnualAmount?: number;
}
