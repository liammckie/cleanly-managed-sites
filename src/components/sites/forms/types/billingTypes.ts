
import { BillingLine } from '@/types/standardTypes';

export interface BillingDetails {
  billingFrequency?: string;
  billingCycle?: string;
  billingDay?: number;
  paymentTerms?: string;
  billingLines?: BillingLine[];
  billingEmail?: string;
  billingNotes?: string;
  purchaseOrderRequired?: boolean;
  purchaseOrderNumber?: string;
}
