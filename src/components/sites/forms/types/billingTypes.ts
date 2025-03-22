
import { BillingContact } from './contactTypes';

export type BillingFrequency = 'weekly' | 'monthly' | 'quarterly' | 'annually';

export type BillingLine = {
  id?: string;
  description: string;
  amount: number;
  frequency: BillingFrequency;
  isRecurring: boolean;
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
  
  // Add legacy properties for compatibility
  billingContact?: string;
  billingPhone?: string;
}

export type AdHocWorkAuthorization = {
  approvalLimit: number;
  approverName: string;
  approverEmail: string;
  approverPhone: string;
  requirePurchaseOrder: boolean;
}
