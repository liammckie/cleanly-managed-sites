
/**
 * Types for billing-related data in the site form
 */

export interface BillingContact {
  id?: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}

export interface BillingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
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
}

export interface BillingDetails {
  useClientInfo?: boolean;
  clientPO?: string;
  clientReference?: string;
  billingContacts?: BillingContact[];
  billingAddress?: BillingAddress;
  billingLines?: BillingLine[];
  billingFrequency?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  directDebit?: boolean;
  bankDetails?: {
    accountName?: string;
    bsb?: string;
    accountNumber?: string;
  };
  xeroContactId?: string;
  xeroItemId?: string;
  xeroAccountId?: string;
  notes?: string;
  contractorPaymentTerms?: string;
  contractorInvoiceFrequency?: string;
}
