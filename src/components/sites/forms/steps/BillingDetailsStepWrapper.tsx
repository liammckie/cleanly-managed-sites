
import React from 'react';
import { BillingDetailsStep } from './BillingDetailsStep';
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
  // Ensure billingDetails has all the required properties with default values
  const billingDetails: BillingDetails = formData.billingDetails || {
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
    // Add additional properties required by components
    serviceDeliveryType: 'direct',
    weeklyBudget: 0,
    annualDirectCost: 0,
    annualContractorCost: 0,
    contractorCostFrequency: '',
    weeklyContractorCost: 0,
    monthlyContractorCost: 0,
    contractorInvoiceFrequency: '',
    serviceType: '',
    deliveryMethod: '',
    rate: '',
    xeroContactId: ''
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
