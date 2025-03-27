
export interface BillingLine {
  id: string;
  description: string;
  amount: number;
  isRecurring: boolean;
  onHold: boolean;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually'; 
}

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface BillingDetails {
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingAddress?: BillingAddress;
  serviceDeliveryType?: string;
  billingLines: BillingLine[];
  contacts?: any[];
}

// DTO types for API
export interface BillingAddressDTO {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface BillingLineDTO {
  id: string;
  description: string;
  amount: number;
  isRecurring?: boolean;
  onHold?: boolean;
  frequency?: string;
}

export interface BillingDetailsDTO {
  useClientInfo?: boolean;
  billingMethod?: string;
  paymentTerms?: string;
  billingEmail?: string;
  billingAddress?: BillingAddressDTO;
  serviceDeliveryType?: string;
  billingLines?: BillingLineDTO[];
  contacts?: any[];
}
