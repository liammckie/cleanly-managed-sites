
// Define the billing frequency type
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

// Define the billing line interface
export interface BillingLine {
  id?: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  on_hold?: boolean;
}

// Define the billing contact interface
export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position?: string;
}

// Define the billing details interface
export interface BillingDetails {
  rate?: number;
  billingFrequency?: BillingFrequency;
  billingLines?: BillingLine[];
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingPostcode?: string;
  billingEmail?: string;
  useSiteAddress?: boolean;
  contacts?: BillingContact[];
  billingReason?: string;
  billingNotes?: string;
  // Added missing properties that were causing errors
  billingOnHold?: boolean;
  billingHoldStartDate?: string | Date;
  billingHoldEndDate?: string | Date;
  billingHoldReason?: string;
  invoiceMethod?: string;
  invoiceFrequency?: string;
  invoiceDay?: number;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  accountNumber?: string;
  taxId?: string;
  notes?: string;
  xeroContactId?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  paymentTerms?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  // Service delivery properties
  serviceDeliveryType?: string;
  deliveryMethod?: string;
  serviceType?: string;
  weeklyBudget?: number;
  annualContractorCost?: number;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
  laborPlan?: {
    staffingLevel?: string;
    headcount?: number;
    hoursPerWeek?: number;
    costPerHour?: number;
    daysPerWeek?: number;
    hoursPerDay?: number;
    weeklyHours?: number;
    ratePerHour?: number;
  };
}

// Export types for use elsewhere
export type { BillingFrequency };
export type { BillingLine };
export type { BillingContact };
