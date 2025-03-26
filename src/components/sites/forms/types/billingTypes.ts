
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  frequency: string;
  isRecurring: boolean;
  onHold: boolean;
  weeklyAmount: number;
  monthlyAmount: number;
  annualAmount: number;
}

export interface BillingDetails {
  billingCycle?: string;
  billingDay?: number;
  billingLines?: BillingLine[];
  billingNotes?: string;
  billingMethod?: string;
  serviceDeliveryType?: string;
  serviceType?: string;
  deliveryMethod?: string;
  contractorCostFrequency?: string;
  weeklyContractorCost?: number;
  monthlyContractorCost?: number;
  contractorInvoiceFrequency?: string;
}
