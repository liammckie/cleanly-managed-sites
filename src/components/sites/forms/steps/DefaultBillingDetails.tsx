
import React from 'react';
import { SiteFormData } from '../types/siteFormData';
import { BillingDetails, BillingAddress } from '../types/billingTypes';

// Create a helper type that forces all BillingDetails properties to be optional
export interface DefaultBillingDetails extends Partial<BillingDetails> {
  // Add any additional fields that might be needed
}

// Create a function to get default billing details
export function getDefaultBillingDetails(): DefaultBillingDetails {
  return {
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Australia'
    },
    useClientInfo: false,
    billingMethod: 'invoice',
    paymentTerms: '30',
    billingEmail: '',
    contacts: [],
    billingLines: []
  };
}

// Create a function to ensure site form data has billing details
export function ensureBillingDetails(formData: SiteFormData): SiteFormData {
  if (!formData.billingDetails) {
    return {
      ...formData,
      billingDetails: getDefaultBillingDetails() as BillingDetails
    };
  }
  
  // Ensure billingAddress exists
  if (!formData.billingDetails.billingAddress) {
    return {
      ...formData,
      billingDetails: {
        ...formData.billingDetails,
        billingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Australia'
        }
      }
    };
  }
  
  // Ensure other required fields exist
  const updatedBillingDetails = {
    ...formData.billingDetails,
    useClientInfo: formData.billingDetails.useClientInfo || false,
    billingMethod: formData.billingDetails.billingMethod || 'invoice',
    paymentTerms: formData.billingDetails.paymentTerms || '30',
    billingEmail: formData.billingDetails.billingEmail || '',
    contacts: formData.billingDetails.contacts || [],
    billingLines: formData.billingDetails.billingLines || []
  };
  
  return {
    ...formData,
    billingDetails: updatedBillingDetails
  };
}
