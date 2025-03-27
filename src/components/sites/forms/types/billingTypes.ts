
export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface BillingContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
  role?: string;
}

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
  billingAddress: BillingAddress;
  useClientInfo: boolean;
  billingMethod: string;
  paymentTerms: string;
  billingEmail: string;
  billingFrequency: string;
  billingInstructions: string;
  billingLines?: BillingLine[];
  contacts?: BillingContact[];
}
