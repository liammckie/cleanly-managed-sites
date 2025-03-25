
export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually' | 'daily' | 'per_event';

export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
  weeklyAmount?: number;
  monthlyAmount?: number;
  annualAmount?: number;
  onHold?: boolean;
  holdStartDate?: string;
  holdEndDate?: string;
  creditAmount?: number;
  creditDate?: string;
  creditReason?: string;
}

export interface BillingDetails {
  invoiceFrequency?: BillingFrequency;
  invoiceDay?: number;
  invoiceEmail?: string;
  invoiceAddressLine1?: string;
  invoiceAddressLine2?: string;
  invoiceCity?: string;
  invoiceState?: string;
  invoicePostalCode?: string;
  invoiceCountry?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
  xeroContactId?: string;
  paymentTerms?: string;
  billingLines?: BillingLine[];
  deliveryMethod?: string;
  serviceType?: string;
  weeklyRevenue?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  laborPlan?: {
    staffingLevel?: string;
    headcount?: number;
    hoursPerWeek?: number;
    costPerHour?: number;
  };
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
}
