
export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually';

export interface BillingLine {
  id?: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
}

export interface LaborPlan {
  workingDays?: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  shiftStartTime: string;
  shiftEndTime: string;
  notes: string;
}

export interface BillingDetails {
  rate: string;
  billingFrequency: string;
  paymentTerms: string;
  invoiceMethod: string;
  accountNumber: string;
  purchaseOrderRequired: boolean;
  purchaseOrderNumber: string;
  billingEmail: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingPostcode: string;
  useSiteAddress: boolean;
  contacts: any[]; // Replace with proper type
  taxId: string;
  xeroContactId: string;
  notes: string;
  billingContact?: string;
  billingPhone?: string;
  annualForecast?: string;
  serviceDeliveryType?: 'direct' | 'contractor';
  annualContractorCost?: number;
  contractorInvoiceFrequency?: 'weekly' | 'monthly' | 'quarterly';
  weeklyBudget?: number;
  laborPlan?: LaborPlan;
  billingLines: BillingLine[];
}
