
import { BillingContact } from './contactTypes';

export type BillingFrequency = 'weekly' | 'fortnightly' | 'monthly' | 'quarterly' | 'annually';

export type BillingLine = {
  id?: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
}

export type LaborPlan = {
  workingDays?: Record<string, boolean>;
  shiftStartTime?: string;
  shiftEndTime?: string;
  notes?: string;
}

export type BillingDetails = {
  rate: string;
  billingFrequency: BillingFrequency;
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
  contacts: BillingContact[];
  taxId: string;
  xeroContactId: string;
  notes: string;
  billingLines: BillingLine[];  // Multiple billing lines per site
  annualForecast?: string;  // Calculated annual forecast
  
  // Add legacy properties for compatibility
  billingContact?: string;
  billingPhone?: string;
  
  // Service delivery fields (moved from JobSpecifications)
  serviceDeliveryType?: 'direct' | 'contractor';
  annualContractorCost?: number;
  contractorInvoiceFrequency?: BillingFrequency;
  
  // Direct employees budget
  weeklyBudget?: number;
  
  // Labor plan details
  laborPlan?: LaborPlan;
}

export type AdHocWorkAuthorization = {
  approvalLimit: number;
  approverName: string;
  approverEmail: string;
  approverPhone: string;
  requirePurchaseOrder: boolean;
}
