
import React from 'react';
import { BillingDetailsStep } from './BillingDetailsStep';
import { BillingDetailsDTO } from '@/types/dto';
import { BillingDetails } from '../types/billingTypes';

interface BillingDetailsStepWrapperProps {
  formData: any;
  handleNestedChange: (section: string, field: string, value: any) => void;
  handleDoubleNestedChange: (section: string, subsection: string, field: string, value: any) => void;
  addBillingLine: () => void;
  updateBillingLine: (id: string, field: string, value: any) => void;
  removeBillingLine: (id: string) => void;
}

export function BillingDetailsStepWrapper({ 
  formData, 
  handleNestedChange,
  handleDoubleNestedChange,
  addBillingLine,
  updateBillingLine,
  removeBillingLine
}: BillingDetailsStepWrapperProps) {
  // Create default billing details with all required properties
  const defaultBillingDetails: BillingDetails = {
    billingLines: [],
    useClientInfo: false,
    billingMethod: '',
    paymentTerms: '',
    billingEmail: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: 'Australia'
    },
    serviceDeliveryType: 'direct',
    contacts: []
  };
  
  // Merge the default values with any existing billing details
  const billingDetails: BillingDetails = {
    ...defaultBillingDetails,
    ...(formData.billingDetails || {}),
    // Ensure billingLines is always an array
    billingLines: (formData.billingDetails?.billingLines || [])
  };
  
  const wrappedFormData = {
    ...formData,
    billingDetails
  };
  
  return (
    <BillingDetailsStep 
      formData={wrappedFormData}
      handleNestedChange={handleNestedChange}
      handleDoubleNestedChange={handleDoubleNestedChange}
      addBillingLine={addBillingLine}
      updateBillingLine={updateBillingLine}
      removeBillingLine={removeBillingLine}
    />
  );
}
