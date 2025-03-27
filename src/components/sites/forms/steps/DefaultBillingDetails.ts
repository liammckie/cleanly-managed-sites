
import { BillingDetails } from '@/components/sites/forms/types/billingTypes';

// Default billing address
export const defaultBillingAddress = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Australia'
};

// Create default billing details
export function getDefaultBillingDetails(): BillingDetails {
  return {
    billingAddress: defaultBillingAddress,
    useClientInfo: false,
    billingMethod: 'fixed',
    paymentTerms: '30days',
    billingEmail: '',
    contacts: [],
    billingLines: []
  };
}

// Ensure that billing details exist and have proper structure
export function ensureBillingDetails(data: any): any {
  if (!data.billingDetails) {
    return {
      ...data,
      billingDetails: getDefaultBillingDetails()
    };
  }
  
  // Ensure billingDetails has all required properties
  const billingDetails = {
    ...getDefaultBillingDetails(),
    ...data.billingDetails
  };
  
  // Ensure billingAddress has proper structure
  if (!billingDetails.billingAddress || typeof billingDetails.billingAddress === 'string') {
    billingDetails.billingAddress = defaultBillingAddress;
  }
  
  return {
    ...data,
    billingDetails
  };
}
