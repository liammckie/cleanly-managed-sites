
import { BillingContact } from './contactTypes';

export type BillingDetails = {
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
  contacts: BillingContact[];
  taxId: string;
  xeroContactId: string;
  notes: string;
}

export type AdHocWorkAuthorization = {
  approvalLimit: number;
  approverName: string;
  approverEmail: string;
  approverPhone: string;
  requirePurchaseOrder: boolean;
}
