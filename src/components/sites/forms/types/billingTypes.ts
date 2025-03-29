
import { BillingLine, BillingContact, BillingDetails } from '@/types/models';

// Define a standardized BillingAddress interface
export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postcode: string;
  country?: string;
}

// Re-export the types correctly for TypeScript with isolatedModules
export type { BillingLine, BillingContact, BillingDetails };
